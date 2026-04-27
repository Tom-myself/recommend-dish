package com.example.recipe.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.recipe.ai.GeminiClient;
import com.example.recipe.dto.FavoriteRecipeDto;
import com.example.recipe.entity.RecipeRequest;
import com.example.recipe.entity.RecipeResponse;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RecipeService {

    private final GeminiClient geminiClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public RecipeResponse generateRecipe(RecipeRequest request) {

        String ingredientsStr = request.getIngredients() != null ? request.getIngredients().toString() : "";
        String utensilsCondition = (request.getUtensils() != null && !request.getUtensils().isBlank())
                ? "調理器具の条件: " + request.getUtensils()
                : "調理器具の条件: 特に指定なし";

        String prompt = """
                あなたはプロの料理研究家です。大学生向けに、「節約・時短」を重視したレシピを提案してください。

                以下の食材・キーワードでレシピを作ってください:
                %s

                %s
                ※例：「フライパンのみ」「フライパンなし（レンジ等で調理）」などの指定がある場合は、必ずその条件に従ってレシピを構成してください。

                必ずJSON形式で出力してください。説明文は禁止。
                料理は一品まででお願いします。
                料理名(title)は、変な改行を防ぐため【必ず20文字以内】で簡潔にしてください。
                想定調理時間（分）と、想定材料費（日本円）も数値で出力してください。

                {
                  "title": "料理名",
                  "ingredients": ["材料1", "材料2"],
                  "steps": ["手順1", "手順2"],
                  "points": ["ポイント1", "ポイント2"],
                  "cookingTimeMinutes": 15,
                  "estimatedCostJpy": 300
                }
                """.formatted(ingredientsStr, utensilsCondition);

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

    public String calculateCalories(RecipeResponse recipe) {
        String prompt = """
                あなたはプロの栄養士です。以下のレシピの合計カロリーの目安を推測してください。
                結果は数値と「kcal」という単位のみで返してください。余計な文字列や説明は一切不要です。（例: 450 kcal）

                料理名: %s
                材料: %s
                """.formatted(recipe.getTitle(), recipe.getIngredients().toString());

        String result = geminiClient.generate(prompt);
        return result.trim();
    }

    public String chatAboutFavorites(List<FavoriteRecipeDto> recipes, String question) {
        String recipeList = recipes.stream()
                .map(r -> String.format(
                        "- %s（調理時間: %s分, 材料費: %s円, 材料: %s）",
                        r.getTitle(),
                        r.getCookingTimeMinutes() != null ? r.getCookingTimeMinutes() : "不明",
                        r.getEstimatedCostJpy() != null ? r.getEstimatedCostJpy() : "不明",
                        r.getIngredients() != null ? String.join("・", r.getIngredients()) : "不明"))
                .collect(Collectors.joining("\n"));

        String prompt = """
                あなたは料理アシスタントです。ユーザーのお気に入りレシピリストをもとに、質問に日本語で答えてください。
                回答は親しみやすく、かつ300文字以内でお願いします。

                【判定・並び替えのルール】
                1. 洗い物が少ない順:
                   レシピの材料や手順から推測される調理器具（フライパン、鍋、ボウル、レンジ容器等）の使用数を「洗い物スコア」として点数化し、少ない順（スコアが高い順）に紹介してください。
                2. 朝食向き:
                   調理時間が15分以内で、かつ栄養バランスが良く朝から食べやすいものを選出してください。
                3. 献立提案:
                   主菜と副菜、あるいは味のバリエーションを考慮して組み合わせてください。
                4. ランダム選出:
                   指示があればリストからランダムに選んでください。

                必ず以下のお気に入りレシピ一覧にある料理のみを対象に回答してください。

                【お気に入りレシピ一覧】
                %s

                【ユーザーの質問】
                %s
                """.formatted(recipeList, question);

        String answer = geminiClient.generate(prompt);
        return answer.trim();
    }
}