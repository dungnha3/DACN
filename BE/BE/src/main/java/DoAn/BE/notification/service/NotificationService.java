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

    // ==================== HR NOTIFICATIONS ====================

    /**
     * Tạo notification cho bảng lương mới
     */
    public Notification createSalaryNotification(Long userId, String month, String year) {
        String title = "Bảng lương mới";
        String content = "Bảng lương tháng " + month + "/" + year + " đã được tạo";
        String link = "/hr/bang-luong";
        return createNotification(userId, "HR_SALARY", title, content, link);
    }

    /**
     * Tạo notification khi đơn nghỉ phép được phê duyệt
     */
    public Notification createLeaveApprovedNotification(Long userId, String startDate, String endDate) {
        String title = "Đơn nghỉ phép được duyệt";
        String content = "Đơn nghỉ phép từ " + startDate + " đến " + endDate + " đã được phê duyệt";
        String link = "/hr/nghi-phep";
        return createNotification(userId, "HR_LEAVE_APPROVED", title, content, link);
    }

    /**
     * Tạo notification khi đơn nghỉ phép bị từ chối
     */
    public Notification createLeaveRejectedNotification(Long userId, String startDate, String endDate, String reason) {
        String title = "Đơn nghỉ phép bị từ chối";
        String content = "Đơn nghỉ phép từ " + startDate + " đến " + endDate + " đã bị từ chối. Lý do: " + reason;
        String link = "/hr/nghi-phep";
        return createNotification(userId, "HR_LEAVE_REJECTED", title, content, link);
    }

    /**
     * Tạo notification cho người quản lý khi có đơn nghỉ phép mới
     */
    public Notification createNewLeaveRequestNotification(Long managerId, String employeeName) {
        String title = "Đơn nghỉ phép mới";
        String content = employeeName + " đã gửi đơn xin nghỉ phép";
        String link = "/hr/nghi-phep/pending";
        return createNotification(managerId, "HR_LEAVE_REQUEST", title, content, link);
    }

    /**
     * Tạo notification khi hợp đồng sắp hết hạn
     */
    public Notification createContractExpiringNotification(Long userId, String employeeName, String expiryDate) {
        String title = "Hợp đồng sắp hết hạn";
        String content = "Hợp đồng của " + employeeName + " sẽ hết hạn vào " + expiryDate;
        String link = "/hr/hop-dong";
        return createNotification(userId, "HR_CONTRACT_EXPIRING", title, content, link);
    }

    /**
     * Tạo notification khi bảng lương được thanh toán
     */
    public Notification createSalaryPaidNotification(Long userId, String month, String year, String amount) {
        String title = "Lương đã được thanh toán";
        String content = "Lương tháng " + month + "/" + year + " (" + amount + " VNĐ) đã được thanh toán";
        String link = "/hr/bang-luong";
        return createNotification(userId, "HR_SALARY_PAID", title, content, link);
    }
}

