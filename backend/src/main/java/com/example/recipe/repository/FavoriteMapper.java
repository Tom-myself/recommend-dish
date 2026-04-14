package com.example.recipe.repository;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface FavoriteMapper {

    @Insert("""
        INSERT INTO favorites (title)
        VALUES (#{title})
    """)
    void insert(String title);

    @Delete("""
        DELETE FROM favorites
        WHERE title = #{title}
    """)
    void delete(String title);
}