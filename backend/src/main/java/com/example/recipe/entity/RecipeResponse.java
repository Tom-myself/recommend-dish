package com.example.recipe.entity;

import java.util.List;

public record RecipeResponse(
        String title,
        List<String> ingredients,
        List<String> steps,
        List<String> points,
        Integer cookingTimeMinutes,
        Integer estimatedCostJpy,
        Integer washingUpScore) {
    public RecipeResponse {
        ingredients = ingredients == null ? List.of() : List.copyOf(ingredients);
        steps = steps == null ? List.of() : List.copyOf(steps);
        points = points == null ? List.of() : List.copyOf(points);

        // JSONに洗い物スコアが含まれていない場合、自動計算してセットする
        if (washingUpScore == null) {
            washingUpScore = WashingUpScore.calculateFromStepsAndIngredients(steps, ingredients).getValue();
        }
    }
}