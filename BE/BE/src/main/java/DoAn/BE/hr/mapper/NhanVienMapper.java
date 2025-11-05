package DoAn.BE.hr.mapper;

import DoAn.BE.hr.dto.NhanVienDTO;
import DoAn.BE.hr.entity.NhanVien;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class NhanVienMapper {
    
    public NhanVienDTO toDTO(NhanVien nhanVien) {
        if (nhanVien == null) {
            return null;
        }
        
        NhanVienDTO dto = new NhanVienDTO();
        dto.setNhanvienId(nhanVien.getNhanvienId());
        
        if (nhanVien.getUser() != null) {
            dto.setUserId(nhanVien.getUser().getUserId());
            dto.setUsername(nhanVien.getUser().getUsername());
        }
        
        dto.setHoTen(nhanVien.getHoTen());
        dto.setCccd(nhanVien.getCccd());
        dto.setNgaySinh(nhanVien.getNgaySinh());
        dto.setGioiTinh(nhanVien.getGioiTinh());
        dto.setDiaChi(nhanVien.getDiaChi());
        dto.setNgayVaoLam(nhanVien.getNgayVaoLam());
        dto.setTrangThai(nhanVien.getTrangThai());
        
        if (nhanVien.getPhongBan() != null) {
            dto.setPhongbanId(nhanVien.getPhongBan().getPhongbanId());
            dto.setTenPhongBan(nhanVien.getPhongBan().getTenPhongBan());
        }
        
        if (nhanVien.getChucVu() != null) {
            dto.setChucvuId(nhanVien.getChucVu().getChucvuId());
            dto.setTenChucVu(nhanVien.getChucVu().getTenChucVu());
        }
        
        dto.setLuongCoBan(nhanVien.getLuongCoBan());
        dto.setPhuCap(nhanVien.getPhuCap());
        dto.setCreatedAt(nhanVien.getCreatedAt());
        
        return dto;
    }
    
    public List<NhanVienDTO> toDTOList(List<NhanVien> nhanViens) {
        if (nhanViens == null) {
            return null;
        }
        return nhanViens.stream().map(this::toDTO).collect(Collectors.toList());
    }
}
