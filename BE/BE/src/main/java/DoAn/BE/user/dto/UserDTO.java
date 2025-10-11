package DoAn.BE.user.dto;

import java.time.LocalDateTime;

import DoAn.BE.user.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long userId;
    private String username;
    private String email;
    private String phoneNumber;
    private String avatarUrl;
    private User.Role role;
    private Boolean isActive;
    private Boolean isOnline;
    private LocalDateTime lastSeen;
    private LocalDateTime createdAt;
    private LocalDateTime lastLogin;
}



