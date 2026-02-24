import { Router } from 'express';
import pool from '../db/index.js';

const router = Router();

// GET /api/categories - 分类列表
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories ORDER BY id');
    res.json({ code: 200, message: 'success', data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ code: 500, message: '服务器内部错误' });
  }
});

export default router;
