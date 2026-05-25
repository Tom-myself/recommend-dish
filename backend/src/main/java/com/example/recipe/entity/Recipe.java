package com.example.recipe.entity;

import java.util.List;

public record Recipe(
    Long id,
    String title,
    List<RecipeIngredient> ingredients,
    List<RecipeStep> steps,
    List<RecipePoint> points,
    Integer cookingTimeMinutes,
    Integer estimatedCostJpy
) {
    public Recipe {
        ingredients = ingredients == null ? List.of() : List.copyOf(ingredients);
        steps = steps == null ? List.of() : List.copyOf(steps);
        points = points == null ? List.of() : List.copyOf(points);
    }

    public Recipe withId(Long id) {
        return new Recipe(id, title, ingredients, steps, points, cookingTimeMinutes, estimatedCostJpy);
    }

    public boolean isGoodForBreakfast() {
        return cookingTimeMinutes != null && cookingTimeMinutes <= 15;
    }

    /**
     * 洗い物スコアの算出
     */
    public WashingUpScore calculateWashingUpScore() {
        List<String> stepDescs = steps.stream().map(RecipeStep::description).toList();
        List<String> ingNames = ingredients.stream().map(RecipeIngredient::name).toList();
        return WashingUpScore.calculateFromStepsAndIngredients(stepDescs, ingNames);
    }

    /**
     * ベジタリアン（肉・魚不使用）判定
     */
    public boolean isVegetarian() {
        if (ingredients.isEmpty()) return false;
        List<String> nonVegKeywords = List.of("肉", "豚", "牛", "鶏", "魚", "えび", "いか", "たこ", "ベーコン", "ウインナー", "ツナ", "ハム");
        return ingredients.stream()
                .map(RecipeIngredient::name)
                .noneMatch(name -> nonVegKeywords.stream().anyMatch(name::contains));
    }

    /**
     * コストパフォーマンス判定（例: 500円以下ならコスパ良し）
     */
    public boolean isCostEffective() {
        return estimatedCostJpy != null && estimatedCostJpy <= 500;
    }

    public enum Difficulty {
        EASY, NORMAL, HARD
    }

    /**
     * 難易度の算出
     */
    public Difficulty getDifficulty() {
        int score = 0;
        
        // 1. 調理時間によるスコア（長いほど難しい）
        if (cookingTimeMinutes != null) {
            if (cookingTimeMinutes > 30) score += 2;
            else if (cookingTimeMinutes > 15) score += 1;
        }
        
        // 2. 工程数によるスコア（多いほど難しい）
        if (steps.size() > 5) score += 2;
        else if (steps.size() > 3) score += 1;

        // 3. 洗い物の多さによるスコア（スコアが低い＝洗い物が多い＝難しい）
        WashingUpScore washingUp = calculateWashingUpScore();
        if (washingUp.getValue() < 4) score += 2;
        else if (washingUp.getValue() < 7) score += 1;

        if (score >= 4) return Difficulty.HARD;
        if (score >= 2) return Difficulty.NORMAL;
        return Difficulty.EASY;
    }
}
