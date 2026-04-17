CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

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

CREATE TABLE IF NOT EXISTS favorites (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    recipe_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    -- 外部キー制約（ユーザーやレシピが消えたらお気に入りも消える設定）
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_recipe FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
    -- 同じレシピを二回お気に入りできないようにする制約
    CONSTRAINT unique_user_recipe UNIQUE (user_id, recipe_id)
);

-- Insert dummy user to prevent FK violations when using dummyUserId=1
INSERT INTO users (id, username, email, password_hash) VALUES (1, 'dummy_user', 'dummy@example.com', '$2a$10$hP.Z5X.H9Yn.J9DqT8Yf3e9xTj4Dk8iG9oD7L/1H4R8L7K5KJhCqO') ON CONFLICT DO NOTHING;

-- ▼ デモ用の初期データ ▼
INSERT INTO recipes (id, title, cooking_time_minutes, estimated_cost_jpy) VALUES 
(1, '鶏肉と野菜の黒酢あん炒め', 15, 350),
(2, '簡単！レンチン豚もやし', 5, 200),
(3, 'とろとろオムライス', 20, 280)
ON CONFLICT (id) DO NOTHING;

SELECT setval('recipes_id_seq', (SELECT MAX(id) FROM recipes));

INSERT INTO recipe_ingredients (recipe_id, name, sort_order) VALUES
(1, '鶏もも肉', 1), (1, '玉ねぎ', 2), (1, 'にんじん', 3), (1, 'ピーマン', 4), (1, '黒酢', 5),
(2, '豚バラ肉', 1), (2, 'もやし', 2), (2, 'ポン酢', 3), (2, 'ネギ', 4),
(3, '卵', 1), (3, 'ご飯', 2), (3, 'ケチャップ', 3), (3, '鶏肉', 4), (3, '玉ねぎ', 5);

INSERT INTO recipe_steps (recipe_id, description, step_number) VALUES
(1, '野菜を切る', 1), (1, '鶏肉を炒める', 2), (1, '野菜を加える', 3), (1, '黒酢あんを絡める', 4),
(2, '耐熱皿にもやしを敷く', 1), (2, '豚肉を乗せる', 2), (2, 'レンジで5分加熱', 3), (2, 'ポン酢をかける', 4),
(3, 'チキンライスを作る', 1), (3, '卵を半熟に焼く', 2), (3, 'ご飯の上に乗せる', 3);

INSERT INTO recipe_points (recipe_id, description, sort_order) VALUES
(1, '強火で一気に炒める', 1),
(2, '豚肉が重ならないように広げる', 1),
(3, '卵は火を通しすぎない', 1);

-- 初期お気に入り登録
INSERT INTO favorites (user_id, recipe_id) VALUES 
(1, 1), (1, 2), (1, 3)
ON CONFLICT DO NOTHING;
