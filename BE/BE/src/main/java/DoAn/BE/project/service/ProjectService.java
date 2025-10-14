package DoAn.BE.project.service;

import DoAn.BE.common.exception.DuplicateException;
import DoAn.BE.common.exception.EntityNotFoundException;
import DoAn.BE.hr.entity.PhongBan;
import DoAn.BE.hr.repository.PhongBanRepository;
import DoAn.BE.project.dto.CreateProjectRequest;
import DoAn.BE.project.dto.ProjectDTO;
import DoAn.BE.project.entity.Project;
import DoAn.BE.project.entity.ProjectMember;
import DoAn.BE.project.mapper.ProjectMapper;
import DoAn.BE.project.repository.ProjectRepository;
import DoAn.BE.user.entity.User;
import DoAn.BE.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PhongBanRepository phongBanRepository;

    @Autowired
    private ProjectMapper projectMapper;

    /**
     * Tạo project mới
     */
    public ProjectDTO createProject(CreateProjectRequest request, Long createdByUserId) {
        // Kiểm tra key project đã tồn tại chưa
        if (projectRepository.findByKeyProject(request.getKeyProject()).isPresent()) {
            throw new DuplicateException("Mã dự án đã tồn tại: " + request.getKeyProject());
        }

        // Lấy user tạo project
        User createdBy = userRepository.findById(createdByUserId)
            .orElseThrow(() -> new EntityNotFoundException("User không tồn tại"));

        // Tạo project
        Project project = new Project();
        project.setName(request.getName());
        project.setKeyProject(request.getKeyProject());
        project.setDescription(request.getDescription());
        project.setStartDate(request.getStartDate());
        project.setEndDate(request.getEndDate());
        project.setCreatedBy(createdBy);
        project.setIsActive(true);

        // Set phòng ban nếu có
        if (request.getPhongbanId() != null) {
            PhongBan phongBan = phongBanRepository.findById(request.getPhongbanId())
                .orElseThrow(() -> new EntityNotFoundException("Phòng ban không tồn tại"));
            project.setPhongBan(phongBan);
        }

        // Lưu project
        Project savedProject = projectRepository.save(project);

        // Tự động thêm creator làm OWNER
        ProjectMember ownerMember = new ProjectMember(savedProject, createdBy, ProjectMember.ProjectRole.OWNER);
        savedProject.getMembers().add(ownerMember);

        return projectMapper.toDTO(savedProject);
    }

    /**
     * Lấy project theo ID
     */
    public ProjectDTO getProjectById(Long projectId) {
        Project project = projectRepository.findById(projectId)
            .orElseThrow(() -> new EntityNotFoundException("Project không tồn tại"));
        return projectMapper.toDTO(project);
    }

    /**
     * Lấy tất cả projects
     */
    public List<ProjectDTO> getAllProjects() {
        List<Project> projects = projectRepository.findAll();
        return projectMapper.toDTOList(projects);
    }

    /**
     * Lấy projects theo user
     */
    public List<ProjectDTO> getProjectsByUser(Long userId) {
        List<Project> projects = projectRepository.findByCreatedBy_UserId(userId);
        return projectMapper.toDTOList(projects);
    }

    /**
     * Lấy projects đang active
     */
    public List<ProjectDTO> getActiveProjects() {
        List<Project> projects = projectRepository.findByIsActiveTrue();
        return projectMapper.toDTOList(projects);
    }

    /**
     * Cập nhật project
     */
    public ProjectDTO updateProject(Long projectId, CreateProjectRequest request) {
        Project project = projectRepository.findById(projectId)
            .orElseThrow(() -> new EntityNotFoundException("Project không tồn tại"));

        // Kiểm tra key project mới có trùng không (nếu thay đổi)
        if (!project.getKeyProject().equals(request.getKeyProject())) {
            if (projectRepository.findByKeyProject(request.getKeyProject()).isPresent()) {
                throw new DuplicateException("Mã dự án đã tồn tại: " + request.getKeyProject());
            }
        }

        // Cập nhật thông tin
        project.setName(request.getName());
        project.setKeyProject(request.getKeyProject());
        project.setDescription(request.getDescription());
        project.setStartDate(request.getStartDate());
        project.setEndDate(request.getEndDate());

        // Cập nhật phòng ban
        if (request.getPhongbanId() != null) {
            PhongBan phongBan = phongBanRepository.findById(request.getPhongbanId())
                .orElseThrow(() -> new EntityNotFoundException("Phòng ban không tồn tại"));
            project.setPhongBan(phongBan);
        } else {
            project.setPhongBan(null);
        }

        Project savedProject = projectRepository.save(project);
        return projectMapper.toDTO(savedProject);
    }

    /**
     * Xóa project (soft delete)
     */
    public void deleteProject(Long projectId) {
        Project project = projectRepository.findById(projectId)
            .orElseThrow(() -> new EntityNotFoundException("Project không tồn tại"));
        
        project.setIsActive(false);
        projectRepository.save(project);
    }

    /**
     * Kích hoạt project
     */
    public ProjectDTO activateProject(Long projectId) {
        Project project = projectRepository.findById(projectId)
            .orElseThrow(() -> new EntityNotFoundException("Project không tồn tại"));
        
        project.setIsActive(true);
        Project savedProject = projectRepository.save(project);
        return projectMapper.toDTO(savedProject);
    }

    /**
     * Thay đổi trạng thái project
     */
    public ProjectDTO changeProjectStatus(Long projectId, Project.ProjectStatus status) {
        Project project = projectRepository.findById(projectId)
            .orElseThrow(() -> new EntityNotFoundException("Project không tồn tại"));
        
        project.setStatus(status);
        Project savedProject = projectRepository.save(project);
        return projectMapper.toDTO(savedProject);
    }

    /**
     * Tìm kiếm projects
     */
    public List<ProjectDTO> searchProjects(String keyword) {
        // TODO: Implement search logic
        return getAllProjects();
    }
}
