# 数据库使用文档

> 本文档描述 `svelte-backend` 项目的 PostgreSQL 数据库连接、配置及日常操作方法。

---

## 目录

1. [环境要求](#1-环境要求)
2. [环境变量配置](#2-环境变量配置)
3. [数据库连接池](#3-数据库连接池)
4. [数据库表结构](#4-数据库表结构)
5. [初始化与数据填充](#5-初始化与数据填充)
6. [在路由中使用数据库](#6-在路由中使用数据库)
7. [常用 psql 操作命令](#7-常用-psql-操作命令)
8. [常见问题排查](#8-常见问题排查)

---

## 1. 环境要求

| 依赖 | 版本要求 | 说明 |
|------|----------|------|
| PostgreSQL | >= 12 | 本项目使用 14.x |
| Node.js | >= 18 | 支持 ESM 模块 |
| pg | ^8.18.0 | Node.js PostgreSQL 客户端 |
| dotenv | ^17.3.1 | 环境变量注入 |

安装 Node.js 依赖：

```bash
npm install
```

---

## 2. 环境变量配置

项目根目录下的 `.env` 文件用于配置所有运行参数，**请勿将此文件提交到版本控制**。

```ini
# 服务端口
PORT=3000

# PostgreSQL 数据库配置
DB_HOST=localhost
DB_PORT=5432
DB_NAME=blog_db
DB_USER=scenery
DB_PASSWORD=
```

### 字段说明

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `PORT` | `3000` | Express 服务监听端口 |
| `DB_HOST` | `localhost` | 数据库服务器地址 |
| `DB_PORT` | `5432` | PostgreSQL 默认端口 |
| `DB_NAME` | `blog_db` | 数据库名称 |
| `DB_USER` | — | 数据库用户名（必填） |
| `DB_PASSWORD` | — | 数据库密码，无密码时留空 |

### 生产环境示例

```ini
PORT=8080
DB_HOST=your-db-host.com
DB_PORT=5432
DB_NAME=blog_db
DB_USER=blog_user
DB_PASSWORD=your_secure_password
```

---

## 3. 数据库连接池

连接池模块位于 `src/db/index.js`，在整个应用中作为单例共享。

```js
// src/db/index.js
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'blog_db',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || undefined,
  max: 10,                    // 连接池最大连接数
  idleTimeoutMillis: 30000,   // 空闲连接超时（30秒）
  connectionTimeoutMillis: 2000, // 获取连接超时（2秒）
});

pool.on('error', (err) => {
  console.error('数据库连接池异常:', err);
});

export default pool;
```

### 在路由文件中引入

```js
import pool from '../db/index.js';
```

### 连接池参数说明

| 参数 | 值 | 说明 |
|------|----|------|
| `max` | 10 | 同时最多 10 个并发连接 |
| `idleTimeoutMillis` | 30000 | 连接闲置 30s 后自动释放 |
| `connectionTimeoutMillis` | 2000 | 获取连接等待超过 2s 则报错 |

---

## 4. 数据库表结构

数据库名：`blog_db`，共 6 张表，表间关系如下：

```
categories ──< articles ──< comments
                 └── tags (TEXT[] 数组，内联存储)

user_profiles （独立，JSONB 存储复杂嵌套数据）
user_stats    （独立）
```

### 4.1 categories — 文章分类

```sql
CREATE TABLE IF NOT EXISTS categories (
  id   VARCHAR(50)  PRIMARY KEY,  -- 分类标识，如 'frontend'
  name VARCHAR(100) NOT NULL      -- 分类显示名，如 '前端开发'
);
```

**预置数据：**

| id | name |
|----|------|
| frontend | 前端开发 |
| web3 | Web3 |
| programming | 编程语言 |
| backend | 后端开发 |
| devops | DevOps |
| ai | 人工智能 |

---

### 4.2 articles — 文章

```sql
CREATE TABLE IF NOT EXISTS articles (
  id          SERIAL       PRIMARY KEY,
  title       VARCHAR(500) NOT NULL,
  excerpt     TEXT,                         -- 摘要
  content     TEXT         NOT NULL,        -- 正文（Markdown）
  image       VARCHAR(500),                 -- 封面图 URL
  author      VARCHAR(100),
  date        VARCHAR(20),                  -- 发布日期，如 '2024-02-20'
  views       VARCHAR(20)  DEFAULT '0',     -- 浏览量，如 '2.5k'
  read_time   VARCHAR(50),                  -- 阅读时长，如 '8 分钟'
  category    VARCHAR(100),                 -- 分类显示名
  category_id VARCHAR(50)  REFERENCES categories(id),
  tags        TEXT[],                       -- 标签数组，如 '{Svelte,JavaScript}'
  featured    BOOLEAN      DEFAULT false,   -- 是否精选
  popular     BOOLEAN      DEFAULT false,   -- 是否热门
  is_draft    BOOLEAN      DEFAULT false,   -- 是否草稿
  created_at  BIGINT                        -- 创建时间戳（毫秒）
);
```

---

### 4.3 comments — 评论

```sql
CREATE TABLE IF NOT EXISTS comments (
  id         SERIAL   PRIMARY KEY,
  article_id INTEGER  REFERENCES articles(id) ON DELETE CASCADE,
  author     VARCHAR(100),
  content    TEXT     NOT NULL,
  date       VARCHAR(20),      -- 评论日期，如 '2024-02-21'
  likes      INTEGER  DEFAULT 0
);
```

> `ON DELETE CASCADE`：删除文章时，其下所有评论自动一并删除。

---

### 4.4 tags — 标签

```sql
CREATE TABLE IF NOT EXISTS tags (
  id   SERIAL      PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL
);
```

> 标签与文章的关联通过 `articles.tags`（`TEXT[]`）内联存储，`tags` 表仅作为标签名称的主列表。

---

### 4.5 user_profiles — 用户资料

```sql
CREATE TABLE IF NOT EXISTS user_profiles (
  id          SERIAL       PRIMARY KEY,
  name        VARCHAR(100),
  title       VARCHAR(200),       -- 职位/头衔
  bio         TEXT,               -- 个人简介
  avatar      VARCHAR(500),       -- 头像 URL
  skills      JSONB,              -- 技能列表
  timeline    JSONB,              -- 职业时间线
  projects    JSONB,              -- 项目列表
  social_links JSONB,             -- 社交链接（API 返回时映射为 socialLinks）
  stats       JSONB               -- 统计概览
);
```

**JSONB 字段数据结构示例：**

```json
// skills
[{ "name": "JavaScript", "level": 95, "icon": "🟨" }]

// timeline
[{ "year": "2024", "title": "高级全栈工程师", "company": "某科技公司", "description": "..." }]

// projects
[{ "name": "DeFi 交易平台", "description": "...", "tech": ["Solidity", "React"], "link": "...", "image": "..." }]

// social_links
[{ "name": "GitHub", "icon": "🐙", "url": "https://github.com" }]

// stats
[{ "label": "文章", "value": "120+", "icon": "📝" }]
```

---

### 4.6 user_stats — 用户统计

```sql
CREATE TABLE IF NOT EXISTS user_stats (
  id     SERIAL     PRIMARY KEY,
  icon   VARCHAR(10),
  number VARCHAR(20),    -- 如 '120+'
  label  VARCHAR(100)    -- 如 '文章总数'
);
```

---

## 5. 初始化与数据填充

### 5.1 手动创建数据库（首次使用）

```bash
psql postgres -c "CREATE DATABASE blog_db;"
```

### 5.2 运行 Seed 脚本

Seed 脚本 `src/db/seed.js` 会自动完成：建表 → 清空旧数据 → 插入初始数据。

```bash
npm run db:seed
```

执行成功后输出：

```
表结构创建完成
分类数据插入完成：6 条
文章数据插入完成：8 条
评论数据插入完成：6 条
标签数据插入完成：20 条
用户资料数据插入完成：1 条
用户统计数据插入完成：4 条

数据库初始化完成！
```

> **注意**：每次执行 `db:seed` 会先 `TRUNCATE` 所有表并重置序列，再重新插入数据，适合重置开发环境。

### 5.3 仅执行 Schema（不插入数据）

```bash
psql blog_db -f src/db/schema.sql
```

---

## 6. 在路由中使用数据库

所有路由均从 `src/db/index.js` 导入连接池，通过 `pool.query()` 执行 SQL。

### 6.1 基础查询模式

```js
import pool from '../db/index.js';

// 查询单条记录
const result = await pool.query(
  'SELECT * FROM articles WHERE id = $1',
  [id]
);
const article = result.rows[0];   // 单条结果

// 查询多条记录
const result = await pool.query('SELECT * FROM articles');
const articles = result.rows;     // 结果数组

// 获取总数
const countResult = await pool.query('SELECT COUNT(*) FROM articles');
const total = parseInt(countResult.rows[0].count);
```

### 6.2 参数化查询（防 SQL 注入）

使用 `$1`, `$2` 占位符，通过数组传入参数：

```js
// 正确写法 — 参数化，安全
await pool.query(
  'SELECT * FROM articles WHERE category_id = $1 AND featured = $2',
  [categoryId, true]
);

// 错误写法 — 字符串拼接，存在注入风险
// await pool.query(`SELECT * FROM articles WHERE category_id = '${categoryId}'`);
```

### 6.3 插入并返回新记录

```js
const result = await pool.query(
  `INSERT INTO articles (title, content, author, created_at)
   VALUES ($1, $2, $3, $4)
   RETURNING *`,
  [title, content, author, Date.now()]
);
const newArticle = result.rows[0];
```

### 6.4 更新（COALESCE 实现部分更新）

```js
// 仅更新传入的字段，未传入的字段保持原值
const result = await pool.query(
  `UPDATE articles SET
     title   = COALESCE($1, title),
     content = COALESCE($2, content)
   WHERE id = $3
   RETURNING *`,
  [title, content, id]
);
```

### 6.5 删除

```js
const result = await pool.query(
  'DELETE FROM articles WHERE id = $1 RETURNING id',
  [id]
);

if (result.rows.length === 0) {
  // 记录不存在
}
```

### 6.6 动态条件查询

```js
const conditions = [];
const params = [];

if (category) {
  params.push(category);
  conditions.push(`category_id = $${params.length}`);
}
if (search) {
  params.push(`%${search}%`);
  conditions.push(`title ILIKE $${params.length}`);
}

const where = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';
const result = await pool.query(
  `SELECT * FROM articles ${where} ORDER BY created_at DESC`,
  params
);
```

### 6.7 事务

```js
const client = await pool.connect();
try {
  await client.query('BEGIN');
  await client.query('INSERT INTO ...', [...]);
  await client.query('UPDATE ...', [...]);
  await client.query('COMMIT');
} catch (err) {
  await client.query('ROLLBACK');
  throw err;
} finally {
  client.release();  // 必须释放连接回连接池
}
```

### 6.8 路由与 SQL 对应关系

| HTTP 方法 | 路由 | 文件 | 核心 SQL |
|-----------|------|------|----------|
| GET | `/api/articles` | routes/articles.js | `SELECT * FROM articles [WHERE ...] ORDER BY created_at DESC` |
| GET | `/api/articles/popular` | routes/articles.js | `SELECT * FROM articles WHERE popular = true` |
| GET | `/api/articles/:id` | routes/articles.js | `SELECT * FROM articles WHERE id = $1` |
| POST | `/api/articles` | routes/articles.js | `INSERT INTO articles (...) VALUES (...) RETURNING *` |
| PUT | `/api/articles/:id` | routes/articles.js | `UPDATE articles SET ... WHERE id = $1 RETURNING *` |
| DELETE | `/api/articles/:id` | routes/articles.js | `DELETE FROM articles WHERE id = $1 RETURNING id` |
| GET | `/api/articles/:id/comments` | routes/comments.js | `SELECT * FROM comments WHERE article_id = $1` |
| POST | `/api/articles/:id/comments` | routes/comments.js | `INSERT INTO comments (...) VALUES (...) RETURNING *` |
| GET | `/api/categories` | routes/categories.js | `SELECT * FROM categories ORDER BY id` |
| GET | `/api/tags` | routes/tags.js | `SELECT name FROM tags ORDER BY id` |
| GET | `/api/user/profile` | routes/user.js | `SELECT * FROM user_profiles LIMIT 1` |
| GET | `/api/user/stats` | routes/user.js | `SELECT icon, number, label FROM user_stats ORDER BY id` |

---

## 7. 常用 psql 操作命令

```bash
# 连接到 blog_db 数据库
psql blog_db

# 列出所有表
\dt

# 查看某张表的结构
\d articles

# 退出 psql
\q
```

### 常用查询

```sql
-- 查看所有文章（简略）
SELECT id, title, author, category, popular, featured FROM articles;

-- 按分类筛选文章
SELECT id, title FROM articles WHERE category_id = 'frontend';

-- 查看某篇文章的所有评论
SELECT * FROM comments WHERE article_id = 1;

-- 查看热门文章数量
SELECT COUNT(*) FROM articles WHERE popular = true;

-- 查看各分类文章数量
SELECT c.name, COUNT(a.id) AS article_count
FROM categories c
LEFT JOIN articles a ON a.category_id = c.id
GROUP BY c.name
ORDER BY article_count DESC;
```

### 数据维护

```sql
-- 重置所有数据（慎用）
TRUNCATE TABLE comments, articles, categories, tags, user_profiles, user_stats CASCADE;

-- 查看序列当前值
SELECT last_value FROM articles_id_seq;

-- 手动重置序列（清空数据后使用）
ALTER SEQUENCE articles_id_seq RESTART WITH 1;
ALTER SEQUENCE comments_id_seq RESTART WITH 1;

-- 删除整个数据库（危险操作，需先断开所有连接）
-- psql postgres -c "DROP DATABASE blog_db;"
```

---

## 8. 常见问题排查

### Q1：连接失败 `ECONNREFUSED`

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**原因**：PostgreSQL 服务未启动。

```bash
# 检查 PostgreSQL 状态
pg_isready

# macOS Homebrew 启动
brew services start postgresql@14

# 查看运行中的端口
lsof -i :5432
```

---

### Q2：认证失败 `password authentication failed`

```
error: password authentication failed for user "xxx"
```

**排查步骤**：

1. 检查 `.env` 中 `DB_USER` 和 `DB_PASSWORD` 是否正确
2. 验证用户是否存在：
   ```bash
   psql postgres -c "\du"
   ```
3. 无密码用户将 `DB_PASSWORD` 留空即可

---

### Q3：数据库不存在 `database "blog_db" does not exist`

```bash
psql postgres -c "CREATE DATABASE blog_db;"
npm run db:seed
```

---

### Q4：`TRUNCATE` 失败（外键约束）

```
ERROR: cannot truncate a table referenced in a foreign key constraint
```

需按依赖顺序清空，或使用 `CASCADE`：

```sql
TRUNCATE TABLE comments, articles, categories CASCADE;
```

---

### Q5：`tags` 字段返回格式问题

`articles.tags` 在 PostgreSQL 中是 `TEXT[]` 类型，`pg` 驱动会自动将其转换为 JavaScript 数组，无需手动解析。

```js
// result.rows[0].tags 已经是数组
// ['Svelte', 'JavaScript', '前端']
```

---

### Q6：`user_profiles.social_links` 与 API 字段名不一致

数据库列名为 `social_links`（下划线），API 响应中映射为 `socialLinks`（驼峰），转换在 `src/routes/user.js` 中完成：

```js
const profile = {
  ...
  socialLinks: row.social_links,  // 列名 → 驼峰
  ...
};
```

---

## 文件结构速览

```
svelte-backend/
├── .env                    # 环境变量（DB 连接信息）
├── package.json            # scripts: db:seed
├── src/
│   ├── app.js              # Express 入口，dotenv 在此加载
│   ├── db/
│   │   ├── index.js        # pg 连接池（全局单例）
│   │   ├── schema.sql      # 建表 SQL（参考文档）
│   │   └── seed.js         # 初始化脚本（建表 + 插入数据）
│   └── routes/
│       ├── articles.js     # 文章 CRUD → articles 表
│       ├── comments.js     # 评论 → comments 表
│       ├── categories.js   # 分类 → categories 表
│       ├── tags.js         # 标签 → tags 表
│       └── user.js         # 用户 → user_profiles / user_stats 表
```
