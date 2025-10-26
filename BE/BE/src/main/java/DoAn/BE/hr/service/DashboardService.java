package DoAn.BE.hr.service;

import DoAn.BE.hr.dto.DashboardDTO;
import DoAn.BE.hr.entity.BangLuong;
import DoAn.BE.hr.entity.HopDong;
import DoAn.BE.hr.entity.HopDong.TrangThaiHopDong;
import DoAn.BE.hr.entity.NghiPhep;
import DoAn.BE.hr.entity.NhanVien.TrangThaiNhanVien;
import DoAn.BE.hr.repository.BangLuongRepository;
import DoAn.BE.hr.repository.ChamCongRepository;
import DoAn.BE.hr.repository.HopDongRepository;
import DoAn.BE.hr.repository.NghiPhepRepository;
import DoAn.BE.hr.repository.NhanVienRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class DashboardService {
    
    private static final Logger log = LoggerFactory.getLogger(DashboardService.class);
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    
    private final NhanVienRepository nhanVienRepository;
    private final NghiPhepRepository nghiPhepRepository;
    private final BangLuongRepository bangLuongRepository;
    private final HopDongRepository hopDongRepository;
    private final ChamCongRepository chamCongRepository;

    public DashboardService(NhanVienRepository nhanVienRepository,
                           NghiPhepRepository nghiPhepRepository,
                           BangLuongRepository bangLuongRepository,
                           HopDongRepository hopDongRepository,
                           ChamCongRepository chamCongRepository) {
        this.nhanVienRepository = nhanVienRepository;
        this.nghiPhepRepository = nghiPhepRepository;
        this.bangLuongRepository = bangLuongRepository;
        this.hopDongRepository = hopDongRepository;
        this.chamCongRepository = chamCongRepository;
    }

    /**
     * ⭐⭐ DASHBOARD TỔNG QUAN - Tính năng nổi bật từ QLNS
     */
    public DashboardDTO getTongQuan() {
        log.info("Lấy thông tin dashboard tổng quan");
        
        DashboardDTO dashboard = new DashboardDTO();
        
        // 1. Thống kê nhân viên
        dashboard.setTongNhanVien(nhanVienRepository.count());
        dashboard.setNhanVienDangLam(nhanVienRepository.countByTrangThai(TrangThaiNhanVien.DANG_LAM_VIEC));
        dashboard.setNhanVienNghiViec(nhanVienRepository.countByTrangThai(TrangThaiNhanVien.NGHI_VIEC));
        
        // 2. Thống kê nghỉ phép
        dashboard.setDonNghiPhepChoDuyet(nghiPhepRepository.countByTrangThai(NghiPhep.TrangThaiNghiPhep.CHO_DUYET));
        dashboard.setDonNghiPhepDaDuyet(nghiPhepRepository.countByTrangThai(NghiPhep.TrangThaiNghiPhep.DA_DUYET));
        dashboard.setDonNghiPhepTuChoi(nghiPhepRepository.countByTrangThai(NghiPhep.TrangThaiNghiPhep.TU_CHOI));
        
        // 3. Thống kê bảng lương tháng hiện tại
        YearMonth currentMonth = YearMonth.now();
        List<BangLuong> bangLuongThangNay = bangLuongRepository.findByThangAndNam(
            currentMonth.getMonthValue(), currentMonth.getYear());
        
        long chuaThanhToan = bangLuongThangNay.stream()
            .filter(bl -> "CHUA_THANH_TOAN".equals(bl.getTrangThai()))
            .count();
        long daThanhToan = bangLuongThangNay.stream()
            .filter(bl -> "DA_THANH_TOAN".equals(bl.getTrangThai()))
            .count();
        BigDecimal tongLuong = bangLuongThangNay.stream()
            .map(BangLuong::getLuongThucNhan)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        dashboard.setBangLuongChuaThanhToan(chuaThanhToan);
        dashboard.setBangLuongDaThanhToan(daThanhToan);
        dashboard.setTongLuongThangNay(tongLuong);
        
        // 4. Thống kê hợp đồng
        dashboard.setHopDongHieuLuc(hopDongRepository.countByTrangThai(TrangThaiHopDong.HIEU_LUC));
        dashboard.setHopDongHetHan(hopDongRepository.countByTrangThai(TrangThaiHopDong.HET_HAN));
        
        // Hợp đồng sắp hết hạn (30 ngày)
        LocalDate today = LocalDate.now();
        LocalDate after30Days = today.plusDays(30);
        List<HopDong> hopDongSapHetHan = hopDongRepository.findExpiringContracts(today, after30Days);
        dashboard.setHopDongSapHetHan(hopDongSapHetHan.size());
        
        // 5. Thống kê chấm công tháng hiện tại
        LocalDate startOfMonth = currentMonth.atDay(1);
        LocalDate endOfMonth = currentMonth.atEndOfMonth();
        dashboard.setTongChamCongThangNay(
            chamCongRepository.findByNgayChamBetween(startOfMonth, endOfMonth).size());
        
        // 6. Danh sách hợp đồng sắp hết hạn
        List<DashboardDTO.HopDongExpiringDTO> hopDongList = hopDongSapHetHan.stream()
            .map(hd -> {
                long daysLeft = ChronoUnit.DAYS.between(today, hd.getNgayKetThuc());
                return new DashboardDTO.HopDongExpiringDTO(
                    hd.getHopdongId(),
                    hd.getNhanVien().getHoTen(),
                    hd.getNgayKetThuc().format(DATE_FORMATTER),
                    (int) daysLeft
                );
            })
            .collect(Collectors.toList());
        dashboard.setHopDongSapHetHanList(hopDongList);
        
        // 7. Danh sách đơn nghỉ phép chờ xử lý
        List<NghiPhep> donChoDuyet = nghiPhepRepository.findByTrangThai(NghiPhep.TrangThaiNghiPhep.CHO_DUYET);
        List<DashboardDTO.NghiPhepPendingDTO> nghiPhepList = donChoDuyet.stream()
            .map(np -> new DashboardDTO.NghiPhepPendingDTO(
                np.getNghiphepId(),
                np.getNhanVien().getHoTen(),
                np.getLoaiPhep().name(),
                np.getNgayBatDau().format(DATE_FORMATTER),
                np.getNgayKetThuc().format(DATE_FORMATTER),
                np.getSoNgay()
            ))
            .collect(Collectors.toList());
        dashboard.setDonNghiPhepChoXuLy(nghiPhepList);
        
        log.info("✅ Dashboard: {} nhân viên, {} đơn chờ duyệt, {} hợp đồng sắp hết hạn",
                 dashboard.getTongNhanVien(), dashboard.getDonNghiPhepChoDuyet(), 
                 dashboard.getHopDongSapHetHan());
        
        return dashboard;
    }

    /**
     * Thống kê theo tháng
     */
    public DashboardDTO getThongKeTheoThang(int thang, int nam) {
        log.info("Lấy thống kê tháng {}/{}", thang, nam);
        
        DashboardDTO dashboard = new DashboardDTO();
        
        // Thống kê bảng lương theo tháng
        List<BangLuong> bangLuongs = bangLuongRepository.findByThangAndNam(thang, nam);
        
        long chuaThanhToan = bangLuongs.stream()
            .filter(bl -> "CHUA_THANH_TOAN".equals(bl.getTrangThai()))
            .count();
        long daThanhToan = bangLuongs.stream()
            .filter(bl -> "DA_THANH_TOAN".equals(bl.getTrangThai()))
            .count();
        BigDecimal tongLuong = bangLuongs.stream()
            .map(BangLuong::getLuongThucNhan)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        dashboard.setBangLuongChuaThanhToan(chuaThanhToan);
        dashboard.setBangLuongDaThanhToan(daThanhToan);
        dashboard.setTongLuongThangNay(tongLuong);
        
        // Thống kê chấm công theo tháng
        YearMonth yearMonth = YearMonth.of(nam, thang);
        LocalDate startDate = yearMonth.atDay(1);
        LocalDate endDate = yearMonth.atEndOfMonth();
        
        dashboard.setTongChamCongThangNay(
            chamCongRepository.findByNgayChamBetween(startDate, endDate).size());
        
        return dashboard;
    }
}
