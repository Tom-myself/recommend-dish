package com.example.recipe.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

public record RecipePoint(
    Long id,
    Long recipeId,
    String description,
    Integer sortOrder
) {}
