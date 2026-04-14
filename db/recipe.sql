CREATE TABLE IF NOT EXISTS recipes (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    ingredients TEXT,        -- 食材リスト
    instructions TEXT,       -- 作り方の手順
    cooking_time_minutes INT, -- 大学生向けに「時短」を判定するためのカラムを追加
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);