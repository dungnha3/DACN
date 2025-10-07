package DoAn.BE.project.repository;

import DoAn.BE.project.entity.Comment;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByIssue_IssueIdOrderByCreatedAtAsc(Long issueId);
    List<Comment> findByUser_UserId(Long userId);
}


