package DoAn.BE.hr.repository;

import DoAn.BE.hr.entity.ChamCong;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChamCongRepository extends JpaRepository<ChamCong, Long> {
    List<ChamCong> findByNhanVien_NhanvienIdOrderByNgayChamDesc(Long nhanvienId);
    List<ChamCong> findByNgayChamBetween(LocalDate start, LocalDate end);
}


