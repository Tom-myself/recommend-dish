package com.example.recipe.service;

import java.time.LocalDate;
import org.springframework.stereotype.Service;
import java.util.List;
import com.example.recipe.dto.MonthlyCostSummary;
import com.example.recipe.entity.CookingLogEntry;
import com.example.recipe.repository.CookingLogMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CookingLogService {

    private final CookingLogMapper cookingLogMapper;

    public void recordCooking(Long userId, Long recipeId) {
        cookingLogMapper.insertCookingLog(userId, recipeId, LocalDate.now());
    }

    public MonthlyCostSummary getMonthlySummary(Long userId, int year, int month) {
        List<CookingLogEntry> logs = cookingLogMapper.findByUserIdAndMonth(userId, year, month);
        Integer totalCost = cookingLogMapper.sumCostByUserIdAndMonth(userId, year, month);

        return new MonthlyCostSummary(year, month, totalCost, logs.size(), logs);

    }
}
