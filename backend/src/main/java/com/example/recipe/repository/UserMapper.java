package com.example.recipe.repository;

import com.example.recipe.entity.User;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface UserMapper {

    @Select("SELECT id, username, email, password_hash AS passwordHash, created_at AS createdAt FROM users WHERE username = #{username}")
    User findByUsername(@Param("username") String username);

    @Select("SELECT id, username, email, password_hash AS passwordHash, created_at AS createdAt FROM users WHERE email = #{email}")
    User findByEmail(@Param("email") String email);

    @Insert("INSERT INTO users (username, email, password_hash) VALUES (#{username}, #{email}, #{passwordHash})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    void insert(User user);
}
