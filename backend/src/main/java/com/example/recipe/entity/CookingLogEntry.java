package com.example.recipe.entity;

import java.time.LocalDate;

/**
 * Mapper が返す料理ログの結果（recipes テーブルと JOIN した情報を含む）。
 */
public record CookingLogEntry(
        Long id,
        Long recipeId,
        String recipeTitle,
        Integer estimatedCostJpy,
        LocalDate cookedDate) {
    public CookingLogEntry {
        if (recipeTitle == null || recipeTitle.isBlank()) {
            throw new IllegalArgumentException("レシピ名を入力してください");
        }
        if (cookedDate == null) {
            throw new IllegalArgumentException("調理日を入力してください");
        }
    }
}
