const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pool = require('../models/db');
const { authMiddleware } = require('../middleware/auth');

// 文件上传配置
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const imagesDir = process.env.IMAGES_DIR || './uploads/images';
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }
    cb(null, imagesDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}_${Math.random().toString(36).substr(2, 6)}${ext}`;
    cb(null, filename);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) {
      cb(null, true);
    } else {
      cb(new Error('仅支持图片文件'));
    }
  }
});

// 获取记录列表
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 20, target_name, record_type, start_date, end_date } = req.query;
    const offset = (page - 1) * limit;

    let sql = 'SELECT o.*, u.name as user_name, u.class as user_class FROM observations o JOIN users u ON o.user_id = u.id WHERE 1=1';
    const params = [];

    // 普通教师只能看自己的记录，园长可以看全部
    if (req.user.role !== 'admin') {
      sql += ' AND o.user_id = ?';
      params.push(req.user.id);
    }

    if (target_name) {
      sql += ' AND o.target_name LIKE ?';
      params.push(`%${target_name}%`);
    }

    if (record_type) {
      sql += ' AND o.record_type = ?';
      params.push(record_type);
    }

    if (start_date) {
      sql += ' AND o.created_at >= ?';
      params.push(start_date);
    }

    if (end_date) {
      sql += ' AND o.created_at <= ?';
      params.push(end_date);
    }

    sql += ' ORDER BY o.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [rows] = await pool.execute(sql, params);

    // 解析 images 字段为数组
    rows.forEach(row => {
      try {
        row.images = JSON.parse(row.images || '[]');
      } catch (e) {
        row.images = [];
      }
    });

    // 获取总数
    let countSql = 'SELECT COUNT(*) as total FROM observations WHERE 1=1';
    const countParams = [];
    if (req.user.role !== 'admin') {
      countSql += ' AND user_id = ?';
      countParams.push(req.user.id);
    }
    if (target_name) {
      countSql += ' AND target_name LIKE ?';
      countParams.push(`%${target_name}%`);
    }
    const [countResult] = await pool.execute(countSql, countParams);

    res.json({
      list: rows,
      total: countResult[0].total,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (error) {
    console.error('List observations error:', error);
    res.status(500).json({ error: '获取记录失败' });
  }
});

// 获取单条记录详情
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT o.*, u.name as user_name, u.class as user_class FROM observations o JOIN users u ON o.user_id = u.id WHERE o.id = ?',
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: '记录不存在' });
    }

    // 普通教师只能查看自己的记录
    if (req.user.role !== 'admin' && rows[0].user_id !== req.user.id) {
      return res.status(403).json({ error: '权限不足' });
    }

    // 解析 images 字段
    try {
      rows[0].images = JSON.parse(rows[0].images || '[]');
    } catch (e) {
      rows[0].images = [];
    }

    res.json({ observation: rows[0] });
  } catch (error) {
    console.error('Get observation error:', error);
    res.status(500).json({ error: '获取记录失败' });
  }
});

// 获取连续观察记录
router.get('/linked/:linkedId', authMiddleware, async (req, res) => {
  try {
    const { linkedId } = req.params;

    let sql = 'SELECT o.*, u.name as user_name FROM observations o JOIN users u ON o.user_id = u.id WHERE o.linked_id = ?';
    const params = [linkedId];

    if (req.user.role !== 'admin') {
      sql += ' AND o.user_id = ?';
      params.push(req.user.id);
    }

    sql += ' ORDER BY o.created_at ASC';

    const [rows] = await pool.execute(sql, params);
    
    // 解析 images 字段
    rows.forEach(row => {
      try {
        row.images = JSON.parse(row.images || '[]');
      } catch (e) {
        row.images = [];
      }
    });
    
    res.json({ observations: rows });
  } catch (error) {
    console.error('Get linked observations error:', error);
    res.status(500).json({ error: '获取连续记录失败' });
  }
});

// 单图上传（返回URL，用于多图场景）
router.post('/upload', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '没有上传文件' });
    }
    const imageUrl = `/files/images/${req.file.filename}`;
    res.json({ url: imageUrl });
  } catch (error) {
    console.error('Upload image error:', error);
    res.status(500).json({ error: '上传失败' });
  }
});

// 创建记录
router.post('/', authMiddleware, upload.array('images', 9), async (req, res) => {
  try {
    const { record_type, target_name, content, analysis, linked_id } = req.body;

    if (!record_type || !target_name) {
      return res.status(400).json({ error: '缺少必要参数' });
    }

    // 处理图片
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(f => `/files/images/${f.filename}`);
    }

    // 如果没有linked_id，生成新的
    const newLinkedId = linked_id || uuidv4();

    const [result] = await pool.execute(
      'INSERT INTO observations (user_id, record_type, target_name, content, analysis, images, linked_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
      [req.user.id, record_type, target_name, content || '', analysis || '', JSON.stringify(images), newLinkedId]
    );

    res.json({
      id: result.insertId,
      linked_id: newLinkedId,
      images
    });
  } catch (error) {
    console.error('Create observation error:', error);
    res.status(500).json({ error: '创建记录失败' });
  }
});

// 更新记录
router.put('/:id', authMiddleware, upload.array('images', 9), async (req, res) => {
  try {
    const { id } = req.params;
    const { record_type, target_name, content, analysis, keep_images } = req.body;

    // 检查权限
    const [rows] = await pool.execute(
      'SELECT * FROM observations WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: '记录不存在' });
    }

    if (req.user.role !== 'admin' && rows[0].user_id !== req.user.id) {
      return res.status(403).json({ error: '权限不足' });
    }

    // 处理图片
    let existingImages = [];
    try {
      existingImages = JSON.parse(rows[0].images || '[]');
    } catch (e) {}

    // 合并保留的图片和新上传的图片
    let newImages = [];
    if (keep_images) {
      const keepArr = Array.isArray(keep_images) ? keep_images : [keep_images];
      newImages = [...existingImages.filter(img => keepArr.includes(img))];
    }

    if (req.files && req.files.length > 0) {
      const newImgPaths = req.files.map(f => `/files/images/${f.filename}`);
      newImages = [...newImages, ...newImgPaths];
    }

    await pool.execute(
      'UPDATE observations SET record_type = ?, target_name = ?, content = ?, analysis = ?, images = ? WHERE id = ?',
      [record_type, target_name, content, analysis, JSON.stringify(newImages), id]
    );

    res.json({ success: true, images: newImages });
  } catch (error) {
    console.error('Update observation error:', error);
    res.status(500).json({ error: '更新记录失败' });
  }
});

// 删除记录
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // 检查权限
    const [rows] = await pool.execute(
      'SELECT * FROM observations WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: '记录不存在' });
    }

    if (req.user.role !== 'admin' && rows[0].user_id !== req.user.id) {
      return res.status(403).json({ error: '权限不足' });
    }

    await pool.execute('DELETE FROM observations WHERE id = ?', [id]);

    res.json({ success: true });
  } catch (error) {
    console.error('Delete observation error:', error);
    res.status(500).json({ error: '删除记录失败' });
  }
});

module.exports = router;
