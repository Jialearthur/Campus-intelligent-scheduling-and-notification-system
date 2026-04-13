const express = require('express');
const db = require('../database');

const router = express.Router();

// 获取排班列表
router.get('/', (req, res) => {
  db.all('SELECT * FROM schedules', (err, schedules) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(schedules);
  });
});

// 生成排班
router.post('/', (req, res) => {
  const { task_id } = req.body;

  // 获取任务信息
  db.get('SELECT * FROM tasks WHERE id = ?', [task_id], (err, task) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // 简化处理：直接为任务分配第一个可用成员
    db.get('SELECT * FROM members WHERE department_id = ? LIMIT 1', [task.department_id], (err, member) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (!member) {
        return res.status(400).json({ error: 'No members found in this department' });
      }

      // 创建排班记录
      db.run(
        'INSERT INTO schedules (task_id, member_id, status) VALUES (?, ?, ?)',
        [task_id, member.id, 'assigned'],
        function(err) {
          if (err) {
            return res.status(500).json({ error: 'Failed to create schedule' });
          }

          res.status(201).json([{ id: this.lastID, task_id, member_id: member.id, status: 'assigned' }]);
        }
      );
    });
  });
});

// 更新排班
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { member_id, status } = req.body;

  db.run(
    'UPDATE schedules SET member_id = ?, status = ? WHERE id = ?',
    [member_id, status, id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to update schedule' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Schedule not found' });
      }
      res.json({ id, member_id, status });
    }
  );
});

module.exports = router;