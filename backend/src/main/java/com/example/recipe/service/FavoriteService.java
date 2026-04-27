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

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FavoriteService {

    private final FavoriteMapper favoriteMapper;
    private final RecipeMapper recipeMapper;

    public List<FavoriteRecipeDto> searchFavorites(Long userId, String title, String ingredient,
            Integer maxTime, Integer maxCost, String sortBy) {
        return favoriteMapper.searchFavorites(userId, title, ingredient, maxTime, maxCost, sortBy);
    }

    @Transactional
    public void toggleFavorite(Long userId, RecipeResponse recipeResponse, boolean isLike) {
        // Find existing recipe
        Recipe recipe = recipeMapper.findByTitle(recipeResponse.getTitle());

        if (recipe == null && isLike) {
            // Unexisting recipe, save it first
            recipe = new Recipe();
            recipe.setTitle(recipeResponse.getTitle());
            recipe.setCookingTimeMinutes(recipeResponse.getCookingTimeMinutes());
            recipe.setEstimatedCostJpy(recipeResponse.getEstimatedCostJpy());
            recipeMapper.insert(recipe);

            if (recipeResponse.getIngredients() != null && !recipeResponse.getIngredients().isEmpty()) {
                List<RecipeIngredient> ingredients = new ArrayList<>();
                int order = 0;
                for (String ing : recipeResponse.getIngredients()) {
                    ingredients.add(new RecipeIngredient(null, recipe.getId(), ing, order++));
                }
                recipeMapper.insertIngredients(ingredients);
            }

            if (recipeResponse.getSteps() != null && !recipeResponse.getSteps().isEmpty()) {
                List<RecipeStep> steps = new ArrayList<>();
                int order = 1;
                for (String step : recipeResponse.getSteps()) {
                    steps.add(new RecipeStep(null, recipe.getId(), step, order++));
                }
                recipeMapper.insertSteps(steps);
            }

            if (recipeResponse.getPoints() != null && !recipeResponse.getPoints().isEmpty()) {
                List<RecipePoint> points = new ArrayList<>();
                int order = 0;
                for (String point : recipeResponse.getPoints()) {
                    points.add(new RecipePoint(null, recipe.getId(), point, order++));
                }
                recipeMapper.insertPoints(points);
            }
        }

        if (recipe != null) {
            if (isLike) {
                // save to favorites. Need to check if already exists to prevent duplicate key
                // but for now we ignore or handle gracefully
                try {
                    favoriteMapper.insert(userId, recipe.getId());
                } catch (Exception e) {
                    // Ignore duplicate
                }
            } else {
                // delete from favorites
                favoriteMapper.delete(userId, recipe.getId());
            }
        }
    }
}
