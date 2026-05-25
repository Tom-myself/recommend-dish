package com.example.recipe.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.example.recipe.dto.MonthlyCostSummary;
import com.example.recipe.service.CookingLogService;
import lombok.RequiredArgsConstructor;

import java.util.Map;

@RestController
@RequestMapping("/api/cooking-logs")
@RequiredArgsConstructor
public class CookingLogController {

    private final CookingLogService logService;

    // 「作った！」ボタンから呼ばれる
    @PostMapping
    public ResponseEntity<String> recordCookingLog(@RequestBody Map<String, Long> body) {
        Long userId = (Long) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        Long recipeId = body.get("recipeId");

        logService.recordCooking(userId, recipeId);
        return ResponseEntity.ok("記録しました");
    }

    // カレンダーページ用の月間データ取得
    @GetMapping
    public ResponseEntity<MonthlyCostSummary> getMonthlySummary(
            @RequestParam int year,
            @RequestParam int month) {
        Long userId = (Long) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();

        MonthlyCostSummary summary = logService.getMonthlySummary(userId, year, month);
        return ResponseEntity.ok(summary);
    }
}
