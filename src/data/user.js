export const userProfile = {
  name: '张三',
  title: '全栈工程师 & Web3 开发者',
  bio: '热爱技术，专注于前端开发和 Web3 领域。喜欢分享学习心得，相信知识的力量可以改变世界。',
  avatar: 'https://picsum.photos/seed/avatar/200/200',
  skills: [
    { name: 'JavaScript', level: 95, icon: '🟨' },
    { name: 'TypeScript', level: 90, icon: '🔷' },
    { name: 'Svelte', level: 88, icon: '🔶' },
    { name: 'React', level: 85, icon: '⚛️' },
    { name: 'Node.js', level: 82, icon: '🟩' },
    { name: 'Solidity', level: 75, icon: '💎' },
    { name: 'Python', level: 70, icon: '🐍' },
    { name: 'CSS', level: 92, icon: '🎨' }
  ],
  timeline: [
    {
      year: '2024',
      title: '高级全栈工程师',
      company: '某科技公司',
      description: '负责公司核心产品的前端架构设计，引入 Svelte 技术栈，性能提升 40%。'
    },
    {
      year: '2022',
      title: 'Web3 开发工程师',
      company: '区块链创业公司',
      description: '开发 DeFi 协议和 NFT 市场，累计处理交易额超过 1000 万美元。'
    },
    {
      year: '2020',
      title: '前端工程师',
      company: '互联网公司',
      description: '负责用户端 H5 页面开发，优化首屏加载速度，用户满意度提升 30%。'
    },
    {
      year: '2018',
      title: '初级开发工程师',
      company: '软件公司',
      description: '从事企业管理系统开发，积累了扎实的编程基础和工程实践经验。'
    }
  ],
  projects: [
    {
      name: 'DeFi 交易平台',
      description: '基于以太坊的去中心化交易所，支持代币互换和流动性挖矿，日交易量超过 100 万美元。',
      tech: ['Solidity', 'ethers.js', 'React', 'Node.js'],
      link: 'https://github.com',
      image: 'https://picsum.photos/seed/defi-project/400/200'
    },
    {
      name: '博客聚合平台',
      description: '使用 Svelte 5 构建的现代博客平台，支持 Markdown 编写、分类标签和全文搜索。',
      tech: ['Svelte', 'TypeScript', 'Node.js', 'PostgreSQL'],
      link: 'https://github.com',
      image: 'https://picsum.photos/seed/blog-project/400/200'
    },
    {
      name: 'AI 代码助手',
      description: '集成 GPT-4 的智能代码补全工具，支持多语言，帮助开发者提高编码效率。',
      tech: ['Python', 'FastAPI', 'React', 'OpenAI API'],
      link: 'https://github.com',
      image: 'https://picsum.photos/seed/ai-project/400/200'
    }
  ],
  socialLinks: [
    { name: 'GitHub', icon: '🐙', url: 'https://github.com' },
    { name: 'Twitter', icon: '🐦', url: 'https://twitter.com' },
    { name: 'LinkedIn', icon: '💼', url: 'https://linkedin.com' },
    { name: '掘金', icon: '📖', url: 'https://juejin.cn' }
  ],
  stats: [
    { label: '文章', value: '120+', icon: '📝' },
    { label: '读者', value: '5k+', icon: '👥' },
    { label: '评论', value: '800+', icon: '💬' },
    { label: '点赞', value: '3.2k', icon: '❤️' }
  ]
};

export const userStats = [
  { icon: '📝', number: '120+', label: '文章总数' },
  { icon: '👥', number: '5k+', label: '读者' },
  { icon: '💬', number: '800+', label: '评论' },
  { icon: '❤️', number: '3.2k', label: '点赞' }
];
