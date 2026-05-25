package com.example.recipe.controller;

import com.example.recipe.dto.AuthResponse;
import com.example.recipe.dto.LoginRequest;
import com.example.recipe.dto.RegisterRequest;
import com.example.recipe.entity.User;
import com.example.recipe.repository.UserMapper;
import com.example.recipe.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (userMapper.findByUsername(request.username()) != null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username already exists");
        }
        if (userMapper.findByEmail(request.email()) != null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email already exists");
        }

        User user = new User(
            null,
            request.username(),
            request.email(),
            passwordEncoder.encode(request.password()),
            null
        );

        Long newId = userMapper.insert(user);
        user = new User(newId, user.username(), user.email(), user.passwordHash(), user.createdAt());

        String token = jwtUtil.generateToken(user.id(), user.username());
        return ResponseEntity.ok(new AuthResponse(token, user.username(), user.id()));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        User user = userMapper.findByUsername(request.username());

        if (user == null || !passwordEncoder.matches(request.password(), user.passwordHash())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }

        String token = jwtUtil.generateToken(user.id(), user.username());
        return ResponseEntity.ok(new AuthResponse(token, user.username(), user.id()));
    }
}
