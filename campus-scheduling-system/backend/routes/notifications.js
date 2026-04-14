const express = require('express');
const db = require('../database');
const nodemailer = require('nodemailer');
const authMiddleware = require('../middleware/auth');

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

// 发送通知并更新状态
const sendNotification = async (notification) => {
  const { id, channel, content, member_id } = notification;
  
  try {
    if (channel === 'email') {
      await sendEmail('user@example.com', '排班通知', content);
    } else if (channel === 'wechat') {
      await sendWechatNotification(member_id, content);
    } else if (channel === 'qywechat') {
      await sendQyWechatNotification(member_id, content);
    }
    
    db.run(
      'UPDATE notifications SET status = ?, sent_at = ? WHERE id = ?',
      ['sent', new Date().toISOString(), id]
    );
    
    return { success: true };
  } catch (error) {
    db.run(
      'UPDATE notifications SET status = ? WHERE id = ?',
      ['failed', id]
    );
    return { success: false, error };
  }
};

// 获取通知列表
router.get('/', authMiddleware, (req, res) => {
  const { status } = req.query;
  let query = 'SELECT * FROM notifications';
  const params = [];
  
  if (status) {
    query += ' WHERE status = ?';
    params.push(status);
  }
  
  query += ' ORDER BY created_at DESC';
  
  db.all(query, params, (err, notifications) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(notifications);
  });
});

// 发送通知
router.post('/', authMiddleware, async (req, res) => {
  const { schedule_id, member_id, channels, content } = req.body;

  try {
    const notifications = [];
    
    for (const channel of channels) {
      await new Promise((resolve, reject) => {
        db.run(
          'INSERT INTO notifications (schedule_id, member_id, channel, content, status, created_at) VALUES (?, ?, ?, ?, ?, ?)',
          [schedule_id, member_id, channel, content, 'pending', new Date().toISOString()],
          function(err) {
            if (err) {
              reject(err);
              return;
            }
            
            const newNotification = { 
              id: this.lastID, 
              schedule_id, 
              member_id, 
              channel, 
              content, 
              status: 'pending',
              created_at: new Date().toISOString()
            };
            
            notifications.push(newNotification);
            
            sendNotification(newNotification);
            resolve();
          }
        );
      });
    }
    
    res.status(201).json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create notification' });
  }
});

// 重新发送通知
router.post('/:id/resend', authMiddleware, (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM notifications WHERE id = ?', [id], (err, notification) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    
    db.run(
      'UPDATE notifications SET status = ?, sent_at = NULL WHERE id = ?',
      ['pending', id],
      (updateErr) => {
        if (updateErr) {
          return res.status(500).json({ error: 'Failed to update notification' });
        }
        
        const updatedNotification = { ...notification, status: 'pending', sent_at: null };
        sendNotification(updatedNotification);
        
        res.json({ message: 'Notification resent successfully' });
      }
    );
  });
});

module.exports = router;