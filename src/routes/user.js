import { Router } from 'express';
import pool from '../db/index.js';

const router = Router();

// GET /api/user/profile - 用户信息
router.get('/profile', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM user_profiles LIMIT 1');

    if (result.rows.length === 0) {
      return res.status(404).json({ code: 404, message: '用户不存在' });
    }

    const row = result.rows[0];
    const profile = {
      name: row.name,
      title: row.title,
      bio: row.bio,
      avatar: row.avatar,
      skills: row.skills,
      timeline: row.timeline,
      projects: row.projects,
      socialLinks: row.social_links,
      stats: row.stats,
    };

    res.json({ code: 200, message: 'success', data: profile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ code: 500, message: '服务器内部错误' });
  }
});

// GET /api/user/stats - 用户统计
router.get('/stats', async (req, res) => {
  try {
    const result = await pool.query('SELECT icon, number, label FROM user_stats ORDER BY id');
    res.json({ code: 200, message: 'success', data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ code: 500, message: '服务器内部错误' });
  }
});

export default router;
