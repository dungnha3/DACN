package DoAn.BE.storage.repository;

import DoAn.BE.storage.entity.Folder;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FolderRepository extends JpaRepository<Folder, Long> {
    List<Folder> findByOwner_UserId(Long userId);
    List<Folder> findByParentFolder_FolderId(Long parentFolderId);
    List<Folder> findByProject_ProjectId(Long projectId);
}


