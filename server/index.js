const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件服务（图片和导出文件）
const uploadsPath = process.env.UPLOAD_PATH || './uploads';
app.use('/files', express.static(path.join(__dirname, uploadsPath)));

// 路由
const authRoutes = require('./routes/auth');
const observationRoutes = require('./routes/observations');
const exportRoutes = require('./routes/export');

app.use('/api/auth', authRoutes);
app.use('/api/observations', observationRoutes);
app.use('/api/export', exportRoutes);

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// 错误处理
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
