package DoAn.BE.chat.service;

import DoAn.BE.chat.entity.Message;
import DoAn.BE.chat.entity.MessageStatus;
import DoAn.BE.chat.entity.MessageStatusId;
import DoAn.BE.chat.repository.MessageRepository;
import DoAn.BE.chat.repository.MessageStatusRepository;
import DoAn.BE.common.exception.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class MessageStatusService {

    @Autowired
    private MessageStatusRepository messageStatusRepository;
    
    @Autowired
    private MessageRepository messageRepository;

    /**
     * Đánh dấu tin nhắn đã gửi
     */
    public void markMessageAsDelivered(Long messageId, Long userId) {
        // Validate message tồn tại
        messageRepository.findById(messageId)
            .orElseThrow(() -> new EntityNotFoundException("Tin nhắn không tồn tại"));
        
        // Tìm MessageStatus
        Optional<MessageStatus> statusOpt = messageStatusRepository.findById(
            new MessageStatusId(messageId, userId));
        
        if (statusOpt.isPresent()) {
            MessageStatus status = statusOpt.get();
            status.setStatus(MessageStatus.MessageStatusType.DELIVERED);
            status.setTimestamp(LocalDateTime.now());
            messageStatusRepository.save(status);
        }
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
     * Đánh dấu tất cả tin nhắn trong phòng đã đọc
     */
    public void markAllMessagesAsSeen(Long roomId, Long userId) {
        // Lấy tất cả tin nhắn trong phòng
        List<Message> messages = messageRepository.findByChatRoom_RoomIdOrderBySentAtAsc(roomId);
        
        for (Message message : messages) {
            markMessageAsSeen(message.getMessageId(), userId);
        }
    }
    
    /**
     * Lấy trạng thái tin nhắn
     */
    public MessageStatus getMessageStatus(Long messageId, Long userId) {
        return messageStatusRepository.findById(
            new MessageStatusId(messageId, userId))
            .orElse(null);
    }
    
    /**
     * Lấy danh sách trạng thái tin nhắn
     */
    public List<MessageStatus> getMessageStatuses(Long messageId) {
        return messageStatusRepository.findByMessage_MessageId(messageId);
    }
    
    /**
     * Đếm số tin nhắn chưa đọc trong phòng
     */
    public Long getUnreadCount(Long roomId, Long userId) {
        // TODO: Implement query đếm tin nhắn chưa đọc
        // SELECT COUNT(*) FROM messages m 
        // LEFT JOIN message_status ms ON m.message_id = ms.message_id AND ms.user_id = ?
        // WHERE m.room_id = ? AND (ms.status IS NULL OR ms.status != 'SEEN')
        return 0L; // Placeholder
    }
}
