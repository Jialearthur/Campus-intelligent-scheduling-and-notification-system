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

    // 获取部门成员
    db.all('SELECT * FROM members WHERE department_id = ?', [task.department_id], (err, members) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      // 过滤出空闲的成员
      const availableMembers = [];
      let checkedMembers = 0;

      members.forEach(member => {
        // 检查成员是否有时间冲突
        db.get(
          'SELECT COUNT(*) as count FROM schedules s JOIN tasks t ON s.task_id = t.id WHERE s.member_id = ? AND ((t.start_time <= ? AND t.end_time >= ?) OR (t.start_time <= ? AND t.end_time >= ?))',
          [member.id, task.end_time, task.start_time, task.end_time, task.start_time],
          (err, result) => {
            if (err) {
              return res.status(500).json({ error: 'Database error' });
            }

            if (result.count === 0) {
              // 检查成员的空闲时间
              db.get(
                'SELECT COUNT(*) as count FROM availability WHERE member_id = ? AND day_of_week = ? AND start_time <= ? AND end_time >= ?',
                [member.id, new Date(task.start_time).getDay(), task.start_time.split(' ')[1], task.end_time.split(' ')[1]],
                (err, availResult) => {
                  if (err) {
                    return res.status(500).json({ error: 'Database error' });
                  }

                  if (availResult.count > 0) {
                    availableMembers.push(member);
                  }

                  checkedMembers++;
                  if (checkedMembers === members.length) {
                    // 按优先级排序
                    availableMembers.sort((a, b) => {
                      if (a.priority === 'core' && b.priority !== 'core') return -1;
                      if (a.priority !== 'core' && b.priority === 'core') return 1;
                      return 0;
                    });

                    // 开始事务
                    db.run('BEGIN TRANSACTION', (err) => {
                      if (err) {
                        return res.status(500).json({ error: 'Transaction error' });
                      }

                      let scheduledCount = 0;
                      const schedules = [];

                      availableMembers.forEach((member, index) => {
                        if (scheduledCount < task.required_count) {
                          db.run(
                            'INSERT INTO schedules (task_id, member_id, status) VALUES (?, ?, ?)',
                            [task_id, member.id, 'assigned'],
                            function(err) {
                              if (err) {
                                db.run('ROLLBACK');
                                return res.status(500).json({ error: 'Failed to create schedule' });
                              }

                              schedules.push({ id: this.lastID, task_id, member_id: member.id, status: 'assigned' });
                              scheduledCount++;

                              if (index === availableMembers.length - 1 || scheduledCount >= task.required_count) {
                                db.run('COMMIT', (err) => {
                                  if (err) {
                                    return res.status(500).json({ error: 'Commit error' });
                                  }
                                  res.status(201).json(schedules);
                                });
                              }
                            }
                          );
                        }
                      });
                    });
                  }
                }
              );
            } else {
              checkedMembers++;
              if (checkedMembers === members.length) {
                // 按优先级排序
                availableMembers.sort((a, b) => {
                  if (a.priority === 'core' && b.priority !== 'core') return -1;
                  if (a.priority !== 'core' && b.priority === 'core') return 1;
                  return 0;
                });

                // 开始事务
                db.run('BEGIN TRANSACTION', (err) => {
                  if (err) {
                    return res.status(500).json({ error: 'Transaction error' });
                  }

                  let scheduledCount = 0;
                  const schedules = [];

                  availableMembers.forEach((member, index) => {
                    if (scheduledCount < task.required_count) {
                      db.run(
                        'INSERT INTO schedules (task_id, member_id, status) VALUES (?, ?, ?)',
                        [task_id, member.id, 'assigned'],
                        function(err) {
                          if (err) {
                            db.run('ROLLBACK');
                            return res.status(500).json({ error: 'Failed to create schedule' });
                          }

                          schedules.push({ id: this.lastID, task_id, member_id: member.id, status: 'assigned' });
                          scheduledCount++;

                          if (index === availableMembers.length - 1 || scheduledCount >= task.required_count) {
                            db.run('COMMIT', (err) => {
                              if (err) {
                                return res.status(500).json({ error: 'Commit error' });
                              }
                              res.status(201).json(schedules);
                            });
                          }
                        }
                      );
                    }
                  });
                });
              }
            }
          }
        );
      });
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