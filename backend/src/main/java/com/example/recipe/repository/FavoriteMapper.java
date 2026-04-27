package com.example.recipe.repository;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.Result;
import org.apache.ibatis.annotations.Many;
import java.util.List;

@Mapper
public interface FavoriteMapper {

    // 保存するのはリレーション（誰がどのレシピを）
    @Insert("""
                INSERT INTO favorites (user_id, recipe_id)
                VALUES (#{userId}, #{recipeId})
            """)
    void insert(@Param("userId") Long userId, @Param("recipeId") Long recipeId);

    // 削除もIDベースで行うのが一般的
    @Delete("""
                DELETE FROM favorites
                WHERE user_id = #{userId} AND recipe_id = #{recipeId}
            """)
    void delete(@Param("userId") Long userId, @Param("recipeId") Long recipeId);

    // 検索は Recipe テーブルと JOIN して情報を引っ張る
    @Select("""
                <script>
                SELECT r.id, r.title, r.cooking_time_minutes, r.estimated_cost_jpy FROM recipes r
                JOIN favorites f ON r.id = f.recipe_id
                <where>
                    AND f.user_id = #{userId}
                    <if test="title != null and title != ''">
                        AND r.title LIKE CONCAT('%', #{title}, '%')
                    </if>
                    <if test="ingredient != null and ingredient != ''">
                        AND EXISTS (
                            SELECT 1 FROM recipe_ingredients ri
                            WHERE ri.recipe_id = r.id AND ri.name LIKE CONCAT('%', #{ingredient}, '%')
                        )
                    </if>
                    <if test="maxTime != null">
                        AND r.cooking_time_minutes &lt;= #{maxTime}
                    </if>
                    <if test="maxCost != null">
                        AND r.estimated_cost_jpy &lt;= #{maxCost}
                    </if>
                </where>
                ORDER BY
                <choose>
                    <when test="sortBy == 'cost_asc'">r.estimated_cost_jpy ASC</when>
                    <when test="sortBy == 'cost_desc'">r.estimated_cost_jpy DESC</when>
                    <when test="sortBy == 'time_asc'">r.cooking_time_minutes ASC</when>
                    <when test="sortBy == 'time_desc'">r.cooking_time_minutes DESC</when>
                    <otherwise>f.id DESC</otherwise>
                </choose>
                </script>
            """)
    @Results({
            @Result(property = "id", column = "id"),
            @Result(property = "title", column = "title"),
            @Result(property = "cookingTimeMinutes", column = "cooking_time_minutes"),
            @Result(property = "estimatedCostJpy", column = "estimated_cost_jpy"),
            @Result(property = "ingredients", column = "id", many = @Many(select = "com.example.recipe.repository.RecipeMapper.findIngredientNamesByRecipeId")),
            @Result(property = "steps", column = "id", many = @Many(select = "com.example.recipe.repository.RecipeMapper.findStepDescriptionsByRecipeId")),
            @Result(property = "points", column = "id", many = @Many(select = "com.example.recipe.repository.RecipeMapper.findPointDescriptionsByRecipeId"))
    })
    List<com.example.recipe.dto.FavoriteRecipeDto> searchFavorites(
            @Param("userId") Long userId,
            @Param("title") String title,
            @Param("ingredient") String ingredient,
            @Param("maxTime") Integer maxTime,
            @Param("maxCost") Integer maxCost,
            @Param("sortBy") String sortBy);
}