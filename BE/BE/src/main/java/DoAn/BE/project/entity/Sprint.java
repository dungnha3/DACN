package DoAn.BE.project.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "sprints")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Sprint {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "sprint_id")
    private Long sprintId;

    @ManyToOne
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Column(nullable = false, length = 100)
    private String name;  // VD: Sprint 1, Sprint Oct 2025

    @Column(length = 500)
    private String goal;  // Mục tiêu sprint

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    @Column(length = 30, nullable = false)
    private SprintStatus status = SprintStatus.PLANNED;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // Relationships
    @OneToMany(mappedBy = "sprint")
    @JsonIgnore
    private List<Issue> issues;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // Helper methods
    public boolean isActive() {
        return this.status == SprintStatus.ACTIVE;
    }

    public boolean isCompleted() {
        return this.status == SprintStatus.COMPLETED;
    }

    public long getDurationDays() {
        return java.time.temporal.ChronoUnit.DAYS.between(startDate, endDate);
    }

    public boolean isOverdue() {
        return this.status == SprintStatus.ACTIVE && 
               LocalDate.now().isAfter(this.endDate);
    }

    // Enum
    public enum SprintStatus {
        PLANNED,    // Lên kế hoạch
        ACTIVE,     // Đang chạy
        COMPLETED   // Đã hoàn thành
    }
}

