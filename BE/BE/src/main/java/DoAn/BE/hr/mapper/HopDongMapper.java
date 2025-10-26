package DoAn.BE.hr.mapper;

import DoAn.BE.hr.dto.HopDongDTO;
import DoAn.BE.hr.entity.HopDong;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class HopDongMapper {
    
    /**
     * Convert HopDong entity to HopDongDTO
     */
    public HopDongDTO toDTO(HopDong hopDong) {
        if (hopDong == null) {
            return null;
        }
        
        HopDongDTO dto = new HopDongDTO();
        dto.setHopdongId(hopDong.getHopdongId());
        
        // Thông tin nhân viên
        if (hopDong.getNhanVien() != null) {
            dto.setNhanvienId(hopDong.getNhanVien().getNhanvienId());
            dto.setHoTenNhanVien(hopDong.getNhanVien().getHoTen());
        }
        
        // Thông tin hợp đồng
        dto.setLoaiHopDong(hopDong.getLoaiHopDong());
        dto.setNgayBatDau(hopDong.getNgayBatDau());
        dto.setNgayKetThuc(hopDong.getNgayKetThuc());
        dto.setLuongCoBan(hopDong.getLuongCoBan());
        dto.setNoiDung(hopDong.getNoiDung());
        dto.setTrangThai(hopDong.getTrangThai());
        dto.setCreatedAt(hopDong.getCreatedAt());
        
        // Computed fields
        dto.setIsExpired(hopDong.isExpired());
        
        // Tính số ngày còn lại
        if (hopDong.getNgayKetThuc() != null) {
            long daysRemaining = ChronoUnit.DAYS.between(LocalDate.now(), hopDong.getNgayKetThuc());
            dto.setSoNgayConLai(daysRemaining > 0 ? (int) daysRemaining : 0);
        }
        
        return dto;
    }
    
    /**
     * Convert list of HopDong entities to list of HopDongDTOs
     */
    public List<HopDongDTO> toDTOList(List<HopDong> hopDongs) {
        if (hopDongs == null) {
            return null;
        }
        
        return hopDongs.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
}
