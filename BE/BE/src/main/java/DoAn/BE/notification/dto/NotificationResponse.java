package DoAn.BE.notification.dto;

import java.time.LocalDateTime;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponse {
    private Long notificationId;
    private String type;
    private String title;
    private String content;
    private String link;
    private Boolean isRead;
    private LocalDateTime createdAt;
    private Long userId; // Minimal user info if needed

    // Constructor to map from Entity
    public NotificationResponse(Long notificationId, String type, String title, String content, String link,
            Boolean isRead, LocalDateTime createdAt, Long userId) {
        this.notificationId = notificationId;
        this.type = type;
        this.title = title;
        this.content = content;
        this.link = link;
        this.isRead = isRead;
        this.createdAt = createdAt;
        this.userId = userId;
    }
}
