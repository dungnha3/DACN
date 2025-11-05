package DoAn.BE.project.service;

import DoAn.BE.common.exception.*;
import DoAn.BE.hr.entity.PhongBan;
import DoAn.BE.hr.repository.PhongBanRepository;
import DoAn.BE.project.dto.*;
import DoAn.BE.project.entity.Project;
import DoAn.BE.project.entity.ProjectMember;
import DoAn.BE.project.entity.ProjectMember.ProjectRole;
import DoAn.BE.project.repository.ProjectMemberRepository;
import DoAn.BE.project.repository.ProjectRepository;
import DoAn.BE.user.entity.User;
import DoAn.BE.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {
    
    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final UserRepository userRepository;
    private final PhongBanRepository phongBanRepository;
    
    @Transactional
    public ProjectDTO createProject(CreateProjectRequest request, Long userId) {
        // Validate user exists
        User creator = userRepository.findById(userId)
            .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy người dùng"));
        
        // Check if project key already exists
        if (projectRepository.findByKeyProject(request.getKeyProject()).isPresent()) {
            throw new DuplicateException("Mã dự án đã tồn tại: " + request.getKeyProject());
        }
        
        // Validate phongban if provided
        PhongBan phongBan = null;
        if (request.getPhongbanId() != null) {
            phongBan = phongBanRepository.findById(request.getPhongbanId())
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy phòng ban"));
        }
        
        // Validate dates
        if (request.getStartDate() != null && request.getEndDate() != null) {
            if (request.getEndDate().isBefore(request.getStartDate())) {
                throw new BadRequestException("Ngày kết thúc phải sau ngày bắt đầu");
            }
        }
        
        // Create project
        Project project = new Project();
        project.setName(request.getName());
        project.setKeyProject(request.getKeyProject());
        project.setDescription(request.getDescription());
        project.setStartDate(request.getStartDate());
        project.setEndDate(request.getEndDate());
        project.setCreatedBy(creator);
        project.setPhongBan(phongBan);
        project.setStatus(Project.ProjectStatus.ACTIVE);
        project.setIsActive(true);
        
        project = projectRepository.save(project);
        
        // Add creator as OWNER
        ProjectMember ownerMember = new ProjectMember(project, creator, ProjectRole.OWNER);
        projectMemberRepository.save(ownerMember);
        
        return convertToDTO(project);
    }
    
    @Transactional(readOnly = true)
    public ProjectDTO getProjectById(Long projectId, Long userId) {
        Project project = projectRepository.findById(projectId)
            .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy dự án"));
        
        // Check if user has access to this project
        validateProjectAccess(projectId, userId);
        
        return convertToDTO(project);
    }
    
    @Transactional(readOnly = true)
    public List<ProjectDTO> getAllProjects() {
        return projectRepository.findByIsActiveTrue().stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<ProjectDTO> getMyProjects(Long userId) {
        List<ProjectMember> memberships = projectMemberRepository.findByUser_UserId(userId);
        return memberships.stream()
            .map(member -> convertToDTO(member.getProject()))
            .collect(Collectors.toList());
    }
    
    @Transactional
    public ProjectDTO updateProject(Long projectId, UpdateProjectRequest request, Long userId) {
        Project project = projectRepository.findById(projectId)
            .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy dự án"));
        
        // Check if user can manage this project
        validateProjectManagement(projectId, userId);
        
        // Update fields if provided
        if (request.getName() != null) {
            project.setName(request.getName());
        }
        if (request.getDescription() != null) {
            project.setDescription(request.getDescription());
        }
        if (request.getStatus() != null) {
            project.setStatus(request.getStatus());
        }
        if (request.getStartDate() != null) {
            project.setStartDate(request.getStartDate());
        }
        if (request.getEndDate() != null) {
            project.setEndDate(request.getEndDate());
        }
        if (request.getPhongbanId() != null) {
            PhongBan phongBan = phongBanRepository.findById(request.getPhongbanId())
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy phòng ban"));
            project.setPhongBan(phongBan);
        }
        
        // Validate dates
        if (project.getStartDate() != null && project.getEndDate() != null) {
            if (project.getEndDate().isBefore(project.getStartDate())) {
                throw new BadRequestException("Ngày kết thúc phải sau ngày bắt đầu");
            }
        }
        
        project = projectRepository.save(project);
        return convertToDTO(project);
    }
    
    @Transactional
    public void deleteProject(Long projectId, Long userId) {
        Project project = projectRepository.findById(projectId)
            .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy dự án"));
        
        // Only OWNER can delete project
        ProjectMember member = projectMemberRepository.findByProject_ProjectIdAndUser_UserId(projectId, userId)
            .orElseThrow(() -> new ProjectAccessDeniedException("Bạn không có quyền truy cập dự án này"));
        
        if (!member.isOwner()) {
            throw new ForbiddenException("Chỉ chủ dự án mới có thể xóa dự án");
        }
        
        // Soft delete
        project.setIsActive(false);
        project.setStatus(Project.ProjectStatus.CANCELLED);
        projectRepository.save(project);
    }
    
    @Transactional
    public ProjectMemberDTO addMember(Long projectId, AddMemberRequest request, Long userId) {
        Project project = projectRepository.findById(projectId)
            .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy dự án"));
        
        // Check if user can manage this project
        validateProjectManagement(projectId, userId);
        
        // Validate new member exists
        User newMember = userRepository.findById(request.getUserId())
            .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy người dùng"));
        
        // Check if user is already a member
        if (projectMemberRepository.findByProject_ProjectIdAndUser_UserId(projectId, request.getUserId()).isPresent()) {
            throw new DuplicateException("Người dùng đã là thành viên của dự án");
        }
        
        // Add member
        ProjectMember projectMember = new ProjectMember(project, newMember, request.getRole());
        projectMember = projectMemberRepository.save(projectMember);
        
        return convertToMemberDTO(projectMember);
    }
    
    @Transactional
    public void removeMember(Long projectId, Long memberId, Long userId) {
        // Check if project exists and user can manage it
        projectRepository.findById(projectId)
            .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy dự án"));
        
        // Check if user can manage this project
        validateProjectManagement(projectId, userId);
        
        ProjectMember memberToRemove = projectMemberRepository.findByProject_ProjectIdAndUser_UserId(projectId, memberId)
            .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy thành viên trong dự án"));
        
        // Cannot remove OWNER
        if (memberToRemove.isOwner()) {
            throw new ForbiddenException("Không thể xóa chủ dự án");
        }
        
        projectMemberRepository.delete(memberToRemove);
    }
    
    @Transactional(readOnly = true)
    public List<ProjectMemberDTO> getProjectMembers(Long projectId, Long userId) {
        // Validate access
        validateProjectAccess(projectId, userId);
        
        List<ProjectMember> members = projectMemberRepository.findByProject_ProjectId(projectId);
        return members.stream()
            .map(this::convertToMemberDTO)
            .collect(Collectors.toList());
    }
    
    @Transactional
    public ProjectMemberDTO updateMemberRole(Long projectId, Long memberId, ProjectRole newRole, Long userId) {
        // Check if user can manage this project
        validateProjectManagement(projectId, userId);
        
        ProjectMember member = projectMemberRepository.findByProject_ProjectIdAndUser_UserId(projectId, memberId)
            .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy thành viên trong dự án"));
        
        // Cannot change OWNER role
        if (member.isOwner()) {
            throw new ForbiddenException("Không thể thay đổi vai trò của chủ dự án");
        }
        
        member.setRole(newRole);
        member = projectMemberRepository.save(member);
        
        return convertToMemberDTO(member);
    }
    
    // Helper methods
    private void validateProjectAccess(Long projectId, Long userId) {
        projectMemberRepository.findByProject_ProjectIdAndUser_UserId(projectId, userId)
            .orElseThrow(() -> new ProjectAccessDeniedException("Bạn không có quyền truy cập dự án này"));
    }
    
    private void validateProjectManagement(Long projectId, Long userId) {
        ProjectMember member = projectMemberRepository.findByProject_ProjectIdAndUser_UserId(projectId, userId)
            .orElseThrow(() -> new ProjectAccessDeniedException("Bạn không có quyền truy cập dự án này"));
        
        if (!member.canManageProject()) {
            throw new ForbiddenException("Bạn không có quyền quản lý dự án này");
        }
    }
    
    private ProjectDTO convertToDTO(Project project) {
        ProjectDTO dto = new ProjectDTO();
        dto.setProjectId(project.getProjectId());
        dto.setName(project.getName());
        dto.setKeyProject(project.getKeyProject());
        dto.setDescription(project.getDescription());
        dto.setStatus(project.getStatus());
        dto.setStartDate(project.getStartDate());
        dto.setEndDate(project.getEndDate());
        dto.setCreatedBy(project.getCreatedBy().getUserId());
        dto.setCreatedByName(project.getCreatedBy().getUsername());
        
        if (project.getPhongBan() != null) {
            dto.setPhongbanId(project.getPhongBan().getPhongbanId());
            dto.setPhongbanName(project.getPhongBan().getTenPhongBan());
        }
        
        return dto;
    }
    
    private ProjectMemberDTO convertToMemberDTO(ProjectMember member) {
        ProjectMemberDTO dto = new ProjectMemberDTO();
        dto.setId(member.getId());
        dto.setUserId(member.getUser().getUserId());
        dto.setUsername(member.getUser().getUsername());
        dto.setEmail(member.getUser().getEmail());
        dto.setAvatarUrl(member.getUser().getAvatarUrl());
        dto.setRole(member.getRole());
        dto.setJoinedAt(member.getJoinedAt());
        return dto;
    }
}
