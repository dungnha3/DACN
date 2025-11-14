package DoAn.BE.project.repository;

import DoAn.BE.project.entity.ProjectMember;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectMemberRepository extends JpaRepository<ProjectMember, Long> {
    List<ProjectMember> findByProject_ProjectId(Long projectId);
    List<ProjectMember> findByUser_UserId(Long userId);
    Optional<ProjectMember> findByProject_ProjectIdAndUser_UserId(Long projectId, Long userId);
    
    /**
     * Lấy danh sách user ID của team members mà Project Manager quản lý
     */
    @Query("SELECT DISTINCT pm.user.userId FROM ProjectMember pm " +
           "WHERE pm.project.projectId IN (" +
           "    SELECT p.projectId FROM ProjectMember p " +
           "    WHERE p.user.userId = :managerId AND p.role = 'MANAGER'" +
           ")")
    List<Long> findTeamMemberUserIdsByManager(@Param("managerId") Long managerId);
}


