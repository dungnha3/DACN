package DoAn.BE.storage.entity;

import DoAn.BE.user.entity.User;
import DoAn.BE.project.entity.Project;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "folders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Folder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "folder_id")
    private Long folderId;

    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @ManyToOne
    @JoinColumn(name = "parent_folder_id")
    private Folder parentFolder;

    @ManyToOne
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @Enumerated(EnumType.STRING)
    @Column(name = "folder_type", length = 20)
    private FolderType folderType = FolderType.PERSONAL;

    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "parentFolder", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Folder> subFolders;

    @OneToMany(mappedBy = "folder", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<File> files;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public String getFullPath() {
        if (parentFolder != null) {
            return parentFolder.getFullPath() + "/" + name;
        }
        return name;
    }

    public boolean isRoot() {
        return parentFolder == null;
    }

    public boolean isProjectFolder() {
        return folderType == FolderType.PROJECT;
    }

    public boolean isSharedFolder() {
        return folderType == FolderType.SHARED;
    }

    public enum FolderType {
        PERSONAL,
        SHARED,
        PROJECT
    }
}
