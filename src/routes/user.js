import { Router } from 'express';
import pool from '../db/index.js';

const router = Router();

// 为没有 id 的 timeline 条目生成 id（兼容旧数据）
function ensureTimelineIds(timeline) {
  let changed = false;
  const result = (timeline || []).map(item => {
    if (!item.id) {
      changed = true;
      return { id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7), ...item };
    }
    return item;
  });
  return { timeline: result, changed };
}

// GET /api/user/profile - 用户信息
router.get('/profile', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM user_profiles LIMIT 1');

    if (result.rows.length === 0) {
      return res.status(404).json({ code: 404, message: '用户不存在' });
    }

    const row = result.rows[0];

    // 自动为旧数据中没有 id 的 timeline 条目补全 id
    const { timeline, changed } = ensureTimelineIds(row.timeline);
    if (changed) {
      await pool.query('UPDATE user_profiles SET timeline = $1 WHERE id = $2', [JSON.stringify(timeline), row.id]);
    }

    const profile = {
      name: row.name,
      title: row.title,
      bio: row.bio,
      avatar: row.avatar,
      skills: row.skills,
      timeline,
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

// GET /api/user/timeline - 获取职业历程列表
router.get('/timeline', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, timeline FROM user_profiles LIMIT 1');
    if (result.rows.length === 0) {
      return res.json({ code: 200, message: 'success', data: [] });
    }
    const row = result.rows[0];
    const { timeline, changed } = ensureTimelineIds(row.timeline);
    if (changed) {
      await pool.query('UPDATE user_profiles SET timeline = $1 WHERE id = $2', [JSON.stringify(timeline), row.id]);
    }
    res.json({ code: 200, message: 'success', data: timeline });
  } catch (err) {
    console.error(err);
    res.status(500).json({ code: 500, message: '服务器内部错误' });
  }
});

// POST /api/user/timeline - 新增职业经历
router.post('/timeline', async (req, res) => {
  try {
    const { year, title, company, description } = req.body;
    if (!year || !title) {
      return res.status(400).json({ code: 400, message: '年份和职位标题为必填项' });
    }
    const result = await pool.query('SELECT id, timeline FROM user_profiles LIMIT 1');
    if (result.rows.length === 0) {
      return res.status(404).json({ code: 404, message: '用户不存在' });
    }
    const row = result.rows[0];
    const { timeline } = ensureTimelineIds(row.timeline);
    const newItem = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      year: year.trim(),
      title: title.trim(),
      company: (company || '').trim(),
      description: (description || '').trim(),
    };
    const updated = [newItem, ...timeline];
    await pool.query('UPDATE user_profiles SET timeline = $1 WHERE id = $2', [JSON.stringify(updated), row.id]);
    res.json({ code: 200, message: '添加成功', data: newItem });
  } catch (err) {
    console.error(err);
    res.status(500).json({ code: 500, message: '服务器内部错误' });
  }
});

// PUT /api/user/timeline/:id - 更新职业经历
router.put('/timeline/:itemId', async (req, res) => {
  try {
    const { itemId } = req.params;
    const { year, title, company, description } = req.body;
    if (!year || !title) {
      return res.status(400).json({ code: 400, message: '年份和职位标题为必填项' });
    }
    const result = await pool.query('SELECT id, timeline FROM user_profiles LIMIT 1');
    if (result.rows.length === 0) {
      return res.status(404).json({ code: 404, message: '用户不存在' });
    }
    const row = result.rows[0];
    const { timeline } = ensureTimelineIds(row.timeline);
    const index = timeline.findIndex(item => item.id === itemId);
    if (index === -1) {
      return res.status(404).json({ code: 404, message: '该职业经历不存在' });
    }
    const updatedItem = {
      ...timeline[index],
      year: year.trim(),
      title: title.trim(),
      company: (company || '').trim(),
      description: (description || '').trim(),
    };
    timeline[index] = updatedItem;
    await pool.query('UPDATE user_profiles SET timeline = $1 WHERE id = $2', [JSON.stringify(timeline), row.id]);
    res.json({ code: 200, message: '更新成功', data: updatedItem });
  } catch (err) {
    console.error(err);
    res.status(500).json({ code: 500, message: '服务器内部错误' });
  }
});

// DELETE /api/user/timeline/:id - 删除职业经历
router.delete('/timeline/:itemId', async (req, res) => {
  try {
    const { itemId } = req.params;
    const result = await pool.query('SELECT id, timeline FROM user_profiles LIMIT 1');
    if (result.rows.length === 0) {
      return res.status(404).json({ code: 404, message: '用户不存在' });
    }
    const row = result.rows[0];
    const { timeline } = ensureTimelineIds(row.timeline);
    const filtered = timeline.filter(item => item.id !== itemId);
    if (filtered.length === timeline.length) {
      return res.status(404).json({ code: 404, message: '该职业经历不存在' });
    }
    await pool.query('UPDATE user_profiles SET timeline = $1 WHERE id = $2', [JSON.stringify(filtered), row.id]);
    res.json({ code: 200, message: '删除成功' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ code: 500, message: '服务器内部错误' });
  }
});

export default router;
