package DoAn.BE.audit.entity;

import DoAn.BE.user.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "audit_log")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuditLog {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long auditId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
    
    @Column(name = "username", nullable = false, columnDefinition = "NVARCHAR(100)")
    private String username;
    
    @Column(name = "action", nullable = false, columnDefinition = "NVARCHAR(100)")
    @Enumerated(EnumType.STRING)
    private ActionType action;
    
    @Column(name = "resource_type", nullable = false, columnDefinition = "NVARCHAR(100)")
    private String resourceType;
    
    @Column(name = "resource_id")
    private Long resourceId;
    
    @Column(name = "description", columnDefinition = "NVARCHAR(MAX)")
    private String description;
    
    @Column(name = "ip_address", columnDefinition = "NVARCHAR(50)")
    private String ipAddress;
    
    @Column(name = "user_agent", columnDefinition = "NVARCHAR(500)")
    private String userAgent;
    
    @Column(name = "session_id", columnDefinition = "NVARCHAR(100)")
    private String sessionId;
    
    @Column(name = "old_values", columnDefinition = "NVARCHAR(MAX)")
    private String oldValues; // JSON string
    
    @Column(name = "new_values", columnDefinition = "NVARCHAR(MAX)")
    private String newValues; // JSON string
    
    @Column(name = "timestamp", nullable = false)
    private LocalDateTime timestamp;
    
    @Column(name = "success")
    private Boolean success = true;
    
    @Column(name = "error_message", columnDefinition = "NVARCHAR(MAX)")
    private String errorMessage;
    
    @PrePersist
    protected void onCreate() {
        timestamp = LocalDateTime.now();
    }
    
    public enum ActionType {
        // Authentication actions
        LOGIN,
        LOGOUT,
        LOGIN_FAILED,
        PASSWORD_CHANGE,
        
        // CRUD operations
        CREATE,
        READ,
        UPDATE,
        DELETE,
        
        // HR specific actions
        APPROVE_LEAVE,
        REJECT_LEAVE,
        APPROVE_SALARY,
        CALCULATE_SALARY,
        EXPORT_DATA,
        
        // Admin actions
        CHANGE_ROLE,
        ACTIVATE_USER,
        DEACTIVATE_USER,
        
        // System actions
        SYSTEM_BACKUP,
        SYSTEM_RESTORE,
        CONFIG_CHANGE,
        
        // File operations
        FILE_UPLOAD,
        FILE_DOWNLOAD,
        FILE_DELETE,
        
        // Chat operations
        SEND_MESSAGE,
        DELETE_MESSAGE,
        CREATE_ROOM,
        
        // Project operations
        CREATE_PROJECT,
        UPDATE_PROJECT,
        DELETE_PROJECT,
        ADD_MEMBER,
        REMOVE_MEMBER
    }
}
