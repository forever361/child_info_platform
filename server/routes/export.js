const express = require('express');
const router = express.Router();
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
const pool = require('../models/db');
const { authMiddleware } = require('../middleware/auth');

const exportsDir = process.env.EXPORTS_DIR || './uploads/exports';
if (!fs.existsSync(exportsDir)) {
  fs.mkdirSync(exportsDir, { recursive: true });
}

// 导出Excel
router.post('/excel', authMiddleware, async (req, res) => {
  try {
    const { ids, linked_id, target_name, start_date, end_date } = req.body;

    let sql = `
      SELECT o.*, u.name as user_name, u.class as user_class
      FROM observations o
      JOIN users u ON o.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    // 普通教师只能导出自己的记录
    if (req.user.role !== 'admin') {
      sql += ' AND o.user_id = ?';
      params.push(req.user.id);
    }

    if (ids && ids.length > 0) {
      sql += ` AND o.id IN (${ids.map(() => '?').join(',')})`;
      params.push(...ids);
    }

    if (linked_id) {
      sql += ' AND o.linked_id = ?';
      params.push(linked_id);
    }

    if (target_name) {
      sql += ' AND o.target_name = ?';
      params.push(target_name);
    }

    if (start_date) {
      sql += ' AND o.created_at >= ?';
      params.push(start_date);
    }

    if (end_date) {
      sql += ' AND o.created_at <= ?';
      params.push(end_date);
    }

    sql += ' ORDER BY o.created_at DESC';

    const [rows] = await pool.execute(sql, params);

    if (rows.length === 0) {
      return res.status(400).json({ error: '没有可导出的记录' });
    }

    // 构建Excel数据
    const data = rows.map(row => {
      let images = [];
      try {
        images = JSON.parse(row.images || '[]');
      } catch (e) {}

      return {
        '观察对象': row.target_name,
        '记录类型': row.record_type === 'individual' ? '个体' : '事件',
        '观察记录': row.content,
        '行为分析': row.analysis,
        '观察教师': row.user_name,
        '班级': row.user_class,
        '观察时间': row.created_at,
        '图片数量': images.length
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(data);

    // 设置列宽
    worksheet['!cols'] = [
      { wch: 12 }, // 观察对象
      { wch: 8 },  // 记录类型
      { wch: 40 }, // 观察记录
      { wch: 40 }, // 行为分析
      { wch: 10 }, // 观察教师
      { wch: 12 }, // 班级
      { wch: 18 }, // 观察时间
      { wch: 8 }  // 图片数量
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, '观察记录');

    const filename = `观察记录_${Date.now()}.xlsx`;
    const filepath = path.join(exportsDir, filename);
    XLSX.writeFile(workbook, filepath);

    res.json({
      success: true,
      file: `/files/exports/${filename}`
    });
  } catch (error) {
    console.error('Export Excel error:', error);
    res.status(500).json({ error: '导出Excel失败' });
  }
});

// 导出Word (简化版，生成带表格的HTML，可直接另存为Word)
router.post('/word', authMiddleware, async (req, res) => {
  try {
    const { ids, linked_id, target_name, start_date, end_date } = req.body;

    let sql = `
      SELECT o.*, u.name as user_name, u.class as user_class
      FROM observations o
      JOIN users u ON o.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (req.user.role !== 'admin') {
      sql += ' AND o.user_id = ?';
      params.push(req.user.id);
    }

    if (ids && ids.length > 0) {
      sql += ` AND o.id IN (${ids.map(() => '?').join(',')})`;
      params.push(...ids);
    }

    if (linked_id) {
      sql += ' AND o.linked_id = ?';
      params.push(linked_id);
    }

    if (target_name) {
      sql += ' AND o.target_name = ?';
      params.push(target_name);
    }

    if (start_date) {
      sql += ' AND o.created_at >= ?';
      params.push(start_date);
    }

    if (end_date) {
      sql += ' AND o.created_at <= ?';
      params.push(end_date);
    }

    sql += ' ORDER BY o.created_at DESC';

    const [rows] = await pool.execute(sql, params);

    if (rows.length === 0) {
      return res.status(400).json({ error: '没有可导出的记录' });
    }

    // 构建HTML内容（兼容Word）
    let html = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office"
            xmlns:w="urn:schemas-microsoft-com:office:word"
            xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8">
        <title>幼儿观察记录</title>
        <style>
          body { font-family: '宋体', serif; font-size: 12pt; }
          h1 { text-align: center; font-size: 18pt; }
          table { border-collapse: collapse; width: 100%; margin-top: 20px; }
          th, td { border: 1px solid #000; padding: 8px; vertical-align: top; }
          th { background: #f0f0f0; }
          .label { font-weight: bold; width: 80px; }
          .content { white-space: pre-wrap; }
        </style>
      </head>
      <body>
        <h1>幼儿观察记录</h1>
    `;

    rows.forEach((row, index) => {
      let images = [];
      try {
        images = JSON.parse(row.images || '[]');
      } catch (e) {}

      html += `
        <table>
          <tr><td class="label">观察对象</td><td>${row.target_name}</td></tr>
          <tr><td class="label">记录类型</td><td>${row.record_type === 'individual' ? '个体' : '事件'}</td></tr>
          <tr><td class="label">观察教师</td><td>${row.user_name} (${row.user_class || ''})</td></tr>
          <tr><td class="label">观察时间</td><td>${row.created_at}</td></tr>
          <tr><td class="label">观察记录</td><td class="content">${row.content || ''}</td></tr>
          <tr><td class="label">行为分析</td><td class="content">${row.analysis || ''}</td></tr>
        </table>
        <br>
      `;
    });

    html += '</body></html>';

    const filename = `观察记录_${Date.now()}.doc`;
    const filepath = path.join(exportsDir, filename);
    fs.writeFileSync(filepath, html, 'utf8');

    res.json({
      success: true,
      file: `/files/exports/${filename}`
    });
  } catch (error) {
    console.error('Export Word error:', error);
    res.status(500).json({ error: '导出Word失败' });
  }
});

module.exports = router;
