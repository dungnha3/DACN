package DoAn.BE.chat.service;

import DoAn.BE.chat.dto.ChatRoomDTO;
import DoAn.BE.chat.dto.CreateChatRoomRequest;
import DoAn.BE.chat.entity.ChatRoom;
import DoAn.BE.chat.entity.ChatRoomMember;
import DoAn.BE.chat.repository.ChatRoomMemberRepository;
import DoAn.BE.chat.repository.ChatRoomRepository;
import DoAn.BE.user.entity.User;
import DoAn.BE.user.repository.UserRepository;
import DoAn.BE.common.exception.BadRequestException;
import DoAn.BE.common.exception.EntityNotFoundException;
import DoAn.BE.common.exception.ForbiddenException;
import DoAn.BE.common.util.PermissionUtil;
import DoAn.BE.chat.websocket.service.WebSocketNotificationService;
import DoAn.BE.notification.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.dao.DataAccessException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import java.util.logging.Logger;

@Service
@Transactional
public class ChatRoomService {

    private static final Logger logger = Logger.getLogger(ChatRoomService.class.getName());

    @Autowired
    private ChatRoomRepository chatRoomRepository;
    
    @Autowired
    private ChatRoomMemberRepository chatRoomMemberRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private WebSocketNotificationService webSocketNotificationService;
    
    @Autowired
    private NotificationService notificationService;

    /**
     * Tạo phòng chat mới - Admin không có quyền
     */
    public ChatRoomDTO createChatRoom(CreateChatRoomRequest request, User currentUser) {
        try {
            // 1. Kiểm tra quyền - Admin không có quyền chat
            if (!PermissionUtil.canUseChat(currentUser)) {
                throw new ForbiddenException("Admin không có quyền sử dụng chat");
            }
            
            // 2. Validate input
            if (request.getName() == null || request.getName().trim().isEmpty()) {
                throw new BadRequestException("Tên phòng chat không được để trống");
            }
            
            logger.info(String.format("User %s tạo phòng chat: %s", currentUser.getUsername(), request.getName()));
            
            // 3. Tạo ChatRoom entity
            ChatRoom chatRoom = new ChatRoom();
            chatRoom.setName(request.getName().trim());
            chatRoom.setType(request.getRoomType());
            chatRoom.setAvatarUrl(request.getAvatarUrl());
            chatRoom.setCreatedAt(LocalDateTime.now());
            
            // 4. Lưu ChatRoom
            chatRoom = chatRoomRepository.save(chatRoom);
            
            // 5. Tạo ChatRoomMember cho creator với role ADMIN
            ChatRoomMember creatorMember = new ChatRoomMember();
            creatorMember.setChatRoom(chatRoom);
            creatorMember.setUser(currentUser);
            creatorMember.setRole(ChatRoomMember.MemberRole.ADMIN);
            creatorMember.setJoinedAt(LocalDateTime.now());
            chatRoomMemberRepository.save(creatorMember);
            
            // 6. Convert sang DTO và return
            return convertToChatRoomDTO(chatRoom);
            
        } catch (DataAccessException | IllegalArgumentException e) {
            logger.severe(String.format("Error creating chat room for user %s: %s", currentUser.getUsername(), e.getMessage()));
            throw new BadRequestException("Không thể tạo phòng chat, vui lòng thử lại");
        }
    }
    
    /**
     * Lấy danh sách phòng chat của user - Admin không có quyền
     */
    public List<ChatRoomDTO> getChatRoomsByUserId(User currentUser) {
        // Kiểm tra quyền - Admin không có quyền chat
        if (!PermissionUtil.canUseChat(currentUser)) {
            throw new ForbiddenException("Admin không có quyền sử dụng chat");
        }
        
        List<ChatRoomMember> memberships = chatRoomMemberRepository.findByUser_UserId(currentUser.getUserId());
        return memberships.stream()
            .map(membership -> convertToChatRoomDTO(membership.getChatRoom()))
            .collect(Collectors.toList());
    }
    
    /**
     * Lấy thông tin phòng chat theo ID
     */
    public ChatRoomDTO getChatRoomById(Long roomId, Long userId) {
        // Validate phòng chat tồn tại
        ChatRoom chatRoom = chatRoomRepository.findById(roomId)
            .orElseThrow(() -> new EntityNotFoundException("Phòng chat với ID " + roomId + " không tồn tại"));
        
        // Kiểm tra user có trong phòng không
        boolean isMember = chatRoomMemberRepository.existsByChatRoom_RoomIdAndUser_UserId(roomId, userId);
        if (!isMember) {
            throw new BadRequestException("Bạn không có quyền truy cập phòng chat này");
        }
        
        return convertToChatRoomDTO(chatRoom);
    }
    
    /**
     * Tìm hoặc tạo chat 1-1
     */
    public ChatRoomDTO findOrCreateDirectChat(Long userId1, Long userId2) {
        // Validate users tồn tại
        User user1 = userRepository.findById(userId1)
            .orElseThrow(() -> new EntityNotFoundException("User 1 không tồn tại"));
        User user2 = userRepository.findById(userId2)
            .orElseThrow(() -> new EntityNotFoundException("User 2 không tồn tại"));
        
        // Tìm phòng chat direct đã tồn tại
        List<ChatRoomMember> user1Rooms = chatRoomMemberRepository.findByUser_UserId(userId1);
        for (ChatRoomMember member1 : user1Rooms) {
            ChatRoom room = member1.getChatRoom();
            if (room.getType() == ChatRoom.RoomType.DIRECT) {
                boolean user2InRoom = chatRoomMemberRepository.existsByChatRoom_RoomIdAndUser_UserId(room.getRoomId(), userId2);
                if (user2InRoom) {
                    return convertToChatRoomDTO(room);
                }
            }
        }
        
        // Tạo phòng chat direct mới
        ChatRoom directRoom = new ChatRoom();
        directRoom.setName(user1.getUsername() + " & " + user2.getUsername());
        directRoom.setType(ChatRoom.RoomType.DIRECT);
        directRoom.setCreatedAt(LocalDateTime.now());
        directRoom = chatRoomRepository.save(directRoom);
        
        // Thêm cả 2 user vào phòng
        ChatRoomMember member1 = new ChatRoomMember();
        member1.setChatRoom(directRoom);
        member1.setUser(user1);
        member1.setRole(ChatRoomMember.MemberRole.MEMBER);
        member1.setJoinedAt(LocalDateTime.now());
        chatRoomMemberRepository.save(member1);
        
        ChatRoomMember member2 = new ChatRoomMember();
        member2.setChatRoom(directRoom);
        member2.setUser(user2);
        member2.setRole(ChatRoomMember.MemberRole.MEMBER);
        member2.setJoinedAt(LocalDateTime.now());
        chatRoomMemberRepository.save(member2);
        
        return convertToChatRoomDTO(directRoom);
    }
    
    /**
     * Thêm thành viên vào phòng chat
     */
    public ChatRoomDTO addMemberToRoom(Long roomId, Long userId, Long adminId) {
        // Validate phòng chat tồn tại
        ChatRoom chatRoom = chatRoomRepository.findById(roomId)
            .orElseThrow(() -> new EntityNotFoundException("Phòng chat với ID " + roomId + " không tồn tại"));
        
        // Kiểm tra admin có quyền thêm thành viên không
        boolean isAdmin = chatRoomMemberRepository.existsByChatRoom_RoomIdAndUser_UserIdAndRole(
            roomId, adminId, ChatRoomMember.MemberRole.ADMIN);
        if (!isAdmin) {
            throw new BadRequestException("Bạn không có quyền thêm thành viên vào phòng chat này");
        }
        
        // Validate user tồn tại
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new EntityNotFoundException("User không tồn tại"));
        
        // Kiểm tra user đã trong phòng chưa
        boolean alreadyMember = chatRoomMemberRepository.existsByChatRoom_RoomIdAndUser_UserId(roomId, userId);
        if (alreadyMember) {
            throw new BadRequestException("User đã là thành viên của phòng chat này");
        }
        
        // Tạo ChatRoomMember
        ChatRoomMember member = new ChatRoomMember();
        member.setChatRoom(chatRoom);
        member.setUser(user);
        member.setRole(ChatRoomMember.MemberRole.MEMBER);
        member.setJoinedAt(LocalDateTime.now());
        chatRoomMemberRepository.save(member);
        
        // Gửi WebSocket notification
        webSocketNotificationService.notifyUserJoined(roomId, user);
        
        // Gửi notification cho các thành viên khác
        List<ChatRoomMember> otherMembers = chatRoomMemberRepository.findByChatRoom_RoomId(roomId)
            .stream()
            .filter(m -> !m.getUser().getUserId().equals(user.getUserId()))
            .toList();
        
        for (ChatRoomMember otherMember : otherMembers) {
            notificationService.createMemberJoinedNotification(
                otherMember.getUser().getUserId(), 
                user.getUsername(), 
                roomId
            );
        }
        
        return convertToChatRoomDTO(chatRoom);
    }
    
    /**
     * Xóa thành viên khỏi phòng chat
     */
    public ChatRoomDTO removeMemberFromRoom(Long roomId, Long userId, Long adminId) {
        // Validate phòng chat tồn tại
        ChatRoom chatRoom = chatRoomRepository.findById(roomId)
            .orElseThrow(() -> new EntityNotFoundException("Phòng chat với ID " + roomId + " không tồn tại"));
        
        // Kiểm tra admin có quyền xóa thành viên không
        boolean isAdmin = chatRoomMemberRepository.existsByChatRoom_RoomIdAndUser_UserIdAndRole(
            roomId, adminId, ChatRoomMember.MemberRole.ADMIN);
        if (!isAdmin) {
            throw new BadRequestException("Bạn không có quyền xóa thành viên khỏi phòng chat này");
        }
        
        // Tìm member để xóa
        ChatRoomMember member = chatRoomMemberRepository.findByChatRoom_RoomIdAndUser_UserId(roomId, userId)
            .orElseThrow(() -> new EntityNotFoundException("User không phải thành viên của phòng chat này"));
        
        User removedUser = member.getUser();
        chatRoomMemberRepository.delete(member);
        
        // Gửi WebSocket notification
        webSocketNotificationService.notifyUserLeft(roomId, removedUser);
        
        // Gửi notification cho các thành viên còn lại
        List<ChatRoomMember> remainingMembers = chatRoomMemberRepository.findByChatRoom_RoomId(roomId);
        for (ChatRoomMember remainingMember : remainingMembers) {
            notificationService.createMemberLeftNotification(
                remainingMember.getUser().getUserId(), 
                removedUser.getUsername(), 
                roomId
            );
        }
        
        return convertToChatRoomDTO(chatRoom);
    }
    
    /**
     * Rời khỏi phòng chat
     */
    public void leaveRoom(Long roomId, Long userId) {
        // Validate phòng chat tồn tại
        chatRoomRepository.findById(roomId)
            .orElseThrow(() -> new EntityNotFoundException("Phòng chat với ID " + roomId + " không tồn tại"));
        
        // Tìm member
        ChatRoomMember member = chatRoomMemberRepository.findByChatRoom_RoomIdAndUser_UserId(roomId, userId)
            .orElseThrow(() -> new EntityNotFoundException("User không phải thành viên của phòng chat này"));
        
        User leavingUser = member.getUser();
        chatRoomMemberRepository.delete(member);
        
        // Gửi WebSocket notification
        webSocketNotificationService.notifyUserLeft(roomId, leavingUser);
        
        // Gửi notification cho các thành viên còn lại
        List<ChatRoomMember> remainingMembers = chatRoomMemberRepository.findByChatRoom_RoomId(roomId);
        for (ChatRoomMember remainingMember : remainingMembers) {
            notificationService.createMemberLeftNotification(
                remainingMember.getUser().getUserId(), 
                leavingUser.getUsername(), 
                roomId
            );
        }
    }
    
    /**
     * Thay đổi quyền thành viên
     */
    public ChatRoomDTO changeMemberRole(Long roomId, Long userId, ChatRoomMember.MemberRole newRole, Long adminId) {
        // Validate phòng chat tồn tại
        ChatRoom chatRoom = chatRoomRepository.findById(roomId)
            .orElseThrow(() -> new EntityNotFoundException("Phòng chat với ID " + roomId + " không tồn tại"));
        
        // Kiểm tra admin có quyền thay đổi role không
        boolean isAdmin = chatRoomMemberRepository.existsByChatRoom_RoomIdAndUser_UserIdAndRole(
            roomId, adminId, ChatRoomMember.MemberRole.ADMIN);
        if (!isAdmin) {
            throw new BadRequestException("Bạn không có quyền thay đổi quyền thành viên trong phòng chat này");
        }
        
        // Tìm member
        ChatRoomMember member = chatRoomMemberRepository.findByChatRoom_RoomIdAndUser_UserId(roomId, userId)
            .orElseThrow(() -> new EntityNotFoundException("User không phải thành viên của phòng chat này"));
        
        // Cập nhật role
        member.setRole(newRole);
        chatRoomMemberRepository.save(member);
        
        return convertToChatRoomDTO(chatRoom);
    }
    
    /**
     * Cập nhật thông tin phòng chat
     */
    public ChatRoomDTO updateRoomSettings(Long roomId, String name, String avatarUrl, Long adminId) {
        // Validate phòng chat tồn tại
        ChatRoom chatRoom = chatRoomRepository.findById(roomId)
            .orElseThrow(() -> new EntityNotFoundException("Phòng chat với ID " + roomId + " không tồn tại"));
        
        // Kiểm tra admin có quyền cập nhật không
        boolean isAdmin = chatRoomMemberRepository.existsByChatRoom_RoomIdAndUser_UserIdAndRole(
            roomId, adminId, ChatRoomMember.MemberRole.ADMIN);
        if (!isAdmin) {
            throw new BadRequestException("Bạn không có quyền cập nhật thông tin phòng chat này");
        }
        
        // Cập nhật thông tin
        if (name != null && !name.trim().isEmpty()) {
            chatRoom.setName(name.trim());
        }
        if (avatarUrl != null) {
            chatRoom.setAvatarUrl(avatarUrl);
        }
        
        chatRoom = chatRoomRepository.save(chatRoom);
        
        // Gửi WebSocket notification
        String updateMessage = "Thông tin phòng chat đã được cập nhật";
        webSocketNotificationService.notifyRoomUpdated(roomId, updateMessage);
        
        // Gửi notification cho tất cả thành viên
        List<ChatRoomMember> members = chatRoomMemberRepository.findByChatRoom_RoomId(roomId);
        for (ChatRoomMember member : members) {
            notificationService.createRoomUpdatedNotification(
                member.getUser().getUserId(), 
                "SETTINGS", 
                updateMessage, 
                roomId
            );
        }
        
        return convertToChatRoomDTO(chatRoom);
    }
    
    /**
     * Lấy danh sách thành viên trong phòng
     */
    public List<ChatRoomMember> getRoomMembers(Long roomId, Long userId) {
        // Validate phòng chat tồn tại
        chatRoomRepository.findById(roomId)
            .orElseThrow(() -> new EntityNotFoundException("Phòng chat với ID " + roomId + " không tồn tại"));
        
        // Kiểm tra user có trong phòng không
        boolean isMember = chatRoomMemberRepository.existsByChatRoom_RoomIdAndUser_UserId(roomId, userId);
        if (!isMember) {
            throw new BadRequestException("Bạn không có quyền xem danh sách thành viên phòng chat này");
        }
        
        return chatRoomMemberRepository.findByChatRoom_RoomId(roomId);
    }
    
    /**
     * Convert ChatRoom entity to DTO
     */
    private ChatRoomDTO convertToChatRoomDTO(ChatRoom chatRoom) {
        ChatRoomDTO dto = new ChatRoomDTO();
        dto.setRoomId(chatRoom.getRoomId());
        dto.setName(chatRoom.getName());
        dto.setRoomType(chatRoom.getType());
        dto.setAvatarUrl(chatRoom.getAvatarUrl());
        dto.setCreatedAt(chatRoom.getCreatedAt());
        
        // Lấy số thành viên
        long memberCount = chatRoomMemberRepository.countByChatRoom_RoomId(chatRoom.getRoomId());
        dto.setMemberCount((int) memberCount);
        
        return dto;
    }
}