package com.example.recipe.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.recipe.service.FavoriteService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;

    @GetMapping("/search")
    public ResponseEntity<List<com.example.recipe.dto.FavoriteRecipeDto>> searchFavorites(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String ingredient,
            @RequestParam(required = false) Integer maxTime,
            @RequestParam(required = false) Integer maxCost) {

        Long userId = (Long) org.springframework.security.core.context.SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();

        List<com.example.recipe.dto.FavoriteRecipeDto> results = favoriteService.searchFavorites(userId, title,
                ingredient, maxTime, maxCost);
        return ResponseEntity.ok(results);
    }
}
