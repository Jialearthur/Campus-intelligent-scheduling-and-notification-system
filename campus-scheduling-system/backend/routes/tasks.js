const express = require('express');
const db = require('../database');

const router = express.Router();

// 获取任务列表
router.get('/', (req, res) => {
  db.all('SELECT * FROM tasks', (err, tasks) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(tasks);
  });
});

// 创建值班任务
router.post('/', (req, res) => {
  const { department_id, type, title, description, start_time, end_time, required_count, created_by } = req.body;

  db.run(
    'INSERT INTO tasks (department_id, type, title, description, start_time, end_time, required_count, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [department_id, type, title, description, start_time, end_time, required_count, created_by],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to create task' });
      }
      res.status(201).json({ 
        id: this.lastID, 
        department_id, 
        type, 
        title, 
        description, 
        start_time, 
        end_time, 
        required_count, 
        created_by 
      });
    }
  );
});

// 更新任务信息
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { department_id, type, title, description, start_time, end_time, required_count } = req.body;

  db.run(
    'UPDATE tasks SET department_id = ?, type = ?, title = ?, description = ?, start_time = ?, end_time = ?, required_count = ? WHERE id = ?',
    [department_id, type, title, description, start_time, end_time, required_count, id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to update task' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Task not found' });
      }
      res.json({ 
        id, 
        department_id, 
        type, 
        title, 
        description, 
        start_time, 
        end_time, 
        required_count 
      });
    }
  );
});

// 删除任务
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  // 开始事务
  db.run('BEGIN TRANSACTION', (err) => {
    if (err) {
      return res.status(500).json({ error: 'Transaction error' });
    }

    // 删除与任务相关的排班
    db.run('DELETE FROM schedules WHERE task_id = ?', [id], (err) => {
      if (err) {
        db.run('ROLLBACK');
        return res.status(500).json({ error: 'Failed to delete schedules' });
      }

      // 删除任务
      db.run('DELETE FROM tasks WHERE id = ?', [id], function(err) {
        if (err) {
          db.run('ROLLBACK');
          return res.status(500).json({ error: 'Failed to delete task' });
        }

        if (this.changes === 0) {
          db.run('ROLLBACK');
          return res.status(404).json({ error: 'Task not found' });
        }

        db.run('COMMIT', (err) => {
          if (err) {
            return res.status(500).json({ error: 'Commit error' });
          }
          res.json({ message: 'Task deleted successfully' });
        });
      });
    });
  });
});

module.exports = router;