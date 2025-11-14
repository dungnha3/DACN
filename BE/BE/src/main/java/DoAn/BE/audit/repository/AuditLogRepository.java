package DoAn.BE.audit.repository;

import DoAn.BE.audit.entity.AuditLog;
import DoAn.BE.audit.entity.AuditLog.ActionType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    
    // Tìm audit log theo user
    @Query("SELECT al FROM AuditLog al WHERE al.username = :username ORDER BY al.timestamp DESC")
    List<AuditLog> findByUsername(@Param("username") String username);
    
    @Query("SELECT al FROM AuditLog al WHERE al.username = :username ORDER BY al.timestamp DESC")
    Page<AuditLog> findByUsername(@Param("username") String username, Pageable pageable);
    
    // Tìm theo action type
    @Query("SELECT al FROM AuditLog al WHERE al.action = :action ORDER BY al.timestamp DESC")
    List<AuditLog> findByAction(@Param("action") ActionType action);
    
    // Tìm theo resource type
    @Query("SELECT al FROM AuditLog al WHERE al.resourceType = :resourceType ORDER BY al.timestamp DESC")
    List<AuditLog> findByResourceType(@Param("resourceType") String resourceType);
    
    // Tìm theo resource id
    @Query("SELECT al FROM AuditLog al WHERE al.resourceType = :resourceType AND al.resourceId = :resourceId ORDER BY al.timestamp DESC")
    List<AuditLog> findByResourceTypeAndId(@Param("resourceType") String resourceType, @Param("resourceId") Long resourceId);
    
    // Tìm theo khoảng thời gian
    @Query("SELECT al FROM AuditLog al WHERE al.timestamp BETWEEN :startDate AND :endDate ORDER BY al.timestamp DESC")
    List<AuditLog> findByTimestampBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT al FROM AuditLog al WHERE al.timestamp BETWEEN :startDate AND :endDate ORDER BY al.timestamp DESC")
    Page<AuditLog> findByTimestampBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate, Pageable pageable);
    
    // Tìm các action thất bại
    @Query("SELECT al FROM AuditLog al WHERE al.success = false ORDER BY al.timestamp DESC")
    List<AuditLog> findFailedActions();
    
    // Tìm theo IP address
    @Query("SELECT al FROM AuditLog al WHERE al.ipAddress = :ipAddress ORDER BY al.timestamp DESC")
    List<AuditLog> findByIpAddress(@Param("ipAddress") String ipAddress);
    
    // Tìm login attempts từ IP
    @Query("SELECT al FROM AuditLog al WHERE al.ipAddress = :ipAddress AND al.action IN ('LOGIN', 'LOGIN_FAILED') ORDER BY al.timestamp DESC")
    List<AuditLog> findLoginAttemptsByIp(@Param("ipAddress") String ipAddress);
    
    // Đếm failed login attempts trong khoảng thời gian
    @Query("SELECT COUNT(al) FROM AuditLog al WHERE al.username = :username AND al.action = 'LOGIN_FAILED' AND al.timestamp > :since")
    long countFailedLoginAttempts(@Param("username") String username, @Param("since") LocalDateTime since);
    
    @Query("SELECT COUNT(al) FROM AuditLog al WHERE al.ipAddress = :ipAddress AND al.action = 'LOGIN_FAILED' AND al.timestamp > :since")
    long countFailedLoginAttemptsByIp(@Param("ipAddress") String ipAddress, @Param("since") LocalDateTime since);
    
    // Thống kê action theo user
    @Query("SELECT al.action, COUNT(al) FROM AuditLog al WHERE al.username = :username GROUP BY al.action")
    List<Object[]> getActionStatsByUser(@Param("username") String username);
    
    // Thống kê action theo ngày
    @Query("SELECT DATE(al.timestamp), COUNT(al) FROM AuditLog al WHERE al.timestamp BETWEEN :startDate AND :endDate GROUP BY DATE(al.timestamp) ORDER BY DATE(al.timestamp)")
    List<Object[]> getDailyActionStats(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    // Xóa audit log cũ (cleanup)
    @Modifying
    @Query("DELETE FROM AuditLog al WHERE al.timestamp < :cutoffDate")
    int deleteOldAuditLogs(@Param("cutoffDate") LocalDateTime cutoffDate);
    
    // Tìm các session đang active
    @Query("SELECT DISTINCT al.sessionId FROM AuditLog al WHERE al.sessionId IS NOT NULL AND al.action = 'LOGIN' AND al.timestamp > :since")
    List<String> findActiveSessions(@Param("since") LocalDateTime since);
    
    // Tìm user activity gần đây
    @Query("SELECT al FROM AuditLog al WHERE al.username = :username AND al.timestamp > :since ORDER BY al.timestamp DESC")
    List<AuditLog> findRecentActivityByUser(@Param("username") String username, @Param("since") LocalDateTime since);
    
    // Tìm suspicious activities
    @Query("SELECT al FROM AuditLog al WHERE (al.action IN ('LOGIN_FAILED', 'PASSWORD_CHANGE', 'CHANGE_ROLE') OR al.success = false) AND al.timestamp > :since ORDER BY al.timestamp DESC")
    List<AuditLog> findSuspiciousActivities(@Param("since") LocalDateTime since);
}
