import { Router } from 'express';
import pool from '../db/index.js';

const router = Router({ mergeParams: true });

// GET /api/articles/:articleId/comments - 获取文章评论
router.get('/', async (req, res) => {
  const articleId = parseInt(req.params.articleId);

  try {
    const result = await pool.query(
      'SELECT * FROM comments WHERE article_id = $1 ORDER BY id ASC',
      [articleId]
    );

    res.json({ code: 200, message: 'success', data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ code: 500, message: '服务器内部错误' });
  }
});

// POST /api/articles/:articleId/comments - 发表评论
router.post('/', async (req, res) => {
  const articleId = parseInt(req.params.articleId);
  const { author, content, date } = req.body;

  if (!content) {
    return res.status(400).json({ code: 400, message: '评论内容不能为空' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO comments (article_id, author, content, date, likes) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [
        articleId,
        author || '匿名用户',
        content,
        date || new Date().toISOString().split('T')[0],
        0,
      ]
    );

    res.status(201).json({ code: 201, message: '评论成功', data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ code: 500, message: '服务器内部错误' });
  }
});

export default router;
