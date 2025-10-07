package DoAn.BE.chat.repository;

import DoAn.BE.chat.entity.ChatRoom;
import DoAn.BE.project.entity.Project;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    List<ChatRoom> findByProject(Project project);
    List<ChatRoom> findByCreatedBy_UserId(Long userId);
    Optional<ChatRoom> findByRoomId(Long roomId);
}


