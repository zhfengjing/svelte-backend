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
});

async function seed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // ===== 创建表结构 =====
    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL
      )
    `);

    await client.query(`
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
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        article_id INTEGER REFERENCES articles(id) ON DELETE CASCADE,
        author VARCHAR(100),
        content TEXT NOT NULL,
        date VARCHAR(20),
        likes INTEGER DEFAULT 0
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS tags (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL
      )
    `);

    await client.query(`
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
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS user_stats (
        id SERIAL PRIMARY KEY,
        icon VARCHAR(10),
        number VARCHAR(20),
        label VARCHAR(100)
      )
    `);

    console.log('表结构创建完成');

    // ===== 清空旧数据（按依赖顺序） =====
    await client.query('TRUNCATE TABLE user_stats CASCADE');
    await client.query('TRUNCATE TABLE user_profiles CASCADE');
    await client.query('TRUNCATE TABLE tags CASCADE');
    await client.query('TRUNCATE TABLE comments CASCADE');
    await client.query('TRUNCATE TABLE articles CASCADE');
    await client.query('TRUNCATE TABLE categories CASCADE');
    // 重置序列
    await client.query('ALTER SEQUENCE articles_id_seq RESTART WITH 1');
    await client.query('ALTER SEQUENCE comments_id_seq RESTART WITH 1');
    await client.query('ALTER SEQUENCE tags_id_seq RESTART WITH 1');
    await client.query('ALTER SEQUENCE user_profiles_id_seq RESTART WITH 1');
    await client.query('ALTER SEQUENCE user_stats_id_seq RESTART WITH 1');

    // ===== 插入分类 =====
    const categoriesData = [
      ['frontend', '前端开发'],
      ['web3', 'Web3'],
      ['programming', '编程语言'],
      ['backend', '后端开发'],
      ['devops', 'DevOps'],
      ['ai', '人工智能'],
    ];
    for (const [id, name] of categoriesData) {
      await client.query(
        'INSERT INTO categories (id, name) VALUES ($1, $2)',
        [id, name]
      );
    }
    console.log(`分类数据插入完成：${categoriesData.length} 条`);

    // ===== 插入文章 =====
    const articlesData = [
      {
        title: 'Svelte 5 完整指南：从入门到精通',
        excerpt: '深入学习 Svelte 5 框架的核心概念，包括 Runes、响应式系统和组件模型，带你快速掌握现代前端开发。',
        content: `# Svelte 5 完整指南

## 什么是 Svelte？

Svelte 是一个现代的 JavaScript 框架，它在编译时将组件转换为高效的原生 JavaScript 代码，无需运行时虚拟 DOM。

## Svelte 5 新特性：Runes

Svelte 5 引入了 Runes 系统，这是一种全新的响应式声明方式：

\`\`\`javascript
// 响应式状态
let count = $state(0);

// 派生值
let doubled = $derived(count * 2);

// 副作用
$effect(() => {
  console.log('count changed:', count);
});
\`\`\`

## 组件基础

\`\`\`svelte
<script>
  let name = $state('World');
</script>

<h1>Hello, {name}!</h1>
<input bind:value={name} />
\`\`\`

## 总结

Svelte 5 带来了更简洁的语法和更好的性能，是构建现代 Web 应用的绝佳选择。`,
        image: 'https://picsum.photos/seed/svelte5/800/400',
        author: '张三',
        date: '2024-02-20',
        views: '2.5k',
        read_time: '8 分钟',
        category: '前端开发',
        category_id: 'frontend',
        tags: ['Svelte', 'JavaScript', '前端'],
        featured: true,
        popular: true,
        created_at: new Date('2024-02-20').getTime(),
      },
      {
        title: 'Web3 开发入门：区块链与智能合约',
        excerpt: '从零开始学习 Web3 开发，了解以太坊、Solidity 智能合约，以及如何构建去中心化应用（DApp）。',
        content: `# Web3 开发入门

## Web3 是什么？

Web3 代表着互联网的下一个演进阶段，基于区块链技术构建去中心化应用。

## 以太坊基础

以太坊是目前最流行的智能合约平台，使用 Solidity 编写智能合约：

\`\`\`solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleStorage {
    uint256 private value;

    function setValue(uint256 _value) public {
        value = _value;
    }

    function getValue() public view returns (uint256) {
        return value;
    }
}
\`\`\`

## 连接钱包

使用 ethers.js 连接 MetaMask：

\`\`\`javascript
import { ethers } from 'ethers';

const provider = new ethers.providers.Web3Provider(window.ethereum);
await provider.send('eth_requestAccounts', []);
const signer = provider.getSigner();
\`\`\`

## 总结

Web3 开发是未来的重要方向，掌握这些技能将为你打开全新的职业机会。`,
        image: 'https://picsum.photos/seed/web3/800/400',
        author: '李四',
        date: '2024-02-18',
        views: '1.8k',
        read_time: '12 分钟',
        category: 'Web3',
        category_id: 'web3',
        tags: ['Web3', '区块链', 'Solidity', '以太坊'],
        featured: true,
        popular: true,
        created_at: new Date('2024-02-18').getTime(),
      },
      {
        title: 'TypeScript 高级技巧：类型体操实战',
        excerpt: '掌握 TypeScript 高级类型系统，学习条件类型、映射类型、模板字面量类型等高级特性，提升代码质量。',
        content: `# TypeScript 高级技巧

## 条件类型

条件类型允许你根据泛型参数的形状来选择不同的类型：

\`\`\`typescript
type IsArray<T> = T extends any[] ? true : false;

type A = IsArray<string[]>; // true
type B = IsArray<number>;   // false
\`\`\`

## 映射类型

使用映射类型创建新的类型：

\`\`\`typescript
type Readonly<T> = {
  readonly [K in keyof T]: T[K];
};

type Optional<T> = {
  [K in keyof T]?: T[K];
};
\`\`\`

## 模板字面量类型

\`\`\`typescript
type EventName = \`on\${Capitalize<string>}\`;

type UppercaseGreeting = \`Hello, \${Uppercase<string>}!\`;
\`\`\`

## infer 关键字

\`\`\`typescript
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

function greet(): string {
  return 'Hello';
}

type GreetReturn = ReturnType<typeof greet>; // string
\`\`\``,
        image: 'https://picsum.photos/seed/typescript/800/400',
        author: '王五',
        date: '2024-02-15',
        views: '3.2k',
        read_time: '10 分钟',
        category: '编程语言',
        category_id: 'programming',
        tags: ['TypeScript', 'JavaScript', '类型系统'],
        featured: true,
        popular: true,
        created_at: new Date('2024-02-15').getTime(),
      },
      {
        title: 'React 18 新特性深度解析',
        excerpt: '全面解析 React 18 的新特性，包括并发模式、Suspense 改进、自动批处理等，以及如何在项目中应用这些特性。',
        content: `# React 18 新特性深度解析

## 并发模式

React 18 默认启用并发特性，这使得渲染更加流畅：

\`\`\`javascript
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
\`\`\`

## 自动批处理

React 18 会自动批处理多个状态更新，减少不必要的重渲染：

\`\`\`javascript
// React 18 中，这两个更新会被自动批处理
setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // 只会触发一次重渲染
}, 1000);
\`\`\`

## useTransition Hook

\`\`\`javascript
const [isPending, startTransition] = useTransition();

function handleClick() {
  startTransition(() => {
    setPage(nextPage);
  });
}
\`\`\``,
        image: 'https://picsum.photos/seed/react18/800/400',
        author: '赵六',
        date: '2024-02-12',
        views: '4.1k',
        read_time: '9 分钟',
        category: '前端开发',
        category_id: 'frontend',
        tags: ['React', 'JavaScript', '前端'],
        featured: false,
        popular: true,
        created_at: new Date('2024-02-12').getTime(),
      },
      {
        title: 'Node.js 性能优化实践指南',
        excerpt: '从代码层面到架构层面，系统讲解 Node.js 应用性能优化策略，包括异步编程、内存管理、集群模式等。',
        content: `# Node.js 性能优化实践

## 异步编程最佳实践

避免回调地狱，使用 async/await：

\`\`\`javascript
// 并行执行异步操作
const [users, posts] = await Promise.all([
  fetchUsers(),
  fetchPosts()
]);
\`\`\`

## 内存管理

定期检查内存使用：

\`\`\`javascript
const used = process.memoryUsage();
console.log(\`RSS: \${Math.round(used.rss / 1024 / 1024)} MB\`);
\`\`\`

## 使用集群模式

\`\`\`javascript
import cluster from 'cluster';
import os from 'os';

if (cluster.isPrimary) {
  const numCPUs = os.cpus().length;
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
} else {
  // Worker process
  startServer();
}
\`\`\``,
        image: 'https://picsum.photos/seed/nodejs/800/400',
        author: '钱七',
        date: '2024-02-10',
        views: '1.5k',
        read_time: '11 分钟',
        category: '后端开发',
        category_id: 'backend',
        tags: ['Node.js', 'JavaScript', '性能优化', '后端'],
        featured: false,
        popular: false,
        created_at: new Date('2024-02-10').getTime(),
      },
      {
        title: 'CSS Grid 布局完全指南',
        excerpt: '全面掌握 CSS Grid 布局系统，从基础语法到复杂布局，包含大量实际案例和最佳实践。',
        content: `# CSS Grid 布局完全指南

## 创建 Grid 容器

\`\`\`css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto;
  gap: 20px;
}
\`\`\`

## 定位 Grid 项目

\`\`\`css
.item {
  grid-column: 1 / 3; /* 跨越两列 */
  grid-row: 1 / 2;
}
\`\`\`

## 命名区域

\`\`\`css
.container {
  grid-template-areas:
    "header header header"
    "sidebar main main"
    "footer footer footer";
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.footer { grid-area: footer; }
\`\`\``,
        image: 'https://picsum.photos/seed/cssgrid/800/400',
        author: '孙八',
        date: '2024-02-08',
        views: '2.9k',
        read_time: '7 分钟',
        category: '前端开发',
        category_id: 'frontend',
        tags: ['CSS', '布局', '前端'],
        featured: false,
        popular: true,
        created_at: new Date('2024-02-08').getTime(),
      },
      {
        title: 'DeFi 协议开发：流动性挖矿实现',
        excerpt: '深入讲解 DeFi 协议开发，包括 AMM 原理、流动性池实现、代币激励机制设计，以及安全审计要点。',
        content: `# DeFi 协议开发

## AMM 原理

自动做市商（AMM）使用数学公式管理流动性：

\`\`\`
x * y = k（恒定乘积公式）
\`\`\`

## 流动性池合约

\`\`\`solidity
contract LiquidityPool {
    uint256 public reserveA;
    uint256 public reserveB;

    function addLiquidity(uint256 amountA, uint256 amountB) external {
        tokenA.transferFrom(msg.sender, address(this), amountA);
        tokenB.transferFrom(msg.sender, address(this), amountB);
        reserveA += amountA;
        reserveB += amountB;
    }

    function getAmountOut(uint256 amountIn, uint256 reserveIn, uint256 reserveOut)
        public pure returns (uint256) {
        uint256 amountInWithFee = amountIn * 997;
        return (amountInWithFee * reserveOut) / (reserveIn * 1000 + amountInWithFee);
    }
}
\`\`\``,
        image: 'https://picsum.photos/seed/defi/800/400',
        author: '周九',
        date: '2024-02-05',
        views: '1.2k',
        read_time: '15 分钟',
        category: 'Web3',
        category_id: 'web3',
        tags: ['DeFi', 'Web3', 'Solidity', '智能合约'],
        featured: false,
        popular: false,
        created_at: new Date('2024-02-05').getTime(),
      },
      {
        title: 'Python 数据科学实战：机器学习入门',
        excerpt: '使用 Python 和 scikit-learn 库进行机器学习实践，涵盖数据预处理、模型训练、评估和部署全流程。',
        content: `# Python 机器学习入门

## 数据预处理

\`\`\`python
import pandas as pd
from sklearn.preprocessing import StandardScaler

df = pd.read_csv('data.csv')
df.fillna(df.mean(), inplace=True)

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)
\`\`\`

## 训练模型

\`\`\`python
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

model = RandomForestClassifier(n_estimators=100)
model.fit(X_train, y_train)

accuracy = model.score(X_test, y_test)
print(f'准确率: {accuracy:.2%}')
\`\`\``,
        image: 'https://picsum.photos/seed/python/800/400',
        author: '吴十',
        date: '2024-02-03',
        views: '3.8k',
        read_time: '13 分钟',
        category: '编程语言',
        category_id: 'programming',
        tags: ['Python', '机器学习', '数据科学'],
        featured: false,
        popular: true,
        created_at: new Date('2024-02-03').getTime(),
      },
    ];

    for (const a of articlesData) {
      await client.query(
        `INSERT INTO articles
          (title, excerpt, content, image, author, date, views, read_time,
           category, category_id, tags, featured, popular, created_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`,
        [
          a.title, a.excerpt, a.content, a.image, a.author, a.date,
          a.views, a.read_time, a.category, a.category_id, a.tags,
          a.featured, a.popular, a.created_at,
        ]
      );
    }
    console.log(`文章数据插入完成：${articlesData.length} 条`);

    // ===== 插入评论 =====
    const commentsData = [
      { article_id: 1, author: '前端爱好者', content: '非常详细的 Svelte 教程！特别是 Runes 系统的介绍，让我对 Svelte 5 有了全新的认识。', date: '2024-02-21', likes: 12 },
      { article_id: 1, author: 'JavaScript 开发者', content: '写得很好，代码示例清晰易懂，已经开始在新项目中使用 Svelte 5 了。', date: '2024-02-22', likes: 8 },
      { article_id: 2, author: 'Web3 新手', content: '这篇文章对我帮助很大！以前对区块链开发一知半解，现在终于有了清晰的认识。', date: '2024-02-19', likes: 15 },
      { article_id: 2, author: '智能合约工程师', content: 'ethers.js 的使用示例很实用，建议后续可以补充更多关于 gas 优化的内容。', date: '2024-02-20', likes: 10 },
      { article_id: 3, author: 'TypeScript 粉丝', content: '类型体操讲解得很透彻，infer 关键字的例子特别好，一下就理解了！', date: '2024-02-16', likes: 20 },
      { article_id: 4, author: 'React 开发者', content: '并发模式的介绍很清晰，自动批处理确实减少了很多不必要的重渲染。', date: '2024-02-13', likes: 18 },
    ];

    for (const c of commentsData) {
      await client.query(
        'INSERT INTO comments (article_id, author, content, date, likes) VALUES ($1,$2,$3,$4,$5)',
        [c.article_id, c.author, c.content, c.date, c.likes]
      );
    }
    console.log(`评论数据插入完成：${commentsData.length} 条`);

    // ===== 插入标签 =====
    const tagsData = [
      'JavaScript', 'TypeScript', 'Svelte', 'React', 'Vue',
      'Node.js', 'Python', 'Web3', '区块链', 'Solidity',
      '以太坊', 'DeFi', 'CSS', '前端', '后端',
      '性能优化', '机器学习', '数据科学', '智能合约', '布局',
    ];
    for (const name of tagsData) {
      await client.query('INSERT INTO tags (name) VALUES ($1)', [name]);
    }
    console.log(`标签数据插入完成：${tagsData.length} 条`);

    // ===== 插入用户资料 =====
    await client.query(
      `INSERT INTO user_profiles (name, title, bio, avatar, skills, timeline, projects, social_links, stats)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [
        '张三',
        '全栈工程师 & Web3 开发者',
        '热爱技术，专注于前端开发和 Web3 领域。喜欢分享学习心得，相信知识的力量可以改变世界。',
        'https://picsum.photos/seed/avatar/200/200',
        JSON.stringify([
          { name: 'JavaScript', level: 95, icon: '🟨' },
          { name: 'TypeScript', level: 90, icon: '🔷' },
          { name: 'Svelte', level: 88, icon: '🔶' },
          { name: 'React', level: 85, icon: '⚛️' },
          { name: 'Node.js', level: 82, icon: '🟩' },
          { name: 'Solidity', level: 75, icon: '💎' },
          { name: 'Python', level: 70, icon: '🐍' },
          { name: 'CSS', level: 92, icon: '🎨' },
        ]),
        JSON.stringify([
          { id: 'tl001', year: '2024', title: '高级全栈工程师', company: '某科技公司', description: '负责公司核心产品的前端架构设计，引入 Svelte 技术栈，性能提升 40%。' },
          { id: 'tl002', year: '2022', title: 'Web3 开发工程师', company: '区块链创业公司', description: '开发 DeFi 协议和 NFT 市场，累计处理交易额超过 1000 万美元。' },
          { id: 'tl003', year: '2020', title: '前端工程师', company: '互联网公司', description: '负责用户端 H5 页面开发，优化首屏加载速度，用户满意度提升 30%。' },
          { id: 'tl004', year: '2018', title: '初级开发工程师', company: '软件公司', description: '从事企业管理系统开发，积累了扎实的编程基础和工程实践经验。' },
        ]),
        JSON.stringify([
          { name: 'DeFi 交易平台', description: '基于以太坊的去中心化交易所，支持代币互换和流动性挖矿，日交易量超过 100 万美元。', tech: ['Solidity', 'ethers.js', 'React', 'Node.js'], link: 'https://github.com', image: 'https://picsum.photos/seed/defi-project/400/200' },
          { name: '博客聚合平台', description: '使用 Svelte 5 构建的现代博客平台，支持 Markdown 编写、分类标签和全文搜索。', tech: ['Svelte', 'TypeScript', 'Node.js', 'PostgreSQL'], link: 'https://github.com', image: 'https://picsum.photos/seed/blog-project/400/200' },
          { name: 'AI 代码助手', description: '集成 GPT-4 的智能代码补全工具，支持多语言，帮助开发者提高编码效率。', tech: ['Python', 'FastAPI', 'React', 'OpenAI API'], link: 'https://github.com', image: 'https://picsum.photos/seed/ai-project/400/200' },
        ]),
        JSON.stringify([
          { name: 'GitHub', icon: '🐙', url: 'https://github.com' },
          { name: 'Twitter', icon: '🐦', url: 'https://twitter.com' },
          { name: 'LinkedIn', icon: '💼', url: 'https://linkedin.com' },
          { name: '掘金', icon: '📖', url: 'https://juejin.cn' },
        ]),
        JSON.stringify([
          { label: '文章', value: '120+', icon: '📝' },
          { label: '读者', value: '5k+', icon: '👥' },
          { label: '评论', value: '800+', icon: '💬' },
          { label: '点赞', value: '3.2k', icon: '❤️' },
        ]),
      ]
    );
    console.log('用户资料数据插入完成：1 条');

    // ===== 插入用户统计 =====
    const userStatsData = [
      { icon: '📝', number: '120+', label: '文章总数' },
      { icon: '👥', number: '5k+', label: '读者' },
      { icon: '💬', number: '800+', label: '评论' },
      { icon: '❤️', number: '3.2k', label: '点赞' },
    ];
    for (const s of userStatsData) {
      await client.query(
        'INSERT INTO user_stats (icon, number, label) VALUES ($1,$2,$3)',
        [s.icon, s.number, s.label]
      );
    }
    console.log(`用户统计数据插入完成：${userStatsData.length} 条`);

    await client.query('COMMIT');
    console.log('\n数据库初始化完成！');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('数据库初始化失败:', err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
