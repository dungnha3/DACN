package DoAn.BE.notification.service;

import DoAn.BE.notification.entity.Notification;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

// Service quản lý thông báo dự án (project, issue, sprint)
@Service
@Transactional
@RequiredArgsConstructor
public class ProjectNotificationService {

    private final NotificationService notificationService;
    
    /**
     * Tạo notification khi được thêm vào project
     */
    public Notification createProjectMemberAddedNotification(Long userId, String projectName) {
        String title = "Được thêm vào dự án";
        String content = "Bạn đã được thêm vào dự án \"" + projectName + "\"";
        String link = "/projects";
        return notificationService.createNotification(userId, "PROJECT_MEMBER_ADDED", title, content, link);
    }
    
    /**
     * Tạo notification khi issue được assign
     */
    public Notification createIssueAssignedNotification(Long userId, String issueTitle, String projectName) {
        String title = "Issue mới được giao";
        String content = "Bạn được giao issue \"" + issueTitle + "\" trong dự án \"" + projectName + "\"";
        String link = "/projects/issues";
        return notificationService.createNotification(userId, "PROJECT_ISSUE_ASSIGNED", title, content, link);
    }
    
    /**
     * Tạo notification khi có comment mới trên issue
     */
    public Notification createIssueCommentNotification(Long userId, String commenterName, String issueTitle) {
        String title = "Comment mới trên issue";
        String content = commenterName + " đã comment trên issue \"" + issueTitle + "\"";
        String link = "/projects/issues";
        return notificationService.createNotification(userId, "PROJECT_ISSUE_COMMENT", title, content, link);
    }
    
    /**
     * Tạo notification khi issue thay đổi status
     */
    public Notification createIssueStatusChangedNotification(Long userId, String issueTitle, String newStatus) {
        String title = "Trạng thái issue thay đổi";
        String content = "Issue \"" + issueTitle + "\" đã chuyển sang trạng thái: " + newStatus;
        String link = "/projects/issues";
        return notificationService.createNotification(userId, "PROJECT_ISSUE_STATUS", title, content, link);
    }
    
    /**
     * Tạo notification khi sprint sắp kết thúc
     */
    public Notification createSprintEndingNotification(Long userId, String sprintName, String endDate) {
        String title = "Sprint sắp kết thúc";
        String content = "Sprint \"" + sprintName + "\" sẽ kết thúc vào " + endDate;
        String link = "/projects/sprints";
        return notificationService.createNotification(userId, "PROJECT_SPRINT_ENDING", title, content, link);
    }
}
