package com.example.recipe.dto;

import java.util.List;
import lombok.Data;

@Data
public class FavoriteRecipeDto {
    private Long id;
    private String title;
    private Integer cookingTimeMinutes;
    private Integer estimatedCostJpy;
    private List<String> ingredients;
    private List<String> steps;
    private List<String> points;
}
