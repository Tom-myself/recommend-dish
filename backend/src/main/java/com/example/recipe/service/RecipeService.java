package com.example.recipe.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.recipe.ai.GeminiClient;
import com.example.recipe.entity.RecipeResponse;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RecipeService {

    private final GeminiClient geminiClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public RecipeResponse generateRecipe(List<String> ingredients) {

        String prompt = """
                あなたはプロの料理研究家です。大学生向けに、「節約・時短」を重視したレシピを提案してください。

                以下の食材でレシピを作ってください:
                %s

                必ずJSON形式で出力してください。説明文は禁止。
                料理は一品まででお願いします。
                想定調理時間（分）と、想定材料費（日本円）も数値で出力してください。

                {
                  "title": "料理名",
                  "ingredients": ["材料1", "材料2"],
                  "steps": ["手順1", "手順2"],
                  "points": ["ポイント1", "ポイント2"],
                  "cookingTimeMinutes": 15,
                  "estimatedCostJpy": 300
                }
                """.formatted(ingredients);

        String json = geminiClient.generate(prompt);
        json = json
                .replace("```json", "")
                .replace("```", "")
                .trim();

        System.out.println("🔥 raw json: " + json);

        // 👇 resultを出す
        System.out.println("🔥 result: " + json);

        try {
            // 👇 ここが核心
            return objectMapper.readValue(json, RecipeResponse.class);

        } catch (Exception e) {
            throw new RuntimeException("JSONパース失敗: " + json, e);
        }

    }
}