const express = require('express');
const db = require('../database');

const router = express.Router();

// 获取成员列表
router.get('/', (req, res) => {
  db.all('SELECT * FROM members', (err, members) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(members);
  });
});

// 创建成员
router.post('/', (req, res) => {
  const { user_id, department_id, name, phone, priority } = req.body;

  db.run(
    'INSERT INTO members (user_id, department_id, name, phone, priority) VALUES (?, ?, ?, ?, ?)',
    [user_id, department_id, name, phone, priority],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to create member' });
      }
      res.status(201).json({ id: this.lastID, user_id, department_id, name, phone, priority });
    }
  );
});

// 更新成员信息
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { department_id, name, phone, priority } = req.body;

  db.run(
    'UPDATE members SET department_id = ?, name = ?, phone = ?, priority = ? WHERE id = ?',
    [department_id, name, phone, priority, id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to update member' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Member not found' });
      }
      res.json({ id, department_id, name, phone, priority });
    }
  );
});

// 删除成员
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  // 开始事务
  db.run('BEGIN TRANSACTION', (err) => {
    if (err) {
      return res.status(500).json({ error: 'Transaction error' });
    }

    // 删除成员的空闲时间
    db.run('DELETE FROM availability WHERE member_id = ?', [id], (err) => {
      if (err) {
        db.run('ROLLBACK');
        return res.status(500).json({ error: 'Failed to delete availability' });
      }

      // 删除成员的特长
      db.run('DELETE FROM skills WHERE member_id = ?', [id], (err) => {
        if (err) {
          db.run('ROLLBACK');
          return res.status(500).json({ error: 'Failed to delete skills' });
        }

        // 删除成员
        db.run('DELETE FROM members WHERE id = ?', [id], function(err) {
          if (err) {
            db.run('ROLLBACK');
            return res.status(500).json({ error: 'Failed to delete member' });
          }

          if (this.changes === 0) {
            db.run('ROLLBACK');
            return res.status(404).json({ error: 'Member not found' });
          }

          db.run('COMMIT', (err) => {
            if (err) {
              return res.status(500).json({ error: 'Commit error' });
            }
            res.json({ message: 'Member deleted successfully' });
          });
        });
      });
    });
  });
});

// 获取成员的空闲时间
router.get('/:id/availability', (req, res) => {
  const { id } = req.params;

  db.all('SELECT * FROM availability WHERE member_id = ?', [id], (err, availability) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(availability);
  });
});

// 添加成员的空闲时间
router.post('/:id/availability', (req, res) => {
  const { id } = req.params;
  const { day_of_week, start_time, end_time } = req.body;

  db.run(
    'INSERT INTO availability (member_id, day_of_week, start_time, end_time) VALUES (?, ?, ?, ?)',
    [id, day_of_week, start_time, end_time],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to add availability' });
      }
      res.status(201).json({ id: this.lastID, member_id: id, day_of_week, start_time, end_time });
    }
  );
});

// 获取成员的特长
router.get('/:id/skills', (req, res) => {
  const { id } = req.params;

  db.all('SELECT * FROM skills WHERE member_id = ?', [id], (err, skills) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(skills);
  });
});

// 添加成员的特长
router.post('/:id/skills', (req, res) => {
  const { id } = req.params;
  const { skill_name } = req.body;

  db.run(
    'INSERT INTO skills (member_id, skill_name) VALUES (?, ?)',
    [id, skill_name],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to add skill' });
      }
      res.status(201).json({ id: this.lastID, member_id: id, skill_name });
    }
  );
});

module.exports = router;