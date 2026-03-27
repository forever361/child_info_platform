const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/auth');
const pool = require('../models/db');

// 微信登录
router.post('/login', async (req, res) => {
  try {
    const { code, userInfo } = req.body;

    if (!code) {
      return res.status(400).json({ error: '缺少code参数' });
    }

    // TODO: 实际需要调用微信接口换取openid
    // const wechatUrl = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=authorization_code`;
    // const wechatRes = await axios.get(wechatUrl);
    // const openid = wechatRes.data.openid;

    // 开发环境：用userInfo.name作为唯一标识，避免每次创建新用户
    const name = userInfo?.name || '新教师';
    let user;

    // 先尝试根据name查找用户
    let [users] = await pool.execute(
      'SELECT * FROM users WHERE name = ? LIMIT 1',
      [name]
    );

    if (users.length === 0) {
      // 新用户自动注册
      const className = userInfo?.class || '';
      const [result] = await pool.execute(
        'INSERT INTO users (openid, name, class) VALUES (?, ?, ?)',
        [code, name, className]
      );
      user = {
        id: result.insertId,
        openid: code,
        name,
        class: className,
        role: 'teacher'
      };
    } else {
      user = users[0];
      // 更新openid
      await pool.execute(
        'UPDATE users SET openid = ? WHERE id = ?',
        [code, user.id]
      );
    }

    // 生成token
    const token = jwt.sign(
      { id: user.id, openid: user.openid, role: user.role },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        class: user.class
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: '登录失败' });
  }
});

// 获取当前用户信息
router.get('/me', require('../middleware/auth').authMiddleware, async (req, res) => {
  try {
    const [users] = await pool.execute(
      'SELECT id, name, role, class, avatar_url FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: '用户不存在' });
    }

    res.json({ user: users[0] });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: '获取用户信息失败' });
  }
});

module.exports = router;
