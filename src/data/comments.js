export const comments = [
  {
    id: 1,
    articleId: 1,
    author: '前端爱好者',
    content: '非常详细的 Svelte 教程！特别是 Runes 系统的介绍，让我对 Svelte 5 有了全新的认识。',
    date: '2024-02-21',
    likes: 12
  },
  {
    id: 2,
    articleId: 1,
    author: 'JavaScript 开发者',
    content: '写得很好，代码示例清晰易懂，已经开始在新项目中使用 Svelte 5 了。',
    date: '2024-02-22',
    likes: 8
  },
  {
    id: 3,
    articleId: 2,
    author: 'Web3 新手',
    content: '这篇文章对我帮助很大！以前对区块链开发一知半解，现在终于有了清晰的认识。',
    date: '2024-02-19',
    likes: 15
  },
  {
    id: 4,
    articleId: 2,
    author: '智能合约工程师',
    content: 'ethers.js 的使用示例很实用，建议后续可以补充更多关于 gas 优化的内容。',
    date: '2024-02-20',
    likes: 10
  },
  {
    id: 5,
    articleId: 3,
    author: 'TypeScript 粉丝',
    content: '类型体操讲解得很透彻，infer 关键字的例子特别好，一下就理解了！',
    date: '2024-02-16',
    likes: 20
  },
  {
    id: 6,
    articleId: 4,
    author: 'React 开发者',
    content: '并发模式的介绍很清晰，自动批处理确实减少了很多不必要的重渲染。',
    date: '2024-02-13',
    likes: 18
  }
];

let nextId = comments.length + 1;

export function getNextCommentId() {
  return nextId++;
}
