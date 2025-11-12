package DoAn.BE.hr.controller;

import DoAn.BE.hr.dto.DashboardDTO;
import DoAn.BE.hr.service.DashboardService;
import DoAn.BE.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {
    
    private final DashboardService dashboardService;
    
    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return (User) auth.getPrincipal();
    }

    /**
     * ⭐⭐ DASHBOARD TỔNG QUAN
     * GET /api/dashboard/tong-quan
     */
    @GetMapping("/tong-quan")
    public ResponseEntity<DashboardDTO> getTongQuan() {
        DashboardDTO dashboard = dashboardService.getTongQuan();
        return ResponseEntity.ok(dashboard);
    }

    /**
     * Thống kê theo tháng
     * GET /api/dashboard/thang?thang=10&nam=2024
     */
    @GetMapping("/thang")
    public ResponseEntity<DashboardDTO> getThongKeTheoThang(
            @RequestParam int thang,
            @RequestParam int nam) {
        DashboardDTO dashboard = dashboardService.getThongKeTheoThang(thang, nam);
        return ResponseEntity.ok(dashboard);
    }
}
