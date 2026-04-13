const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database');

const router = express.Router();
const SECRET_KEY = 'your-secret-key';

// 注册路由
router.post('/register', (req, res) => {
  const { email, password, role, name, department_id, phone, priority } = req.body;

  // 检查邮箱是否已存在
  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (user) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // 哈希密码
    const hashedPassword = bcrypt.hashSync(password, 8);

    // 开始事务
    db.run('BEGIN TRANSACTION', (err) => {
      if (err) {
        return res.status(500).json({ error: 'Transaction error' });
      }

      // 创建用户
      db.run(
        'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)',
        [email, hashedPassword, role],
        function(err) {
          if (err) {
            db.run('ROLLBACK');
            return res.status(500).json({ error: 'Failed to create user' });
          }

          const userId = this.lastID;

          // 创建成员
          db.run(
            'INSERT INTO members (user_id, department_id, name, phone, priority) VALUES (?, ?, ?, ?, ?)',
            [userId, department_id, name, phone, priority],
            (err) => {
              if (err) {
                db.run('ROLLBACK');
                return res.status(500).json({ error: 'Failed to create member' });
              }

              db.run('COMMIT', (err) => {
                if (err) {
                  return res.status(500).json({ error: 'Commit error' });
                }

                // 生成token
                const token = jwt.sign({ id: userId, role }, SECRET_KEY, { expiresIn: '24h' });
                res.status(201).json({ token, user: { id: userId, email, role, name } });
              });
            }
          );
        }
      );
    });
  });
});

// 登录路由
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // 查找用户
  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // 验证密码
    const passwordValid = bcrypt.compareSync(password, user.password_hash);
    if (!passwordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // 生成token
    const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '24h' });

    // 获取用户信息
    db.get('SELECT * FROM members WHERE user_id = ?', [user.id], (err, member) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      res.json({ 
        token, 
        user: { 
          id: user.id, 
          email: user.email, 
          role: user.role,
          name: member ? member.name : null
        } 
      });
    });
  });
});

module.exports = router;