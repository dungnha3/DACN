package DoAn.BE.project.mapper;

import DoAn.BE.project.dto.IssueDTO;
import DoAn.BE.project.entity.Issue;
import org.springframework.stereotype.Component;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class IssueMapper {

    private static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    public IssueDTO toDTO(Issue issue) {
        if (issue == null) {
            return null;
        }

        IssueDTO dto = new IssueDTO();
        dto.setIssueId(issue.getIssueId());
        dto.setIssueKey(issue.getIssueKey());
        dto.setTitle(issue.getTitle());
        dto.setDescription(issue.getDescription());
        dto.setPriority(issue.getPriority());
        dto.setEstimatedHours(issue.getEstimatedHours());
        dto.setActualHours(issue.getActualHours());
        dto.setDueDate(issue.getDueDate());

        // Set project info
        if (issue.getProject() != null) {
            dto.setProjectId(issue.getProject().getProjectId());
            dto.setProjectName(issue.getProject().getName());
        }

        // Set assignee info
        if (issue.getAssignee() != null) {
            dto.setAssigneeId(issue.getAssignee().getUserId());
            dto.setAssigneeName(issue.getAssignee().getUsername());
        }

        // Set reporter info
        if (issue.getReporter() != null) {
            dto.setReporterId(issue.getReporter().getUserId());
            dto.setReporterName(issue.getReporter().getUsername());
        }

        // Set status info
        if (issue.getIssueStatus() != null) {
            dto.setStatusId(issue.getIssueStatus().getStatusId());
            dto.setStatusName(issue.getIssueStatus().getName());
        }

        // Set timestamps
        if (issue.getCreatedAt() != null) {
            dto.setCreatedAt(issue.getCreatedAt().format(DATE_TIME_FORMATTER));
        }
        if (issue.getUpdatedAt() != null) {
            dto.setUpdatedAt(issue.getUpdatedAt().format(DATE_TIME_FORMATTER));
        }

        return dto;
    }

    public List<IssueDTO> toDTOList(List<Issue> issues) {
        if (issues == null) {
            return null;
        }

        return issues.stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }
}
