package com.customo.backend.controller;

import com.customo.backend.dto.*;
import com.customo.backend.entity.User;
import com.customo.backend.service.AuthService;
import com.customo.backend.util.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;
    private final JwtUtil jwtUtil;

    public AuthController(AuthService authService, JwtUtil jwtUtil) {
        this.authService = authService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        try {
            AuthResponse resp = authService.register(req);
            return ResponseEntity.status(201).body(Map.of("success", true, "data", Map.of("user", resp.user, "token", resp.token)));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest req) {
        try {
            AuthResponse resp = authService.login(req);
            return ResponseEntity.ok(Map.of("success", true, "data", Map.of("user", resp.user, "token", resp.token)));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(401).body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(@RequestHeader(value = "Authorization", required = false) String auth) {
        try {
            if (auth == null || !auth.startsWith("Bearer ")) return ResponseEntity.status(401).body(Map.of("success", false, "message", "No token provided"));
            String token = auth.replace("Bearer ", "");
            String userId = jwtUtil.getUserIdFromToken(token);
            User u = authService.findById(userId);
            if (u == null) return ResponseEntity.status(401).body(Map.of("success", false, "message", "User not found or inactive"));
            return ResponseEntity.ok(Map.of("success", true, "data", Map.of("user", Map.of(
                "id", u.getId(), "email", u.getEmail(), "firstName", u.getFirstName(), "lastName", u.getLastName(), "phone", u.getPhone(), "company", u.getCompany(), "role", u.getRole(), "createdAt", u.getCreatedAt()
            ))));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("success", false, "message", "Invalid token"));
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestHeader(value = "Authorization", required = false) String auth, @RequestBody ProfileUpdateRequest req) {
        try {
            if (auth == null || !auth.startsWith("Bearer ")) return ResponseEntity.status(401).body(Map.of("success", false, "message", "No token provided"));
            String token = auth.replace("Bearer ", "");
            String userId = jwtUtil.getUserIdFromToken(token);
            User u = authService.updateProfile(userId, req);
            return ResponseEntity.ok(Map.of("success", true, "message", "Profile updated successfully", "data", Map.of("user", Map.of("id", u.getId(), "email", u.getEmail(), "firstName", u.getFirstName(), "lastName", u.getLastName(), "phone", u.getPhone(), "company", u.getCompany(), "role", u.getRole(), "updatedAt", u.getUpdatedAt()))));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(Map.of("success", false, "message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("success", false, "message", "Internal server error"));
        }
    }

    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestHeader(value = "Authorization", required = false) String auth, @RequestBody ChangePasswordRequest req) {
        try {
            if (auth == null || !auth.startsWith("Bearer ")) return ResponseEntity.status(401).body(Map.of("success", false, "message", "No token provided"));
            String token = auth.replace("Bearer ", "");
            String userId = jwtUtil.getUserIdFromToken(token);
            authService.changePassword(userId, req);
            return ResponseEntity.ok(Map.of("success", true, "message", "Password changed successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(Map.of("success", false, "message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("success", false, "message", "Internal server error"));
        }
    }
}
