package DoAn.BE.hr.repository;

import DoAn.BE.hr.entity.NhanVien;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NhanVienRepository extends JpaRepository<NhanVien, Long> {
    Optional<NhanVien> findByUser_UserId(Long userId);
    Optional<NhanVien> findByCccd(String cccd);
}


