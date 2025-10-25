package DoAn.BE.hr.controller;

import DoAn.BE.hr.dto.BangLuongDTO;
import DoAn.BE.hr.dto.CreateBangLuongRequest;
import DoAn.BE.hr.dto.UpdateBangLuongRequest;
import DoAn.BE.hr.entity.BangLuong;
import DoAn.BE.hr.mapper.BangLuongMapper;
import DoAn.BE.hr.service.BangLuongService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/bang-luong")
public class BangLuongController {
    
    private final BangLuongService bangLuongService;
    private final BangLuongMapper bangLuongMapper;

    public BangLuongController(BangLuongService bangLuongService, BangLuongMapper bangLuongMapper) {
        this.bangLuongService = bangLuongService;
        this.bangLuongMapper = bangLuongMapper;
    }
    
    /**
     * Tạo bảng lương mới
     * POST /api/bang-luong
     */
    @PostMapping
    public ResponseEntity<BangLuongDTO> createBangLuong(@Valid @RequestBody CreateBangLuongRequest request) {
        BangLuong bangLuong = bangLuongService.createBangLuong(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(bangLuongMapper.toDTO(bangLuong));
    }
    
    /**
     * Lấy thông tin bảng lương theo ID
     * GET /api/bang-luong/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<BangLuongDTO> getBangLuongById(@PathVariable Long id) {
        BangLuong bangLuong = bangLuongService.getBangLuongById(id);
        return ResponseEntity.ok(bangLuongMapper.toDTO(bangLuong));
    }
    
    /**
     * Lấy danh sách tất cả bảng lương
     * GET /api/bang-luong
     */
    @GetMapping
    public ResponseEntity<List<BangLuongDTO>> getAllBangLuong() {
        List<BangLuong> bangLuongs = bangLuongService.getAllBangLuong();
        return ResponseEntity.ok(bangLuongMapper.toDTOList(bangLuongs));
    }
    
    /**
     * Cập nhật bảng lương
     * PUT /api/bang-luong/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<BangLuongDTO> updateBangLuong(
            @PathVariable Long id,
            @Valid @RequestBody UpdateBangLuongRequest request) {
        BangLuong bangLuong = bangLuongService.updateBangLuong(id, request);
        return ResponseEntity.ok(bangLuongMapper.toDTO(bangLuong));
    }
    
    /**
     * Xóa bảng lương
     * DELETE /api/bang-luong/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteBangLuong(@PathVariable Long id) {
        bangLuongService.deleteBangLuong(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Xóa bảng lương thành công");
        return ResponseEntity.ok(response);
    }
    
    /**
     * Lấy bảng lương theo nhân viên
     * GET /api/bang-luong/nhan-vien/{nhanvienId}
     */
    @GetMapping("/nhan-vien/{nhanvienId}")
    public ResponseEntity<List<BangLuongDTO>> getBangLuongByNhanVien(@PathVariable Long nhanvienId) {
        List<BangLuong> bangLuongs = bangLuongService.getBangLuongByNhanVien(nhanvienId);
        return ResponseEntity.ok(bangLuongMapper.toDTOList(bangLuongs));
    }
    
    /**
     * Lấy bảng lương theo kỳ (tháng/năm)
     * GET /api/bang-luong/period?thang=1&nam=2024
     */
    @GetMapping("/period")
    public ResponseEntity<List<BangLuongDTO>> getBangLuongByPeriod(
            @RequestParam Integer thang,
            @RequestParam Integer nam) {
        List<BangLuong> bangLuongs = bangLuongService.getBangLuongByPeriod(thang, nam);
        return ResponseEntity.ok(bangLuongMapper.toDTOList(bangLuongs));
    }
    
    /**
     * Lấy bảng lương theo nhân viên và kỳ
     * GET /api/bang-luong/nhan-vien/{nhanvienId}/period?thang=1&nam=2024
     */
    @GetMapping("/nhan-vien/{nhanvienId}/period")
    public ResponseEntity<BangLuongDTO> getBangLuongByNhanVienAndPeriod(
            @PathVariable Long nhanvienId,
            @RequestParam Integer thang,
            @RequestParam Integer nam) {
        BangLuong bangLuong = bangLuongService.getBangLuongByNhanVienAndPeriod(nhanvienId, thang, nam);
        return ResponseEntity.ok(bangLuongMapper.toDTO(bangLuong));
    }
    
    /**
     * Lấy bảng lương theo trạng thái
     * GET /api/bang-luong/trang-thai/{trangThai}
     */
    @GetMapping("/trang-thai/{trangThai}")
    public ResponseEntity<List<BangLuongDTO>> getBangLuongByTrangThai(@PathVariable String trangThai) {
        List<BangLuong> bangLuongs = bangLuongService.getBangLuongByTrangThai(trangThai);
        return ResponseEntity.ok(bangLuongMapper.toDTOList(bangLuongs));
    }
    
    /**
     * Đánh dấu đã thanh toán
     * PATCH /api/bang-luong/{id}/mark-paid
     */
    @PatchMapping("/{id}/mark-paid")
    public ResponseEntity<BangLuongDTO> markAsPaid(@PathVariable Long id) {
        BangLuong bangLuong = bangLuongService.markAsPaid(id);
        return ResponseEntity.ok(bangLuongMapper.toDTO(bangLuong));
    }
    
    /**
     * Hủy bảng lương
     * PATCH /api/bang-luong/{id}/cancel
     */
    @PatchMapping("/{id}/cancel")
    public ResponseEntity<BangLuongDTO> cancelBangLuong(@PathVariable Long id) {
        BangLuong bangLuong = bangLuongService.cancelBangLuong(id);
        return ResponseEntity.ok(bangLuongMapper.toDTO(bangLuong));
    }
    
    /**
     * Tính tổng lương thực nhận theo kỳ
     * GET /api/bang-luong/total/period?thang=1&nam=2024
     */
    @GetMapping("/total/period")
    public ResponseEntity<Map<String, Object>> getTotalSalaryByPeriod(
            @RequestParam Integer thang,
            @RequestParam Integer nam) {
        BigDecimal total = bangLuongService.getTotalSalaryByPeriod(thang, nam);
        Map<String, Object> response = new HashMap<>();
        response.put("thang", thang);
        response.put("nam", nam);
        response.put("tongLuongThucNhan", total);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Tính tổng lương thực nhận theo nhân viên trong năm
     * GET /api/bang-luong/total/nhan-vien/{nhanvienId}/year/{nam}
     */
    @GetMapping("/total/nhan-vien/{nhanvienId}/year/{nam}")
    public ResponseEntity<Map<String, Object>> getTotalSalaryByNhanVienAndYear(
            @PathVariable Long nhanvienId,
            @PathVariable Integer nam) {
        BigDecimal total = bangLuongService.getTotalSalaryByNhanVienAndYear(nhanvienId, nam);
        Map<String, Object> response = new HashMap<>();
        response.put("nhanvienId", nhanvienId);
        response.put("nam", nam);
        response.put("tongLuongThucNhan", total);
        return ResponseEntity.ok(response);
    }
}
