package DoAn.BE.user.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import DoAn.BE.common.exception.EntityNotFoundException;
import DoAn.BE.common.exception.InvalidRequestException;
import DoAn.BE.user.dto.ChangePasswordRequest;
import DoAn.BE.user.dto.UpdateUserRequest;
import DoAn.BE.user.entity.User;
import DoAn.BE.user.repository.UserRepository;
import jakarta.transaction.Transactional;

@Service
@Transactional
public class ProfileService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Profile management
    public User getCurrentUserProfile(Long userId) {
        return userRepository.findById(userId)
            .orElseThrow(() -> new EntityNotFoundException("User không tồn tại"));
    }

    public User updateProfile(Long userId, UpdateUserRequest request) {
        User user = getCurrentUserProfile(userId);

        // Update profile fields (không update username và role)
        if (request.getEmail() != null) {
            user.setEmail(request.getEmail());
        }
        if (request.getPhoneNumber() != null) {
            user.setPhoneNumber(request.getPhoneNumber());
        }
        if (request.getAvatarUrl() != null) {
            user.setAvatarUrl(request.getAvatarUrl());
        }

        return userRepository.save(user);
    }

    public void changePassword(Long userId, ChangePasswordRequest request) {
        User user = getCurrentUserProfile(userId);

        // Verify old password
        if (!passwordEncoder.matches(request.getOldPassword(), user.getPasswordHash())) {
            throw new InvalidRequestException("Mật khẩu cũ không đúng");
        }

        // Set new password
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    public void setUserOnline(Long userId) {
        User user = getCurrentUserProfile(userId);
        user.setOnline();
        userRepository.save(user);
    }

    public void setUserOffline(Long userId) {
        User user = getCurrentUserProfile(userId);
        user.setOffline();
        userRepository.save(user);
    }
}
