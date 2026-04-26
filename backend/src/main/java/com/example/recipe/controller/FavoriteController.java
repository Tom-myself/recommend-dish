package com.example.recipe.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.recipe.ai.GeminiClient;
import com.example.recipe.dto.FavoriteChatRequest;
import com.example.recipe.dto.FavoriteRecipeDto;
import com.example.recipe.service.FavoriteService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;
    private final GeminiClient geminiClient;

    @GetMapping("/search")
    public ResponseEntity<List<FavoriteRecipeDto>> searchFavorites(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String ingredient,
            @RequestParam(required = false) Integer maxTime,
            @RequestParam(required = false) Integer maxCost) {

        Long userId = (Long) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();

        List<FavoriteRecipeDto> results = favoriteService.searchFavorites(userId, title,
                ingredient, maxTime, maxCost);
        return ResponseEntity.ok(results);
    }

    @PostMapping("/chat")
    public ResponseEntity<String> chat(@RequestBody FavoriteChatRequest request) {
        // お気に入りレシピ一覧をテキスト化
        String recipeList = request.getRecipes().stream()
                .map(r -> String.format(
                        "- %s（調理時間: %s分, 材料費: %s円, 材料: %s）",
                        r.getTitle(),
                        r.getCookingTimeMinutes() != null ? r.getCookingTimeMinutes() : "不明",
                        r.getEstimatedCostJpy() != null ? r.getEstimatedCostJpy() : "不明",
                        r.getIngredients() != null ? String.join("・", r.getIngredients()) : "不明"))
                .collect(Collectors.joining("\n"));

        String prompt = """
                あなたは料理アシスタントです。ユーザーのお気に入りレシピリストをもとに、質問に日本語で答えてください。
                回答は簡潔かつ親しみやすく、200文字以内でお願いします。

                【お気に入りレシピ一覧】
                %s

                【ユーザーの質問】
                %s
                """.formatted(recipeList, request.getQuestion());

        String answer = geminiClient.generate(prompt);
        return ResponseEntity.ok(answer.trim());
    }
}
