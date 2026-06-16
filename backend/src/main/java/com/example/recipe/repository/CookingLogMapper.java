package com.example.recipe.repository;

import java.util.List;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import com.example.recipe.entity.CookingLogEntry;

@Mapper
public interface CookingLogMapper {

    @Insert("""
                INSERT INTO cooking_logs (user_id, recipe_id, cooked_at)
                VALUES (#{userId}, #{recipeId}, #{cookedAt})
            """)
    void insertCookingLog(@Param("userId") Long userId, @Param("recipeId") Long recipeId,
            @Param("cookedAt") java.time.LocalDate cookedAt);

    @Select("""
                SELECT cl.id, cl.recipe_id, r.title AS recipe_title,
                       r.estimated_cost_jpy, cl.cooked_at AS cooked_date
                FROM cooking_logs cl
                JOIN recipes r ON cl.recipe_id = r.id
                WHERE cl.user_id = #{userId}
                  AND EXTRACT(YEAR FROM cl.cooked_at) = #{year}
                  AND EXTRACT(MONTH FROM cl.cooked_at) = #{month}
                ORDER BY cl.cooked_at
            """)
    List<CookingLogEntry> findByUserIdAndMonth(@Param("userId") Long userId,
            @Param("year") int year,
            @Param("month") int month);

    @Select("""
                SELECT COALESCE(SUM(r.estimated_cost_jpy), 0)
                FROM cooking_logs cl
                JOIN recipes r ON cl.recipe_id = r.id
                WHERE cl.user_id = #{userId}
                  AND EXTRACT(YEAR FROM cl.cooked_at) = #{year}
                  AND EXTRACT(MONTH FROM cl.cooked_at) = #{month}
            """)
    Integer sumCostByUserIdAndMonth(@Param("userId") Long userId,
            @Param("year") int year,
            @Param("month") int month);

    @Delete("""
                DELETE FROM cooking_logs
                WHERE id = #{logId} AND user_id = #{userId}
            """)
    int deleteByIdAndUserId(@Param("logId") Long logId, @Param("userId") Long userId);
}
