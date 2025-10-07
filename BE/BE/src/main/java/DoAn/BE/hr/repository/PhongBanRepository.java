package DoAn.BE.hr.repository;

import DoAn.BE.hr.entity.PhongBan;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PhongBanRepository extends JpaRepository<PhongBan, Long> {
    Optional<PhongBan> findByTenPhongBan(String tenPhongBan);
}


