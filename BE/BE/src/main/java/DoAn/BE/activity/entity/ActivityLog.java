package DoAn.BE.activity.entity;

import java.time.LocalDateTime;

import DoAn.BE.user.entity.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "activity_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActivityLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "log_id")
    private Long logId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "action", nullable = false, length = 50)
    private Action action;

    @Column(name = "entity_type", nullable = false, length = 50)
    private String entityType;

    @Column(name = "entity_id", nullable = false)
    private Long entityId;

    @Column(name = "description", length = 500)
    private String description;

    @Column(name = "ip_address", length = 50)
    private String ipAddress;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public enum Action {
        CREATE,
        UPDATE,
        DELETE,
        VIEW
    }

    // Helper methods
    public String getEntityReference() {
        return entityType + "#" + entityId;
    }

    public String getFullDescription() {
        return String.format("%s %s %s", action, entityType, description != null ? description : "");
    }

    public boolean isCreateAction() {
        return action == Action.CREATE;
    }

    public boolean isUpdateAction() {
        return action == Action.UPDATE;
    }

    public boolean isDeleteAction() {
        return action == Action.DELETE;
    }

    public boolean isViewAction() {
        return action == Action.VIEW;
    }
}
