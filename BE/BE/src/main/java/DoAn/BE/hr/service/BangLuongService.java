package DoAn.BE.hr.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;

import DoAn.BE.common.exception.DuplicateException;
import DoAn.BE.common.exception.EntityNotFoundException;
import DoAn.BE.common.exception.ForbiddenException;
import DoAn.BE.common.util.PermissionUtil;
import DoAn.BE.user.entity.User;
import DoAn.BE.hr.dto.CreateBangLuongRequest;
import DoAn.BE.hr.dto.UpdateBangLuongRequest;
import DoAn.BE.hr.entity.BangLuong;
import DoAn.BE.hr.entity.NhanVien;
import DoAn.BE.hr.repository.BangLuongRepository;
import DoAn.BE.hr.repository.ChamCongRepository;
import DoAn.BE.hr.repository.HopDongRepository;
import DoAn.BE.hr.repository.NhanVienRepository;
import DoAn.BE.hr.entity.HopDong;
import DoAn.BE.hr.entity.HopDong.TrangThaiHopDong;
import DoAn.BE.notification.service.HRNotificationService;
import jakarta.transaction.Transactional;
import java.time.LocalDate;
import java.time.YearMonth;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

// Service quản lý bảng lương (tính lương, thưởng, khấu trừ, thống kê)
@Service
@Transactional
@Slf4j
public class BangLuongService {
    
    private final BangLuongRepository bangLuongRepository;
    private final NhanVienRepository nhanVienRepository;
    private final HopDongRepository hopDongRepository;
    private final ChamCongRepository chamCongRepository;
    private final HRNotificationService hrNotificationService;

    public BangLuongService(BangLuongRepository bangLuongRepository, 
                           NhanVienRepository nhanVienRepository,
                           HopDongRepository hopDongRepository,
                           ChamCongRepository chamCongRepository,
                           HRNotificationService hrNotificationService) {
        this.bangLuongRepository = bangLuongRepository;
        this.nhanVienRepository = nhanVienRepository;
        this.hopDongRepository = hopDongRepository;
        this.chamCongRepository = chamCongRepository;
        this.hrNotificationService = hrNotificationService;
    }

    // Tạo bảng lương mới - Chỉ HR Manager
    public BangLuong createBangLuong(CreateBangLuongRequest request, User currentUser) {
        PermissionUtil.checkHRPermission(currentUser);
        log.info("HR Manager {} tạo bảng lương cho nhân viên ID: {}", currentUser.getUsername(), request.getNhanvienId());
        NhanVien nhanVien = nhanVienRepository.findById(request.getNhanvienId())
            .orElseThrow(() -> new EntityNotFoundException("Nhân viên không tồn tại"));
        if (bangLuongRepository.existsByNhanVien_NhanvienIdAndThangAndNam(request.getNhanvienId(), request.getThang(), request.getNam())) {
            throw new DuplicateException("Bảng lương cho nhân viên này trong kỳ " + 
                request.getThang() + "/" + request.getNam() + " đã tồn tại");
        }

        BangLuong bangLuong = new BangLuong();
        bangLuong.setNhanVien(nhanVien);
        bangLuong.setThang(request.getThang());
        bangLuong.setNam(request.getNam());
        bangLuong.setLuongCoBan(request.getLuongCoBan());
        
        // Set các giá trị mặc định hoặc từ request
        bangLuong.setNgayCong(request.getNgayCong() != null ? request.getNgayCong() : 0);
        bangLuong.setNgayCongChuan(request.getNgayCongChuan() != null ? request.getNgayCongChuan() : 26);
        bangLuong.setPhuCap(request.getPhuCap() != null ? request.getPhuCap() : BigDecimal.ZERO);
        bangLuong.setThuong(request.getThuong() != null ? request.getThuong() : BigDecimal.ZERO);
        bangLuong.setGioLamThem(request.getGioLamThem() != null ? request.getGioLamThem() : 0);
        bangLuong.setKhauTruKhac(request.getKhauTruKhac() != null ? request.getKhauTruKhac() : BigDecimal.ZERO);
        bangLuong.setGhiChu(request.getGhiChu());

        return bangLuongRepository.save(bangLuong);
    }

    /**
     * Lấy thông tin bảng lương theo ID
     * - Accounting Manager: xem tất cả
     * - Employee: chỉ xem của mình
     */
    public BangLuong getBangLuongById(Long id, User currentUser) {
        BangLuong bangLuong = bangLuongRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Bảng lương không tồn tại"));
        
        // Admin không có quyền xem
        if (currentUser.isAdmin()) {
            throw new ForbiddenException("Admin không có quyền truy cập dữ liệu bảng lương");
        }
        
        // HR và Accounting xem tất cả
        if (currentUser.isManagerHR() || currentUser.isManagerAccounting()) {
            return bangLuong;
        }
        
        // Employee chỉ xem của mình
        if (!bangLuong.getNhanVien().getUser().getUserId().equals(currentUser.getUserId())) {
            throw new ForbiddenException("Bạn không có quyền xem bảng lương này");
        }
        
        return bangLuong;
    }
    
    public BangLuong getBangLuongById(Long id) {
        return bangLuongRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Bảng lương không tồn tại"));
    }

    /**
     * Lấy danh sách tất cả bảng lương - Chỉ HR/Accounting
     */
    public List<BangLuong> getAllBangLuong(User currentUser) {
        if (!currentUser.isManagerHR() && !currentUser.isManagerAccounting()) {
            throw new ForbiddenException("Chỉ HR/Accounting Manager mới có quyền xem danh sách bảng lương");
        }
        return bangLuongRepository.findAll();
    }
    
    public List<BangLuong> getAllBangLuong() {
        return bangLuongRepository.findAll();
    }

    /**
     * ⭐ Lấy danh sách bảng lương có phân trang
     */
    public Page<BangLuong> getAllBangLuongPage(Pageable pageable) {
        return bangLuongRepository.findAll(pageable);
    }

    /**
     * Cập nhật bảng lương - Chỉ HR Manager
     */
    public BangLuong updateBangLuong(Long id, UpdateBangLuongRequest request, User currentUser) {
        PermissionUtil.checkHRPermission(currentUser);
        log.info("HR Manager {} cập nhật bảng lương ID: {}", currentUser.getUsername(), id);
        
        BangLuong bangLuong = getBangLuongById(id);

        // Cập nhật các trường nếu có
        if (request.getThang() != null) {
            bangLuong.setThang(request.getThang());
        }
        if (request.getNam() != null) {
            bangLuong.setNam(request.getNam());
        }
        if (request.getLuongCoBan() != null) {
            bangLuong.setLuongCoBan(request.getLuongCoBan());
        }
        if (request.getNgayCong() != null) {
            bangLuong.setNgayCong(request.getNgayCong());
        }
        if (request.getNgayCongChuan() != null) {
            bangLuong.setNgayCongChuan(request.getNgayCongChuan());
        }
        if (request.getPhuCap() != null) {
            bangLuong.setPhuCap(request.getPhuCap());
        }
        if (request.getThuong() != null) {
            bangLuong.setThuong(request.getThuong());
        }
        if (request.getGioLamThem() != null) {
            bangLuong.setGioLamThem(request.getGioLamThem());
        }
        if (request.getKhauTruKhac() != null) {
            bangLuong.setKhauTruKhac(request.getKhauTruKhac());
        }
        if (request.getTrangThai() != null) {
            bangLuong.setTrangThai(request.getTrangThai());
        }
        if (request.getGhiChu() != null) {
            bangLuong.setGhiChu(request.getGhiChu());
        }

        return bangLuongRepository.save(bangLuong);
    }

    /**
     * Xóa bảng lương - Chỉ HR Manager
     */
    public void deleteBangLuong(Long id, User currentUser) {
        PermissionUtil.checkHRPermission(currentUser);
        log.info("HR Manager {} xóa bảng lương ID: {}", currentUser.getUsername(), id);
        
        BangLuong bangLuong = getBangLuongById(id);
        bangLuongRepository.delete(bangLuong);
    }

    /**
     * Lấy bảng lương theo nhân viên
     * - HR/Accounting: xem tất cả
     * - Employee: chỉ xem của mình
     */
    public List<BangLuong> getBangLuongByNhanVien(Long nhanvienId, User currentUser) {
        // Admin không có quyền
        if (currentUser.isAdmin()) {
            throw new ForbiddenException("Admin không có quyền truy cập dữ liệu bảng lương");
        }
        
        // HR và Accounting xem tất cả
        if (!currentUser.isManagerHR() && !currentUser.isManagerAccounting()) {
            // Employee chỉ xem của mình
            NhanVien nhanVien = nhanVienRepository.findById(nhanvienId)
                .orElseThrow(() -> new EntityNotFoundException("Nhân viên không tồn tại"));
            if (!nhanVien.getUser().getUserId().equals(currentUser.getUserId())) {
                throw new ForbiddenException("Bạn chỉ có thể xem bảng lương của chính mình");
            }
        }
        return bangLuongRepository.findByNhanVien_NhanvienId(nhanvienId);
    }

    /**
     * Lấy bảng lương theo kỳ (tháng/năm)
     */
    public List<BangLuong> getBangLuongByPeriod(Integer thang, Integer nam) {
        return bangLuongRepository.findByThangAndNam(thang, nam);
    }

    /**
     * Lấy bảng lương theo nhân viên và kỳ
     */
    public BangLuong getBangLuongByNhanVienAndPeriod(Long nhanvienId, Integer thang, Integer nam) {
        return bangLuongRepository.findByNhanVien_NhanvienIdAndThangAndNam(nhanvienId, thang, nam)
            .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy bảng lương cho kỳ này"));
    }

    /**
     * Lấy bảng lương theo trạng thái
     */
    public List<BangLuong> getBangLuongByTrangThai(String trangThai) {
        return bangLuongRepository.findByTrangThai(trangThai);
    }

    /**
     * Đánh dấu đã thanh toán - Chỉ Accounting Manager (chỉ xem)
     */
    public BangLuong markAsPaid(Long id, User currentUser) {
        PermissionUtil.checkAccountingViewPermission(currentUser);
        log.info("Accounting Manager {} đánh dấu thanh toán bảng lương ID: {}", currentUser.getUsername(), id);
        
        BangLuong bangLuong = getBangLuongById(id);
        bangLuong.setTrangThai("DA_THANH_TOAN");
        return bangLuongRepository.save(bangLuong);
    }

    /**
     * Hủy bảng lương
     */
    public BangLuong cancelBangLuong(Long id) {
        BangLuong bangLuong = getBangLuongById(id);
        bangLuong.setTrangThai("DA_HUY");
        return bangLuongRepository.save(bangLuong);
    }

    /**
     * Tính tổng lương thực nhận theo kỳ
     */
    public BigDecimal getTotalSalaryByPeriod(Integer thang, Integer nam) {
        List<BangLuong> bangLuongs = getBangLuongByPeriod(thang, nam);
        return bangLuongs.stream()
            .map(BangLuong::getLuongThucNhan)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    /**
     * Tính tổng lương thực nhận theo nhân viên trong năm
     */
    public BigDecimal getTotalSalaryByNhanVienAndYear(Long nhanvienId, Integer nam) {
        BigDecimal total = bangLuongRepository.getTongLuongNhanVienTheoNam(nhanvienId, nam);
        return total != null ? total : BigDecimal.ZERO;
    }

    /**
     * ⭐⭐⭐ TÍNH LƯƠNG TỰ ĐỘNG - Tính năng nổi bật từ QLNS
     * Tự động tính lương dựa trên:
     * - Hợp đồng còn hiệu lực
     * - Dữ liệu chấm công trong tháng
     * - Các khoản bảo hiểm (BHXH 8%, BHYT 1.5%, BHTN 1%)
     * - Thuế TNCN theo bậc thang lũy tiến
     */
    public BangLuong tinhLuongTuDong(Long nhanvienId, Integer thang, Integer nam) {
        log.info("Bắt đầu tính lương tự động cho nhân viên ID: {}, tháng {}/{}", nhanvienId, thang, nam);
        
        // 1. Lấy thông tin nhân viên
        NhanVien nhanVien = nhanVienRepository.findById(nhanvienId)
            .orElseThrow(() -> new EntityNotFoundException("Nhân viên không tồn tại"));
        log.debug("Tìm thấy nhân viên: {}", nhanVien.getHoTen());
        
        // 2. Kiểm tra bảng lương đã tồn tại chưa
        if (bangLuongRepository.existsByNhanVien_NhanvienIdAndThangAndNam(nhanvienId, thang, nam)) {
            throw new DuplicateException("Bảng lương cho nhân viên này trong kỳ " + thang + "/" + nam + " đã tồn tại");
        }
        
        // 3. Lấy hợp đồng còn hiệu lực
        HopDong hopDong = hopDongRepository
            .findFirstByNhanVien_NhanvienIdAndTrangThaiOrderByNgayBatDauDesc(
                nhanvienId, TrangThaiHopDong.HIEU_LUC)
            .orElseThrow(() -> new EntityNotFoundException("Nhân viên chưa có hợp đồng còn hiệu lực"));
        log.debug("Lương cơ bản từ hợp đồng: {}", hopDong.getLuongCoBan());
        
        // 4. Lấy dữ liệu chấm công trong tháng
        YearMonth yearMonth = YearMonth.of(nam, thang);
        LocalDate startDate = yearMonth.atDay(1);
        LocalDate endDate = yearMonth.atEndOfMonth();
        
        // Đếm số ngày công thực tế
        int ngayCong = chamCongRepository.countWorkingDaysByNhanVienAndMonth(nhanvienId, startDate, endDate);
        log.debug("Số ngày công: {}", ngayCong);
        
        // Tính tổng giờ làm việc
        BigDecimal tongGioLam = chamCongRepository.sumWorkingHoursByNhanVienAndMonth(nhanvienId, startDate, endDate);
        log.debug("Tổng giờ làm: {}", tongGioLam);
        
        // 5. Tạo bảng lương với dữ liệu tự động
        BangLuong bangLuong = new BangLuong();
        bangLuong.setNhanVien(nhanVien);
        bangLuong.setThang(thang);
        bangLuong.setNam(nam);
        bangLuong.setLuongCoBan(hopDong.getLuongCoBan());
        bangLuong.setNgayCong(ngayCong);
        bangLuong.setNgayCongChuan(26); // Số ngày công chuẩn
        
        // Phụ cấp từ nhân viên (nếu có)
        bangLuong.setPhuCap(nhanVien.getPhuCap() != null ? nhanVien.getPhuCap() : BigDecimal.ZERO);
        
        // Tính giờ làm thêm (nếu > 176 giờ/tháng)
        BigDecimal gioChuan = new BigDecimal("176"); // 22 ngày * 8 giờ
        if (tongGioLam.compareTo(gioChuan) > 0) {
            BigDecimal gioThem = tongGioLam.subtract(gioChuan);
            bangLuong.setGioLamThem(gioThem.intValue());
        }
        
        // Mặc định không có thưởng/phạt (có thể cập nhật sau)
        bangLuong.setThuong(BigDecimal.ZERO);
        bangLuong.setKhauTruKhac(BigDecimal.ZERO);
        
        // Entity sẽ tự động tính các khoản còn lại trong @PrePersist
        BangLuong saved = bangLuongRepository.save(bangLuong);
        
        log.info("✅ Tính lương thành công cho nhân viên: {} - Thực nhận: {}", 
                 nhanVien.getHoTen(), saved.getLuongThucNhan());
        
        // 🔔 Gửi notification cho nhân viên
        try {
            if (nhanVien.getUser() != null) {
                hrNotificationService.createSalaryNotification(
                    nhanVien.getUser().getUserId(),
                    String.valueOf(thang),
                    String.valueOf(nam)
                );
            }
        } catch (Exception e) {
            log.warn("Không thể gửi notification lương cho nhân viên {}: {}", nhanVien.getHoTen(), e.getMessage());
        }
        
        return saved;
    }

    /**
     * Tính lương tự động cho tất cả nhân viên trong tháng
     */
    public List<BangLuong> tinhLuongTuDongChoTatCa(Integer thang, Integer nam) {
        log.info("Bắt đầu tính lương tự động cho tất cả nhân viên - Tháng {}/{}", thang, nam);
        
        List<NhanVien> nhanViens = nhanVienRepository.findByTrangThai(NhanVien.TrangThaiNhanVien.DANG_LAM_VIEC);
        List<BangLuong> results = new java.util.ArrayList<>();
        
        for (NhanVien nv : nhanViens) {
            try {
                BangLuong bangLuong = tinhLuongTuDong(nv.getNhanvienId(), thang, nam);
                results.add(bangLuong);
            } catch (Exception e) {
                log.error("Lỗi khi tính lương cho nhân viên {}: {}", nv.getHoTen(), e.getMessage());
            }
        }
        
        log.info("✅ Hoàn thành tính lương cho {}/{} nhân viên", results.size(), nhanViens.size());
        return results;
    }
}
