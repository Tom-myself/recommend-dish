package com.example.recipe.entity;

import java.util.List;
import lombok.Data;

@Data
public class Recipe {
    private Long id;
    private String title;
    private List<RecipeIngredient> ingredients;
    private List<RecipeStep> steps;
    private List<RecipePoint> points;
    private Integer cookingTimeMinutes;
    private Integer estimatedCostJpy;
}
