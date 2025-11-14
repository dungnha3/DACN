package DoAn.BE.hr.controller;

import DoAn.BE.audit.entity.AuditLog.ActionType;
import DoAn.BE.audit.service.AuditService;
import DoAn.BE.hr.entity.NhanVien;
import DoAn.BE.hr.service.NhanVienService;
import DoAn.BE.hr.service.WorkflowNotificationService;
import DoAn.BE.user.entity.User;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/hr/salary-proposal")
@RequiredArgsConstructor
public class SalaryIncreaseProposalController {
    
    private final NhanVienService nhanVienService;
    private final WorkflowNotificationService workflowNotificationService;
    private final AuditService auditService;
    
    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return (User) auth.getPrincipal();
    }
    
    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty() && !"unknown".equalsIgnoreCase(xForwardedFor)) {
            return xForwardedFor.split(",")[0].trim();
        }
        
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty() && !"unknown".equalsIgnoreCase(xRealIp)) {
            return xRealIp;
        }
        
        return request.getRemoteAddr();
    }
    
    /**
     * Đề xuất tăng lương - Chỉ Project Manager
     * POST /api/hr/salary-proposal
     */
    @PostMapping
    public ResponseEntity<Map<String, String>> proposeSalaryIncrease(
            @Valid @RequestBody SalaryIncreaseRequest request,
            HttpServletRequest httpRequest) {
        
        User currentUser = getCurrentUser();
        if (!currentUser.isManagerProject()) {
            throw new RuntimeException("Chỉ Project Manager mới có quyền đề xuất tăng lương");
        }
        
        // Lấy thông tin nhân viên
        NhanVien nhanVien = nhanVienService.getNhanVienById(request.getNhanVienId(), currentUser);
        
        // Kiểm tra lương hiện tại
        BigDecimal currentSalary = nhanVien.getLuongCoBan();
        if (request.getProposedSalary().compareTo(currentSalary) <= 0) {
            throw new RuntimeException("Lương đề xuất phải cao hơn lương hiện tại");
        }
        
        // Gửi thông báo đề xuất
        workflowNotificationService.notifySalaryIncreaseProposal(
            nhanVien.getUser().getUserId(),
            currentSalary,
            request.getProposedSalary(),
            request.getReason(),
            currentUser
        );
        
        // Audit log
        String ipAddress = getClientIpAddress(httpRequest);
        String userAgent = httpRequest.getHeader("User-Agent");
        String description = String.format("Đề xuất tăng lương cho %s từ %s lên %s", 
                                         nhanVien.getHoTen(), currentSalary, request.getProposedSalary());
        
        auditService.logHRAction(currentUser, ActionType.CREATE, "SalaryProposal", 
                               nhanVien.getNhanvienId(), description, 
                               ipAddress, userAgent, null);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Đề xuất tăng lương đã được gửi thành công");
        response.put("employeeName", nhanVien.getHoTen());
        response.put("currentSalary", currentSalary.toString());
        response.put("proposedSalary", request.getProposedSalary().toString());
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * DTO cho đề xuất tăng lương
     */
    public static class SalaryIncreaseRequest {
        private Long nhanVienId;
        private BigDecimal proposedSalary;
        private String reason;
        
        // Getters and setters
        public Long getNhanVienId() { return nhanVienId; }
        public void setNhanVienId(Long nhanVienId) { this.nhanVienId = nhanVienId; }
        
        public BigDecimal getProposedSalary() { return proposedSalary; }
        public void setProposedSalary(BigDecimal proposedSalary) { this.proposedSalary = proposedSalary; }
        
        public String getReason() { return reason; }
        public void setReason(String reason) { this.reason = reason; }
    }
}
