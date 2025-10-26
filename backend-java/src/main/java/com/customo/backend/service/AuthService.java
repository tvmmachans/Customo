package com.customo.backend.service;

import com.customo.backend.dto.*;
import com.customo.backend.entity.User;
import com.customo.backend.repository.UserRepository;
import com.customo.backend.util.JwtUtil;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder(12);
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    public AuthResponse register(RegisterRequest req) {
        Optional<User> existing = userRepository.findByEmail(req.email);
        if (existing.isPresent()) throw new IllegalArgumentException("User already exists");

        User u = new User();
        u.setId(UUID.randomUUID().toString());
        u.setEmail(req.email);
        u.setPassword(passwordEncoder.encode(req.password));
        u.setFirstName(req.firstName);
        u.setLastName(req.lastName);
        u.setPhone(req.phone);
        u.setCompany(req.company);
        userRepository.save(u);

        AuthResponse resp = new AuthResponse();
        resp.token = jwtUtil.generateToken(u.getId(), u.getEmail());
        AuthResponse.UserDTO userDTO = new AuthResponse.UserDTO();
        userDTO.id = u.getId(); userDTO.email = u.getEmail(); userDTO.firstName = u.getFirstName();
        userDTO.lastName = u.getLastName(); userDTO.phone = u.getPhone(); userDTO.company = u.getCompany();
        userDTO.role = u.getRole();
        resp.user = userDTO;
        return resp;
    }

    public AuthResponse login(AuthRequest req) {
        User u = userRepository.findByEmail(req.email).orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));
        if (!u.isActive()) throw new IllegalArgumentException("Invalid credentials");
        if (!passwordEncoder.matches(req.password, u.getPassword())) throw new IllegalArgumentException("Invalid credentials");
        AuthResponse resp = new AuthResponse();
        resp.token = jwtUtil.generateToken(u.getId(), u.getEmail());
        AuthResponse.UserDTO userDTO = new AuthResponse.UserDTO();
        userDTO.id = u.getId(); userDTO.email = u.getEmail(); userDTO.firstName = u.getFirstName();
        userDTO.lastName = u.getLastName(); userDTO.phone = u.getPhone(); userDTO.company = u.getCompany();
        userDTO.role = u.getRole();
        resp.user = userDTO;
        return resp;
    }

    public User findById(String id) {
        return userRepository.findById(id).orElse(null);
    }

    public User updateProfile(String id, ProfileUpdateRequest req) {
        User u = userRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("User not found"));
        u.setFirstName(req.firstName);
        u.setLastName(req.lastName);
        u.setPhone(req.phone);
        u.setCompany(req.company);
        return userRepository.save(u);
    }

    public void changePassword(String id, ChangePasswordRequest req) {
        User u = userRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("User not found"));
        if (!passwordEncoder.matches(req.currentPassword, u.getPassword())) throw new IllegalArgumentException("Current password is incorrect");
        u.setPassword(passwordEncoder.encode(req.newPassword));
        userRepository.save(u);
    }
}
