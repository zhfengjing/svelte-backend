/**
 * 认证中间件
 * 从 Authorization: Bearer <token> 头中提取用户标识
 * token 直接作为 followerId 使用（无需真实 JWT 验证）
 */

export const optionalAuth = (req, _res, next) => {
  const auth = req.headers.authorization;
  if (auth && auth.startsWith('Bearer ')) {
    req.followerId = auth.slice(7).trim();
  }
  next();
};

export const requireAuth = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ code: 401, message: '请提供认证 Token' });
  }
  const token = auth.slice(7).trim();
  if (!token) {
    return res.status(401).json({ code: 401, message: '认证 Token 不能为空' });
  }
  req.followerId = token;
  next();
};
