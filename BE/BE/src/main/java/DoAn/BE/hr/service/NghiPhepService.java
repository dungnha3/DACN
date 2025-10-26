package DoAn.BE.hr.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import DoAn.BE.common.exception.BadRequestException;
import DoAn.BE.common.exception.EntityNotFoundException;
import DoAn.BE.hr.dto.NghiPhepRequest;
import DoAn.BE.hr.entity.NghiPhep;
import DoAn.BE.hr.entity.NghiPhep.TrangThaiNghiPhep;
import DoAn.BE.hr.entity.NhanVien;
import DoAn.BE.hr.repository.NghiPhepRepository;
import DoAn.BE.hr.repository.NhanVienRepository;
import DoAn.BE.notification.service.NotificationService;
import DoAn.BE.user.entity.User;
import DoAn.BE.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
@Transactional
public class NghiPhepService {
    
    private static final Logger log = LoggerFactory.getLogger(NghiPhepService.class);
    
    private final NghiPhepRepository nghiPhepRepository;
    private final NhanVienRepository nhanVienRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public NghiPhepService(NghiPhepRepository nghiPhepRepository, 
                          NhanVienRepository nhanVienRepository,
                          UserRepository userRepository,
                          NotificationService notificationService) {
        this.nghiPhepRepository = nghiPhepRepository;
        this.nhanVienRepository = nhanVienRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    /**
     * Tạo đơn nghỉ phép mới
     */
    public NghiPhep createNghiPhep(NghiPhepRequest request) {
        // Kiểm tra nhân viên tồn tại
        NhanVien nhanVien = nhanVienRepository.findById(request.getNhanvienId())
            .orElseThrow(() -> new EntityNotFoundException("Nhân viên không tồn tại"));

        // Validate ngày
        if (request.getNgayKetThuc().isBefore(request.getNgayBatDau())) {
            throw new BadRequestException("Ngày kết thúc phải sau ngày bắt đầu");
        }

        NghiPhep nghiPhep = new NghiPhep();
        nghiPhep.setNhanVien(nhanVien);
        nghiPhep.setLoaiPhep(request.getLoaiPhep());
        nghiPhep.setNgayBatDau(request.getNgayBatDau());
        nghiPhep.setNgayKetThuc(request.getNgayKetThuc());
        nghiPhep.setLyDo(request.getLyDo());
        nghiPhep.setTrangThai(TrangThaiNghiPhep.CHO_DUYET);

        return nghiPhepRepository.save(nghiPhep);
    }

    /**
     * Lấy thông tin nghỉ phép theo ID
     */
    public NghiPhep getNghiPhepById(Long id) {
        return nghiPhepRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Đơn nghỉ phép không tồn tại"));
    }

    /**
     * Lấy danh sách tất cả nghỉ phép
     */
    public List<NghiPhep> getAllNghiPhep() {
        return nghiPhepRepository.findAll();
    }

    /**
     * Cập nhật đơn nghỉ phép
     */
    public NghiPhep updateNghiPhep(Long id, NghiPhepRequest request) {
        NghiPhep nghiPhep = getNghiPhepById(id);

        // Chỉ cho phép cập nhật nếu đang chờ duyệt
        if (nghiPhep.getTrangThai() != TrangThaiNghiPhep.CHO_DUYET) {
            throw new BadRequestException("Chỉ có thể cập nhật đơn đang chờ duyệt");
        }

        // Không cho đổi nhân viên
        if (request.getNhanvienId() != null && 
            !request.getNhanvienId().equals(nghiPhep.getNhanVien().getNhanvienId())) {
            throw new BadRequestException("Không thể thay đổi nhân viên");
        }

        // Cập nhật các trường
        if (request.getLoaiPhep() != null) {
            nghiPhep.setLoaiPhep(request.getLoaiPhep());
        }
        if (request.getNgayBatDau() != null) {
            nghiPhep.setNgayBatDau(request.getNgayBatDau());
        }
        if (request.getNgayKetThuc() != null) {
            nghiPhep.setNgayKetThuc(request.getNgayKetThuc());
        }
        if (request.getLyDo() != null) {
            nghiPhep.setLyDo(request.getLyDo());
        }

        // Validate lại ngày
        if (nghiPhep.getNgayKetThuc().isBefore(nghiPhep.getNgayBatDau())) {
            throw new BadRequestException("Ngày kết thúc phải sau ngày bắt đầu");
        }

        return nghiPhepRepository.save(nghiPhep);
    }

    /**
     * Xóa đơn nghỉ phép
     */
    public void deleteNghiPhep(Long id) {
        NghiPhep nghiPhep = getNghiPhepById(id);
        
        // Chỉ cho phép xóa nếu đang chờ duyệt
        if (nghiPhep.getTrangThai() != TrangThaiNghiPhep.CHO_DUYET) {
            throw new BadRequestException("Chỉ có thể xóa đơn đang chờ duyệt");
        }
        
        nghiPhepRepository.delete(nghiPhep);
    }

    /**
     * Lấy nghỉ phép theo nhân viên
     */
    public List<NghiPhep> getNghiPhepByNhanVien(Long nhanvienId) {
        return nghiPhepRepository.findByNhanVien_NhanvienId(nhanvienId);
    }

    /**
     * Lấy nghỉ phép trong khoảng thời gian
     */
    public List<NghiPhep> getNghiPhepInDateRange(LocalDate startDate, LocalDate endDate) {
        return nghiPhepRepository.findByNgayBatDauLessThanEqualAndNgayKetThucGreaterThanEqual(endDate, startDate);
    }

    /**
     * Duyệt đơn nghỉ phép
     */
    public NghiPhep approveNghiPhep(Long id, Long approverId, String note) {
        log.info("Phê duyệt đơn nghỉ phép ID: {} bởi user ID: {}", id, approverId);
        NghiPhep nghiPhep = getNghiPhepById(id);
        
        if (nghiPhep.getTrangThai() != TrangThaiNghiPhep.CHO_DUYET) {
            throw new BadRequestException("Đơn này đã được xử lý");
        }
        
        User approver = userRepository.findById(approverId)
            .orElseThrow(() -> new EntityNotFoundException("Người duyệt không tồn tại"));
        
        nghiPhep.approve(approver, note);
        NghiPhep saved = nghiPhepRepository.save(nghiPhep);
        log.info("✅ Đã phê duyệt đơn nghỉ phép cho nhân viên: {}", nghiPhep.getNhanVien().getHoTen());
        
        // 🔔 Gửi notification cho nhân viên
        try {
            if (nghiPhep.getNhanVien().getUser() != null) {
                notificationService.createLeaveApprovedNotification(
                    nghiPhep.getNhanVien().getUser().getUserId(),
                    nghiPhep.getNgayBatDau().toString(),
                    nghiPhep.getNgayKetThuc().toString()
                );
            }
        } catch (Exception e) {
            log.warn("Không thể gửi notification: {}", e.getMessage());
        }
        
        return saved;
    }

    /**
     * Từ chối đơn nghỉ phép
     */
    public NghiPhep rejectNghiPhep(Long id, Long approverId, String note) {
        log.info("Từ chối đơn nghỉ phép ID: {} bởi user ID: {}", id, approverId);
        NghiPhep nghiPhep = getNghiPhepById(id);
        
        if (nghiPhep.getTrangThai() != TrangThaiNghiPhep.CHO_DUYET) {
            throw new BadRequestException("Đơn này đã được xử lý");
        }
        
        User approver = userRepository.findById(approverId)
            .orElseThrow(() -> new EntityNotFoundException("Người duyệt không tồn tại"));
        
        nghiPhep.reject(approver, note);
        NghiPhep saved = nghiPhepRepository.save(nghiPhep);
        log.info("❌ Đã từ chối đơn nghỉ phép cho nhân viên: {} - Lý do: {}", nghiPhep.getNhanVien().getHoTen(), note);
        
        // 🔔 Gửi notification cho nhân viên
        try {
            if (nghiPhep.getNhanVien().getUser() != null) {
                notificationService.createLeaveRejectedNotification(
                    nghiPhep.getNhanVien().getUser().getUserId(),
                    nghiPhep.getNgayBatDau().toString(),
                    nghiPhep.getNgayKetThuc().toString(),
                    note != null ? note : "Không có lý do cụ thể"
                );
            }
        } catch (Exception e) {
            log.warn("Không thể gửi notification: {}", e.getMessage());
        }
        
        return saved;
    }

    /**
     * Lấy danh sách đơn chờ duyệt
     */
    public List<NghiPhep> getPendingNghiPhep() {
        return nghiPhepRepository.findByTrangThai(TrangThaiNghiPhep.CHO_DUYET);
    }

    /**
     * Lấy danh sách đơn đã duyệt
     */
    public List<NghiPhep> getApprovedNghiPhep() {
        return nghiPhepRepository.findByTrangThai(TrangThaiNghiPhep.DA_DUYET);
    }

    /**
     * Lấy danh sách đơn bị từ chối
     */
    public List<NghiPhep> getRejectedNghiPhep() {
        return nghiPhepRepository.findByTrangThai(TrangThaiNghiPhep.TU_CHOI);
    }

    /**
     * Tính tổng số ngày nghỉ của nhân viên trong năm
     */
    public int getTotalLeaveDays(Long nhanvienId, int year) {
        List<NghiPhep> nghiPheps = nghiPhepRepository.findApprovedByNhanVienAndYear(nhanvienId, year);
        return nghiPheps.stream()
            .mapToInt(NghiPhep::getSoNgay)
            .sum();
    }

    /**
     * Kiểm tra nhân viên có đang nghỉ phép không
     */
    public boolean isOnLeave(Long nhanvienId, LocalDate date) {
        return nghiPhepRepository.isNhanVienOnLeave(nhanvienId, date);
    }
}
