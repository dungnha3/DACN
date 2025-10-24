package DoAn.BE.chat.service;

import DoAn.BE.chat.websocket.service.WebSocketNotificationService;
import DoAn.BE.user.entity.User;
import DoAn.BE.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Service
public class TypingIndicatorService {

    @Autowired
    private WebSocketNotificationService webSocketNotificationService;

    @Autowired
    private UserRepository userRepository;

    // Store typing users for each room: roomId -> Set of userIds
    private final Map<Long, Set<Long>> typingUsers = new ConcurrentHashMap<>();
    
    // Store last typing time for cleanup: roomId -> userId -> timestamp
    private final Map<Long, Map<Long, Long>> lastTypingTime = new ConcurrentHashMap<>();

    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

    public TypingIndicatorService() {
        // Schedule cleanup task every 5 seconds
        scheduler.scheduleAtFixedRate(this::cleanupExpiredTyping, 5, 5, TimeUnit.SECONDS);
    }

    /**
     * Bắt đầu typing indicator
     */
    public void startTyping(Long roomId, Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return;

        // Add user to typing set
        typingUsers.computeIfAbsent(roomId, k -> ConcurrentHashMap.newKeySet()).add(userId);
        
        // Update last typing time
        lastTypingTime.computeIfAbsent(roomId, k -> new ConcurrentHashMap<>())
                     .put(userId, System.currentTimeMillis());

        // Notify other users
        webSocketNotificationService.notifyTyping(roomId, userId, user.getUsername(), true);
    }

    /**
     * Dừng typing indicator
     */
    public void stopTyping(Long roomId, Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return;

        // Remove user from typing set
        Set<Long> roomTypingUsers = typingUsers.get(roomId);
        if (roomTypingUsers != null) {
            roomTypingUsers.remove(userId);
            if (roomTypingUsers.isEmpty()) {
                typingUsers.remove(roomId);
            }
        }

        // Remove from last typing time
        Map<Long, Long> roomLastTyping = lastTypingTime.get(roomId);
        if (roomLastTyping != null) {
            roomLastTyping.remove(userId);
            if (roomLastTyping.isEmpty()) {
                lastTypingTime.remove(roomId);
            }
        }

        // Notify other users
        webSocketNotificationService.notifyTyping(roomId, userId, user.getUsername(), false);
    }

    /**
     * Lấy danh sách user đang typing trong phòng
     */
    public List<String> getTypingUsers(Long roomId) {
        Set<Long> roomTypingUsers = typingUsers.get(roomId);
        if (roomTypingUsers == null || roomTypingUsers.isEmpty()) {
            return List.of();
        }

        return roomTypingUsers.stream()
            .map(userId -> userRepository.findById(userId)
                .map(User::getUsername)
                .orElse("Unknown"))
            .toList();
    }

    /**
     * Lấy số lượng user đang typing
     */
    public int getTypingUserCount(Long roomId) {
        Set<Long> roomTypingUsers = typingUsers.get(roomId);
        return roomTypingUsers != null ? roomTypingUsers.size() : 0;
    }

    /**
     * Kiểm tra user có đang typing không
     */
    public boolean isUserTyping(Long roomId, Long userId) {
        Set<Long> roomTypingUsers = typingUsers.get(roomId);
        return roomTypingUsers != null && roomTypingUsers.contains(userId);
    }

    /**
     * Cleanup expired typing indicators (older than 5 seconds)
     */
    private void cleanupExpiredTyping() {
        long currentTime = System.currentTimeMillis();
        long expireTime = 5000; // 5 seconds

        for (Map.Entry<Long, Map<Long, Long>> roomEntry : lastTypingTime.entrySet()) {
            Long roomId = roomEntry.getKey();
            Map<Long, Long> roomLastTyping = roomEntry.getValue();

            // Find expired users
            List<Long> expiredUsers = roomLastTyping.entrySet().stream()
                .filter(entry -> currentTime - entry.getValue() > expireTime)
                .map(Map.Entry::getKey)
                .toList();

            // Remove expired users
            for (Long userId : expiredUsers) {
                stopTyping(roomId, userId);
            }
        }
    }

    /**
     * Force stop typing for a user (when they send a message)
     */
    public void forceStopTyping(Long roomId, Long userId) {
        stopTyping(roomId, userId);
    }

    /**
     * Clear all typing indicators for a room
     */
    public void clearAllTyping(Long roomId) {
        Set<Long> roomTypingUsers = typingUsers.get(roomId);
        if (roomTypingUsers != null) {
            List<Long> usersToStop = List.copyOf(roomTypingUsers);
            for (Long userId : usersToStop) {
                stopTyping(roomId, userId);
            }
        }
    }

    /**
     * Get typing status for all rooms
     */
    public Map<Long, List<String>> getAllTypingStatus() {
        return typingUsers.entrySet().stream()
            .collect(java.util.stream.Collectors.toMap(
                Map.Entry::getKey,
                entry -> getTypingUsers(entry.getKey())
            ));
    }
}

