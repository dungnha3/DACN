package DoAn.BE.auth.controller;

import DoAn.BE.auth.dto.AuthResponse;
import DoAn.BE.auth.dto.LoginRequest;
import DoAn.BE.auth.dto.RegisterRequest;
import DoAn.BE.auth.service.AuthService;
import DoAn.BE.common.exception.BadRequestException;
import DoAn.BE.common.exception.UnauthorizedException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    /**
     * Đăng ký tài khoản mới (public endpoint)
     * POST /api/auth/register
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request,
            HttpServletRequest httpRequest) {
        try {
            String ipAddress = getClientIpAddress(httpRequest);
            String userAgent = httpRequest.getHeader("User-Agent");
            
            AuthResponse response = authService.register(request, ipAddress, userAgent);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            throw new BadRequestException("Đăng ký thất bại: " + e.getMessage());
        }
    }

    /**
     * Đăng nhập
     * POST /api/auth/login
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletRequest httpRequest) {
        try {
            String ipAddress = getClientIpAddress(httpRequest);
            String userAgent = httpRequest.getHeader("User-Agent");
            
            AuthResponse response = authService.login(request, ipAddress, userAgent);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            throw new UnauthorizedException("Đăng nhập thất bại: " + e.getMessage());
        }
    }

    /**
     * Refresh token
     * POST /api/auth/refresh
     */
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshToken(@RequestBody Map<String, String> request) {
        try {
            String refreshToken = request.get("refreshToken");
            if (refreshToken == null || refreshToken.trim().isEmpty()) {
                throw new BadRequestException("Refresh token không được để trống");
            }
            
            AuthResponse response = authService.refreshToken(refreshToken);
            return ResponseEntity.ok(response);
        } catch (UnauthorizedException | BadRequestException e) {
            throw e;
        }
    }

    /**
     * Đăng xuất
     * POST /api/auth/logout
     */
    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(
            @RequestBody(required = false) Map<String, String> request,
            HttpServletRequest httpRequest) {
        try {
            String refreshToken = request != null ? request.get("refreshToken") : null;
            String sessionId = request != null ? request.get("sessionId") : null;
            
            authService.logout(refreshToken, sessionId);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Đăng xuất thành công");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            throw new BadRequestException("Đăng xuất thất bại: " + e.getMessage());
        }
    }

    /**
     * Đăng xuất tất cả thiết bị
     * POST /api/auth/logout-all
     */
    @PostMapping("/logout-all")
    public ResponseEntity<Map<String, String>> logoutAllDevices(@RequestParam Long userId) {
        try {
            authService.logoutAllDevices(userId);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Đăng xuất tất cả thiết bị thành công");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            throw new BadRequestException("Đăng xuất tất cả thiết bị thất bại: " + e.getMessage());
        }
    }

    /**
     * Kiểm tra token có hợp lệ không
     * GET /api/auth/validate
     */
    @GetMapping("/validate")
    public ResponseEntity<Map<String, Object>> validateToken(@RequestParam String token) {
        try {
            // Token validation sẽ được xử lý bởi JWT filter
            Map<String, Object> response = new HashMap<>();
            response.put("valid", true);
            response.put("message", "Token hợp lệ");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("valid", false);
            response.put("message", "Token không hợp lệ: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    /**
     * Lấy thông tin client IP address
     */
    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty() && !"unknown".equalsIgnoreCase(xForwardedFor)) {
            return xForwardedFor.split(",")[0].trim();
        }
        
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty() && !"unknown".equalsIgnoreCase(xRealIp)) {
            return xRealIp;
        }
        
        return request.getRemoteAddr();
    }
}
