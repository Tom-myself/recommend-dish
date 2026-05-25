package com.example.recipe.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

public record User(
    Long id,
    String username,
    String email,
    String passwordHash,
    LocalDateTime createdAt
) {}
