package com.example.recipe.entity;

import java.time.LocalDate;

public record CookingLog(
        Long id,
        Long userId,
        Long recipeId,
        LocalDate cookedDate) {

}
