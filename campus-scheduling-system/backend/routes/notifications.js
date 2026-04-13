const express = require('express');
const db = require('../database');
const nodemailer = require('nodemailer');

const router = express.Router();

// 模拟邮件发送
const sendEmail = (to, subject, text) => {
  // 这里只是模拟发送，实际项目中需要配置真实的邮件服务
  console.log(`Sending email to ${to}: ${subject} - ${text}`);
  return Promise.resolve();
};

// 模拟微信通知
const sendWechatNotification = (userId, content) => {
  // 这里只是模拟发送，实际项目中需要配置真实的微信API
  console.log(`Sending wechat notification to user ${userId}: ${content}`);
  return Promise.resolve();
};

// 模拟企业微信通知
const sendQyWechatNotification = (userId, content) => {
  // 这里只是模拟发送，实际项目中需要配置真实的企业微信API
  console.log(`Sending QY wechat notification to user ${userId}: ${content}`);
  return Promise.resolve();
};

// 获取通知列表
router.get('/', (req, res) => {
  db.all('SELECT * FROM notifications', (err, notifications) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(notifications);
  });
});

// 发送通知
router.post('/', async (req, res) => {
  const { schedule_id, member_id, channels, content } = req.body;

  // 开始事务
  db.run('BEGIN TRANSACTION', (err) => {
    if (err) {
      return res.status(500).json({ error: 'Transaction error' });
    }

    const notifications = [];
    let sentCount = 0;

    channels.forEach(channel => {
      db.run(
        'INSERT INTO notifications (schedule_id, member_id, channel, content, status) VALUES (?, ?, ?, ?, ?)',
        [schedule_id, member_id, channel, content, 'pending'],
        function(err) {
          if (err) {
            db.run('ROLLBACK');
            return res.status(500).json({ error: 'Failed to create notification' });
          }

          notifications.push({ id: this.lastID, schedule_id, member_id, channel, content, status: 'pending' });
          sentCount++;

          // 模拟发送通知
          if (channel === 'email') {
            sendEmail('user@example.com', '排班通知', content)
              .then(() => {
                db.run('UPDATE notifications SET status = ?, sent_at = ? WHERE id = ?', ['sent', new Date().toISOString(), this.lastID]);
              })
              .catch(() => {
                db.run('UPDATE notifications SET status = ? WHERE id = ?', ['failed', this.lastID]);
              });
          } else if (channel === 'wechat') {
            sendWechatNotification(member_id, content)
              .then(() => {
                db.run('UPDATE notifications SET status = ?, sent_at = ? WHERE id = ?', ['sent', new Date().toISOString(), this.lastID]);
              })
              .catch(() => {
                db.run('UPDATE notifications SET status = ? WHERE id = ?', ['failed', this.lastID]);
              });
          } else if (channel === 'qywechat') {
            sendQyWechatNotification(member_id, content)
              .then(() => {
                db.run('UPDATE notifications SET status = ?, sent_at = ? WHERE id = ?', ['sent', new Date().toISOString(), this.lastID]);
              })
              .catch(() => {
                db.run('UPDATE notifications SET status = ? WHERE id = ?', ['failed', this.lastID]);
              });
          }

          if (sentCount === channels.length) {
            db.run('COMMIT', (err) => {
              if (err) {
                return res.status(500).json({ error: 'Commit error' });
              }
              res.status(201).json(notifications);
            });
          }
        }
      );
    });
  });
});

module.exports = router;