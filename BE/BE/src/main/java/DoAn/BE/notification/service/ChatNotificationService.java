package DoAn.BE.notification.service;

import DoAn.BE.notification.entity.Notification;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

// Service quản lý thông báo chat
@Service
@Transactional
@RequiredArgsConstructor
public class ChatNotificationService {

    private final NotificationService notificationService;
    
    /**
     * Tạo chat notification với type động
     */
    public Notification createChatNotification(Long userId, String type, String title, String content, String link) {
        return notificationService.createNotification(userId, "CHAT_" + type, title, content, link);
    }

    /**
     * Tạo notification cho tin nhắn mới
     */
    public Notification createNewMessageNotification(Long userId, String senderName, String content, Long roomId) {
        String title = "Tin nhắn mới từ " + senderName;
        String truncatedContent = content != null && content.length() > 50 ? 
            content.substring(0, 47) + "..." : content;
        String link = "/chat/rooms/" + roomId;
        
        return createChatNotification(userId, "NEW_MESSAGE", title, truncatedContent, link);
    }

    /**
     * Tạo notification cho thành viên mới
     */
    public Notification createMemberJoinedNotification(Long userId, String memberName, Long roomId) {
        String title = "Thành viên mới";
        String content = memberName + " đã tham gia phòng chat";
        String link = "/chat/rooms/" + roomId;
        
        return createChatNotification(userId, "MEMBER_JOINED", title, content, link);
    }

    /**
     * Tạo notification cho thành viên rời khỏi
     */
    public Notification createMemberLeftNotification(Long userId, String memberName, Long roomId) {
        String title = "Thành viên rời khỏi";
        String content = memberName + " đã rời khỏi phòng chat";
        String link = "/chat/rooms/" + roomId;
        
        return createChatNotification(userId, "MEMBER_LEFT", title, content, link);
    }

    /**
     * Tạo notification cho phòng chat được cập nhật
     */
    public Notification createRoomUpdatedNotification(Long userId, String updateType, String details, Long roomId) {
        String title = "Phòng chat được cập nhật";
        String content = "Phòng chat đã được cập nhật: " + details;
        String link = "/chat/rooms/" + roomId;
        
        return createChatNotification(userId, "ROOM_UPDATED", title, content, link);
    }
}
