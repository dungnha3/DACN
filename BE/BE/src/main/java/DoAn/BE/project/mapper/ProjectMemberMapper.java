package DoAn.BE.project.mapper;

import DoAn.BE.project.dto.ProjectMemberDTO;
import DoAn.BE.project.entity.ProjectMember;
import org.springframework.stereotype.Component;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class ProjectMemberMapper {

    private static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    public ProjectMemberDTO toDTO(ProjectMember member) {
        if (member == null) {
            return null;
        }

        ProjectMemberDTO dto = new ProjectMemberDTO();
        dto.setId(member.getId());
        dto.setRole(member.getRole());

        // Set project info
        if (member.getProject() != null) {
            dto.setProjectId(member.getProject().getProjectId());
            dto.setProjectName(member.getProject().getName());
        }

        // Set user info
        if (member.getUser() != null) {
            dto.setUserId(member.getUser().getUserId());
            dto.setUserName(member.getUser().getUsername());
        }

        // Set joined date
        if (member.getJoinedAt() != null) {
            dto.setJoinedAt(member.getJoinedAt().format(DATE_TIME_FORMATTER));
        }

        return dto;
    }

    public List<ProjectMemberDTO> toDTOList(List<ProjectMember> members) {
        if (members == null) {
            return null;
        }

        return members.stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }
}
