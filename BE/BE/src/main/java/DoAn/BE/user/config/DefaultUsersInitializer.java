package DoAn.BE.user.config;

import DoAn.BE.user.dto.CreateUserRequest;
import DoAn.BE.user.entity.User;
import DoAn.BE.user.repository.UserRepository;
import DoAn.BE.user.service.UserService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DefaultUsersInitializer {

    @Bean
    CommandLineRunner initDefaultUsers(UserService userService,
                                       UserRepository userRepository,
                                       PasswordEncoder passwordEncoder) {
        return args -> {
            upsertUser(userService, userRepository, passwordEncoder,
                    "admin", "Admin@123", "admin@example.com", User.Role.ADMIN);
            upsertUser(userService, userRepository, passwordEncoder,
                    "manager", "Manager@123", "manager@example.com", User.Role.MANAGER);
            upsertUser(userService, userRepository, passwordEncoder,
                    "employee", "Employee@123", "employee@example.com", User.Role.EMPLOYEE);
        };
    }

    private void upsertUser(UserService userService,
                            UserRepository userRepository,
                            PasswordEncoder passwordEncoder,
                            String username,
                            String password,
                            String email,
                            User.Role role) {
        userRepository.findByUsername(username).ifPresentOrElse(existing -> {
            existing.setRole(role);
            existing.setIsActive(true);
            existing.setPasswordHash(passwordEncoder.encode(password));
            if (email != null && (existing.getEmail() == null || !existing.getEmail().equals(email))) {
                existing.setEmail(email);
            }
            userRepository.save(existing);
            System.out.println("🔁 Đã cập nhật tài khoản mặc định: " + username + " (" + role + ")");
        }, () -> {
            CreateUserRequest req = new CreateUserRequest();
            req.setUsername(username);
            req.setPassword(password);
            req.setEmail(email);
            req.setPhoneNumber(null);
            req.setRole(role);
            userService.createUser(req);
            System.out.println("✅ Đã tạo tài khoản mặc định: " + username + " (" + role + ")");
        });
    }
}
