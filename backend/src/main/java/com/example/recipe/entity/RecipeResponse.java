package com.example.recipe.entity;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecipeResponse {

    private String title;
    private List<String> ingredients;
    private List<String> steps;
    private List<String> points;
}