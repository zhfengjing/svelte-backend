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
