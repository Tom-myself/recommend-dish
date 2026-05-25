package com.example.recipe.dto;

import java.util.List;

/**
 * お気に入りレシピの検索結果DTO（不変）。
 * Mapper は Entity を返し、Service がこの DTO に変換する。
 */
public record FavoriteRecipeDto(
    Long id,
    String title,
    Integer cookingTimeMinutes,
    Integer estimatedCostJpy,
    List<String> ingredients,
    List<String> steps,
    List<String> points
) {
    public FavoriteRecipeDto {
        ingredients = ingredients == null ? List.of() : List.copyOf(ingredients);
        steps = steps == null ? List.of() : List.copyOf(steps);
        points = points == null ? List.of() : List.copyOf(points);
    }
}
