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
import DoAn.BE.notification.service.ChatNotificationService;
import org.springframework.lang.NonNull;
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

    private final MessageRepository messageRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final ChatRoomMemberRepository chatRoomMemberRepository;
    private final MessageStatusRepository messageStatusRepository;
    private final UserRepository userRepository;
    private final WebSocketNotificationService webSocketNotificationService;
    private final ChatNotificationService chatNotificationService;
    private final TypingIndicatorService typingIndicatorService;

    public MessageService(MessageRepository messageRepository,
                         ChatRoomRepository chatRoomRepository,
                         ChatRoomMemberRepository chatRoomMemberRepository,
                         MessageStatusRepository messageStatusRepository,
                         UserRepository userRepository,
                         WebSocketNotificationService webSocketNotificationService,
                         ChatNotificationService chatNotificationService,
                         TypingIndicatorService typingIndicatorService) {
        this.messageRepository = messageRepository;
        this.chatRoomRepository = chatRoomRepository;
        this.chatRoomMemberRepository = chatRoomMemberRepository;
        this.messageStatusRepository = messageStatusRepository;
        this.userRepository = userRepository;
        this.webSocketNotificationService = webSocketNotificationService;
        this.chatNotificationService = chatNotificationService;
        this.typingIndicatorService = typingIndicatorService;
    }

    // Gửi tin nhắn
    public MessDTO sendMessage(SendMessageRequest request, @NonNull Long senderId) {
        if (request.getRoomId() == null) {
            throw new BadRequestException("Room ID không được null");
        }
        User sender = userRepository.findById(senderId)
            .orElseThrow(() -> new EntityNotFoundException("Người gửi không tồn tại"));

        ChatRoom chatRoom = chatRoomRepository.findById(request.getRoomId())
            .orElseThrow(() -> new EntityNotFoundException("Phòng chat không tồn tại"));

        boolean isMember = chatRoomMemberRepository.existsByChatRoom_RoomIdAndUser_UserId(request.getRoomId(), senderId);
        if (!isMember) {
            throw new BadRequestException("Bạn không có quyền gửi tin nhắn trong phòng này");
        }

        Message message = new Message();
        message.setChatRoom(chatRoom);
        message.setSender(sender);
        message.setContent(request.getContent());
        message.setMessageType(detectMessageType(request));
        message.setSentAt(LocalDateTime.now());
        message.setIsDeleted(false);

        if (request.getReplyToMessageId() != null) {
            Message replyToMessage = messageRepository.findById(request.getReplyToMessageId())
                .orElseThrow(() -> new EntityNotFoundException("Tin nhắn được reply không tồn tại"));

            if (!replyToMessage.getChatRoom().getRoomId().equals(request.getRoomId())) {
                throw new BadRequestException("Không thể reply tin nhắn từ phòng khác");
            }

            message.setReplyToMessage(replyToMessage);
        }

        message = messageRepository.save(message);


        List<ChatRoomMember> members = chatRoomMemberRepository.findByChatRoom_RoomId(request.getRoomId());
        for (ChatRoomMember member : members) {
            if (member.getUser() != null && member.getUser().getUserId() != null 
                && !member.getUser().getUserId().equals(senderId)) {
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

        webSocketNotificationService.notifyNewMessage(request.getRoomId(), messageDTO);


        List<ChatRoomMember> otherMembers = chatRoomMemberRepository.findByChatRoom_RoomId(request.getRoomId())
            .stream()
            .filter(member -> member.getUser() != null && member.getUser().getUserId() != null
                && !member.getUser().getUserId().equals(senderId))
            .toList();

        for (ChatRoomMember member : otherMembers) {
            chatNotificationService.createNewMessageNotification(
                member.getUser().getUserId(),
                sender.getUsername(),
                request.getContent(),
                request.getRoomId()
            );
        }

        typingIndicatorService.forceStopTyping(request.getRoomId(), senderId);

        return messageDTO;
    }

    // Lấy tin nhắn trong phòng chat
    public List<MessDTO> getMessagesByRoomId(@NonNull Long roomId, @NonNull Long userId, int page, int size) {
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

    // Đánh dấu tin nhắn đã đọc
    public void markMessageAsSeen(@NonNull Long messageId, @NonNull Long userId) {
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

    // Tự động xác định loại tin nhắn
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

    // Chuyển đổi Message entity sang DTO
    private MessDTO convertToMessageDTO(Message message) {
        MessDTO dto = new MessDTO();
        dto.setMessageId(message.getMessageId());
        dto.setRoomId(message.getChatRoom().getRoomId());

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

    // Tìm kiếm tin nhắn theo nội dung
    public List<MessDTO> searchMessages(@NonNull Long roomId, String keyword, @NonNull Long userId, Pageable pageable) {
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

    // Tìm kiếm tin nhắn theo người gửi
    public List<MessDTO> searchMessagesBySender(@NonNull Long roomId, String senderKeyword, @NonNull Long userId) {
        // Validate permissions
        validateRoomAccess(roomId, userId);

        List<Message> messages = messageRepository.searchMessagesBySender(roomId, senderKeyword);

        return messages.stream()
            .map(this::convertToMessageDTO)
            .collect(Collectors.toList());
    }

    // Tìm kiếm tin nhắn theo khoảng thời gian
    public List<MessDTO> searchMessagesByDateRange(@NonNull Long roomId, LocalDateTime startDate, LocalDateTime endDate, @NonNull Long userId) {
        // Validate permissions
        validateRoomAccess(roomId, userId);

        List<Message> messages = messageRepository.searchMessagesByDateRange(roomId, startDate, endDate);

        return messages.stream()
            .map(this::convertToMessageDTO)
            .collect(Collectors.toList());
    }

    // Tìm kiếm tin nhắn theo loại
    public List<MessDTO> searchMessagesByType(@NonNull Long roomId, Message.MessageType messageType, @NonNull Long userId) {
        // Validate permissions
        validateRoomAccess(roomId, userId);

        List<Message> messages = messageRepository.searchMessagesByType(roomId, messageType);

        return messages.stream()
            .map(this::convertToMessageDTO)
            .collect(Collectors.toList());
    }

    // Sửa tin nhắn
    public MessDTO editMessage(@NonNull Long messageId, String newContent, @NonNull Long userId) {
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
            chatNotificationService.createChatNotification(
                member.getUser().getUserId(),
                "MESSAGE_EDITED",
                "Tin nhắn đã được sửa",
                finalMessage.getSender().getUsername() + " đã sửa tin nhắn",
                "/chat/rooms/" + finalMessage.getChatRoom().getRoomId()
            );
        }

        return messageDTO;
    }

    // Xóa tin nhắn (soft delete)
    public void deleteMessage(@NonNull Long messageId, @NonNull Long userId) {
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
                chatNotificationService.createChatNotification(
                    member.getUser().getUserId(),
                    "MESSAGE_DELETED",
                    "Tin nhắn đã bị xóa",
                    deleter.getUsername() + " đã xóa tin nhắn",
                    "/chat/rooms/" + finalMessage.getChatRoom().getRoomId()
                );
            }
        }
    }

    // Kiểm tra quyền truy cập phòng
    private void validateRoomAccess(@NonNull Long roomId, @NonNull Long userId) {
        chatRoomRepository.findById(roomId)
            .orElseThrow(() -> new EntityNotFoundException("Phòng chat không tồn tại"));

        boolean isMember = chatRoomMemberRepository.existsByChatRoom_RoomIdAndUser_UserId(roomId, userId);
        if (!isMember) {
            throw new BadRequestException("Bạn không có quyền truy cập phòng này");
        }
    }
}
