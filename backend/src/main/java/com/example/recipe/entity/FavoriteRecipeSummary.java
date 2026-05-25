package com.example.recipe.entity;

/**
 * Mapper が返すお気に入りレシピの基本情報。
 * Recipe Entity は ingredients/steps/points を含む7引数のコンストラクタを持つため、
 * 4カラムのSQLと直接マッピングできない。この中間Entityで受け取り、
 * Service で完全な FavoriteRecipeDto に組み立てる。
 */
public record FavoriteRecipeSummary(
    Long id,
    String title,
    Integer cookingTimeMinutes,
    Integer estimatedCostJpy
) {}
