package DoAn.BE.project.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "issue_types")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class IssueType {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "type_id")
    private Integer typeId;

    @Column(nullable = false, unique = true, length = 50)
    private String name;  // Task, Bug, Story, Epic

    @Column(length = 50)
    private String icon;  // Emoji hoặc icon class

    @Column(length = 7)
    private String color;  // Hex color: #4BADE8

    // Relationships
    @OneToMany(mappedBy = "issueType")
    @JsonIgnore
    private List<Issue> issues;

    // Constructor
    public IssueType(String name, String icon, String color) {
        this.name = name;
        this.icon = icon;
        this.color = color;
    }
}

