package DoAn.BE.project.service;

import DoAn.BE.project.entity.Issue;
import DoAn.BE.project.repository.IssueRepository;
import DoAn.BE.notification.service.ProjectNotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * Service xử lý scheduled jobs cho Issue
 * - Check overdue issues daily
 * - Send reminders
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class IssueScheduledService {
    
    private final IssueRepository issueRepository;
    private final ProjectNotificationService projectNotificationService;
    
    /**
     * Check overdue issues mỗi ngày lúc 9:00 AM
     */
    @Scheduled(cron = "0 0 9 * * *")
    @Transactional
    public void checkOverdueIssues() {
        log.info("🔍 Bắt đầu kiểm tra overdue issues...");
        
        LocalDate today = LocalDate.now();
        
        // Get all issues chưa done
        List<Issue> allIssues = issueRepository.findAll();
        
        int overdueCount = 0;
        for (Issue issue : allIssues) {
            // Check if issue is overdue
            if (issue.isOverdue() && issue.getAssignee() != null) {
                try {
                    // Send notification
                    projectNotificationService.createIssueOverdueNotification(
                        issue.getAssignee().getUserId(),
                        issue.getTitle(),
                        issue.getIssueKey()
                    );
                    overdueCount++;
                    log.debug("⚠️ Sent overdue notification for issue: {}", issue.getIssueKey());
                } catch (Exception e) {
                    log.error("Error sending overdue notification for issue {}: {}", 
                        issue.getIssueKey(), e.getMessage());
                }
            }
        }
        
        log.info("✅ Hoàn tất kiểm tra overdue issues. Đã gửi {} notifications", overdueCount);
    }
    
    /**
     * Reminder cho issues sắp đến deadline (3 ngày trước)
     * Chạy mỗi ngày lúc 10:00 AM
     */
    @Scheduled(cron = "0 0 10 * * *")
    @Transactional
    public void remindUpcomingDeadlines() {
        log.info("🔔 Bắt đầu nhắc deadline sắp tới...");
        
        LocalDate threeDaysLater = LocalDate.now().plusDays(3);
        
        List<Issue> allIssues = issueRepository.findAll();
        
        int reminderCount = 0;
        for (Issue issue : allIssues) {
            // Check if deadline is in 3 days and not done
            if (issue.getDueDate() != null && 
                issue.getDueDate().equals(threeDaysLater) && 
                !issue.isDone() &&
                issue.getAssignee() != null) {
                try {
                    projectNotificationService.createIssueUpdatedNotification(
                        issue.getAssignee().getUserId(),
                        issue.getTitle(),
                        "System",
                        "Deadline sắp tới: " + issue.getDueDate()
                    );
                    reminderCount++;
                    log.debug("🔔 Sent deadline reminder for issue: {}", issue.getIssueKey());
                } catch (Exception e) {
                    log.error("Error sending deadline reminder for issue {}: {}", 
                        issue.getIssueKey(), e.getMessage());
                }
            }
        }
        
        log.info("✅ Hoàn tất nhắc deadline. Đã gửi {} reminders", reminderCount);
    }
}
