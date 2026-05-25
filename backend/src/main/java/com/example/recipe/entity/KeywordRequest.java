package com.example.recipe.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

public record KeywordRequest(
    String keyword,
    String utensils
) {}
