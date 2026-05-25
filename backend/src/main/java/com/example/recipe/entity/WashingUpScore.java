package com.example.recipe.entity;

import java.util.List;

/**
 * 洗い物スコア（Value Object）
 * 0-10の値を保証し、不変である。
 */
public final class WashingUpScore implements Comparable<WashingUpScore> {
    private final int value;

    public WashingUpScore(int value) {
        if (value < 0 || value > 10) {
            throw new IllegalArgumentException("Score must be between 0 and 10.");
        }
        this.value = value;
    }

    /**
     * 調理工程からスコアを算出するドメインロジック
     */
    public static WashingUpScore calculateFromStepsAndIngredients(List<String> steps, List<String> ingredients) {
        int score = 10;
        
        if (steps != null) {
            for (String step : steps) {
                if (step.contains("フライパン")) score -= 2;
                if (step.contains("鍋")) score -= 2;
                if (step.contains("ボウル")) score -= 1;
                if (step.contains("揚げる") || step.contains("揚げ")) score -= 3;
            }
        }
        
        if (ingredients != null) {
            for (String ingredient : ingredients) {
                if (ingredient.contains("油")) score -= 1;
            }
        }
        
        return new WashingUpScore(Math.max(score, 0));
    }

    public boolean isEasy() {
        return this.value >= 7;
    }

    public int getValue() { 
        return value; 
    }

    @Override
    public int compareTo(WashingUpScore other) {
        return Integer.compare(this.value, other.value);
    }
}
