package DoAn.BE.chat.service;

import DoAn.BE.user.entity.User;
import DoAn.BE.user.repository.UserRepository;
import DoAn.BE.chat.websocket.service.WebSocketNotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Transactional
public class UserPresenceService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WebSocketNotificationService webSocketNotificationService;

    // Store online users
    private final Set<Long> onlineUsers = ConcurrentHashMap.newKeySet();

    /**
     * Đánh dấu user online
     */
    public void markUserOnline(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User không tồn tại"));

        boolean wasOffline = !onlineUsers.contains(userId);
        onlineUsers.add(userId);

        // Cập nhật database
        user.setIsOnline(true);
        user.setLastSeen(LocalDateTime.now());
        userRepository.save(user);

        // Thông báo đến các phòng chat mà user tham gia
        if (wasOffline) {
            notifyUserStatusChange(userId, true);
        }
    }

    /**
     * Đánh dấu user offline
     */
    public void markUserOffline(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User không tồn tại"));

        boolean wasOnline = onlineUsers.contains(userId);
        onlineUsers.remove(userId);

        // Cập nhật database
        user.setIsOnline(false);
        user.setLastSeen(LocalDateTime.now());
        userRepository.save(user);

        // Thông báo đến các phòng chat mà user tham gia
        if (wasOnline) {
            notifyUserStatusChange(userId, false);
        }
    }

    /**
     * Kiểm tra user có online không
     */
    public boolean isUserOnline(Long userId) {
        return onlineUsers.contains(userId);
    }

    /**
     * Lấy danh sách user online
     */
    public List<Long> getOnlineUsers() {
        return List.copyOf(onlineUsers);
    }

    /**
     * Lấy số lượng user online
     */
    public int getOnlineUserCount() {
        return onlineUsers.size();
    }

    /**
     * Cập nhật last seen của user
     */
    public void updateLastSeen(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User không tồn tại"));

        user.setLastSeen(LocalDateTime.now());
        userRepository.save(user);
    }

    /**
     * Thông báo thay đổi trạng thái online/offline
     */
    private void notifyUserStatusChange(Long userId, boolean isOnline) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return;

        String statusMessage = isOnline ? "đã online" : "đã offline";
        
        // Gửi notification đến tất cả phòng chat mà user tham gia
        // TODO: Implement logic để lấy danh sách phòng chat của user
        // và gửi notification đến từng phòng
        
        // Tạm thời gửi notification chung
        java.util.Map<String, Object> data = new java.util.HashMap<>();
        data.put("userId", userId);
        data.put("isOnline", isOnline);
        
        webSocketNotificationService.sendNotification(
            user.getUsername(),
            "Trạng thái: " + statusMessage,
            data
        );
    }

    /**
     * Cleanup users who haven't been active for a while
     */
    public void cleanupInactiveUsers() {
        LocalDateTime cutoffTime = LocalDateTime.now().minusMinutes(5);
        
        List<User> inactiveUsers = userRepository.findByIsOnlineTrueAndLastSeenBefore(cutoffTime);
        
        for (User user : inactiveUsers) {
            markUserOffline(user.getUserId());
        }
    }
}
