package DoAn.BE.hr.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;

import DoAn.BE.common.exception.DuplicateException;
import DoAn.BE.common.exception.EntityNotFoundException;
import DoAn.BE.hr.dto.CreateBangLuongRequest;
import DoAn.BE.hr.dto.UpdateBangLuongRequest;
import DoAn.BE.hr.entity.BangLuong;
import DoAn.BE.hr.entity.NhanVien;
import DoAn.BE.hr.repository.BangLuongRepository;
import DoAn.BE.hr.repository.NhanVienRepository;
import jakarta.transaction.Transactional;

@Service
@Transactional
public class BangLuongService {
    
    private final BangLuongRepository bangLuongRepository;
    private final NhanVienRepository nhanVienRepository;

    public BangLuongService(BangLuongRepository bangLuongRepository, NhanVienRepository nhanVienRepository) {
        this.bangLuongRepository = bangLuongRepository;
        this.nhanVienRepository = nhanVienRepository;
    }

    /**
     * Tạo bảng lương mới
     */
    public BangLuong createBangLuong(CreateBangLuongRequest request) {
        // Kiểm tra nhân viên tồn tại
        NhanVien nhanVien = nhanVienRepository.findById(request.getNhanvienId())
            .orElseThrow(() -> new EntityNotFoundException("Nhân viên không tồn tại"));

        // Kiểm tra bảng lương đã tồn tại cho kỳ này chưa
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
     */
    public BangLuong getBangLuongById(Long id) {
        return bangLuongRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Bảng lương không tồn tại"));
    }

    /**
     * Lấy danh sách tất cả bảng lương
     */
    public List<BangLuong> getAllBangLuong() {
        return bangLuongRepository.findAll();
    }

    /**
     * Cập nhật bảng lương
     */
    public BangLuong updateBangLuong(Long id, UpdateBangLuongRequest request) {
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
     * Xóa bảng lương
     */
    public void deleteBangLuong(Long id) {
        BangLuong bangLuong = getBangLuongById(id);
        bangLuongRepository.delete(bangLuong);
    }

    /**
     * Lấy bảng lương theo nhân viên
     */
    public List<BangLuong> getBangLuongByNhanVien(Long nhanvienId) {
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
     * Đánh dấu đã thanh toán
     */
    public BangLuong markAsPaid(Long id) {
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
}
