package DoAn.BE.project.dto;

import DoAn.BE.project.entity.Issue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateIssueRequest {
    @NotBlank(message = "Tiêu đề không được để trống")
    @Size(max = 255, message = "Tiêu đề không được quá 255 ký tự")
    private String title;
    
    @Size(max = 2000, message = "Mô tả không được quá 2000 ký tự")
    private String description;
    
    private Long projectId;
    private Long assigneeId;
    private Long reporterId;
    private Integer statusId;
    private Issue.Priority priority = Issue.Priority.MEDIUM;
    private BigDecimal estimatedHours;
    private LocalDate dueDate;
}