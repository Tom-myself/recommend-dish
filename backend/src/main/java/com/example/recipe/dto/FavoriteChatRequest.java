package com.example.recipe.dto;

import java.util.List;
import lombok.Data;

@Data
public class FavoriteChatRequest {
    private String question;
    private List<FavoriteRecipeDto> recipes;
}
