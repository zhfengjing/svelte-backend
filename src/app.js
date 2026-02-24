import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import articlesRouter from './routes/articles.js';
import commentsRouter from './routes/comments.js';
import categoriesRouter from './routes/categories.js';
import tagsRouter from './routes/tags.js';
import userRouter from './routes/user.js';

const app = express();

// 中间件
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// 请求日志
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// API 路由
app.use('/api/articles', articlesRouter);
app.use('/api/articles/:articleId/comments', commentsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/tags', tagsRouter);
app.use('/api/user', userRouter);

// 健康检查
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 处理
app.use((_req, res) => {
  res.status(404).json({ code: 404, message: '接口不存在' });
});

// 全局错误处理
app.use((err, _req, res, _next) => {
  console.error('Server error:', err);
  res.status(500).json({ code: 500, message: '服务器内部错误' });
});

export default app;
