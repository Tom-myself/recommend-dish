package com.example.recipe.entity;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

public record RecipeResponse(
    String title,
    List<String> ingredients,
    List<String> steps,
    List<String> points,
    Integer cookingTimeMinutes,
    Integer estimatedCostJpy
) {
    public RecipeResponse {
        ingredients = ingredients == null ? List.of() : List.copyOf(ingredients);
        steps = steps == null ? List.of() : List.copyOf(steps);
        points = points == null ? List.of() : List.copyOf(points);
    }
}