package DoAn.BE.notification.service;

import DoAn.BE.notification.entity.Notification;
import DoAn.BE.notification.repository.NotificationRepository;
import DoAn.BE.user.entity.User;
import DoAn.BE.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Tạo notification mới
     */
    public Notification createNotification(Long userId, String type, String title, String content, String link) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User không tồn tại"));

        Notification notification = new Notification();
        notification.setUser(user);
        notification.setType(type);
        notification.setTitle(title);
        notification.setContent(content);
        notification.setLink(link);
        notification.setIsRead(false);

        return notificationRepository.save(notification);
    }

    /**
     * Tạo notification đơn giản
     */
    public Notification createNotification(Long userId, String title, String content) {
        return createNotification(userId, "GENERAL", title, content, null);
    }

    /**
     * Lấy danh sách notification của user
     */
    public List<Notification> getUserNotifications(Long userId) {
        return notificationRepository.findByUser_UserIdOrderByCreatedAtDesc(userId);
    }

    /**
     * Lấy số notification chưa đọc
     */
    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUser_UserIdAndIsReadFalse(userId);
    }

    /**
     * Đánh dấu notification đã đọc
     */
    public void markAsRead(Long notificationId, Long userId) {
        Optional<Notification> notificationOpt = notificationRepository.findById(notificationId);
        if (notificationOpt.isPresent()) {
            Notification notification = notificationOpt.get();
            if (notification.getUser().getUserId().equals(userId)) {
                notification.markAsRead();
                notificationRepository.save(notification);
            }
        }
    }

    /**
     * Đánh dấu tất cả notification đã đọc
     */
    public void markAllAsRead(Long userId) {
        List<Notification> unreadNotifications = notificationRepository.findByUser_UserIdOrderByCreatedAtDesc(userId)
            .stream()
            .filter(Notification::isUnread)
            .toList();

        for (Notification notification : unreadNotifications) {
            notification.markAsRead();
        }
        notificationRepository.saveAll(unreadNotifications);
    }

    /**
     * Xóa notification
     */
    public void deleteNotification(Long notificationId, Long userId) {
        Optional<Notification> notificationOpt = notificationRepository.findById(notificationId);
        if (notificationOpt.isPresent()) {
            Notification notification = notificationOpt.get();
            if (notification.getUser().getUserId().equals(userId)) {
                notificationRepository.delete(notification);
            }
        }
    }

    /**
     * Tạo chat notification
     */
    public Notification createChatNotification(Long userId, String type, String title, String content, String link) {
        return createNotification(userId, "CHAT_" + type, title, content, link);
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

