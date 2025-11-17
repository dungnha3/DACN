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
import DoAn.BE.notification.service.ChatNotificationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.dao.DataAccessException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

// Service quản lý chat rooms (tạo, sửa, xóa, thêm/xóa members, permissions)
@Service
@Transactional
@Slf4j
public class ChatRoomService {

    private final ChatRoomRepository chatRoomRepository;
    private final ChatRoomMemberRepository chatRoomMemberRepository;
    private final UserRepository userRepository;
    private final WebSocketNotificationService webSocketNotificationService;
    private final ChatNotificationService chatNotificationService;

    public ChatRoomService(ChatRoomRepository chatRoomRepository,
                          ChatRoomMemberRepository chatRoomMemberRepository,
                          UserRepository userRepository,
                          WebSocketNotificationService webSocketNotificationService,
                          ChatNotificationService chatNotificationService) {
        this.chatRoomRepository = chatRoomRepository;
        this.chatRoomMemberRepository = chatRoomMemberRepository;
        this.userRepository = userRepository;
        this.webSocketNotificationService = webSocketNotificationService;
        this.chatNotificationService = chatNotificationService;
    }

    // Tạo phòng chat mới
    public ChatRoomDTO createChatRoom(CreateChatRoomRequest request, User currentUser) {
        try {
            if (!PermissionUtil.canUseChat(currentUser)) {
                throw new ForbiddenException("Admin không có quyền sử dụng chat");
            }
            
            if (request.getName() == null || request.getName().trim().isEmpty()) {
                throw new BadRequestException("Tên phòng chat không được để trống");
            }
            
            log.info("User {} tạo phòng chat: {}", currentUser.getUsername(), request.getName());
            
            ChatRoom chatRoom = new ChatRoom();
            chatRoom.setName(request.getName().trim());
            chatRoom.setType(request.getRoomType());
            chatRoom.setAvatarUrl(request.getAvatarUrl());
            chatRoom.setCreatedAt(LocalDateTime.now());
            chatRoom = chatRoomRepository.save(chatRoom);
            
            ChatRoomMember creatorMember = new ChatRoomMember();
            creatorMember.setChatRoom(chatRoom);
            creatorMember.setUser(currentUser);
            creatorMember.setRole(ChatRoomMember.MemberRole.ADMIN);
            creatorMember.setJoinedAt(LocalDateTime.now());
            chatRoomMemberRepository.save(creatorMember);
            
            return convertToChatRoomDTO(chatRoom);
            
        } catch (DataAccessException | IllegalArgumentException e) {
            log.error("Lỗi tạo phòng chat cho user {}: {}", currentUser.getUsername(), e.getMessage(), e);
            throw new BadRequestException("Không thể tạo phòng chat, vui lòng thử lại");
        }
    }
    
    // Lấy danh sách phòng chat của user
    public List<ChatRoomDTO> getChatRoomsByUserId(User currentUser) {
        if (!PermissionUtil.canUseChat(currentUser)) {
            throw new ForbiddenException("Admin không có quyền sử dụng chat");
        }
        
        List<ChatRoomMember> memberships = chatRoomMemberRepository.findByUser_UserId(currentUser.getUserId());
        return memberships.stream()
            .map(membership -> convertToChatRoomDTO(membership.getChatRoom()))
            .collect(Collectors.toList());
    }
    
    // Lấy thông tin phòng chat
    public ChatRoomDTO getChatRoomById(Long roomId, Long userId) {
        if (roomId == null || userId == null) {
            throw new BadRequestException("Room ID và User ID không được để trống");
        }
        // Validate phòng chat tồn tại
        ChatRoom chatRoom = chatRoomRepository.findById(roomId)
            .orElseThrow(() -> new EntityNotFoundException("Phòng chat không tồn tại"));
        
        // Kiểm tra user có trong phòng không
        boolean isMember = chatRoomMemberRepository.existsByChatRoom_RoomIdAndUser_UserId(roomId, userId);
        if (!isMember) {
            throw new BadRequestException("Không có quyền truy cập phòng chat này");
        }
        
        return convertToChatRoomDTO(chatRoom);
    }
    
    // Tìm hoặc tạo chat 1-1
    public ChatRoomDTO findOrCreateDirectChat(Long userId1, Long userId2) {
        if (userId1 == null || userId2 == null) {
            throw new BadRequestException("User ID không được để trống");
        }
        User user1 = userRepository.findById(userId1)
            .orElseThrow(() -> new EntityNotFoundException("User 1 không tồn tại"));
        User user2 = userRepository.findById(userId2)
            .orElseThrow(() -> new EntityNotFoundException("User 2 không tồn tại"));
        
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
        
        ChatRoom directRoom = new ChatRoom();
        directRoom.setName(user1.getUsername() + " & " + user2.getUsername());
        directRoom.setType(ChatRoom.RoomType.DIRECT);
        directRoom.setCreatedAt(LocalDateTime.now());
        directRoom = chatRoomRepository.save(directRoom);
        
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
    
    // Thêm thành viên vào phòng chat
    public ChatRoomDTO addMemberToRoom(Long roomId, Long userId, Long adminId) {
        if (roomId == null || userId == null || adminId == null) {
            throw new BadRequestException("Room ID, User ID và Admin ID không được để trống");
        }
        // Validate phòng chat tồn tại
        ChatRoom chatRoom = chatRoomRepository.findById(roomId)
            .orElseThrow(() -> new EntityNotFoundException("Phòng chat không tồn tại"));
        
        // Kiểm tra admin có quyền thêm thành viên không
        boolean isAdmin = chatRoomMemberRepository.existsByChatRoom_RoomIdAndUser_UserIdAndRole(
            roomId, adminId, ChatRoomMember.MemberRole.ADMIN);
        if (!isAdmin) {
            throw new BadRequestException("Không có quyền thêm thành viên vào phòng chat này");
        }
        
        // Validate user tồn tại
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new EntityNotFoundException("User không tồn tại"));
        
        // Kiểm tra user đã trong phòng chưa
        boolean alreadyMember = chatRoomMemberRepository.existsByChatRoom_RoomIdAndUser_UserId(roomId, userId);
        if (alreadyMember) {
            throw new BadRequestException("User đã là thành viên của phòng chat này");
        }
        
        ChatRoomMember member = new ChatRoomMember();
        member.setChatRoom(chatRoom);
        member.setUser(user);
        member.setRole(ChatRoomMember.MemberRole.MEMBER);
        member.setJoinedAt(LocalDateTime.now());
        chatRoomMemberRepository.save(member);
        
        webSocketNotificationService.notifyUserJoined(roomId, user);
        
        List<ChatRoomMember> otherMembers = chatRoomMemberRepository.findByChatRoom_RoomId(roomId)
            .stream()
            .filter(m -> m.getUser() != null && !m.getUser().getUserId().equals(user.getUserId()))
            .toList();
        
        for (ChatRoomMember otherMember : otherMembers) {
            chatNotificationService.createMemberJoinedNotification(
                otherMember.getUser().getUserId(), 
                user.getUsername(), 
                roomId
            );
        }
        
        return convertToChatRoomDTO(chatRoom);
    }
    
    public ChatRoomDTO removeMemberFromRoom(Long roomId, Long userId, Long adminId) {
        if (roomId == null || userId == null || adminId == null) {
            throw new BadRequestException("Room ID, User ID và Admin ID không được để trống");
        }
        ChatRoom chatRoom = chatRoomRepository.findById(roomId)
            .orElseThrow(() -> new EntityNotFoundException("Phòng chat không tồn tại"));
        
        boolean isAdmin = chatRoomMemberRepository.existsByChatRoom_RoomIdAndUser_UserIdAndRole(
            roomId, adminId, ChatRoomMember.MemberRole.ADMIN);
        if (!isAdmin) {
            throw new BadRequestException("Bạn không có quyền xóa thành viên khỏi phòng chat này");
        }
        
        ChatRoomMember member = chatRoomMemberRepository.findByChatRoom_RoomIdAndUser_UserId(roomId, userId)
            .orElseThrow(() -> new EntityNotFoundException("User không phải thành viên của phòng chat này"));
        
        User removedUser = member.getUser();
        chatRoomMemberRepository.delete(member);
        
        webSocketNotificationService.notifyUserLeft(roomId, removedUser);
        
        List<ChatRoomMember> remainingMembers = chatRoomMemberRepository.findByChatRoom_RoomId(roomId);
        for (ChatRoomMember remainingMember : remainingMembers) {
            if (remainingMember.getUser() != null && removedUser != null) {
                chatNotificationService.createMemberLeftNotification(
                    remainingMember.getUser().getUserId(), 
                    removedUser.getUsername(), 
                    roomId
                );
            }
        }
        
        return convertToChatRoomDTO(chatRoom);
    }
    
    public void leaveRoom(Long roomId, Long userId) {
        if (roomId == null || userId == null) {
            throw new BadRequestException("Room ID và User ID không được để trống");
        }
        chatRoomRepository.findById(roomId)
            .orElseThrow(() -> new EntityNotFoundException("Phòng chat với ID " + roomId + " không tồn tại"));
        
        ChatRoomMember member = chatRoomMemberRepository.findByChatRoom_RoomIdAndUser_UserId(roomId, userId)
            .orElseThrow(() -> new EntityNotFoundException("User không phải thành viên của phòng chat này"));
        
        User leavingUser = member.getUser();
        chatRoomMemberRepository.delete(member);
        
        webSocketNotificationService.notifyUserLeft(roomId, leavingUser);
        
        List<ChatRoomMember> remainingMembers = chatRoomMemberRepository.findByChatRoom_RoomId(roomId);
        for (ChatRoomMember remainingMember : remainingMembers) {
            if (remainingMember.getUser() != null && leavingUser != null) {
                chatNotificationService.createMemberLeftNotification(
                    remainingMember.getUser().getUserId(), 
                    leavingUser.getUsername(), 
                    roomId
                );
            }
        }
    }
    
    public ChatRoomDTO changeMemberRole(Long roomId, Long userId, ChatRoomMember.MemberRole newRole, Long adminId) {
        if (roomId == null || userId == null || adminId == null || newRole == null) {
            throw new BadRequestException("Room ID, User ID, Admin ID và Role không được để trống");
        }
        ChatRoom chatRoom = chatRoomRepository.findById(roomId)
            .orElseThrow(() -> new EntityNotFoundException("Phòng chat với ID " + roomId + " không tồn tại"));
        
        boolean isAdmin = chatRoomMemberRepository.existsByChatRoom_RoomIdAndUser_UserIdAndRole(
            roomId, adminId, ChatRoomMember.MemberRole.ADMIN);
        if (!isAdmin) {
            throw new BadRequestException("Bạn không có quyền thay đổi quyền thành viên trong phòng chat này");
        }
        
        ChatRoomMember member = chatRoomMemberRepository.findByChatRoom_RoomIdAndUser_UserId(roomId, userId)
            .orElseThrow(() -> new EntityNotFoundException("User không phải thành viên của phòng chat này"));
        
        member.setRole(newRole);
        chatRoomMemberRepository.save(member);
        
        return convertToChatRoomDTO(chatRoom);
    }
    
    public ChatRoomDTO updateRoomSettings(Long roomId, String name, String avatarUrl, Long adminId) {
        if (roomId == null || adminId == null) {
            throw new BadRequestException("Room ID và Admin ID không được để trống");
        }
        ChatRoom chatRoom = chatRoomRepository.findById(roomId)
            .orElseThrow(() -> new EntityNotFoundException("Phòng chat với ID " + roomId + " không tồn tại"));
        
        boolean isAdmin = chatRoomMemberRepository.existsByChatRoom_RoomIdAndUser_UserIdAndRole(
            roomId, adminId, ChatRoomMember.MemberRole.ADMIN);
        if (!isAdmin) {
            throw new BadRequestException("Bạn không có quyền cập nhật thông tin phòng chat này");
        }
        
        if (name != null && !name.trim().isEmpty()) {
            chatRoom.setName(name.trim());
        }
        if (avatarUrl != null) {
            chatRoom.setAvatarUrl(avatarUrl);
        }
        
        chatRoom = chatRoomRepository.save(chatRoom);
        
        String updateMessage = "Thông tin phòng chat đã được cập nhật";
        webSocketNotificationService.notifyRoomUpdated(roomId, updateMessage);
        
        List<ChatRoomMember> members = chatRoomMemberRepository.findByChatRoom_RoomId(roomId);
        for (ChatRoomMember member : members) {
            if (member.getUser() != null) {
                chatNotificationService.createRoomUpdatedNotification(
                    member.getUser().getUserId(), 
                    "SETTINGS", 
                    updateMessage, 
                    roomId
                );
            }
        }
        
        return convertToChatRoomDTO(chatRoom);
    }
    
    public List<ChatRoomMember> getRoomMembers(Long roomId, Long userId) {
        if (roomId == null || userId == null) {
            throw new BadRequestException("Room ID và User ID không được để trống");
        }
        chatRoomRepository.findById(roomId)
            .orElseThrow(() -> new EntityNotFoundException("Phòng chat với ID " + roomId + " không tồn tại"));
        
        boolean isMember = chatRoomMemberRepository.existsByChatRoom_RoomIdAndUser_UserId(roomId, userId);
        if (!isMember) {
            throw new BadRequestException("Bạn không có quyền xem danh sách thành viên phòng chat này");
        }
        
        return chatRoomMemberRepository.findByChatRoom_RoomId(roomId);
    }
    
    private ChatRoomDTO convertToChatRoomDTO(ChatRoom chatRoom) {
        if (chatRoom == null) {
            throw new IllegalArgumentException("ChatRoom không được null");
        }
        ChatRoomDTO dto = new ChatRoomDTO();
        dto.setRoomId(chatRoom.getRoomId());
        dto.setName(chatRoom.getName());
        dto.setRoomType(chatRoom.getType());
        dto.setAvatarUrl(chatRoom.getAvatarUrl());
        dto.setCreatedAt(chatRoom.getCreatedAt());
        
        long memberCount = chatRoomMemberRepository.countByChatRoom_RoomId(chatRoom.getRoomId());
        dto.setMemberCount((int) memberCount);
        
        return dto;
    }
}