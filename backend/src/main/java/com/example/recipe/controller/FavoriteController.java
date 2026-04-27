package com.example.recipe.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.recipe.dto.FavoriteChatRequest;
import com.example.recipe.dto.FavoriteRecipeDto;
import com.example.recipe.service.FavoriteService;
import com.example.recipe.service.RecipeService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;
    private final RecipeService recipeService;

    @GetMapping("/search")
    public ResponseEntity<List<FavoriteRecipeDto>> searchFavorites(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String ingredient,
            @RequestParam(required = false) Integer maxTime,
            @RequestParam(required = false) Integer maxCost,
            @RequestParam(required = false) String sortBy) {

        Long userId = (Long) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();

        List<FavoriteRecipeDto> results = favoriteService.searchFavorites(userId, title,
                ingredient, maxTime, maxCost, sortBy);
        return ResponseEntity.ok(results);
    }

    @PostMapping("/chat")
    public ResponseEntity<String> chat(@RequestBody FavoriteChatRequest request) {
        String answer = recipeService.chatAboutFavorites(request.getRecipes(), request.getQuestion());
        return ResponseEntity.ok(answer);
    }
}
