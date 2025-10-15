package DoAn.BE.auth.service;

import DoAn.BE.auth.entity.UserSession;
import DoAn.BE.auth.repository.UserSessionRepository;
import DoAn.BE.user.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class SessionService {

    @Autowired
    private UserSessionRepository userSessionRepository;

    @Value("${session.timeout:30}") // 30 minutes
    private int sessionTimeoutMinutes;

    @Value("${session.max-concurrent:5}") // Max 5 concurrent sessions per user
    private int maxConcurrentSessions;

    /**
     * Tạo session mới cho user
     */
    public UserSession createSession(User user, String ipAddress, String userAgent) {
        // Kiểm tra số lượng session hiện tại
        List<UserSession> activeSessions = userSessionRepository.findByUserAndIsActiveTrue(user);
        
        if (activeSessions.size() >= maxConcurrentSessions) {
            // Xóa session cũ nhất
            UserSession oldestSession = activeSessions.stream()
                    .min((s1, s2) -> s1.getLastActivity().compareTo(s2.getLastActivity()))
                    .orElse(null);
            if (oldestSession != null) {
                deactivateSession(oldestSession.getSessionId());
            }
        }

        // Tạo session mới
        UserSession session = new UserSession();
        session.setUser(user);
        session.setSessionId(UUID.randomUUID().toString());
        session.setIpAddress(ipAddress);
        session.setUserAgent(userAgent);
        session.setIsActive(true);

        return userSessionRepository.save(session);
    }

    /**
     * Cập nhật hoạt động của session
     */
    public void updateSessionActivity(String sessionId) {
        Optional<UserSession> sessionOpt = userSessionRepository.findBySessionId(sessionId);
        if (sessionOpt.isPresent()) {
            UserSession session = sessionOpt.get();
            session.updateActivity();
            userSessionRepository.save(session);
        }
    }

    /**
     * Vô hiệu hóa session
     */
    public void deactivateSession(String sessionId) {
        Optional<UserSession> sessionOpt = userSessionRepository.findBySessionId(sessionId);
        if (sessionOpt.isPresent()) {
            UserSession session = sessionOpt.get();
            session.setIsActive(false);
            userSessionRepository.save(session);
        }
    }

    /**
     * Vô hiệu hóa tất cả session của user
     */
    public void deactivateAllUserSessions(User user) {
        List<UserSession> sessions = userSessionRepository.findByUserAndIsActiveTrue(user);
        sessions.forEach(session -> {
            session.setIsActive(false);
            userSessionRepository.save(session);
        });
    }

    /**
     * Kiểm tra session có hợp lệ không
     */
    public boolean isValidSession(String sessionId) {
        Optional<UserSession> sessionOpt = userSessionRepository.findBySessionId(sessionId);
        if (sessionOpt.isEmpty()) {
            return false;
        }

        UserSession session = sessionOpt.get();
        return session.getIsActive() && !session.isExpired(sessionTimeoutMinutes);
    }

    /**
     * Lấy thông tin session
     */
    public Optional<UserSession> getSession(String sessionId) {
        return userSessionRepository.findBySessionId(sessionId);
    }

    /**
     * Lấy tất cả session active của user
     */
    public List<UserSession> getUserActiveSessions(User user) {
        return userSessionRepository.findByUserAndIsActiveTrue(user);
    }

    /**
     * Dọn dẹp session hết hạn
     */
    @Transactional
    public void cleanupExpiredSessions() {
        List<UserSession> allSessions = userSessionRepository.findAll();
        LocalDateTime cutoffTime = LocalDateTime.now().minusMinutes(sessionTimeoutMinutes);
        
        allSessions.stream()
                .filter(session -> session.getLastActivity().isBefore(cutoffTime))
                .forEach(session -> {
                    session.setIsActive(false);
                    userSessionRepository.save(session);
                });
    }

    /**
     * Đếm số session active của user
     */
    public long countActiveSessions(User user) {
        return userSessionRepository.findByUserAndIsActiveTrue(user).size();
    }

    /**
     * Kiểm tra IP address có khác với session hiện tại không
     */
    public boolean isSuspiciousActivity(String sessionId, String currentIp) {
        Optional<UserSession> sessionOpt = userSessionRepository.findBySessionId(sessionId);
        if (sessionOpt.isEmpty()) {
            return false;
        }

        UserSession session = sessionOpt.get();
        return !currentIp.equals(session.getIpAddress());
    }
}




