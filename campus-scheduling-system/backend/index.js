const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(bodyParser.json());

// 测试路由
app.get('/', (req, res) => {
  res.json({ message: 'Campus Scheduling System API' });
});

// 导入路由
const authRoutes = require('./routes/auth');
const memberRoutes = require('./routes/members');
const taskRoutes = require('./routes/tasks');
const scheduleRoutes = require('./routes/schedules');
const notificationRoutes = require('./routes/notifications');
const statisticsRoutes = require('./routes/statistics');

// 使用路由
app.use('/api/auth', authRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/statistics', statisticsRoutes);

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// 错误处理
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;