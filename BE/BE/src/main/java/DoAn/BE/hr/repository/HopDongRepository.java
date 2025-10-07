package DoAn.BE.hr.repository;

import DoAn.BE.hr.entity.HopDong;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HopDongRepository extends JpaRepository<HopDong, Long> {
    List<HopDong> findByNhanVien_NhanvienId(Long nhanvienId);
}


