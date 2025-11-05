package DoAn.BE.hr.controller;

import DoAn.BE.hr.dto.HopDongDTO;
import DoAn.BE.hr.dto.HopDongRequest;
import DoAn.BE.hr.entity.HopDong;
import DoAn.BE.hr.entity.HopDong.TrangThaiHopDong;
import DoAn.BE.hr.mapper.HopDongMapper;
import DoAn.BE.hr.service.HopDongService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/hop-dong")
public class HopDongController {
    
    private final HopDongService hopDongService;
    private final HopDongMapper hopDongMapper;

    public HopDongController(HopDongService hopDongService, HopDongMapper hopDongMapper) {
        this.hopDongService = hopDongService;
        this.hopDongMapper = hopDongMapper;
    }
    
    /**
     * Tạo hợp đồng mới
     * POST /api/hop-dong
     */
    @PostMapping
    public ResponseEntity<HopDongDTO> createHopDong(@Valid @RequestBody HopDongRequest request) {
        HopDong hopDong = hopDongService.createHopDong(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(hopDongMapper.toDTO(hopDong));
    }
    
    /**
     * Lấy thông tin hợp đồng theo ID
     * GET /api/hop-dong/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<HopDongDTO> getHopDongById(@PathVariable Long id) {
        HopDong hopDong = hopDongService.getHopDongById(id);
        return ResponseEntity.ok(hopDongMapper.toDTO(hopDong));
    }
    
    /**
     * Lấy danh sách tất cả hợp đồng
     * GET /api/hop-dong
     */
    @GetMapping
    public ResponseEntity<List<HopDongDTO>> getAllHopDong() {
        List<HopDong> hopDongs = hopDongService.getAllHopDong();
        return ResponseEntity.ok(hopDongMapper.toDTOList(hopDongs));
    }
    
    /**
     * Cập nhật hợp đồng
     * PUT /api/hop-dong/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<HopDongDTO> updateHopDong(
            @PathVariable Long id,
            @Valid @RequestBody HopDongRequest request) {
        HopDong hopDong = hopDongService.updateHopDong(id, request);
        return ResponseEntity.ok(hopDongMapper.toDTO(hopDong));
    }
    
    /**
     * Xóa hợp đồng
     * DELETE /api/hop-dong/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteHopDong(@PathVariable Long id) {
        hopDongService.deleteHopDong(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Xóa hợp đồng thành công");
        return ResponseEntity.ok(response);
    }
    
    /**
     * Lấy hợp đồng theo nhân viên
     * GET /api/hop-dong/nhan-vien/{nhanvienId}
     */
    @GetMapping("/nhan-vien/{nhanvienId}")
    public ResponseEntity<List<HopDongDTO>> getHopDongByNhanVien(@PathVariable Long nhanvienId) {
        List<HopDong> hopDongs = hopDongService.getHopDongByNhanVien(nhanvienId);
        return ResponseEntity.ok(hopDongMapper.toDTOList(hopDongs));
    }
    
    /**
     * Lấy hợp đồng hiệu lực của nhân viên
     * GET /api/hop-dong/nhan-vien/{nhanvienId}/active
     */
    @GetMapping("/nhan-vien/{nhanvienId}/active")
    public ResponseEntity<HopDongDTO> getActiveHopDong(@PathVariable Long nhanvienId) {
        HopDong hopDong = hopDongService.getActiveHopDong(nhanvienId);
        return ResponseEntity.ok(hopDongMapper.toDTO(hopDong));
    }
    
    /**
     * Lấy hợp đồng theo trạng thái
     * GET /api/hop-dong/trang-thai/{trangThai}
     */
    @GetMapping("/trang-thai/{trangThai}")
    public ResponseEntity<List<HopDongDTO>> getHopDongByTrangThai(@PathVariable TrangThaiHopDong trangThai) {
        List<HopDong> hopDongs = hopDongService.getHopDongByTrangThai(trangThai);
        return ResponseEntity.ok(hopDongMapper.toDTOList(hopDongs));
    }
    
    /**
     * Hủy hợp đồng
     * PATCH /api/hop-dong/{id}/cancel
     */
    @PatchMapping("/{id}/cancel")
    public ResponseEntity<HopDongDTO> cancelHopDong(@PathVariable Long id) {
        HopDong hopDong = hopDongService.cancelHopDong(id);
        return ResponseEntity.ok(hopDongMapper.toDTO(hopDong));
    }
    
    /**
     * Gia hạn hợp đồng
     * PATCH /api/hop-dong/{id}/renew
     */
    @PatchMapping("/{id}/renew")
    public ResponseEntity<HopDongDTO> renewHopDong(
            @PathVariable Long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate newEndDate) {
        HopDong hopDong = hopDongService.renewHopDong(id, newEndDate);
        return ResponseEntity.ok(hopDongMapper.toDTO(hopDong));
    }
    
    /**
     * Lấy danh sách hợp đồng sắp hết hạn
     * GET /api/hop-dong/expiring?daysAhead=30
     */
    @GetMapping("/expiring")
    public ResponseEntity<List<HopDongDTO>> getExpiringContracts(
            @RequestParam(defaultValue = "30") int daysAhead) {
        List<HopDong> hopDongs = hopDongService.getExpiringContracts(daysAhead);
        return ResponseEntity.ok(hopDongMapper.toDTOList(hopDongs));
    }
    
    /**
     * Cập nhật trạng thái hợp đồng hết hạn (batch job)
     * POST /api/hop-dong/update-expired
     */
    @PostMapping("/update-expired")
    public ResponseEntity<Map<String, Object>> updateExpiredContracts() {
        int count = hopDongService.updateExpiredContracts();
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Cập nhật trạng thái hợp đồng hết hạn thành công");
        response.put("updatedCount", count);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Kiểm tra nhân viên có hợp đồng hiệu lực không
     * GET /api/hop-dong/nhan-vien/{nhanvienId}/has-active
     */
    @GetMapping("/nhan-vien/{nhanvienId}/has-active")
    public ResponseEntity<Map<String, Object>> hasActiveContract(@PathVariable Long nhanvienId) {
        boolean hasActive = hopDongService.hasActiveContract(nhanvienId);
        Map<String, Object> response = new HashMap<>();
        response.put("nhanvienId", nhanvienId);
        response.put("hasActiveContract", hasActive);
        return ResponseEntity.ok(response);
    }
}
