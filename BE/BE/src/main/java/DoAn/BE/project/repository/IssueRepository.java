package DoAn.BE.project.repository;

import DoAn.BE.project.entity.Issue;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IssueRepository extends JpaRepository<Issue, Long> {
    Optional<Issue> findByIssueKey(String issueKey);
    List<Issue> findByProject_ProjectId(Long projectId);
    List<Issue> findBySprint_SprintId(Long sprintId);
    List<Issue> findByReporter_UserId(Long userId);
    List<Issue> findByAssignee_UserId(Long userId);
}


