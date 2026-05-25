package com.example.recipe.entity;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

public record RecipeRequest(
    List<String> ingredients,
    String utensils
) {
    public RecipeRequest {
        ingredients = ingredients == null ? List.of() : List.copyOf(ingredients);
    }
}