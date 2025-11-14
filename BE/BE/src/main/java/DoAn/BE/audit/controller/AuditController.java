package DoAn.BE.audit.controller;

import DoAn.BE.audit.entity.AuditLog;
import DoAn.BE.audit.service.AuditService;
import DoAn.BE.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/audit")
@RequiredArgsConstructor
public class AuditController {
    
    private final AuditService auditService;
    
    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return (User) auth.getPrincipal();
    }
    
    /**
     * Lấy danh sách audit logs - Chỉ Admin
     * GET /api/audit/logs?page=0&size=10
     */
    @GetMapping("/logs")
    public ResponseEntity<Page<AuditLog>> getAuditLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "timestamp") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        User currentUser = getCurrentUser();
        if (!currentUser.isAdmin()) {
            throw new RuntimeException("Chỉ Admin mới có quyền xem audit logs");
        }
        
        Sort sort = sortDir.equalsIgnoreCase("asc") ? 
            Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<AuditLog> auditLogs = auditService.getAuditLogs(pageable);
        return ResponseEntity.ok(auditLogs);
    }
    
    /**
     * Lấy audit logs theo user - Admin hoặc chính user đó
     * GET /api/audit/logs/user/{username}
     */
    @GetMapping("/logs/user/{username}")
    public ResponseEntity<Page<AuditLog>> getAuditLogsByUser(
            @PathVariable String username,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        User currentUser = getCurrentUser();
        if (!currentUser.isAdmin() && !currentUser.getUsername().equals(username)) {
            throw new RuntimeException("Chỉ Admin hoặc chính user đó mới có quyền xem audit logs");
        }
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("timestamp").descending());
        Page<AuditLog> auditLogs = auditService.getAuditLogsByUser(username, pageable);
        return ResponseEntity.ok(auditLogs);
    }
    
    /**
     * Lấy audit logs theo khoảng thời gian - Chỉ Admin
     * GET /api/audit/logs/date-range?startDate=2024-01-01T00:00:00&endDate=2024-12-31T23:59:59
     */
    @GetMapping("/logs/date-range")
    public ResponseEntity<Page<AuditLog>> getAuditLogsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        User currentUser = getCurrentUser();
        if (!currentUser.isAdmin()) {
            throw new RuntimeException("Chỉ Admin mới có quyền xem audit logs theo thời gian");
        }
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("timestamp").descending());
        Page<AuditLog> auditLogs = auditService.getAuditLogsByDateRange(startDate, endDate, pageable);
        return ResponseEntity.ok(auditLogs);
    }
    
    /**
     * Lấy các action thất bại - Chỉ Admin
     * GET /api/audit/failed-actions
     */
    @GetMapping("/failed-actions")
    public ResponseEntity<List<AuditLog>> getFailedActions() {
        User currentUser = getCurrentUser();
        if (!currentUser.isAdmin()) {
            throw new RuntimeException("Chỉ Admin mới có quyền xem failed actions");
        }
        
        List<AuditLog> failedActions = auditService.getFailedActions();
        return ResponseEntity.ok(failedActions);
    }
    
    /**
     * Lấy suspicious activities - Chỉ Admin
     * GET /api/audit/suspicious?hours=24
     */
    @GetMapping("/suspicious")
    public ResponseEntity<List<AuditLog>> getSuspiciousActivities(
            @RequestParam(defaultValue = "24") int hours) {
        
        User currentUser = getCurrentUser();
        if (!currentUser.isAdmin()) {
            throw new RuntimeException("Chỉ Admin mới có quyền xem suspicious activities");
        }
        
        LocalDateTime since = LocalDateTime.now().minusHours(hours);
        List<AuditLog> suspiciousActivities = auditService.getSuspiciousActivities(since);
        return ResponseEntity.ok(suspiciousActivities);
    }
    
    /**
     * Kiểm tra account có bị lock không
     * GET /api/audit/account-status/{username}
     */
    @GetMapping("/account-status/{username}")
    public ResponseEntity<Map<String, Object>> getAccountStatus(@PathVariable String username) {
        User currentUser = getCurrentUser();
        if (!currentUser.isAdmin() && !currentUser.getUsername().equals(username)) {
            throw new RuntimeException("Chỉ Admin hoặc chính user đó mới có quyền kiểm tra trạng thái account");
        }
        
        boolean isLocked = auditService.isAccountLocked(username);
        List<AuditLog> recentActivity = auditService.getRecentUserActivity(username, 24);
        
        Map<String, Object> response = new HashMap<>();
        response.put("username", username);
        response.put("isLocked", isLocked);
        response.put("recentActivityCount", recentActivity.size());
        response.put("recentActivity", recentActivity.stream().limit(10).toList()); // Last 10 activities
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Lấy thống kê action theo user - Admin hoặc chính user đó
     * GET /api/audit/stats/user/{username}
     */
    @GetMapping("/stats/user/{username}")
    public ResponseEntity<Map<String, Object>> getUserActionStats(@PathVariable String username) {
        User currentUser = getCurrentUser();
        if (!currentUser.isAdmin() && !currentUser.getUsername().equals(username)) {
            throw new RuntimeException("Chỉ Admin hoặc chính user đó mới có quyền xem thống kê");
        }
        
        Map<AuditLog.ActionType, Long> actionStats = auditService.getActionStatsByUser(username);
        List<AuditLog> recentActivity = auditService.getRecentUserActivity(username, 168); // Last 7 days
        
        Map<String, Object> response = new HashMap<>();
        response.put("username", username);
        response.put("actionStats", actionStats);
        response.put("recentActivityCount", recentActivity.size());
        response.put("lastActivity", recentActivity.isEmpty() ? null : recentActivity.get(0).getTimestamp());
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Lấy thống kê action theo ngày - Chỉ Admin
     * GET /api/audit/stats/daily?days=30
     */
    @GetMapping("/stats/daily")
    public ResponseEntity<Map<String, Long>> getDailyActionStats(
            @RequestParam(defaultValue = "30") int days) {
        
        User currentUser = getCurrentUser();
        if (!currentUser.isAdmin()) {
            throw new RuntimeException("Chỉ Admin mới có quyền xem thống kê hàng ngày");
        }
        
        LocalDateTime startDate = LocalDateTime.now().minusDays(days);
        LocalDateTime endDate = LocalDateTime.now();
        
        Map<String, Long> dailyStats = auditService.getDailyActionStats(startDate, endDate);
        return ResponseEntity.ok(dailyStats);
    }
    
    /**
     * Kiểm tra IP có bị block không - Chỉ Admin
     * GET /api/audit/ip-status?ip=192.168.1.1
     */
    @GetMapping("/ip-status")
    public ResponseEntity<Map<String, Object>> getIpStatus(@RequestParam String ip) {
        User currentUser = getCurrentUser();
        if (!currentUser.isAdmin()) {
            throw new RuntimeException("Chỉ Admin mới có quyền kiểm tra IP status");
        }
        
        boolean isBlocked = auditService.isIpBlocked(ip);
        
        Map<String, Object> response = new HashMap<>();
        response.put("ipAddress", ip);
        response.put("isBlocked", isBlocked);
        
        return ResponseEntity.ok(response);
    }
}
