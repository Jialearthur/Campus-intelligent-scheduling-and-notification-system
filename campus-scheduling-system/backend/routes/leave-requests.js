const express = require('express');
const db = require('../database');

const router = express.Router();

// 获取请假申请列表
router.get('/', (req, res) => {
  db.all(
    `
    SELECT lr.*, m.name as member_name, s.task_id, t.title as task_title
    FROM leave_requests lr
    LEFT JOIN members m ON lr.member_id = m.id
    LEFT JOIN schedules s ON lr.schedule_id = s.id
    LEFT JOIN tasks t ON s.task_id = t.id
    ORDER BY lr.created_at DESC
    `,
    (err, leaveRequests) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(leaveRequests);
    }
  );
});

// 获取成员的请假申请
router.get('/member/:member_id', (req, res) => {
  const { member_id } = req.params;
  db.all(
    `
    SELECT lr.*, s.task_id, t.title as task_title
    FROM leave_requests lr
    LEFT JOIN schedules s ON lr.schedule_id = s.id
    LEFT JOIN tasks t ON s.task_id = t.id
    WHERE lr.member_id = ?
    ORDER BY lr.created_at DESC
    `,
    [member_id],
    (err, leaveRequests) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(leaveRequests);
    }
  );
});

// 创建请假申请
router.post('/', (req, res) => {
  const { schedule_id, member_id, reason, start_time, end_time } = req.body;
  
  db.run(
    'INSERT INTO leave_requests (schedule_id, member_id, reason, start_time, end_time) VALUES (?, ?, ?, ?, ?)',
    [schedule_id, member_id, reason, start_time, end_time],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      db.get(
        `
        SELECT lr.*, m.name as member_name, s.task_id, t.title as task_title
        FROM leave_requests lr
        LEFT JOIN members m ON lr.member_id = m.id
        LEFT JOIN schedules s ON lr.schedule_id = s.id
        LEFT JOIN tasks t ON s.task_id = t.id
        WHERE lr.id = ?
        `,
        [this.lastID],
        (err, leaveRequest) => {
          if (err) {
            return res.status(500).json({ error: 'Database error' });
          }
          res.status(201).json(leaveRequest);
        }
      );
    }
  );
});

// 审批请假申请
router.put('/:id/approve', (req, res) => {
  const { id } = req.params;
  const { approved_by, status } = req.body;
  
  db.run(
    'UPDATE leave_requests SET status = ?, approved_by = ? WHERE id = ?',
    [status, approved_by, id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      // 如果批准请假，需要重新排班
      if (status === 'approved') {
        db.get(
          'SELECT schedule_id, member_id FROM leave_requests WHERE id = ?',
          [id],
          (err, leaveRequest) => {
            if (err) {
              return res.status(500).json({ error: 'Database error' });
            }
            
            // 这里可以添加重新排班的逻辑
            // 例如，调用排班算法为该任务重新分配成员
            
            db.get(
              `
              SELECT lr.*, m.name as member_name, s.task_id, t.title as task_title
              FROM leave_requests lr
              LEFT JOIN members m ON lr.member_id = m.id
              LEFT JOIN schedules s ON lr.schedule_id = s.id
              LEFT JOIN tasks t ON s.task_id = t.id
              WHERE lr.id = ?
              `,
              [id],
              (err, updatedLeaveRequest) => {
                if (err) {
                  return res.status(500).json({ error: 'Database error' });
                }
                res.json(updatedLeaveRequest);
              }
            );
          }
        );
      } else {
        db.get(
          `
          SELECT lr.*, m.name as member_name, s.task_id, t.title as task_title
          FROM leave_requests lr
          LEFT JOIN members m ON lr.member_id = m.id
          LEFT JOIN schedules s ON lr.schedule_id = s.id
          LEFT JOIN tasks t ON s.task_id = t.id
          WHERE lr.id = ?
          `,
          [id],
          (err, updatedLeaveRequest) => {
            if (err) {
              return res.status(500).json({ error: 'Database error' });
            }
            res.json(updatedLeaveRequest);
          }
        );
      }
    }
  );
});

// 删除请假申请
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  
  db.run(
    'DELETE FROM leave_requests WHERE id = ?',
    [id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ message: 'Leave request deleted successfully' });
    }
  );
});

module.exports = router;
