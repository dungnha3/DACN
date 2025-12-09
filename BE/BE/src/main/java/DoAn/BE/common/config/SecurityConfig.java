package DoAn.BE.common.config;

import DoAn.BE.auth.filter.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    @Autowired
    @Lazy
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authz -> authz
                        // ===== PUBLIC ENDPOINTS =====
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/public/**").permitAll()
                        .requestMatchers("/actuator/**").permitAll()

                        // ===== WEBSOCKET ENDPOINTS =====
                        // Allow WebSocket handshake (SockJS /info, /websocket)
                        // Auth will be checked at STOMP CONNECT level in AuthChannelInterceptor
                        .requestMatchers("/ws/**").permitAll()

                        // ===== ADMIN ENDPOINTS =====
                        // Admin chỉ quản lý user và thông báo, KHÔNG truy cập dữ liệu công ty
                        .requestMatchers("/api/admin/users/**").hasRole("ADMIN")
                        .requestMatchers("/api/admin/role-requests/**").hasRole("ADMIN")
                        .requestMatchers("/api/admin/notifications/**").hasRole("ADMIN")

                        // ===== HR MANAGER ENDPOINTS =====
                        // Allow employees to view their own details via this specific endpoint
                        .requestMatchers("/nhan-vien/user/**")
                        .hasAnyRole("EMPLOYEE", "MANAGER_HR", "MANAGER_ACCOUNTING", "MANAGER_PROJECT")
                        .requestMatchers("/nhan-vien/**").hasAnyRole("MANAGER_HR", "MANAGER_ACCOUNTING")
                        .requestMatchers("/phong-ban/**").hasRole("MANAGER_HR")
                        .requestMatchers("/chuc-vu/**").hasRole("MANAGER_HR")
                        .requestMatchers("/hop-dong/**").hasRole("MANAGER_HR")
                        .requestMatchers("/api/hr/role-change-request/**").hasRole("MANAGER_HR")

                        // ===== ACCOUNTING MANAGER ENDPOINTS =====
                        .requestMatchers("/bang-luong/tinh-tu-dong/**").hasRole("MANAGER_ACCOUNTING")
                        .requestMatchers("/bang-luong/export/**").hasRole("MANAGER_ACCOUNTING")
                        .requestMatchers("/cham-cong/manage/**").hasRole("MANAGER_ACCOUNTING")
                        .requestMatchers("/nghi-phep/approve/**").hasAnyRole("MANAGER_ACCOUNTING", "MANAGER_PROJECT")

                        // ===== PROJECT MANAGER ENDPOINTS =====
                        // Project Manager chỉ truy cập dự án của mình (kiểm tra trong service)
                        .requestMatchers("/api/projects/**").hasAnyRole("MANAGER_PROJECT", "EMPLOYEE")
                        .requestMatchers("/api/issues/**").hasAnyRole("MANAGER_PROJECT", "EMPLOYEE")

                        // ===== EMPLOYEE ENDPOINTS =====
                        // Employee truy cập dữ liệu của chính mình
                        .requestMatchers("/api/profile/**").authenticated()
                        .requestMatchers("/cham-cong/gps")
                        .hasAnyRole("EMPLOYEE", "MANAGER_PROJECT", "MANAGER_HR", "MANAGER_ACCOUNTING")
                        .requestMatchers("/cham-cong/my/**").authenticated()
                        .requestMatchers("/bang-luong/my/**").authenticated()
                        .requestMatchers("/nghi-phep/my/**").authenticated()

                        // ===== CHAT & STORAGE =====
                        // Admin KHÔNG có quyền chat
                        .requestMatchers("/api/chat/**")
                        .hasAnyRole("EMPLOYEE", "MANAGER_HR", "MANAGER_ACCOUNTING", "MANAGER_PROJECT")
                        .requestMatchers("/api/storage/**").authenticated()

                        // ===== AI CHATBOT =====
                        // AI Assistant cho quản lý dự án - tất cả authenticated users (trừ ADMIN)
                        .requestMatchers("/api/ai/status").authenticated()
                        .requestMatchers("/api/ai/**")
                        .hasAnyRole("EMPLOYEE", "MANAGER_HR", "MANAGER_ACCOUNTING", "MANAGER_PROJECT")

                        // ===== NOTIFICATION =====
                        .requestMatchers("/api/notifications/**").authenticated()

                        // All other requests require authentication
                        .anyRequest().authenticated())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}