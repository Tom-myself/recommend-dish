package com.example.recipe.dto;

import java.util.List;
import lombok.Data;

public record FavoriteChatRequest(
    String question,
    List<FavoriteRecipeDto> recipes
) {
    public FavoriteChatRequest {
        recipes = recipes == null ? List.of() : List.copyOf(recipes);
    }
}
