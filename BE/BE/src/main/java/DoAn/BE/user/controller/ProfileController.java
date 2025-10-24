package DoAn.BE.user.controller;

import DoAn.BE.user.dto.ChangePasswordRequest;
import DoAn.BE.user.dto.UpdateUserRequest;
import DoAn.BE.user.dto.UserDTO;
import DoAn.BE.user.entity.User;
import DoAn.BE.user.mapper.UserMapper;
import DoAn.BE.user.service.ProfileService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/profile")
public class ProfileController {
    
    private final ProfileService profileService;
    private final UserMapper userMapper;

    public ProfileController(ProfileService profileService, UserMapper userMapper) {
        this.profileService = profileService;
        this.userMapper = userMapper;
    }
    
    /**
     * Lấy thông tin profile của user hiện tại
     * GET /api/profile
     */
    @GetMapping
    public ResponseEntity<UserDTO> getCurrentUserProfile() {
        Long userId = getCurrentUserId();
        User user = profileService.getCurrentUserProfile(userId);
        return ResponseEntity.ok(userMapper.toDTO(user));
    }
    
    /**
     * Cập nhật profile của user hiện tại
     * PUT /api/profile
     */
    @PutMapping
    public ResponseEntity<UserDTO> updateProfile(@Valid @RequestBody UpdateUserRequest request) {
        Long userId = getCurrentUserId();
        User user = profileService.updateProfile(userId, request);
        return ResponseEntity.ok(userMapper.toDTO(user));
    }
    
    /**
     * Đổi mật khẩu
     * POST /api/profile/change-password
     */
    @PostMapping("/change-password")
    public ResponseEntity<Map<String, String>> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        Long userId = getCurrentUserId();
        profileService.changePassword(userId, request);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Đổi mật khẩu thành công");
        return ResponseEntity.ok(response);
    }
    
    /**
     * Set user online
     * PATCH /api/profile/online
     */
    @PatchMapping("/online")
    public ResponseEntity<Map<String, String>> setOnline() {
        Long userId = getCurrentUserId();
        profileService.setUserOnline(userId);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Đã set online");
        return ResponseEntity.ok(response);
    }
    
    /**
     * Set user offline
     * PATCH /api/profile/offline
     */
    @PatchMapping("/offline")
    public ResponseEntity<Map<String, String>> setOffline() {
        Long userId = getCurrentUserId();
        profileService.setUserOffline(userId);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Đã set offline");
        return ResponseEntity.ok(response);
    }
    
    /**
     * Helper method để lấy userId từ SecurityContext
     * Tạm thời return hardcode ID, sẽ integrate với Spring Security sau
     */
    private Long getCurrentUserId() {
        // TODO: Get from SecurityContext after implementing authentication
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        // Tạm thời return 1L cho testing
        // Trong production, sẽ extract từ JWT token
        if (authentication != null && authentication.isAuthenticated()) {
            // Extract userId from authentication principal
            // return ((UserDetails) authentication.getPrincipal()).getUserId();
        }
        
        return 1L; // Placeholder for testing
    }
}

