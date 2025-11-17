package DoAn.BE.notification.service;

import DoAn.BE.notification.entity.Notification;
import DoAn.BE.notification.repository.NotificationRepository;
import DoAn.BE.user.entity.User;
import DoAn.BE.user.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

// Service core quản lý thông báo (CRUD operations only)
// Domain-specific notifications đã được tách ra:
// - AuthNotificationService: Auth & Security notifications
// - ChatNotificationService: Chat notifications  
// - HRNotificationService: HR notifications
// - ProjectNotificationService: Project notifications
// - StorageNotificationService: Storage notifications
@Service
@Transactional
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationService(NotificationRepository notificationRepository, UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

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

    public Notification createNotification(Long userId, String title, String content) {
        return createNotification(userId, "GENERAL", title, content, null);
    }

    public List<Notification> getUserNotifications(Long userId) {
        return notificationRepository.findByUser_UserIdOrderByCreatedAtDesc(userId);
    }
    
    public Page<Notification> getUserNotifications(Long userId, Pageable pageable) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User không tồn tại"));
        return notificationRepository.findByUserOrderByCreatedAtDesc(user, pageable);
    }

    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUser_UserIdAndIsReadFalse(userId);
    }

    public void markAsRead(Long notificationId, Long userId) {
        Optional<Notification> notificationOpt = notificationRepository.findById(notificationId);
        if (notificationOpt.isPresent()) {
            Notification notification = notificationOpt.get();
            if (notification.getUser() != null && notification.getUser().getUserId().equals(userId)) {
                notification.markAsRead();
                notificationRepository.save(notification);
            }
        }
    }

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

    public void deleteNotification(Long notificationId, Long userId) {
        Optional<Notification> notificationOpt = notificationRepository.findById(notificationId);
        if (notificationOpt.isPresent()) {
            Notification notification = notificationOpt.get();
            if (notification.getUser() != null && notification.getUser().getUserId().equals(userId)) {
                notificationRepository.delete(notification);
            }
        }
    }
}
