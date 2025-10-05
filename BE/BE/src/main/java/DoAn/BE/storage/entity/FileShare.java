package DoAn.BE.storage.entity;

import DoAn.BE.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "file_shares")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FileShare {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "share_id")
    private Long shareId;

    @ManyToOne
    @JoinColumn(name = "file_id", nullable = false)
    private File file;

    @ManyToOne
    @JoinColumn(name = "shared_by", nullable = false)
    private User sharedBy;

    @ManyToOne
    @JoinColumn(name = "shared_to")
    private User sharedTo;

    @Enumerated(EnumType.STRING)
    @Column(name = "permission", length = 20)
    private Permission permission = Permission.VIEW;

    @Column(name = "share_token", unique = true, length = 100)
    private String shareToken;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.shareToken == null) {
            this.shareToken = generateShareToken();
        }
    }

    private String generateShareToken() {
        return UUID.randomUUID().toString().replace("-", "");
    }

    public boolean isExpired() {
        return expiresAt != null && expiresAt.isBefore(LocalDateTime.now());
    }

    public boolean isPublicShare() {
        return sharedTo == null;
    }

    public boolean isPrivateShare() {
        return sharedTo != null;
    }

    public boolean canView() {
        return permission == Permission.VIEW || permission == Permission.DOWNLOAD || permission == Permission.EDIT;
    }

    public boolean canDownload() {
        return permission == Permission.DOWNLOAD || permission == Permission.EDIT;
    }

    public boolean canEdit() {
        return permission == Permission.EDIT;
    }

    public void setExpirationDays(int days) {
        this.expiresAt = LocalDateTime.now().plusDays(days);
    }

    public void setExpirationHours(int hours) {
        this.expiresAt = LocalDateTime.now().plusHours(hours);
    }

    public enum Permission {
        VIEW,
        DOWNLOAD,
        EDIT
    }
}
