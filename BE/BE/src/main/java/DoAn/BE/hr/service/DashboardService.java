package DoAn.BE.hr.service;

import DoAn.BE.hr.dto.DashboardDTO;
import DoAn.BE.hr.dto.DashboardStatsDTO;
import DoAn.BE.hr.entity.BangLuong;
import DoAn.BE.hr.entity.ChamCong;
import DoAn.BE.hr.entity.HopDong;
import DoAn.BE.hr.entity.HopDong.TrangThaiHopDong;
import DoAn.BE.hr.entity.NghiPhep;
import DoAn.BE.hr.entity.NhanVien;
import DoAn.BE.hr.entity.NhanVien.TrangThaiNhanVien;
import DoAn.BE.hr.entity.PhongBan;
import DoAn.BE.hr.repository.BangLuongRepository;
import DoAn.BE.hr.repository.ChamCongRepository;
import DoAn.BE.hr.repository.HopDongRepository;
import DoAn.BE.hr.repository.NghiPhepRepository;
import DoAn.BE.hr.repository.NhanVienRepository;
import DoAn.BE.hr.repository.PhongBanRepository;
import DoAn.BE.notification.repository.ThongBaoRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.Period;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

// Service cung cấp thống kê dashboard cho HR
@Service
@Transactional(readOnly = true)
@Slf4j
public class DashboardService {
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    
    private final NhanVienRepository nhanVienRepository;
    private final NghiPhepRepository nghiPhepRepository;
    private final BangLuongRepository bangLuongRepository;
    private final HopDongRepository hopDongRepository;
    private final ChamCongRepository chamCongRepository;
    private final PhongBanRepository phongBanRepository;
    private final ThongBaoRepository thongBaoRepository;

    public DashboardService(NhanVienRepository nhanVienRepository,
                           NghiPhepRepository nghiPhepRepository,
                           BangLuongRepository bangLuongRepository,
                           HopDongRepository hopDongRepository,
                           ChamCongRepository chamCongRepository,
                           PhongBanRepository phongBanRepository,
                           ThongBaoRepository thongBaoRepository) {
        this.nhanVienRepository = nhanVienRepository;
        this.nghiPhepRepository = nghiPhepRepository;
        this.bangLuongRepository = bangLuongRepository;
        this.hopDongRepository = hopDongRepository;
        this.chamCongRepository = chamCongRepository;
        this.phongBanRepository = phongBanRepository;
        this.thongBaoRepository = thongBaoRepository;
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

    /**
     * ⭐⭐⭐ DASHBOARD NÂNG CAO - Biểu đồ và thống kê chi tiết
     */
    public DashboardStatsDTO getDashboardStats() {
        log.info("Lấy thống kê dashboard nâng cao");
        
        DashboardStatsDTO stats = new DashboardStatsDTO();
        
        // 1. Thống kê tổng quan
        stats.setTongQuan(getTongQuanStats());
        
        // 2. Biểu đồ chấm công theo phòng ban
        stats.setChamCongPhongBan(getChamCongPhongBanStats());
        
        // 3. Biểu đồ lương theo tháng (6 tháng gần nhất)
        stats.setLuongTheoThang(getLuongTheoThangStats());
        
        // 4. Thống kê nghỉ phép
        stats.setNghiPhep(getNghiPhepStats());
        
        // 5. Thống kê hợp đồng
        stats.setHopDong(getHopDongStats());
        
        // 6. Thống kê nhân viên theo độ tuổi
        stats.setNhanVienTheoTuoi(getNhanVienTheoTuoiStats());
        
        // 7. Thống kê nhân viên theo giới tính
        stats.setNhanVienTheoGioiTinh(getNhanVienTheoGioiTinhStats());
        
        return stats;
    }
    
    private DashboardStatsDTO.TongQuanStats getTongQuanStats() {
        DashboardStatsDTO.TongQuanStats tongQuan = new DashboardStatsDTO.TongQuanStats();
        
        // Thống kê nhân viên
        tongQuan.setTongNhanVien(nhanVienRepository.count());
        tongQuan.setNhanVienDangLam(nhanVienRepository.countByTrangThai(TrangThaiNhanVien.DANG_LAM_VIEC));
        tongQuan.setNhanVienNghiViec(nhanVienRepository.countByTrangThai(TrangThaiNhanVien.NGHI_VIEC));
        
        // Thống kê nghỉ phép
        tongQuan.setDonNghiPhepChoDuyet(nghiPhepRepository.countByTrangThai(NghiPhep.TrangThaiNghiPhep.CHO_DUYET));
        
        // Thống kê bảng lương
        YearMonth currentMonth = YearMonth.now();
        List<BangLuong> bangLuongThangNay = bangLuongRepository.findByThangAndNam(
            currentMonth.getMonthValue(), currentMonth.getYear());
        tongQuan.setBangLuongChoDuyet(bangLuongThangNay.stream()
            .filter(bl -> "CHO_DUYET".equals(bl.getTrangThai()))
            .count());
        
        // Thống kê hợp đồng hết hạn 30 ngày
        LocalDate today = LocalDate.now();
        LocalDate after30Days = today.plusDays(30);
        tongQuan.setHopDongHetHan30Ngay(hopDongRepository.findExpiringContracts(today, after30Days).size());
        
        // Thống kê thông báo chưa đọc (tổng của tất cả user)
        tongQuan.setThongBaoChuaDoc(thongBaoRepository.count()); // Tạm thời lấy tổng
        
        // Tổng chi phí lương tháng hiện tại
        BigDecimal tongChiPhi = bangLuongThangNay.stream()
            .map(BangLuong::getLuongThucNhan)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        tongQuan.setTongChiPhiLuongThang(tongChiPhi);
        
        return tongQuan;
    }
    
    /**
     * Biểu đồ hiệu suất chấm công theo phòng ban
     */
    private List<DashboardStatsDTO.ChamCongPhongBanStats> getChamCongPhongBanStats() {
        List<PhongBan> phongBans = phongBanRepository.findAll();
        LocalDate startOfMonth = YearMonth.now().atDay(1);
        LocalDate endOfMonth = YearMonth.now().atEndOfMonth();
        
        return phongBans.stream().map(pb -> {
            List<NhanVien> nhanViens = nhanVienRepository.findByPhongBan(pb);
            long tongNhanVien = nhanViens.size();
            
            if (tongNhanVien == 0) {
                return new DashboardStatsDTO.ChamCongPhongBanStats(
                    pb.getTenPhongBan(), 0, 0, 0, 0, 0.0);
            }
            
            // Lấy chấm công của tất cả nhân viên trong phòng ban tháng này
            List<ChamCong> chamCongs = new ArrayList<>();
            for (NhanVien nv : nhanViens) {
                chamCongs.addAll(chamCongRepository.findByNhanVienAndNgayChamBetween(
                    nv, startOfMonth, endOfMonth));
            }
            
            long diMuon = chamCongs.stream()
                .filter(cc -> "DI_MUON".equals(cc.getTrangThai()))
                .count();
            long veSom = chamCongs.stream()
                .filter(cc -> "VE_SOM".equals(cc.getTrangThai()))
                .count();
            long dungGio = chamCongs.stream()
                .filter(cc -> "DUNG_GIO".equals(cc.getTrangThai()))
                .count();
            
            double tiLeDungGio = chamCongs.size() > 0 ? 
                (double) dungGio / chamCongs.size() * 100 : 0.0;
            
            return new DashboardStatsDTO.ChamCongPhongBanStats(
                pb.getTenPhongBan(), tongNhanVien, diMuon, veSom, dungGio, 
                Math.round(tiLeDungGio * 100.0) / 100.0);
        }).collect(Collectors.toList());
    }
    
    /**
     * Biểu đồ cột lương theo từng tháng (6 tháng gần nhất)
     */
    private List<DashboardStatsDTO.LuongTheoThangStats> getLuongTheoThangStats() {
        List<DashboardStatsDTO.LuongTheoThangStats> stats = new ArrayList<>();
        
        for (int i = 5; i >= 0; i--) {
            YearMonth month = YearMonth.now().minusMonths(i);
            List<BangLuong> bangLuongs = bangLuongRepository.findByThangAndNam(
                month.getMonthValue(), month.getYear());
            
            BigDecimal tongLuong = bangLuongs.stream()
                .map(BangLuong::getLuongThucNhan)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
            
            BigDecimal luongTrungBinh = bangLuongs.size() > 0 ? 
                tongLuong.divide(BigDecimal.valueOf(bangLuongs.size()), 2, RoundingMode.HALF_UP) : 
                BigDecimal.ZERO;
            
            stats.add(new DashboardStatsDTO.LuongTheoThangStats(
                month.format(DateTimeFormatter.ofPattern("MM/yyyy")),
                tongLuong,
                bangLuongs.size(),
                luongTrungBinh
            ));
        }
        
        return stats;
    }
    
    private List<DashboardStatsDTO.NghiPhepStats> getNghiPhepStats() {
        List<DashboardStatsDTO.NghiPhepStats> stats = new ArrayList<>();
        
        // Lấy tất cả loại nghỉ phép
        List<Object[]> results = nghiPhepRepository.getStatsByLoaiPhep();
        
        for (Object[] result : results) {
            String loaiNghi = (String) result[0];
            long soLuong = (Long) result[1];
            long choDuyet = nghiPhepRepository.countByLoaiPhepAndTrangThai(
                NghiPhep.LoaiPhep.valueOf(loaiNghi), NghiPhep.TrangThaiNghiPhep.CHO_DUYET);
            long daDuyet = nghiPhepRepository.countByLoaiPhepAndTrangThai(
                NghiPhep.LoaiPhep.valueOf(loaiNghi), NghiPhep.TrangThaiNghiPhep.DA_DUYET);
            long tuChoi = nghiPhepRepository.countByLoaiPhepAndTrangThai(
                NghiPhep.LoaiPhep.valueOf(loaiNghi), NghiPhep.TrangThaiNghiPhep.TU_CHOI);
            
            stats.add(new DashboardStatsDTO.NghiPhepStats(
                loaiNghi, soLuong, choDuyet, daDuyet, tuChoi));
        }
        
        return stats;
    }
    
    private DashboardStatsDTO.HopDongStats getHopDongStats() {
        DashboardStatsDTO.HopDongStats stats = new DashboardStatsDTO.HopDongStats();
        
        stats.setTongHopDong(hopDongRepository.count());
        stats.setHopDongConHieuLuc(hopDongRepository.countByTrangThai(TrangThaiHopDong.HIEU_LUC));
        stats.setHopDongHetHan(hopDongRepository.countByTrangThai(TrangThaiHopDong.HET_HAN));
        
        // Hợp đồng sắp hết hạn 30 ngày
        LocalDate today = LocalDate.now();
        LocalDate after30Days = today.plusDays(30);
        stats.setHopDongSapHetHan(hopDongRepository.findExpiringContracts(today, after30Days).size());
        
        // Thống kê theo loại hợp đồng
        List<Object[]> hopDongTheoLoai = hopDongRepository.getStatsByLoaiHopDong();
        Map<String, Long> loaiStats = hopDongTheoLoai.stream()
            .collect(Collectors.toMap(
                row -> (String) row[0],
                row -> (Long) row[1]
            ));
        stats.setHopDongTheoLoai(loaiStats);
        
        return stats;
    }
    
    private List<DashboardStatsDTO.NhanVienTheoTuoiStats> getNhanVienTheoTuoiStats() {
        List<NhanVien> nhanViens = nhanVienRepository.findByTrangThai(TrangThaiNhanVien.DANG_LAM_VIEC);
        LocalDate today = LocalDate.now();
        
        Map<String, Long> tuoiGroups = new HashMap<>();
        tuoiGroups.put("20-25", 0L);
        tuoiGroups.put("26-30", 0L);
        tuoiGroups.put("31-35", 0L);
        tuoiGroups.put("36-40", 0L);
        tuoiGroups.put("41-50", 0L);
        tuoiGroups.put("50+", 0L);
        
        for (NhanVien nv : nhanViens) {
            if (nv.getNgaySinh() != null) {
                int tuoi = Period.between(nv.getNgaySinh(), today).getYears();
                String group;
                if (tuoi <= 25) group = "20-25";
                else if (tuoi <= 30) group = "26-30";
                else if (tuoi <= 35) group = "31-35";
                else if (tuoi <= 40) group = "36-40";
                else if (tuoi <= 50) group = "41-50";
                else group = "50+";
                
                tuoiGroups.put(group, tuoiGroups.get(group) + 1);
            }
        }
        
        long tongNhanVien = nhanViens.size();
        return tuoiGroups.entrySet().stream()
            .map(entry -> {
                double tiLe = tongNhanVien > 0 ? 
                    (double) entry.getValue() / tongNhanVien * 100 : 0.0;
                return new DashboardStatsDTO.NhanVienTheoTuoiStats(
                    entry.getKey(), entry.getValue(), 
                    Math.round(tiLe * 100.0) / 100.0);
            })
            .collect(Collectors.toList());
    }
    
    private Map<String, Long> getNhanVienTheoGioiTinhStats() {
        List<NhanVien> nhanViens = nhanVienRepository.findByTrangThai(TrangThaiNhanVien.DANG_LAM_VIEC);
        
        Map<String, Long> gioiTinhStats = new HashMap<>();
        gioiTinhStats.put("Nam", 0L);
        gioiTinhStats.put("Nữ", 0L);
        gioiTinhStats.put("Khác", 0L);
        
        for (NhanVien nv : nhanViens) {
            NhanVien.GioiTinh gioiTinh = nv.getGioiTinh();
            if (gioiTinh != null) {
                switch (gioiTinh) {
                    case Nam -> gioiTinhStats.put("Nam", gioiTinhStats.get("Nam") + 1);
                    case Nữ -> gioiTinhStats.put("Nữ", gioiTinhStats.get("Nữ") + 1);
                    case Khác -> gioiTinhStats.put("Khác", gioiTinhStats.get("Khác") + 1);
                }
            }
        }
        
        return gioiTinhStats;
    }
}
