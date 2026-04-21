package com.example.recipe.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import java.util.Map;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.recipe.entity.RecipeRequest;
import com.example.recipe.entity.RecipeResponse;
import com.example.recipe.service.RecipeService;
import com.example.recipe.service.FavoriteService;
import org.springframework.web.bind.annotation.DeleteMapping;

@RestController
@RequestMapping("/api/recipe")
@CrossOrigin(origins = "http://localhost:3000")
public class RecipeController {

    private final RecipeService recipeService;
    private final FavoriteService favoriteService;

    public RecipeController(RecipeService recipeService, FavoriteService favoriteService) {
        this.recipeService = recipeService;
        this.favoriteService = favoriteService;
    }

    @PostMapping
    public RecipeResponse generate(@RequestBody RecipeRequest request) {

        RecipeResponse result = recipeService.generateRecipe(request);

        return result;
    }

    @PostMapping("/favorites")
    public ResponseEntity<String> favorite(@RequestBody RecipeResponse recipe) {
        Long userId = (Long) org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        favoriteService.toggleFavorite(userId, recipe, true);
        System.out.println("お気に入り登録: " + recipe.getTitle());
        return ResponseEntity.ok("お気に入りに登録しました");
    }

    @DeleteMapping("/favorites")
    public ResponseEntity<String> unfavorite(@RequestBody RecipeResponse recipe) {
        Long userId = (Long) org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        favoriteService.toggleFavorite(userId, recipe, false);
        System.out.println("お気に入り解除: " + recipe.getTitle());
        return ResponseEntity.ok("お気に入りを解除しました");
    }

    @PostMapping("/calories")
    public ResponseEntity<Map<String, String>> calculateCalories(@RequestBody RecipeResponse recipe) {
        String calories = recipeService.calculateCalories(recipe);
        return ResponseEntity.ok(Map.of("calories", calories));
    }
}