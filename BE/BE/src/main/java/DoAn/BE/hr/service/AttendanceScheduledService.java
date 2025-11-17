package DoAn.BE.hr.service;

import DoAn.BE.hr.entity.ChamCong;
import DoAn.BE.hr.entity.NhanVien;
import DoAn.BE.hr.repository.ChamCongRepository;
import DoAn.BE.hr.repository.NhanVienRepository;
import DoAn.BE.notification.service.AttendanceNotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * Service xử lý scheduled jobs cho Attendance
 * - Check missing attendance
 * - Send reminders
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AttendanceScheduledService {
    
    private final ChamCongRepository chamCongRepository;
    private final NhanVienRepository nhanVienRepository;
    private final AttendanceNotificationService attendanceNotificationService;
    
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    
    /**
     * Nhắc checkout cuối ngày (5:30 PM)
     */
    @Scheduled(cron = "0 30 17 * * MON-FRI")
    @Transactional
    public void remindCheckout() {
        log.info("🔔 Bắt đầu nhắc checkout...");
        
        LocalDate today = LocalDate.now();
        
        // Get all employees
        List<NhanVien> allEmployees = nhanVienRepository.findAll();
        
        int reminderCount = 0;
        for (NhanVien nhanVien : allEmployees) {
            try {
                // Check if employee has checked in but not checked out
                List<ChamCong> todayAttendance = chamCongRepository
                    .findByNhanVien_NhanvienIdAndNgayCham(nhanVien.getNhanvienId(), today);
                
                if (!todayAttendance.isEmpty()) {
                    ChamCong chamCong = todayAttendance.get(0);
                    
                    // Has check-in but no check-out
                    if (chamCong.getGioVao() != null && chamCong.getGioRa() == null) {
                        if (nhanVien.getUser() != null) {
                            attendanceNotificationService.createCheckoutReminderNotification(
                                nhanVien.getUser().getUserId()
                            );
                            reminderCount++;
                        }
                    }
                }
            } catch (Exception e) {
                log.error("Error sending checkout reminder for employee {}: {}", 
                    nhanVien.getHoTen(), e.getMessage());
            }
        }
        
        log.info("✅ Hoàn tất nhắc checkout. Đã gửi {} reminders", reminderCount);
    }
    
    /**
     * Check missing attendance (chạy vào 8:00 PM mỗi ngày)
     */
    @Scheduled(cron = "0 0 20 * * MON-FRI")
    @Transactional
    public void checkMissingAttendance() {
        log.info("🔍 Bắt đầu kiểm tra missing attendance...");
        
        LocalDate today = LocalDate.now();
        String dateStr = today.format(DATE_FORMATTER);
        
        // Get all employees
        List<NhanVien> allEmployees = nhanVienRepository.findAll();
        
        int missingCount = 0;
        for (NhanVien nhanVien : allEmployees) {
            try {
                // Check if employee has attendance record today
                List<ChamCong> todayAttendance = chamCongRepository
                    .findByNhanVien_NhanvienIdAndNgayCham(nhanVien.getNhanvienId(), today);
                
                if (todayAttendance.isEmpty()) {
                    // No attendance record - send notification
                    if (nhanVien.getUser() != null) {
                        attendanceNotificationService.createMissingAttendanceNotification(
                            nhanVien.getUser().getUserId(),
                            dateStr
                        );
                        missingCount++;
                        log.debug("⚠️ Sent missing attendance notification for: {}", nhanVien.getHoTen());
                    }
                } else {
                    ChamCong chamCong = todayAttendance.get(0);
                    
                    // Has check-in but no check-out
                    if (chamCong.getGioVao() != null && chamCong.getGioRa() == null) {
                        if (nhanVien.getUser() != null) {
                            attendanceNotificationService.createMissingAttendanceNotification(
                                nhanVien.getUser().getUserId(),
                                dateStr + " (Chưa checkout)"
                            );
                            missingCount++;
                        }
                    }
                }
            } catch (Exception e) {
                log.error("Error checking attendance for employee {}: {}", 
                    nhanVien.getHoTen(), e.getMessage());
            }
        }
        
        log.info("✅ Hoàn tất kiểm tra missing attendance. Đã gửi {} notifications", missingCount);
    }
    
    /**
     * Monthly summary (ngày 1 hàng tháng lúc 9:00 AM)
     */
    @Scheduled(cron = "0 0 9 1 * *")
    @Transactional
    public void sendMonthlySummary() {
        log.info("📊 Bắt đầu gửi monthly summary...");
        
        LocalDate lastMonth = LocalDate.now().minusMonths(1);
        LocalDate firstDayOfLastMonth = lastMonth.withDayOfMonth(1);
        LocalDate lastDayOfLastMonth = lastMonth.withDayOfMonth(lastMonth.lengthOfMonth());
        
        String monthStr = lastMonth.format(DateTimeFormatter.ofPattern("MM/yyyy"));
        
        List<NhanVien> allEmployees = nhanVienRepository.findAll();
        
        int summaryCount = 0;
        for (NhanVien nhanVien : allEmployees) {
            try {
                // Get attendance records for last month
                List<ChamCong> monthAttendance = chamCongRepository
                    .findByNhanVien_NhanvienIdAndNgayChamBetween(
                        nhanVien.getNhanvienId(), 
                        firstDayOfLastMonth, 
                        lastDayOfLastMonth
                    );
                
                int totalDays = monthAttendance.size();
                int lateDays = (int) monthAttendance.stream()
                    .filter(cc -> cc.getTrangThai() == ChamCong.TrangThaiChamCong.DI_TRE)
                    .count();
                
                // Calculate absent days (working days - attendance days)
                int workingDays = lastMonth.lengthOfMonth(); // Simplified
                int absentDays = Math.max(0, workingDays - totalDays);
                
                if (nhanVien.getUser() != null) {
                    attendanceNotificationService.createMonthlyAttendanceSummaryNotification(
                        nhanVien.getUser().getUserId(),
                        monthStr,
                        totalDays,
                        lateDays,
                        absentDays
                    );
                    summaryCount++;
                }
            } catch (Exception e) {
                log.error("Error sending monthly summary for employee {}: {}", 
                    nhanVien.getHoTen(), e.getMessage());
            }
        }
        
        log.info("✅ Hoàn tất gửi monthly summary. Đã gửi {} summaries", summaryCount);
    }
}
