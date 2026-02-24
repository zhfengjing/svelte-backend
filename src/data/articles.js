export const articles = [
  {
    id: 1,
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
    readTime: '8 分钟',
    category: '前端开发',
    categoryId: 'frontend',
    tags: ['Svelte', 'JavaScript', '前端'],
    featured: true,
    popular: true,
    createdAt: new Date('2024-02-20').getTime()
  },
  {
    id: 2,
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
    readTime: '12 分钟',
    category: 'Web3',
    categoryId: 'web3',
    tags: ['Web3', '区块链', 'Solidity', '以太坊'],
    featured: true,
    popular: true,
    createdAt: new Date('2024-02-18').getTime()
  },
  {
    id: 3,
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
    readTime: '10 分钟',
    category: '编程语言',
    categoryId: 'programming',
    tags: ['TypeScript', 'JavaScript', '类型系统'],
    featured: true,
    popular: true,
    createdAt: new Date('2024-02-15').getTime()
  },
  {
    id: 4,
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
    readTime: '9 分钟',
    category: '前端开发',
    categoryId: 'frontend',
    tags: ['React', 'JavaScript', '前端'],
    featured: false,
    popular: true,
    createdAt: new Date('2024-02-12').getTime()
  },
  {
    id: 5,
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
    readTime: '11 分钟',
    category: '后端开发',
    categoryId: 'backend',
    tags: ['Node.js', 'JavaScript', '性能优化', '后端'],
    featured: false,
    popular: false,
    createdAt: new Date('2024-02-10').getTime()
  },
  {
    id: 6,
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
    readTime: '7 分钟',
    category: '前端开发',
    categoryId: 'frontend',
    tags: ['CSS', '布局', '前端'],
    featured: false,
    popular: true,
    createdAt: new Date('2024-02-08').getTime()
  },
  {
    id: 7,
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
        // 接收代币
        tokenA.transferFrom(msg.sender, address(this), amountA);
        tokenB.transferFrom(msg.sender, address(this), amountB);

        // 更新储备
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
    readTime: '15 分钟',
    category: 'Web3',
    categoryId: 'web3',
    tags: ['DeFi', 'Web3', 'Solidity', '智能合约'],
    featured: false,
    popular: false,
    createdAt: new Date('2024-02-05').getTime()
  },
  {
    id: 8,
    title: 'Python 数据科学实战：机器学习入门',
    excerpt: '使用 Python 和 scikit-learn 库进行机器学习实践，涵盖数据预处理、模型训练、评估和部署全流程。',
    content: `# Python 机器学习入门

## 数据预处理

\`\`\`python
import pandas as pd
from sklearn.preprocessing import StandardScaler

# 加载数据
df = pd.read_csv('data.csv')

# 处理缺失值
df.fillna(df.mean(), inplace=True)

# 特征缩放
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
    readTime: '13 分钟',
    category: '编程语言',
    categoryId: 'programming',
    tags: ['Python', '机器学习', '数据科学'],
    featured: false,
    popular: true,
    createdAt: new Date('2024-02-03').getTime()
  }
];

let nextId = articles.length + 1;

export function getNextId() {
  return nextId++;
}
