package DoAn.BE.hr.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

import org.springframework.stereotype.Service;

import DoAn.BE.common.exception.DuplicateException;
import DoAn.BE.common.exception.EntityNotFoundException;
import DoAn.BE.hr.dto.ChamCongRequest;
import DoAn.BE.hr.entity.ChamCong;
import DoAn.BE.hr.entity.ChamCong.TrangThaiChamCong;
import DoAn.BE.hr.entity.NhanVien;
import DoAn.BE.hr.repository.ChamCongRepository;
import DoAn.BE.hr.repository.NhanVienRepository;
import jakarta.transaction.Transactional;

@Service
@Transactional
public class ChamCongService {
    
    private final ChamCongRepository chamCongRepository;
    private final NhanVienRepository nhanVienRepository;

    public ChamCongService(ChamCongRepository chamCongRepository, NhanVienRepository nhanVienRepository) {
        this.chamCongRepository = chamCongRepository;
        this.nhanVienRepository = nhanVienRepository;
    }

    /**
     * Tạo chấm công mới
     */
    public ChamCong createChamCong(ChamCongRequest request) {
        // Kiểm tra nhân viên tồn tại
        NhanVien nhanVien = nhanVienRepository.findById(request.getNhanvienId())
            .orElseThrow(() -> new EntityNotFoundException("Nhân viên không tồn tại"));

        ChamCong chamCong = new ChamCong();
        chamCong.setNhanVien(nhanVien);
        chamCong.setNgayCham(request.getNgayCham());
        chamCong.setGioVao(request.getGioVao());
        chamCong.setGioRa(request.getGioRa());
        chamCong.setTrangThai(request.getTrangThai());
        chamCong.setGhiChu(request.getGhiChu());

        return chamCongRepository.save(chamCong);
    }

    /**
     * Lấy thông tin chấm công theo ID
     */
    public ChamCong getChamCongById(Long id) {
        return chamCongRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Chấm công không tồn tại"));
    }

    /**
     * Lấy danh sách tất cả chấm công
     */
    public List<ChamCong> getAllChamCong() {
        return chamCongRepository.findAll();
    }

    /**
     * Cập nhật chấm công
     */
    public ChamCong updateChamCong(Long id, ChamCongRequest request) {
        ChamCong chamCong = getChamCongById(id);

        // Không cho đổi nhân viên
        if (request.getNhanvienId() != null && 
            !request.getNhanvienId().equals(chamCong.getNhanVien().getNhanvienId())) {
            throw new DuplicateException("Không thể thay đổi nhân viên");
        }

        // Cập nhật các trường
        if (request.getNgayCham() != null) {
            chamCong.setNgayCham(request.getNgayCham());
        }
        if (request.getGioVao() != null) {
            chamCong.setGioVao(request.getGioVao());
        }
        if (request.getGioRa() != null) {
            chamCong.setGioRa(request.getGioRa());
        }
        if (request.getTrangThai() != null) {
            chamCong.setTrangThai(request.getTrangThai());
        }
        if (request.getGhiChu() != null) {
            chamCong.setGhiChu(request.getGhiChu());
        }

        return chamCongRepository.save(chamCong);
    }

    /**
     * Xóa chấm công
     */
    public void deleteChamCong(Long id) {
        ChamCong chamCong = getChamCongById(id);
        chamCongRepository.delete(chamCong);
    }

    /**
     * Lấy chấm công theo nhân viên
     */
    public List<ChamCong> getChamCongByNhanVien(Long nhanvienId) {
        return chamCongRepository.findByNhanVien_NhanvienIdOrderByNgayChamDesc(nhanvienId);
    }

    /**
     * Lấy chấm công theo khoảng thời gian
     */
    public List<ChamCong> getChamCongByDateRange(LocalDate startDate, LocalDate endDate) {
        return chamCongRepository.findByNgayChamBetween(startDate, endDate);
    }

    /**
     * Lấy chấm công của nhân viên trong tháng
     */
    public List<ChamCong> getChamCongByNhanVienAndMonth(Long nhanvienId, int year, int month) {
        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDate startDate = yearMonth.atDay(1);
        LocalDate endDate = yearMonth.atEndOfMonth();
        
        return chamCongRepository.findByNhanVien_NhanvienIdAndNgayChamBetween(nhanvienId, startDate, endDate);
    }

    /**
     * Tính tổng số ngày công của nhân viên trong tháng
     */
    public int countWorkingDays(Long nhanvienId, int year, int month) {
        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDate startDate = yearMonth.atDay(1);
        LocalDate endDate = yearMonth.atEndOfMonth();
        
        return chamCongRepository.countWorkingDaysByNhanVienAndMonth(nhanvienId, startDate, endDate);
    }

    /**
     * Tính tổng số giờ làm việc của nhân viên trong tháng
     */
    public BigDecimal getTotalWorkingHours(Long nhanvienId, int year, int month) {
        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDate startDate = yearMonth.atDay(1);
        LocalDate endDate = yearMonth.atEndOfMonth();
        
        return chamCongRepository.sumWorkingHoursByNhanVienAndMonth(nhanvienId, startDate, endDate);
    }

    /**
     * Đếm số lần đi trễ của nhân viên trong tháng
     */
    public long countLateDays(Long nhanvienId, int year, int month) {
        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDate startDate = yearMonth.atDay(1);
        LocalDate endDate = yearMonth.atEndOfMonth();
        
        return chamCongRepository.countLateDaysByNhanVienAndMonth(nhanvienId, startDate, endDate);
    }

    /**
     * Đếm số lần về sớm của nhân viên trong tháng
     */
    public long countEarlyLeaveDays(Long nhanvienId, int year, int month) {
        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDate startDate = yearMonth.atDay(1);
        LocalDate endDate = yearMonth.atEndOfMonth();
        
        return chamCongRepository.countEarlyLeaveDaysByNhanVienAndMonth(nhanvienId, startDate, endDate);
    }

    /**
     * Check-in (chấm công vào)
     */
    public ChamCong checkIn(Long nhanvienId, LocalDate ngayCham) {
        NhanVien nhanVien = nhanVienRepository.findById(nhanvienId)
            .orElseThrow(() -> new EntityNotFoundException("Nhân viên không tồn tại"));

        ChamCong chamCong = new ChamCong();
        chamCong.setNhanVien(nhanVien);
        chamCong.setNgayCham(ngayCham);
        chamCong.setGioVao(java.time.LocalTime.now());
        
        // Tự động xác định trạng thái
        if (chamCong.isLate()) {
            chamCong.setTrangThai(TrangThaiChamCong.DI_TRE);
        } else {
            chamCong.setTrangThai(TrangThaiChamCong.DU_GIO);
        }

        return chamCongRepository.save(chamCong);
    }

    /**
     * Check-out (chấm công ra)
     */
    public ChamCong checkOut(Long chamcongId) {
        ChamCong chamCong = getChamCongById(chamcongId);
        chamCong.setGioRa(java.time.LocalTime.now());
        
        // Cập nhật trạng thái
        if (chamCong.isEarlyLeave()) {
            chamCong.setTrangThai(TrangThaiChamCong.VE_SOM);
        } else if (!chamCong.isLate()) {
            chamCong.setTrangThai(TrangThaiChamCong.DU_GIO);
        }

        return chamCongRepository.save(chamCong);
    }
}
