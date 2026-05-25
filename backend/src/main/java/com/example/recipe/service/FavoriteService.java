package com.example.recipe.service;

import java.util.List;
import java.util.ArrayList;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.recipe.entity.Recipe;
import com.example.recipe.entity.RecipeIngredient;
import com.example.recipe.entity.RecipePoint;
import com.example.recipe.entity.RecipeResponse;
import com.example.recipe.entity.RecipeStep;
import com.example.recipe.repository.FavoriteMapper;
import com.example.recipe.repository.RecipeMapper;
import com.example.recipe.dto.FavoriteRecipeDto;
import com.example.recipe.entity.FavoriteRecipeSummary;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FavoriteService {

    private final FavoriteMapper favoriteMapper;
    private final RecipeMapper recipeMapper;

    /**
     * お気に入り検索。
     * Mapper は FavoriteRecipeSummary（基本情報のみ）を返し、Service で完全な DTO に組み立てる。
     */
    public List<FavoriteRecipeDto> searchFavorites(Long userId, String title, String ingredient,
            Integer maxTime, Integer maxCost, String sortBy) {
        // 1. Mapper から基本情報（4カラム）を取得
        List<FavoriteRecipeSummary> summaries = favoriteMapper.searchFavorites(userId, title, ingredient, maxTime, maxCost, sortBy);

        // 2. 各レシピに材料・手順・ポイントを紐づけて不変な DTO に変換
        return summaries.stream()
                .map(s -> new FavoriteRecipeDto(
                        s.id(),
                        s.title(),
                        s.cookingTimeMinutes(),
                        s.estimatedCostJpy(),
                        recipeMapper.findIngredientNamesByRecipeId(s.id()),
                        recipeMapper.findStepDescriptionsByRecipeId(s.id()),
                        recipeMapper.findPointDescriptionsByRecipeId(s.id())))
                .toList();
    }

    @Transactional
    public void toggleFavorite(Long userId, RecipeResponse recipeResponse, boolean isLike) {
        // Find existing recipe
        Recipe recipe = recipeMapper.findByTitle(recipeResponse.title());

        if (recipe == null && isLike) {
            // Unexisting recipe, save it first
            recipe = new Recipe(
                null,
                recipeResponse.title(),
                null,
                null,
                null,
                recipeResponse.cookingTimeMinutes(),
                recipeResponse.estimatedCostJpy()
            );
            
            Long newId = recipeMapper.insert(recipe);
            recipe = recipe.withId(newId);

            if (recipeResponse.ingredients() != null && !recipeResponse.ingredients().isEmpty()) {
                List<RecipeIngredient> ingredients = new ArrayList<>();
                int order = 0;
                for (String ing : recipeResponse.ingredients()) {
                    ingredients.add(new RecipeIngredient(null, recipe.id(), ing, order++));
                }
                recipeMapper.insertIngredients(ingredients);
            }

            if (recipeResponse.steps() != null && !recipeResponse.steps().isEmpty()) {
                List<RecipeStep> steps = new ArrayList<>();
                int order = 1;
                for (String step : recipeResponse.steps()) {
                    steps.add(new RecipeStep(null, recipe.id(), step, order++));
                }
                recipeMapper.insertSteps(steps);
            }

            if (recipeResponse.points() != null && !recipeResponse.points().isEmpty()) {
                List<RecipePoint> points = new ArrayList<>();
                int order = 0;
                for (String point : recipeResponse.points()) {
                    points.add(new RecipePoint(null, recipe.id(), point, order++));
                }
                recipeMapper.insertPoints(points);
            }
        }

        if (recipe != null) {
            if (isLike) {
                // save to favorites. Need to check if already exists to prevent duplicate key
                // but for now we ignore or handle gracefully
                try {
                    favoriteMapper.insert(userId, recipe.id());
                } catch (Exception e) {
                    // Ignore duplicate
                }
            } else {
                // delete from favorites
                favoriteMapper.delete(userId, recipe.id());
            }
        }
    }
}
