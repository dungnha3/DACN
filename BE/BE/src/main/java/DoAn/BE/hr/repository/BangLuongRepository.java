package DoAn.BE.hr.repository;

import DoAn.BE.hr.entity.BangLuong;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BangLuongRepository extends JpaRepository<BangLuong, Long> {
    List<BangLuong> findByNhanVien_NhanvienId(Long nhanvienId);
    List<BangLuong> findByThangAndNam(Integer thang, Integer nam);
}


