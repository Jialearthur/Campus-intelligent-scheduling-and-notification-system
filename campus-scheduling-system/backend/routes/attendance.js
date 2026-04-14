const express = require('express');
const db = require('../database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// 获取考勤列表
router.get('/', authMiddleware, (req, res) => {
  db.all(
    `
    SELECT a.*, m.name as member_name, s.task_id, t.title as task_title
    FROM attendance a
    LEFT JOIN members m ON a.member_id = m.id
    LEFT JOIN schedules s ON a.schedule_id = s.id
    LEFT JOIN tasks t ON s.task_id = t.id
    ORDER BY a.created_at DESC
    `,
    (err, attendance) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(attendance);
    }
  );
});

// 获取成员的考勤记录
router.get('/member/:member_id', authMiddleware, (req, res) => {
  const { member_id } = req.params;
  db.all(
    `
    SELECT a.*, s.task_id, t.title as task_title
    FROM attendance a
    LEFT JOIN schedules s ON a.schedule_id = s.id
    LEFT JOIN tasks t ON s.task_id = t.id
    WHERE a.member_id = ?
    ORDER BY a.created_at DESC
    `,
    [member_id],
    (err, attendance) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(attendance);
    }
  );
});

// 获取任务的考勤记录
router.get('/task/:task_id', authMiddleware, (req, res) => {
  const { task_id } = req.params;
  db.all(
    `
    SELECT a.*, m.name as member_name
    FROM attendance a
    LEFT JOIN members m ON a.member_id = m.id
    LEFT JOIN schedules s ON a.schedule_id = s.id
    WHERE s.task_id = ?
    ORDER BY a.created_at DESC
    `,
    [task_id],
    (err, attendance) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(attendance);
    }
  );
});

// 签到
router.post('/check-in', authMiddleware, (req, res) => {
  const { schedule_id, member_id } = req.body;
  const check_in_time = new Date().toISOString();
  
  db.run(
    'UPDATE attendance SET status = ?, check_in_time = ? WHERE schedule_id = ? AND member_id = ?',
    ['present', check_in_time, schedule_id, member_id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      // 如果没有找到记录，创建新的考勤记录
      if (this.changes === 0) {
        db.run(
          'INSERT INTO attendance (schedule_id, member_id, status, check_in_time) VALUES (?, ?, ?, ?)',
          [schedule_id, member_id, 'present', check_in_time],
          function(err) {
            if (err) {
              return res.status(500).json({ error: 'Database error' });
            }
            
            db.get(
              `
              SELECT a.*, m.name as member_name, s.task_id, t.title as task_title
              FROM attendance a
              LEFT JOIN members m ON a.member_id = m.id
              LEFT JOIN schedules s ON a.schedule_id = s.id
              LEFT JOIN tasks t ON s.task_id = t.id
              WHERE a.id = ?
              `,
              [this.lastID],
              (err, attendance) => {
                if (err) {
                  return res.status(500).json({ error: 'Database error' });
                }
                res.status(201).json(attendance);
              }
            );
          }
        );
      } else {
        db.get(
          `
          SELECT a.*, m.name as member_name, s.task_id, t.title as task_title
          FROM attendance a
          LEFT JOIN members m ON a.member_id = m.id
          LEFT JOIN schedules s ON a.schedule_id = s.id
          LEFT JOIN tasks t ON s.task_id = t.id
          WHERE a.schedule_id = ? AND a.member_id = ?
          `,
          [schedule_id, member_id],
          (err, attendance) => {
            if (err) {
              return res.status(500).json({ error: 'Database error' });
            }
            res.json(attendance);
          }
        );
      }
    }
  );
});

// 批量签到（扫码签到）
router.post('/batch-check-in', authMiddleware, (req, res) => {
  const { schedule_id, member_ids } = req.body;
  const check_in_time = new Date().toISOString();
  const results = [];
  
  // 遍历成员ID，逐个签到
  member_ids.forEach((member_id, index) => {
    db.run(
      'UPDATE attendance SET status = ?, check_in_time = ? WHERE schedule_id = ? AND member_id = ?',
      ['present', check_in_time, schedule_id, member_id],
      function(err) {
        if (err) {
          results.push({ member_id, error: 'Database error' });
        } else {
          if (this.changes === 0) {
            db.run(
              'INSERT INTO attendance (schedule_id, member_id, status, check_in_time) VALUES (?, ?, ?, ?)',
              [schedule_id, member_id, 'present', check_in_time],
              function(err) {
                if (err) {
                  results.push({ member_id, error: 'Database error' });
                } else {
                  results.push({ member_id, success: true });
                }
                
                // 所有成员处理完成后返回结果
                if (index === member_ids.length - 1) {
                  res.json(results);
                }
              }
            );
          } else {
            results.push({ member_id, success: true });
            
            // 所有成员处理完成后返回结果
            if (index === member_ids.length - 1) {
              res.json(results);
            }
          }
        }
      }
    );
  });
});

// 更新考勤状态
router.put('/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  db.run(
    'UPDATE attendance SET status = ? WHERE id = ?',
    [status, id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      db.get(
        `
        SELECT a.*, m.name as member_name, s.task_id, t.title as task_title
        FROM attendance a
        LEFT JOIN members m ON a.member_id = m.id
        LEFT JOIN schedules s ON a.schedule_id = s.id
        LEFT JOIN tasks t ON s.task_id = t.id
        WHERE a.id = ?
        `,
        [id],
        (err, attendance) => {
          if (err) {
            return res.status(500).json({ error: 'Database error' });
          }
          res.json(attendance);
        }
      );
    }
  );
});

// 删除考勤记录
router.delete('/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  
  db.run(
    'DELETE FROM attendance WHERE id = ?',
    [id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ message: 'Attendance record deleted successfully' });
    }
  );
});

module.exports = router;
