package DoAn.BE.project.service;

import DoAn.BE.common.exception.DuplicateException;
import DoAn.BE.common.exception.EntityNotFoundException;
import DoAn.BE.project.dto.ProjectMemberDTO;
import DoAn.BE.project.entity.Project;
import DoAn.BE.project.entity.ProjectMember;
import DoAn.BE.project.mapper.ProjectMemberMapper;
import DoAn.BE.project.repository.ProjectMemberRepository;
import DoAn.BE.project.repository.ProjectRepository;
import DoAn.BE.user.entity.User;
import DoAn.BE.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ProjectMemberService {

    @Autowired
    private ProjectMemberRepository projectMemberRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectMemberMapper projectMemberMapper;

    /**
     * Thêm member vào project
     */
    public ProjectMemberDTO addMemberToProject(Long projectId, Long userId, ProjectMember.ProjectRole role) {
        // Kiểm tra project tồn tại
        Project project = projectRepository.findById(projectId)
            .orElseThrow(() -> new EntityNotFoundException("Project không tồn tại"));

        // Kiểm tra user tồn tại
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new EntityNotFoundException("User không tồn tại"));

        // Kiểm tra user đã là member chưa
        if (projectMemberRepository.existsByProject_ProjectIdAndUser_UserId(projectId, userId)) {
            throw new DuplicateException("User đã là thành viên của project này");
        }

        // Tạo project member
        ProjectMember member = new ProjectMember(project, user, role);
        ProjectMember savedMember = projectMemberRepository.save(member);

        return projectMemberMapper.toDTO(savedMember);
    }

    /**
     * Lấy danh sách members của project
     */
    public List<ProjectMemberDTO> getProjectMembers(Long projectId) {
        List<ProjectMember> members = projectMemberRepository.findByProject_ProjectId(projectId);
        return projectMemberMapper.toDTOList(members);
    }

    /**
     * Lấy projects của user
     */
    public List<ProjectMemberDTO> getUserProjects(Long userId) {
        List<ProjectMember> members = projectMemberRepository.findByUser_UserId(userId);
        return projectMemberMapper.toDTOList(members);
    }

    /**
     * Cập nhật role của member
     */
    public ProjectMemberDTO updateMemberRole(Long projectId, Long userId, ProjectMember.ProjectRole newRole) {
        ProjectMember member = projectMemberRepository.findByProject_ProjectIdAndUser_UserId(projectId, userId)
            .orElseThrow(() -> new EntityNotFoundException("Project member không tồn tại"));

        member.setRole(newRole);
        ProjectMember savedMember = projectMemberRepository.save(member);

        return projectMemberMapper.toDTO(savedMember);
    }

    /**
     * Xóa member khỏi project
     */
    public void removeMemberFromProject(Long projectId, Long userId) {
        ProjectMember member = projectMemberRepository.findByProject_ProjectIdAndUser_UserId(projectId, userId)
            .orElseThrow(() -> new EntityNotFoundException("Project member không tồn tại"));

        // Không cho phép xóa OWNER
        if (member.getRole() == ProjectMember.ProjectRole.OWNER) {
            throw new RuntimeException("Không thể xóa OWNER khỏi project");
        }

        projectMemberRepository.delete(member);
    }

    /**
     * Kiểm tra user có phải member của project không
     */
    public boolean isProjectMember(Long projectId, Long userId) {
        return projectMemberRepository.existsByProject_ProjectIdAndUser_UserId(projectId, userId);
    }

    /**
     * Kiểm tra user có quyền quản lý project không
     */
    public boolean canManageProject(Long projectId, Long userId) {
        ProjectMember member = projectMemberRepository.findByProject_ProjectIdAndUser_UserId(projectId, userId)
            .orElse(null);
        
        return member != null && member.canManageProject();
    }
}
