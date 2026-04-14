package com.example.recipe.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.recipe.entity.RecipeRequest;
import com.example.recipe.entity.RecipeResponse;
import com.example.recipe.service.RecipeService;

@RestController
@RequestMapping("/api/recipe")
@CrossOrigin(origins = "http://localhost:3000")
public class RecipeController {

    private final RecipeService recipeService;

    public RecipeController(RecipeService recipeService) {
        this.recipeService = recipeService;
    }

    @PostMapping
    public RecipeResponse generate(@RequestBody RecipeRequest request) {

        RecipeResponse result = recipeService.generateRecipe(request.getIngredients());

        return result;
    }

    @PostMapping("/favorite")
    public ResponseEntity<String> favorite(@RequestBody RecipeResponse recipe) {
        // ここでお気に入りの処理を実装（例: データベースに保存）
        System.out.println("お気に入り登録: " + recipe.getTitle());
        return ResponseEntity.ok("お気に入りに登録しました");
    }
    
}