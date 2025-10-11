package DoAn.BE.user.dto;

import DoAn.BE.user.entity.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserRequest {
    @Size(min = 3, max = 50, message = "Username phải từ 3-50 ký tự")
    private String username;
    
    @Email(message = "Email không hợp lệ")
    private String email;
    
    @Size(max = 15, message = "Số điện thoại không được quá 15 ký tự")
    private String phoneNumber;
    
    @Size(max = 500, message = "Avatar URL không được quá 500 ký tự")
    private String avatarUrl;
    
    private User.Role role;
    
    private Boolean isActive;
}



