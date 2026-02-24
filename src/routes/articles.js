import { Router } from 'express';
import pool from '../db/index.js';

const router = Router();

// GET /api/articles/popular - 热门文章（必须在 /:id 之前）
router.get('/popular', async (req, res) => {
  const { timeRange = 'all' } = req.query;

  try {
    let query = 'SELECT * FROM articles WHERE popular = true';
    const params = [];

    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    if (timeRange === 'today') {
      params.push(now - dayMs);
      query += ` AND created_at > $${params.length}`;
    } else if (timeRange === 'week') {
      params.push(now - 7 * dayMs);
      query += ` AND created_at > $${params.length}`;
    } else if (timeRange === 'month') {
      params.push(now - 30 * dayMs);
      query += ` AND created_at > $${params.length}`;
    }

    query += ' ORDER BY created_at DESC';

    let result = await pool.query(query, params);

    // 如果时间范围过严导致无结果，返回全部热门文章
    if (result.rows.length === 0 && timeRange !== 'all') {
      result = await pool.query('SELECT * FROM articles WHERE popular = true ORDER BY created_at DESC');
    }

    res.json({ code: 200, message: 'success', data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ code: 500, message: '服务器内部错误' });
  }
});

// GET /api/articles - 文章列表
router.get('/', async (req, res) => {
  const { page = 1, pageSize = 10, category, search, featured, limit, exclude } = req.query;

  try {
    const conditions = [];
    const params = [];

    if (category) {
      params.push(category);
      conditions.push(`category_id = $${params.length}`);
    }

    if (search) {
      params.push(`%${search}%`);
      conditions.push(`(title ILIKE $${params.length} OR excerpt ILIKE $${params.length})`);
    }

    if (featured === 'true') {
      conditions.push('featured = true');
    }

    if (exclude) {
      params.push(parseInt(exclude));
      conditions.push(`id != $${params.length}`);
    }

    const where = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';

    const countResult = await pool.query(`SELECT COUNT(*) FROM articles ${where}`, params);
    const total = parseInt(countResult.rows[0].count);

    if (limit) {
      params.push(parseInt(limit));
      const result = await pool.query(
        `SELECT * FROM articles ${where} ORDER BY created_at DESC LIMIT $${params.length}`,
        params
      );
      return res.json({ code: 200, message: 'success', data: result.rows, total });
    }

    const pageNum = parseInt(page);
    const pageSizeNum = parseInt(pageSize);
    const offset = (pageNum - 1) * pageSizeNum;

    params.push(pageSizeNum, offset);
    const result = await pool.query(
      `SELECT * FROM articles ${where} ORDER BY created_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );

    res.json({
      code: 200,
      message: 'success',
      data: result.rows,
      total,
      page: pageNum,
      pageSize: pageSizeNum,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ code: 500, message: '服务器内部错误' });
  }
});

// GET /api/articles/:id - 文章详情
router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const result = await pool.query('SELECT * FROM articles WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ code: 404, message: '文章不存在' });
    }

    res.json({ code: 200, message: 'success', data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ code: 500, message: '服务器内部错误' });
  }
});

// POST /api/articles - 创建文章
router.post('/', async (req, res) => {
  const { title, excerpt, content, image, category, categoryId, tags, isDraft, author, date } = req.body;

  if (!title || !content) {
    return res.status(400).json({ code: 400, message: '标题和内容不能为空' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO articles
        (title, excerpt, content, image, author, date, views, read_time,
         category, category_id, tags, featured, popular, is_draft, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
       RETURNING *`,
      [
        title,
        excerpt || content.slice(0, 100) + '...',
        content,
        image || `https://picsum.photos/seed/${Date.now()}/800/400`,
        author || '匿名用户',
        date || new Date().toISOString().split('T')[0],
        '0',
        `${Math.max(1, Math.ceil(content.length / 500))} 分钟`,
        category || '未分类',
        categoryId || 'other',
        tags || [],
        false,
        false,
        isDraft || false,
        Date.now(),
      ]
    );

    res.status(201).json({ code: 201, message: '创建成功', data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ code: 500, message: '服务器内部错误' });
  }
});

// PUT /api/articles/:id - 更新文章
router.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { title, excerpt, content, image, author, date, views, readTime, category, categoryId, tags, featured, popular, isDraft } = req.body;

  try {
    const result = await pool.query(
      `UPDATE articles SET
        title = COALESCE($1, title),
        excerpt = COALESCE($2, excerpt),
        content = COALESCE($3, content),
        image = COALESCE($4, image),
        author = COALESCE($5, author),
        date = COALESCE($6, date),
        views = COALESCE($7, views),
        read_time = COALESCE($8, read_time),
        category = COALESCE($9, category),
        category_id = COALESCE($10, category_id),
        tags = COALESCE($11, tags),
        featured = COALESCE($12, featured),
        popular = COALESCE($13, popular),
        is_draft = COALESCE($14, is_draft)
       WHERE id = $15
       RETURNING *`,
      [title, excerpt, content, image, author, date, views, readTime,
       category, categoryId, tags, featured, popular, isDraft, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ code: 404, message: '文章不存在' });
    }

    res.json({ code: 200, message: '更新成功', data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ code: 500, message: '服务器内部错误' });
  }
});

// DELETE /api/articles/:id - 删除文章
router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const result = await pool.query('DELETE FROM articles WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ code: 404, message: '文章不存在' });
    }

    res.json({ code: 200, message: '删除成功' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ code: 500, message: '服务器内部错误' });
  }
});

export default router;
