package com.example.recipe.repository;

import java.util.List;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import com.example.recipe.entity.Recipe;
import com.example.recipe.entity.RecipeIngredient;
import com.example.recipe.entity.RecipePoint;
import com.example.recipe.entity.RecipeStep;

@Mapper
public interface RecipeMapper {

    @Select("SELECT * FROM recipes WHERE title = #{title} LIMIT 1")
    Recipe findByTitle(@Param("title") String title);

    @Select("SELECT name FROM recipe_ingredients WHERE recipe_id = #{recipeId} ORDER BY sort_order")
    List<String> findIngredientNamesByRecipeId(@Param("recipeId") Long recipeId);

    @Select("SELECT description FROM recipe_steps WHERE recipe_id = #{recipeId} ORDER BY step_number")
    List<String> findStepDescriptionsByRecipeId(@Param("recipeId") Long recipeId);

    @Select("SELECT description FROM recipe_points WHERE recipe_id = #{recipeId} ORDER BY sort_order")
    List<String> findPointDescriptionsByRecipeId(@Param("recipeId") Long recipeId);

    @Insert("""
        INSERT INTO recipes (title, cooking_time_minutes, estimated_cost_jpy)
        VALUES (#{title}, #{cookingTimeMinutes}, #{estimatedCostJpy})
    """)
    @Options(useGeneratedKeys = true, keyProperty = "id")
    void insert(Recipe recipe);

    @Insert("""
        <script>
        INSERT INTO recipe_ingredients (recipe_id, name, sort_order)
        VALUES 
        <foreach collection='ingredients' item='i' separator=','>
            (#{i.recipeId}, #{i.name}, #{i.sortOrder})
        </foreach>
        </script>
    """)
    void insertIngredients(@Param("ingredients") List<RecipeIngredient> ingredients);

    @Insert("""
        <script>
        INSERT INTO recipe_steps (recipe_id, description, step_number)
        VALUES 
        <foreach collection='steps' item='s' separator=','>
            (#{s.recipeId}, #{s.description}, #{s.stepNumber})
        </foreach>
        </script>
    """)
    void insertSteps(@Param("steps") List<RecipeStep> steps);

    @Insert("""
        <script>
        INSERT INTO recipe_points (recipe_id, description, sort_order)
        VALUES 
        <foreach collection='points' item='p' separator=','>
            (#{p.recipeId}, #{p.description}, #{p.sortOrder})
        </foreach>
        </script>
    """)
    void insertPoints(@Param("points") List<RecipePoint> points);
}
