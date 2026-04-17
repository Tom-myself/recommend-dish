CREATE TABLE IF NOT EXISTS recipes (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    cooking_time_minutes INT, -- 大学生向けに「時短」を判定するためのカラムを追加
    estimated_cost_jpy INT,   -- 「節約」を可視化するための材料費（円）
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS recipe_ingredients (
    id BIGSERIAL PRIMARY KEY,
    recipe_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    CONSTRAINT fk_recipe_ing FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS recipe_steps (
    id BIGSERIAL PRIMARY KEY,
    recipe_id BIGINT NOT NULL,
    description TEXT NOT NULL,
    step_number INT NOT NULL,
    CONSTRAINT fk_recipe_step FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS recipe_points (
    id BIGSERIAL PRIMARY KEY,
    recipe_id BIGINT NOT NULL,
    description TEXT NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    CONSTRAINT fk_recipe_point FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
);