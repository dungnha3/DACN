package DoAn.BE.hr.repository;

import DoAn.BE.hr.entity.NghiPhep;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NghiPhepRepository extends JpaRepository<NghiPhep, Long> {
    List<NghiPhep> findByNhanVien_NhanvienId(Long nhanvienId);
    List<NghiPhep> findByNgayBatDauLessThanEqualAndNgayKetThucGreaterThanEqual(LocalDate end, LocalDate start);
}


