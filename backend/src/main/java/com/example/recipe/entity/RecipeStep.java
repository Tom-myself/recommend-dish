package com.example.recipe.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecipeStep {
    private Long id;
    private Long recipeId;
    private String description;
    private Integer stepNumber;
}
