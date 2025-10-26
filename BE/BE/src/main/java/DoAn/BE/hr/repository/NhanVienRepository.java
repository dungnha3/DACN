package DoAn.BE.hr.repository;

import DoAn.BE.hr.entity.NhanVien;
import DoAn.BE.hr.entity.NhanVien.TrangThaiNhanVien;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface NhanVienRepository extends JpaRepository<NhanVien, Long> {
    Optional<NhanVien> findByUser_UserId(Long userId);
    Optional<NhanVien> findByCccd(String cccd);
    boolean existsByCccd(String cccd);
    
    List<NhanVien> findByTrangThai(TrangThaiNhanVien trangThai);
    List<NhanVien> findByPhongBan_PhongbanId(Long phongbanId);
    List<NhanVien> findByChucVu_ChucvuId(Long chucvuId);
    
    @Query("SELECT nv FROM NhanVien nv WHERE " +
           "LOWER(nv.hoTen) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(nv.cccd) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<NhanVien> searchByKeyword(@Param("keyword") String keyword);
    
    // Đếm theo trạng thái
    long countByTrangThai(TrangThaiNhanVien trangThai);
}


