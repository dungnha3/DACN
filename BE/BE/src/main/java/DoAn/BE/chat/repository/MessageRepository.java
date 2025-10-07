package DoAn.BE.chat.repository;

import DoAn.BE.chat.entity.Message;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByChatRoom_RoomIdOrderBySentAtAsc(Long roomId);
    List<Message> findBySender_UserId(Long userId);
}


