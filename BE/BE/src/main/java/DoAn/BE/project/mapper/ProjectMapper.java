package DoAn.BE.project.mapper;

import DoAn.BE.project.dto.ProjectDTO;
import DoAn.BE.project.entity.Project;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class ProjectMapper {

    public ProjectDTO toDTO(Project project) {
        if (project == null) {
            return null;
        }

        ProjectDTO dto = new ProjectDTO();
        dto.setProjectId(project.getProjectId());
        dto.setName(project.getName());
        dto.setKeyProject(project.getKeyProject());
        dto.setDescription(project.getDescription());
        dto.setStatus(project.getStatus());
        dto.setStartDate(project.getStartDate());
        dto.setEndDate(project.getEndDate());
        
        // Set phòng ban info
        if (project.getPhongBan() != null) {
            dto.setPhongbanId(project.getPhongBan().getPhongbanId());
            dto.setPhongbanName(project.getPhongBan().getTenPhongBan());
        }
        
        // Set creator info
        if (project.getCreatedBy() != null) {
            dto.setCreatedBy(project.getCreatedBy().getUserId());
            dto.setCreatedByName(project.getCreatedBy().getUsername());
        }

        return dto;
    }

    public List<ProjectDTO> toDTOList(List<Project> projects) {
        if (projects == null) {
            return null;
        }

        return projects.stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }

    public Project toEntity(ProjectDTO dto) {
        if (dto == null) {
            return null;
        }

        Project project = new Project();
        project.setProjectId(dto.getProjectId());
        project.setName(dto.getName());
        project.setKeyProject(dto.getKeyProject());
        project.setDescription(dto.getDescription());
        project.setStatus(dto.getStatus());
        project.setStartDate(dto.getStartDate());
        project.setEndDate(dto.getEndDate());

        return project;
    }
}
