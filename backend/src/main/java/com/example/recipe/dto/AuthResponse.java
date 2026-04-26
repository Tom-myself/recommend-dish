package com.example.recipe.dto;

public record AuthResponse(
    String token,
    String username,
    Long id
) {}
