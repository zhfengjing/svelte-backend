import { Router } from 'express';
import pool from '../db/index.js';
import { requireAuth, optionalAuth } from '../middleware/auth.js';

const router = Router();

/**
 * GET /api/authors/:authorId/follow
 * 查询当前用户是否已关注该作者，并返回关注总数
 */
router.get('/:authorId/follow', optionalAuth, async (req, res, next) => {
  const { authorId } = req.params;
  try {
    const countResult = await pool.query(
      'SELECT COUNT(*) AS count FROM follows WHERE author_id = $1',
      [authorId]
    );
    const followCount = parseInt(countResult.rows[0].count, 10);

    let isFollowing = false;
    if (req.followerId) {
      const checkResult = await pool.query(
        'SELECT 1 FROM follows WHERE follower_id = $1 AND author_id = $2',
        [req.followerId, authorId]
      );
      isFollowing = checkResult.rowCount > 0;
    }

    res.json({ success: true, isFollowing, followCount });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/authors/:authorId/follow
 * 关注作者
 */
router.post('/:authorId/follow', requireAuth, async (req, res, next) => {
  const { authorId } = req.params;
  const followerId = req.followerId;

  try {
    await pool.query(
      `INSERT INTO follows (follower_id, author_id)
       VALUES ($1, $2)
       ON CONFLICT (follower_id, author_id) DO NOTHING`,
      [followerId, authorId]
    );

    const { rows } = await pool.query(
      'SELECT COUNT(*) AS count FROM follows WHERE author_id = $1',
      [authorId]
    );

    res.json({
      success: true,
      message: '关注成功',
      isFollowing: true,
      followCount: parseInt(rows[0].count, 10),
    });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/authors/:authorId/follow
 * 取消关注作者
 */
router.delete('/:authorId/follow', requireAuth, async (req, res, next) => {
  const { authorId } = req.params;
  const followerId = req.followerId;

  try {
    await pool.query(
      'DELETE FROM follows WHERE follower_id = $1 AND author_id = $2',
      [followerId, authorId]
    );

    const { rows } = await pool.query(
      'SELECT COUNT(*) AS count FROM follows WHERE author_id = $1',
      [authorId]
    );

    res.json({
      success: true,
      message: '取消关注成功',
      isFollowing: false,
      followCount: parseInt(rows[0].count, 10),
    });
  } catch (err) {
    next(err);
  }
});

export default router;
