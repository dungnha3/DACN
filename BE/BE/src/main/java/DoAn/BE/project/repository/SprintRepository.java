package DoAn.BE.project.repository;

import DoAn.BE.project.entity.Sprint;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SprintRepository extends JpaRepository<Sprint, Long> {
    List<Sprint> findByProject_ProjectIdOrderByStartDateAsc(Long projectId);
}


