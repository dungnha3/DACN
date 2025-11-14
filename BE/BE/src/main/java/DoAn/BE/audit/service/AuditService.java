package DoAn.BE.audit.service;

import DoAn.BE.audit.entity.AuditLog;
import DoAn.BE.audit.entity.AuditLog.ActionType;
import DoAn.BE.audit.repository.AuditLogRepository;
import DoAn.BE.user.entity.User;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuditService {
    
    private final AuditLogRepository auditLogRepository;
    private final ObjectMapper objectMapper;
    
    /**
     * Ghi log audit (async để không ảnh hưởng performance)
     */
    @Async
    @Transactional
    public void logAction(User user, ActionType action, String resourceType, Long resourceId,
                         String description, String ipAddress, String userAgent, String sessionId) {
        try {
            AuditLog auditLog = new AuditLog();
            auditLog.setUser(user);
            auditLog.setUsername(user != null ? user.getUsername() : "SYSTEM");
            auditLog.setAction(action);
            auditLog.setResourceType(resourceType);
            auditLog.setResourceId(resourceId);
            auditLog.setDescription(description);
            auditLog.setIpAddress(ipAddress);
            auditLog.setUserAgent(userAgent);
            auditLog.setSessionId(sessionId);
            auditLog.setSuccess(true);
            
            auditLogRepository.save(auditLog);
            log.debug("Audit log saved: {} - {} - {}", user != null ? user.getUsername() : "SYSTEM", action, description);
        } catch (Exception e) {
            log.error("Failed to save audit log: {}", e.getMessage());
        }
    }
    
    /**
     * Ghi log với old/new values
     */
    @Async
    @Transactional
    public void logActionWithValues(User user, ActionType action, String resourceType, Long resourceId,
                                  String description, Object oldValues, Object newValues,
                                  String ipAddress, String userAgent, String sessionId) {
        try {
            AuditLog auditLog = new AuditLog();
            auditLog.setUser(user);
            auditLog.setUsername(user != null ? user.getUsername() : "SYSTEM");
            auditLog.setAction(action);
            auditLog.setResourceType(resourceType);
            auditLog.setResourceId(resourceId);
            auditLog.setDescription(description);
            auditLog.setIpAddress(ipAddress);
            auditLog.setUserAgent(userAgent);
            auditLog.setSessionId(sessionId);
            auditLog.setSuccess(true);
            
            if (oldValues != null) {
                auditLog.setOldValues(objectMapper.writeValueAsString(oldValues));
            }
            if (newValues != null) {
                auditLog.setNewValues(objectMapper.writeValueAsString(newValues));
            }
            
            auditLogRepository.save(auditLog);
        } catch (Exception e) {
            log.error("Failed to save audit log with values: {}", e.getMessage());
        }
    }
    
    /**
     * Ghi log thất bại
     */
    @Async
    @Transactional
    public void logFailedAction(User user, ActionType action, String resourceType, Long resourceId,
                              String description, String errorMessage, String ipAddress, 
                              String userAgent, String sessionId) {
        try {
            AuditLog auditLog = new AuditLog();
            auditLog.setUser(user);
            auditLog.setUsername(user != null ? user.getUsername() : "ANONYMOUS");
            auditLog.setAction(action);
            auditLog.setResourceType(resourceType);
            auditLog.setResourceId(resourceId);
            auditLog.setDescription(description);
            auditLog.setIpAddress(ipAddress);
            auditLog.setUserAgent(userAgent);
            auditLog.setSessionId(sessionId);
            auditLog.setSuccess(false);
            auditLog.setErrorMessage(errorMessage);
            
            auditLogRepository.save(auditLog);
        } catch (Exception e) {
            log.error("Failed to save failed audit log: {}", e.getMessage());
        }
    }
    
    /**
     * Lấy audit logs với phân trang
     */
    @Transactional(readOnly = true)
    @SuppressWarnings("null")
    public Page<AuditLog> getAuditLogs(Pageable pageable) {
        return auditLogRepository.findAll(pageable);
    }
    
    /**
     * Lấy audit logs theo user
     */
    @Transactional(readOnly = true)
    public Page<AuditLog> getAuditLogsByUser(String username, Pageable pageable) {
        return auditLogRepository.findByUsername(username, pageable);
    }
    
    /**
     * Lấy audit logs theo khoảng thời gian
     */
    @Transactional(readOnly = true)
    public Page<AuditLog> getAuditLogsByDateRange(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable) {
        return auditLogRepository.findByTimestampBetween(startDate, endDate, pageable);
    }
    
    /**
     * Lấy các action thất bại
     */
    @Transactional(readOnly = true)
    public List<AuditLog> getFailedActions() {
        return auditLogRepository.findFailedActions();
    }
    
    /**
     * Lấy suspicious activities
     */
    @Transactional(readOnly = true)
    public List<AuditLog> getSuspiciousActivities(LocalDateTime since) {
        return auditLogRepository.findSuspiciousActivities(since);
    }
    
    /**
     * Kiểm tra failed login attempts
     */
    @Transactional(readOnly = true)
    public boolean isAccountLocked(String username) {
        LocalDateTime oneHourAgo = LocalDateTime.now().minusHours(1);
        long failedAttempts = auditLogRepository.countFailedLoginAttempts(username, oneHourAgo);
        return failedAttempts >= 5; // Lock after 5 failed attempts in 1 hour
    }
    
    /**
     * Kiểm tra IP có bị block không
     */
    @Transactional(readOnly = true)
    public boolean isIpBlocked(String ipAddress) {
        LocalDateTime oneHourAgo = LocalDateTime.now().minusHours(1);
        long failedAttempts = auditLogRepository.countFailedLoginAttemptsByIp(ipAddress, oneHourAgo);
        return failedAttempts >= 10; // Block IP after 10 failed attempts in 1 hour
    }
    
    /**
     * Lấy thống kê action theo user
     */
    @Transactional(readOnly = true)
    public Map<ActionType, Long> getActionStatsByUser(String username) {
        List<Object[]> results = auditLogRepository.getActionStatsByUser(username);
        return results.stream().collect(
            java.util.stream.Collectors.toMap(
                row -> (ActionType) row[0],
                row -> (Long) row[1]
            )
        );
    }
    
    /**
     * Lấy thống kê action theo ngày
     */
    @Transactional(readOnly = true)
    public Map<String, Long> getDailyActionStats(LocalDateTime startDate, LocalDateTime endDate) {
        List<Object[]> results = auditLogRepository.getDailyActionStats(startDate, endDate);
        return results.stream().collect(
            java.util.stream.Collectors.toMap(
                row -> row[0].toString(),
                row -> (Long) row[1]
            )
        );
    }
    
    /**
     * Lấy activity gần đây của user
     */
    @Transactional(readOnly = true)
    public List<AuditLog> getRecentUserActivity(String username, int hours) {
        LocalDateTime since = LocalDateTime.now().minusHours(hours);
        return auditLogRepository.findRecentActivityByUser(username, since);
    }
    
    /**
     * Dọn dẹp audit log cũ (chạy hàng tháng)
     */
    @Scheduled(cron = "0 0 2 1 * *") // 2AM on 1st day of month
    @Transactional
    public void cleanupOldAuditLogs() {
        LocalDateTime cutoffDate = LocalDateTime.now().minusMonths(6); // Keep 6 months
        int deletedCount = auditLogRepository.deleteOldAuditLogs(cutoffDate);
        log.info("Cleaned up {} old audit logs", deletedCount);
        
        // Log the cleanup action
        logAction(null, ActionType.SYSTEM_BACKUP, "AuditLog", null, 
                 "Cleaned up " + deletedCount + " old audit logs", 
                 null, null, null);
    }
    
    // Helper methods for common audit actions
    
    public void logLogin(User user, String ipAddress, String userAgent, String sessionId) {
        logAction(user, ActionType.LOGIN, "User", user.getUserId(), 
                 "User logged in successfully", ipAddress, userAgent, sessionId);
    }
    
    public void logFailedLogin(String username, String ipAddress, String userAgent, String errorMessage) {
        logFailedAction(null, ActionType.LOGIN_FAILED, "User", null, 
                       "Failed login attempt for username: " + username, 
                       errorMessage, ipAddress, userAgent, null);
    }
    
    public void logLogout(User user, String ipAddress, String userAgent, String sessionId) {
        logAction(user, ActionType.LOGOUT, "User", user.getUserId(), 
                 "User logged out", ipAddress, userAgent, sessionId);
    }
    
    public void logPasswordChange(User user, String ipAddress, String userAgent, String sessionId) {
        logAction(user, ActionType.PASSWORD_CHANGE, "User", user.getUserId(), 
                 "Password changed", ipAddress, userAgent, sessionId);
    }
    
    public void logRoleChange(User admin, User targetUser, User.Role oldRole, User.Role newRole, 
                             String ipAddress, String userAgent, String sessionId) {
        String description = String.format("Changed role of user %s from %s to %s", 
                                         targetUser.getUsername(), oldRole, newRole);
        logAction(admin, ActionType.CHANGE_ROLE, "User", targetUser.getUserId(), 
                 description, ipAddress, userAgent, sessionId);
    }
    
    public void logDataExport(User user, String exportType, String ipAddress, String userAgent, String sessionId) {
        logAction(user, ActionType.EXPORT_DATA, exportType, null, 
                 "Exported " + exportType + " data", ipAddress, userAgent, sessionId);
    }
    
    public void logHRAction(User user, ActionType action, String resourceType, Long resourceId, 
                           String description, String ipAddress, String userAgent, String sessionId) {
        logAction(user, action, resourceType, resourceId, description, ipAddress, userAgent, sessionId);
    }
}
