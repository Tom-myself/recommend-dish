package com.example.recipe.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

public record RecipeIngredient(
    Long id,
    Long recipeId,
    String name,
    Integer sortOrder
) {}
