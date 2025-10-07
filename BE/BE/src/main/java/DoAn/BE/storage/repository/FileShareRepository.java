package DoAn.BE.storage.repository;

import DoAn.BE.storage.entity.FileShare;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FileShareRepository extends JpaRepository<FileShare, Long> {
    List<FileShare> findByFile_FileId(Long fileId);
    List<FileShare> findBySharedBy_UserId(Long userId);
    List<FileShare> findBySharedTo_UserId(Long userId);
    Optional<FileShare> findByShareToken(String shareToken);
}


