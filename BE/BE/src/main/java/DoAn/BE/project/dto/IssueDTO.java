package DoAn.BE.project.dto;

import DoAn.BE.project.entity.Issue;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class IssueDTO {
    private Long issueId;
    private String issueKey;
    private String title;
    private String description;
    private Long projectId;
    private String projectName;
    private Long assigneeId;
    private String assigneeName;
    private Long reporterId;
    private String reporterName;
    private Integer statusId;
    private String statusName;
    private Issue.Priority priority;
    private BigDecimal estimatedHours;
    private BigDecimal actualHours;
    private LocalDate dueDate;
    private String createdAt;
    private String updatedAt;
}
