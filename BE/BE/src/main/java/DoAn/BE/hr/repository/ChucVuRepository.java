package DoAn.BE.hr.repository;

import DoAn.BE.hr.entity.ChucVu;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChucVuRepository extends JpaRepository<ChucVu, Long> {
    Optional<ChucVu> findByTenChucVu(String tenChucVu);
}


