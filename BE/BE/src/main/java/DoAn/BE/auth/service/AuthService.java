package DoAn.BE.auth.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import DoAn.BE.auth.dto.AuthResponse;
import DoAn.BE.auth.dto.LoginRequest;
import DoAn.BE.auth.dto.RegisterRequest;
import DoAn.BE.auth.entity.LoginAttempt;
import DoAn.BE.auth.entity.RefreshToken;
import DoAn.BE.auth.repository.LoginAttemptRepository;
import DoAn.BE.auth.repository.RefreshTokenRepository;
import DoAn.BE.common.exception.DuplicateException;
import DoAn.BE.common.exception.UnauthorizedException;
import DoAn.BE.user.dto.CreateUserRequest;
import DoAn.BE.user.entity.User;
import DoAn.BE.user.service.UserService;

@Service
@Transactional
public class AuthService {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private SessionService sessionService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private LoginAttemptRepository loginAttemptRepository;

    private static final int MAX_LOGIN_ATTEMPTS = 5;
    private static final int LOCKOUT_DURATION_MINUTES = 15;

    /**
     * Đăng ký user mới (public endpoint)
     */
    public AuthResponse register(RegisterRequest request, String ipAddress, String userAgent) {
        // Kiểm tra username đã tồn tại
        if (userService.existsByUsername(request.getUsername())) {
            throw new DuplicateException("Username đã tồn tại");
        }

        // Kiểm tra email đã tồn tại
        if (userService.existsByEmail(request.getEmail())) {
            throw new DuplicateException("Email đã tồn tại");
        }

        // Tạo user mới
        CreateUserRequest createUserRequest = new CreateUserRequest();
        createUserRequest.setUsername(request.getUsername());
        createUserRequest.setPassword(request.getPassword());
        createUserRequest.setEmail(request.getEmail());
        createUserRequest.setPhoneNumber(request.getPhoneNumber());
        createUserRequest.setRole(request.getRole() != null ? request.getRole() : User.Role.EMPLOYEE);

        User user = userService.createUser(createUserRequest);

        // Tạo session
        sessionService.createSession(user, ipAddress, userAgent);

        // Tạo tokens
        String accessToken = jwtService.generateToken(user);
        String refreshToken = createRefreshToken(user);

        return buildAuthResponse(accessToken, refreshToken, user);
    }

    /**
     * Đăng nhập
     */
    public AuthResponse login(LoginRequest request, String ipAddress, String userAgent) {
        // Kiểm tra login attempts
        checkLoginAttempts(request.getUsername(), ipAddress);

        // Tìm user
        User user = userService.findByUsername(request.getUsername())
                .orElseThrow(() -> new UnauthorizedException("Thông tin đăng nhập không chính xác"));

        // Kiểm tra user có active không
        if (!user.getIsActive()) {
            recordFailedLogin(request.getUsername(), ipAddress, "Tài khoản đã bị vô hiệu hóa");
            throw new UnauthorizedException("Tài khoản đã bị vô hiệu hóa");
        }

        // Kiểm tra password
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            recordFailedLogin(request.getUsername(), ipAddress, "Mật khẩu không chính xác");
            throw new UnauthorizedException("Thông tin đăng nhập không chính xác");
        }

        // Xóa failed attempts
        clearFailedAttempts(request.getUsername(), ipAddress);

        // Cập nhật last login
        user.setLastLogin(LocalDateTime.now());
        user.setIsOnline(true);
        userService.save(user);

        // Tạo session
        sessionService.createSession(user, ipAddress, userAgent);

        // Tạo tokens
        String accessToken = jwtService.generateToken(user);
        String refreshToken = createRefreshToken(user);

        return buildAuthResponse(accessToken, refreshToken, user);
    }

    /**
     * Refresh token
     */
    public AuthResponse refreshToken(String refreshTokenString) {
        // Validate refresh token
        if (!jwtService.validateToken(refreshTokenString) || !jwtService.isRefreshToken(refreshTokenString)) {
            throw new UnauthorizedException("Refresh token không hợp lệ");
        }

        // Tìm refresh token trong database
        RefreshToken refreshToken = refreshTokenRepository.findByToken(refreshTokenString)
                .orElseThrow(() -> new UnauthorizedException("Refresh token không tồn tại"));

        if (!refreshToken.isValid()) {
            throw new UnauthorizedException("Refresh token đã hết hạn hoặc bị thu hồi");
        }

        User user = refreshToken.getUser();
        if (!user.getIsActive()) {
            throw new UnauthorizedException("Tài khoản đã bị vô hiệu hóa");
        }

        // Tạo access token mới
        String newAccessToken = jwtService.generateToken(user);

        // Tạo refresh token mới (rotate)
        refreshTokenRepository.delete(refreshToken);
        String newRefreshToken = createRefreshToken(user);

        return buildAuthResponse(newAccessToken, newRefreshToken, user);
    }

    /**
     * Đăng xuất
     */
    public void logout(String refreshTokenString, String sessionId) {
        // Revoke refresh token
        if (refreshTokenString != null) {
            refreshTokenRepository.findByToken(refreshTokenString)
                    .ifPresent(token -> {
                        token.setIsRevoked(true);
                        refreshTokenRepository.save(token);
                    });
        }

        // Deactivate session
        if (sessionId != null) {
            sessionService.deactivateSession(sessionId);
        }
    }

    /**
     * Đăng xuất tất cả thiết bị
     */
    public void logoutAllDevices(Long userId) {
        User user = userService.getUserById(userId);

        // Revoke tất cả refresh tokens
        refreshTokenRepository.revokeAllTokensByUser(user);

        // Deactivate tất cả sessions
        sessionService.deactivateAllUserSessions(user);

        // Set user offline
        user.setIsOnline(false);
        userService.save(user);
    }

    /**
     * Tạo refresh token
     */
    private String createRefreshToken(User user) {
        // Xóa refresh token cũ của user (nếu có)
        List<RefreshToken> existingTokens = refreshTokenRepository.findValidTokensByUser(user, LocalDateTime.now());
        refreshTokenRepository.deleteAll(existingTokens);

        // Tạo refresh token mới
        String tokenString = jwtService.generateRefreshToken(user);

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setToken(tokenString);
        refreshToken.setUser(user);
        refreshToken.setExpiresAt(LocalDateTime.now().plusSeconds(jwtService.getRefreshExpiration() / 1000));
        refreshToken.setIsRevoked(false);

        refreshTokenRepository.save(refreshToken);

        return tokenString;
    }

    /**
     * Kiểm tra login attempts
     */
    private void checkLoginAttempts(String username, String ipAddress) {
        LocalDateTime cutoffTime = LocalDateTime.now().minusMinutes(LOCKOUT_DURATION_MINUTES);

        long recentAttempts = loginAttemptRepository.countRecentFailedAttempts(username, ipAddress, cutoffTime);

        if (recentAttempts >= MAX_LOGIN_ATTEMPTS) {
            throw new UnauthorizedException("Tài khoản tạm thời bị khóa do đăng nhập sai quá nhiều lần");
        }
    }

    /**
     * Ghi lại login thất bại
     */
    private void recordFailedLogin(String username, String ipAddress, String reason) {
        LoginAttempt attempt = new LoginAttempt();
        attempt.setUsername(username);
        attempt.setIpAddress(ipAddress);
        attempt.setAttemptedAt(LocalDateTime.now());
        attempt.setSuccess(false);
        attempt.setFailureReason(reason);

        loginAttemptRepository.save(attempt);
    }

    /**
     * Xóa failed attempts
     */
    private void clearFailedAttempts(String username, String ipAddress) {
        loginAttemptRepository.deleteByUsernameAndIpAddress(username, ipAddress);
    }

    /**
     * Xây dựng AuthResponse
     */
    private AuthResponse buildAuthResponse(String accessToken, String refreshToken, User user) {
        AuthResponse response = new AuthResponse();
        response.setAccessToken(accessToken);
        response.setRefreshToken(refreshToken);
        response.setTokenType("Bearer");
        response.setExpiresIn(jwtService.getJwtExpiration() / 1000); // Convert to seconds

        AuthResponse.UserInfo userInfo = new AuthResponse.UserInfo();
        userInfo.setUserId(user.getUserId());
        userInfo.setUsername(user.getUsername());
        userInfo.setEmail(user.getEmail());
        userInfo.setRole(user.getRole());
        userInfo.setIsActive(user.getIsActive());

        response.setUser(userInfo);
        return response;
    }
}
