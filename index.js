import app from './src/app.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`\n🚀 服务端启动成功！`);
  console.log(`   地址: http://localhost:${PORT}`);
  console.log(`   API:  http://localhost:${PORT}/api`);
  console.log(`\n📋 可用接口:`);
  console.log(`   GET    /api/articles          文章列表`);
  console.log(`   GET    /api/articles/popular  热门文章`);
  console.log(`   GET    /api/articles/:id      文章详情`);
  console.log(`   POST   /api/articles          创建文章`);
  console.log(`   PUT    /api/articles/:id      更新文章`);
  console.log(`   DELETE /api/articles/:id      删除文章`);
  console.log(`   GET    /api/articles/:id/comments  评论列表`);
  console.log(`   POST   /api/articles/:id/comments  发表评论`);
  console.log(`   GET    /api/categories        分类列表`);
  console.log(`   GET    /api/tags              标签列表`);
  console.log(`   GET    /api/user/profile      用户信息`);
  console.log(`   GET    /api/user/stats        用户统计\n`);
});
