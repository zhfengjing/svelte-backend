-- Blog 数据库 Schema

-- 分类表
CREATE TABLE IF NOT EXISTS categories (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

-- 文章表
CREATE TABLE IF NOT EXISTS articles (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  image VARCHAR(500),
  author VARCHAR(100),
  date VARCHAR(20),
  views VARCHAR(20) DEFAULT '0',
  read_time VARCHAR(50),
  category VARCHAR(100),
  category_id VARCHAR(50) REFERENCES categories(id),
  tags TEXT[],
  featured BOOLEAN DEFAULT false,
  popular BOOLEAN DEFAULT false,
  is_draft BOOLEAN DEFAULT false,
  created_at BIGINT
);

-- 评论表
CREATE TABLE IF NOT EXISTS comments (
  id SERIAL PRIMARY KEY,
  article_id INTEGER REFERENCES articles(id) ON DELETE CASCADE,
  author VARCHAR(100),
  content TEXT NOT NULL,
  date VARCHAR(20),
  likes INTEGER DEFAULT 0
);

-- 标签表
CREATE TABLE IF NOT EXISTS tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL
);

-- 用户资料表
CREATE TABLE IF NOT EXISTS user_profiles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  title VARCHAR(200),
  bio TEXT,
  avatar VARCHAR(500),
  skills JSONB,
  timeline JSONB,
  projects JSONB,
  social_links JSONB,
  stats JSONB
);

-- 用户统计表
CREATE TABLE IF NOT EXISTS user_stats (
  id SERIAL PRIMARY KEY,
  icon VARCHAR(10),
  number VARCHAR(20),
  label VARCHAR(100)
);

-- 文章点赞表
CREATE TABLE IF NOT EXISTS article_likes (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  article_id INTEGER NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, article_id)
);

CREATE INDEX IF NOT EXISTS idx_article_likes_article_id ON article_likes(article_id);
CREATE INDEX IF NOT EXISTS idx_article_likes_user_id ON article_likes(user_id);

-- 文章收藏表
CREATE TABLE IF NOT EXISTS article_bookmarks (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  article_id INTEGER NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, article_id)
);

CREATE INDEX IF NOT EXISTS idx_article_bookmarks_article_id ON article_bookmarks(article_id);
CREATE INDEX IF NOT EXISTS idx_article_bookmarks_user_id ON article_bookmarks(user_id);

-- 关注表
CREATE TABLE IF NOT EXISTS follows (
  id SERIAL PRIMARY KEY,
  follower_id VARCHAR(255) NOT NULL,
  author_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(follower_id, author_id)
);

CREATE INDEX IF NOT EXISTS idx_follows_author_id ON follows(author_id);
CREATE INDEX IF NOT EXISTS idx_follows_follower_id ON follows(follower_id);
