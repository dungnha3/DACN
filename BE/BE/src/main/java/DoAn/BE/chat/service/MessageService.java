package DoAn.BE.chat.service;

import DoAn.BE.chat.dto.MessDTO;
import DoAn.BE.chat.dto.SendMessageRequest;
import DoAn.BE.chat.entity.ChatRoom;
import DoAn.BE.chat.entity.ChatRoomMember;
import DoAn.BE.chat.entity.Message;
import DoAn.BE.chat.entity.MessageStatus;
import DoAn.BE.chat.entity.MessageStatusId;
import DoAn.BE.chat.repository.ChatRoomRepository;
import DoAn.BE.chat.repository.ChatRoomMemberRepository;
import DoAn.BE.chat.repository.MessageRepository;
import DoAn.BE.chat.repository.MessageStatusRepository;
import DoAn.BE.user.entity.User;
import DoAn.BE.user.dto.UserDTO;
import DoAn.BE.user.repository.UserRepository;
import DoAn.BE.common.exception.BadRequestException;
import DoAn.BE.common.exception.EntityNotFoundException;
import DoAn.BE.chat.websocket.service.WebSocketNotificationService;
import DoAn.BE.notification.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.data.domain.Pageable;

@Service
@Transactional
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private ChatRoomRepository chatRoomRepository;

    @Autowired
    private ChatRoomMemberRepository chatRoomMemberRepository;

    @Autowired
    private MessageStatusRepository messageStatusRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WebSocketNotificationService webSocketNotificationService;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private TypingIndicatorService typingIndicatorService;

    /**
     * Gửi tin nhắn
     */
    public MessDTO sendMessage(SendMessageRequest request, Long senderId) {
        // Validate sender tồn tại
        User sender = userRepository.findById(senderId)
            .orElseThrow(() -> new EntityNotFoundException("Người gửi không tồn tại"));

        // Validate phòng chat tồn tại
        ChatRoom chatRoom = chatRoomRepository.findById(request.getRoomId())
            .orElseThrow(() -> new EntityNotFoundException("Phòng chat không tồn tại"));

        // Kiểm tra sender có trong phòng không
        boolean isMember = chatRoomMemberRepository.existsByChatRoom_RoomIdAndUser_UserId(request.getRoomId(), senderId);
        if (!isMember) {
            throw new BadRequestException("Bạn không có quyền gửi tin nhắn trong phòng này");
        }

        // Tạo Message entity
        Message message = new Message();
        message.setChatRoom(chatRoom);
        message.setSender(sender);
        message.setContent(request.getContent());
        message.setMessageType(detectMessageType(request));
        message.setSentAt(LocalDateTime.now());
        message.setIsDeleted(false);

        // Set reply message nếu có
        if (request.getReplyToMessageId() != null) {
            Message replyToMessage = messageRepository.findById(request.getReplyToMessageId())
                .orElseThrow(() -> new EntityNotFoundException("Tin nhắn được reply không tồn tại"));

            // Kiểm tra tin nhắn reply có cùng phòng không
            if (!replyToMessage.getChatRoom().getRoomId().equals(request.getRoomId())) {
                throw new BadRequestException("Không thể reply tin nhắn từ phòng khác");
            }

            message.setReplyToMessage(replyToMessage);
        }

        // Lưu tin nhắn
        message = messageRepository.save(message);

        // Tạo MessageStatus cho tất cả members (trừ sender)
        List<ChatRoomMember> members = chatRoomMemberRepository.findByChatRoom_RoomId(request.getRoomId());
        for (ChatRoomMember member : members) {
            if (!member.getUser().getUserId().equals(senderId)) {
                MessageStatus status = new MessageStatus();
                status.setId(new MessageStatusId(message.getMessageId(), member.getUser().getUserId()));
                status.setMessage(message);
                status.setUser(member.getUser());
                status.setStatus(MessageStatus.MessageStatusType.DELIVERED);
                status.setTimestamp(LocalDateTime.now());
                messageStatusRepository.save(status);
            }
        }

        MessDTO messageDTO = convertToMessageDTO(message);

        // Gửi WebSocket notification
        webSocketNotificationService.notifyNewMessage(request.getRoomId(), messageDTO);

        // Gửi notification cho các thành viên khác
        List<ChatRoomMember> otherMembers = chatRoomMemberRepository.findByChatRoom_RoomId(request.getRoomId())
            .stream()
            .filter(member -> !member.getUser().getUserId().equals(senderId))
            .toList();

        for (ChatRoomMember member : otherMembers) {
            notificationService.createNewMessageNotification(
                member.getUser().getUserId(),
                sender.getUsername(),
                request.getContent(),
                request.getRoomId()
            );
        }

        // Dừng typing indicator cho user này
        typingIndicatorService.forceStopTyping(request.getRoomId(), senderId);

        return messageDTO;
    }

    /**
     * Lấy tin nhắn trong phòng chat
     */
    public List<MessDTO> getMessagesByRoomId(Long roomId, Long userId, int page, int size) {
        // Validate phòng chat tồn tại
        chatRoomRepository.findById(roomId)
            .orElseThrow(() -> new EntityNotFoundException("Phòng chat không tồn tại"));

        // Kiểm tra user có trong phòng không
        boolean isMember = chatRoomMemberRepository.existsByChatRoom_RoomIdAndUser_UserId(roomId, userId);
        if (!isMember) {
            throw new BadRequestException("Bạn không có quyền xem tin nhắn trong phòng này");
        }

        // Lấy tin nhắn với phân trang
        List<Message> messages = messageRepository.findByChatRoom_RoomIdOrderBySentAtAsc(roomId);

        // Convert sang DTO
        return messages.stream()
            .map(this::convertToMessageDTO)
            .collect(Collectors.toList());
    }

    /**
     * Đánh dấu tin nhắn đã đọc
     */
    public void markMessageAsSeen(Long messageId, Long userId) {
        // Validate message tồn tại
        messageRepository.findById(messageId)
            .orElseThrow(() -> new EntityNotFoundException("Tin nhắn không tồn tại"));

        // Tìm MessageStatus
        Optional<MessageStatus> statusOpt = messageStatusRepository.findById(
            new MessageStatusId(messageId, userId));

        if (statusOpt.isPresent()) {
            MessageStatus status = statusOpt.get();
            status.setStatus(MessageStatus.MessageStatusType.SEEN);
            status.setTimestamp(LocalDateTime.now());
            messageStatusRepository.save(status);
        }
    }

    /**
     * Tự động detect loại tin nhắn
     */
    private Message.MessageType detectMessageType(SendMessageRequest request) {
        if (request.getFileId() != null) {
            String fileName = request.getFileName();
            if (fileName != null) {
                String extension = fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();
                if (List.of("jpg", "jpeg", "png", "gif", "webp").contains(extension)) {
                    return Message.MessageType.IMAGE;
                }
            }
            return Message.MessageType.FILE;
        }
        return Message.MessageType.TEXT;
    }

    /**
     * Convert Message entity sang DTO
     */
    private MessDTO convertToMessageDTO(Message message) {
        MessDTO dto = new MessDTO();
        dto.setMessageId(message.getMessageId());
        dto.setRoomId(message.getChatRoom().getRoomId());

        // Convert User to UserDTO
        UserDTO senderDTO = new UserDTO();
        senderDTO.setUserId(message.getSender().getUserId());
        senderDTO.setUsername(message.getSender().getUsername());
        senderDTO.setEmail(message.getSender().getEmail());
        senderDTO.setAvatarUrl(message.getSender().getAvatarUrl());
        dto.setSender(senderDTO);

        dto.setContent(message.getContent());
        dto.setMessageType(message.getMessageType());
        dto.setFileId(message.getFile() != null ? message.getFile().getFileId() : null);
        dto.setFileName(message.getFile() != null ? message.getFile().getOriginalFilename() : null);
        dto.setFileUrl(message.getFile() != null ? message.getFile().getFilePath() : null);
        dto.setSentAt(message.getSentAt());
        dto.setIsDeleted(message.getIsDeleted());
        dto.setEditedAt(message.getEditedAt());
        dto.setIsEdited(message.getEditedAt() != null);
        dto.setReplyToMessageId(message.getReplyToMessage() != null ? message.getReplyToMessage().getMessageId() : null);

        return dto;
    }

    // ==================== SEARCH METHODS ====================

    /**
     * Tìm kiếm tin nhắn theo nội dung
     */
    public List<MessDTO> searchMessages(Long roomId, String keyword, Long userId, Pageable pageable) {
        // Validate phòng chat tồn tại
        chatRoomRepository.findById(roomId)
            .orElseThrow(() -> new EntityNotFoundException("Phòng chat không tồn tại"));

        // Kiểm tra user có trong phòng không
        boolean isMember = chatRoomMemberRepository.existsByChatRoom_RoomIdAndUser_UserId(roomId, userId);
        if (!isMember) {
            throw new BadRequestException("Bạn không có quyền tìm kiếm trong phòng này");
        }

        // Tìm kiếm tin nhắn
        List<Message> messages = messageRepository.searchMessagesByContent(roomId, keyword);

        // Apply pagination manually
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), messages.size());
        List<Message> pagedMessages = messages.subList(start, end);

        return pagedMessages.stream()
            .map(this::convertToMessageDTO)
            .collect(Collectors.toList());
    }

    /**
     * Tìm kiếm tin nhắn theo người gửi
     */
    public List<MessDTO> searchMessagesBySender(Long roomId, String senderKeyword, Long userId) {
        // Validate permissions
        validateRoomAccess(roomId, userId);

        List<Message> messages = messageRepository.searchMessagesBySender(roomId, senderKeyword);

        return messages.stream()
            .map(this::convertToMessageDTO)
            .collect(Collectors.toList());
    }

    /**
     * Tìm kiếm tin nhắn theo khoảng thời gian
     */
    public List<MessDTO> searchMessagesByDateRange(Long roomId, LocalDateTime startDate, LocalDateTime endDate, Long userId) {
        // Validate permissions
        validateRoomAccess(roomId, userId);

        List<Message> messages = messageRepository.searchMessagesByDateRange(roomId, startDate, endDate);

        return messages.stream()
            .map(this::convertToMessageDTO)
            .collect(Collectors.toList());
    }

    /**
     * Tìm kiếm tin nhắn theo loại
     */
    public List<MessDTO> searchMessagesByType(Long roomId, Message.MessageType messageType, Long userId) {
        // Validate permissions
        validateRoomAccess(roomId, userId);

        List<Message> messages = messageRepository.searchMessagesByType(roomId, messageType);

        return messages.stream()
            .map(this::convertToMessageDTO)
            .collect(Collectors.toList());
    }

    /**
     * Sửa tin nhắn
     */
    public MessDTO editMessage(Long messageId, String newContent, Long userId) {
        // Validate message tồn tại
        Message message = messageRepository.findById(messageId)
            .orElseThrow(() -> new EntityNotFoundException("Tin nhắn không tồn tại"));

        // Kiểm tra quyền sửa (chỉ người gửi mới được sửa)
        if (!message.getSender().getUserId().equals(userId)) {
            throw new BadRequestException("Bạn chỉ có thể sửa tin nhắn của mình");
        }

        // Kiểm tra tin nhắn đã bị xóa chưa
        if (message.getIsDeleted()) {
            throw new BadRequestException("Không thể sửa tin nhắn đã bị xóa");
        }

        // Cập nhật nội dung
        message.setContent(newContent);
        message.markAsEdited();

        message = messageRepository.save(message);

        MessDTO messageDTO = convertToMessageDTO(message);

        // Gửi WebSocket notification
        webSocketNotificationService.notifyMessageEdited(message.getChatRoom().getRoomId(), messageDTO);

        // Gửi notification cho các thành viên khác
        final Message finalMessage = message;
        List<ChatRoomMember> otherMembers = chatRoomMemberRepository.findByChatRoom_RoomId(finalMessage.getChatRoom().getRoomId())
            .stream()
            .filter(member -> !member.getUser().getUserId().equals(finalMessage.getSender().getUserId()))
            .toList();

        for (ChatRoomMember member : otherMembers) {
            notificationService.createChatNotification(
                member.getUser().getUserId(),
                "MESSAGE_EDITED",
                "Tin nhắn đã được sửa",
                finalMessage.getSender().getUsername() + " đã sửa tin nhắn",
                "/chat/rooms/" + finalMessage.getChatRoom().getRoomId()
            );
        }

        return messageDTO;
    }

    /**
     * Xóa tin nhắn (soft delete)
     */
    public void deleteMessage(Long messageId, Long userId) {
        // Validate message tồn tại
        Message message = messageRepository.findById(messageId)
            .orElseThrow(() -> new EntityNotFoundException("Tin nhắn không tồn tại"));

        // Kiểm tra quyền xóa (chỉ người gửi mới được xóa)
        if (!message.getSender().getUserId().equals(userId)) {
            throw new BadRequestException("Bạn chỉ có thể xóa tin nhắn của mình");
        }

        // Soft delete
        message.setIsDeleted(true);
        messageRepository.save(message);

        // Gửi WebSocket notification
        webSocketNotificationService.notifyMessageDeleted(message.getChatRoom().getRoomId(), messageId, userId);

        // Gửi notification cho các thành viên khác
        User deleter = userRepository.findById(userId).orElse(null);
        if (deleter != null) {
            final Message finalMessage = message;
            List<ChatRoomMember> otherMembers = chatRoomMemberRepository.findByChatRoom_RoomId(finalMessage.getChatRoom().getRoomId())
                .stream()
                .filter(member -> !member.getUser().getUserId().equals(deleter.getUserId()))
                .toList();

            for (ChatRoomMember member : otherMembers) {
                notificationService.createChatNotification(
                    member.getUser().getUserId(),
                    "MESSAGE_DELETED",
                    "Tin nhắn đã bị xóa",
                    deleter.getUsername() + " đã xóa tin nhắn",
                    "/chat/rooms/" + finalMessage.getChatRoom().getRoomId()
                );
            }
        }
    }

    /**
     * Helper method để validate quyền truy cập phòng
     */
    private void validateRoomAccess(Long roomId, Long userId) {
        chatRoomRepository.findById(roomId)
            .orElseThrow(() -> new EntityNotFoundException("Phòng chat không tồn tại"));

        boolean isMember = chatRoomMemberRepository.existsByChatRoom_RoomIdAndUser_UserId(roomId, userId);
        if (!isMember) {
            throw new BadRequestException("Bạn không có quyền truy cập phòng này");
        }
    }
}
