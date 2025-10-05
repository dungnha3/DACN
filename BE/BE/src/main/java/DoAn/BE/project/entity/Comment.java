package DoAn.BE.project.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.*;

import DoAn.BE.user.entity.User;

@Entity
@Table(name = "comments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Comment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "comment_id")
    private Long commentId;

    @ManyToOne
    @JoinColumn(name = "issue_id", nullable = false)
    private Issue issue;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, columnDefinition = "NVARCHAR(MAX)")
    private String content;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "is_deleted", nullable = false)
    private Boolean isDeleted = false;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Constructor
    public Comment(Issue issue, User user, String content) {
        this.issue = issue;
        this.user = user;
        this.content = content;
    }

    // Helper methods
    public void softDelete() {
        this.isDeleted = true;
        this.updatedAt = LocalDateTime.now();
    }

    public boolean canEdit(User currentUser) {
        return this.user.getUserId().equals(currentUser.getUserId());
    }
}

