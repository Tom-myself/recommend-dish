package com.example.recipe.dto;

public record RegisterRequest(
    String username,
    String email,
    String password
) {}
