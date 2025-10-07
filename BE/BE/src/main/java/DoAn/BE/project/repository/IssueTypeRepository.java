package DoAn.BE.project.repository;

import DoAn.BE.project.entity.IssueType;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IssueTypeRepository extends JpaRepository<IssueType, Integer> {
    Optional<IssueType> findByName(String name);
}


