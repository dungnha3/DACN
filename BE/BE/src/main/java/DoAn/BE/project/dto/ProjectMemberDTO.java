package DoAn.BE.project.dto;

import DoAn.BE.project.entity.ProjectMember;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProjectMemberDTO {
    private Long id;
    private Long projectId;
    private String projectName;
    private Long userId;
    private String userName;
    private ProjectMember.ProjectRole role;
    private String joinedAt;
}
