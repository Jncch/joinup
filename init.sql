-- JoinUp データベース初期化スクリプト

-- ユーザーテーブル
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    user_type VARCHAR(50) NOT NULL CHECK (user_type IN ('freelancer', 'community')),
    name VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- フリーランサープロフィール
CREATE TABLE freelancer_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    skills TEXT[],
    experience_years INTEGER,
    availability VARCHAR(100),
    preferred_communities TEXT[],
    portfolio_url VARCHAR(500),
    github_url VARCHAR(500),
    hourly_rate INTEGER,
    bio TEXT,
    location VARCHAR(255),
    remote_ok BOOLEAN DEFAULT true
);

-- コミュニティプロフィール
CREATE TABLE community_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    community_type VARCHAR(255),
    activity_description TEXT,
    regular_events TEXT[],
    target_audience TEXT,
    requirements TEXT[],
    location VARCHAR(255),
    website_url VARCHAR(500),
    member_count INTEGER DEFAULT 0,
    meeting_frequency VARCHAR(100)
);

-- マッチング記録
CREATE TABLE matches (
    id SERIAL PRIMARY KEY,
    freelancer_id INTEGER REFERENCES users(id),
    community_id INTEGER REFERENCES users(id),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed')),
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- メッセージ
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    match_id INTEGER REFERENCES matches(id) ON DELETE CASCADE,
    sender_id INTEGER REFERENCES users(id),
    content TEXT NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- レビュー
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    match_id INTEGER REFERENCES matches(id),
    reviewer_id INTEGER REFERENCES users(id),
    reviewee_id INTEGER REFERENCES users(id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- サンプルデータの挿入
INSERT INTO users (email, user_type, name, avatar_url) VALUES
('tanaka@example.com', 'freelancer', '田中太郎', 'https://api.dicebear.com/7.x/avataaars/svg?seed=tanaka'),
('sato@example.com', 'freelancer', '佐藤花子', 'https://api.dicebear.com/7.x/avataaars/svg?seed=sato'),
('tech_community@example.com', 'community', 'Tech勉強会', 'https://api.dicebear.com/7.x/initials/svg?seed=TC'),
('design_community@example.com', 'community', 'デザイン交流会', 'https://api.dicebear.com/7.x/initials/svg?seed=DC');

INSERT INTO freelancer_profiles (user_id, skills, experience_years, availability, bio, location, hourly_rate) VALUES
(1, ARRAY['React', 'Node.js', 'Python'], 5, '週20時間', 'フルスタックエンジニアです。スタートアップでの開発経験が豊富です。', '東京', 5000),
(2, ARRAY['UI/UX', 'Figma', 'Adobe XD'], 3, '週15時間', 'ユーザーに寄り添うデザインを心がけています。', '大阪', 4000);

INSERT INTO community_profiles (user_id, community_type, activity_description, target_audience, location, member_count) VALUES
(3, 'Tech', '毎月第3土曜にエンジニア向け勉強会を開催しています', 'エンジニア・学生', '東京・渋谷', 150),
(4, 'Design', 'デザイナー同士の交流とスキルアップを目的としたコミュニティです', 'デザイナー・クリエイター', '大阪・梅田', 80);