import { Router } from 'express';
import pool from '../db/index.js';

const router = Router();

// GET /api/tags - 标签列表
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT name FROM tags ORDER BY id');
    const tags = result.rows.map(r => r.name);
    res.json({ code: 200, message: 'success', data: tags });
  } catch (err) {
    console.error(err);
    res.status(500).json({ code: 500, message: '服务器内部错误' });
  }
});

export default router;
