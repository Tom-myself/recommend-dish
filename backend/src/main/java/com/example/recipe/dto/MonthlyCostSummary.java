package com.example.recipe.dto;

import java.util.List;

import com.example.recipe.entity.CookingLogEntry;

public record MonthlyCostSummary(
        int year,
        int month,
        Integer totalCostJpy,
        int cookCount,
        List<CookingLogEntry> logs) {
    public MonthlyCostSummary {
        logs = logs == null ? List.of() : List.copyOf(logs);
    }
}
