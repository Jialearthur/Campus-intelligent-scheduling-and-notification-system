const db = require('./database');

// 检查成员是否有时间冲突
const checkTimeConflict = (member_id, task_start_time, task_end_time, exclude_schedule_id = null) => {
  return new Promise((resolve, reject) => {
    const query = exclude_schedule_id 
      ? 'SELECT COUNT(*) as count FROM schedules s JOIN tasks t ON s.task_id = t.id WHERE s.member_id = ? AND s.id != ? AND ((t.start_time <= ? AND t.end_time >= ?) OR (t.start_time <= ? AND t.end_time >= ?))'
      : 'SELECT COUNT(*) as count FROM schedules s JOIN tasks t ON s.task_id = t.id WHERE s.member_id = ? AND ((t.start_time <= ? AND t.end_time >= ?) OR (t.start_time <= ? AND t.end_time >= ?))';
    const params = exclude_schedule_id 
      ? [member_id, exclude_schedule_id, task_end_time, task_start_time, task_end_time, task_start_time]
      : [member_id, task_end_time, task_start_time, task_end_time, task_start_time];
    
    db.get(query, params, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result.count > 0);
      }
    });
  });
};

// 检查成员是否有空闲时间
const checkAvailability = (member_id, day_of_week, start_time, end_time) => {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT COUNT(*) as count FROM availability WHERE member_id = ? AND day_of_week = ? AND start_time <= ? AND end_time >= ?',
      [member_id, day_of_week, end_time, start_time],
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.count > 0);
        }
      }
    );
  });
};

// 获取成员值班次数
const getMemberDutyCount = (member_id, start_date, end_date) => {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT COUNT(*) as count FROM schedules s JOIN tasks t ON s.task_id = t.id WHERE s.member_id = ? AND t.start_time >= ? AND t.start_time <= ?',
      [member_id, start_date, end_date],
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.count);
        }
      }
    );
  });
};

// 测试排班功能
async function testScheduling() {
  try {
    // 获取任务信息
    const task = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM tasks WHERE id = 3', (err, task) => {
        if (err) reject(err);
        else resolve(task);
      });
    });

    if (!task) {
      console.log('Task not found');
      return;
    }

    console.log('Task:', task);

    // 获取任务时间信息
    const task_start_time = new Date(task.start_time);
    const task_end_time = new Date(task.end_time);
    const day_of_week = task_start_time.getDay();
    const start_time = task_start_time.toTimeString().substring(0, 5);
    const end_time = task_end_time.toTimeString().substring(0, 5);
    
    console.log('Task time info:', {
      day_of_week,
      start_time,
      end_time
    });

    // 获取部门成员
    const department_members = await new Promise((resolve, reject) => {
      db.all('SELECT * FROM members WHERE department_id = ?', [task.department_id], (err, members) => {
        if (err) reject(err);
        else resolve(members);
      });
    });

    console.log('Department members:', department_members);

    // 计算成员值班次数
    const start_of_week = new Date();
    start_of_week.setDate(start_of_week.getDate() - start_of_week.getDay());
    const end_of_week = new Date();
    end_of_week.setDate(end_of_week.getDate() + (6 - end_of_week.getDay()));
    const start_date = start_of_week.toISOString().split('T')[0] + ' 00:00:00';
    const end_date = end_of_week.toISOString().split('T')[0] + ' 23:59:59';
    
    console.log('Week range:', {
      start_date,
      end_date
    });

    // 过滤并排序成员
    const available_members = [];
    
    // 先处理本部门成员
    for (const member of department_members) {
      console.log('Checking department member:', member.id, member.name);
      
      const has_conflict = await checkTimeConflict(member.id, task.start_time, task.end_time);
      console.log('Has conflict:', has_conflict);
      
      const has_availability = await checkAvailability(member.id, day_of_week, start_time, end_time);
      console.log('Has availability:', has_availability);
      
      const duty_count = await getMemberDutyCount(member.id, start_date, end_date);
      console.log('Duty count:', duty_count);
      
      if (!has_conflict && has_availability) {
        console.log('Adding member to available list:', member.id, member.name);
        available_members.push({ ...member, duty_count, is_department: true });
      }
    }

    console.log('Available members:', available_members);

    if (available_members.length === 0) {
      console.log('No available members for this task');
      return;
    }

    // 排序：核心成员优先，然后按值班次数排序
    available_members.sort((a, b) => {
      // 核心成员优先
      if (a.priority === 'core' && b.priority !== 'core') return -1;
      if (a.priority !== 'core' && b.priority === 'core') return 1;
      // 本部门成员优先
      if (a.is_department && !b.is_department) return -1;
      if (!a.is_department && b.is_department) return 1;
      // 值班次数少的优先
      return a.duty_count - b.duty_count;
    });

    console.log('Sorted available members:', available_members);

    // 创建排班记录
    const schedules = [];
    for (let i = 0; i < Math.min(task.required_count, available_members.length); i++) {
      const member = available_members[i];
      console.log('Assigning member', member.id, member.name, 'to task', task.id);
      
      const schedule = await new Promise((resolve, reject) => {
        db.run(
          'INSERT INTO schedules (task_id, member_id, status) VALUES (?, ?, ?)',
          [task.id, member.id, 'assigned'],
          function(err) {
            if (err) reject(err);
            else resolve({ id: this.lastID, task_id: task.id, member_id: member.id, status: 'assigned' });
          }
        );
      });
      schedules.push(schedule);
    }

    console.log('Scheduling completed successfully:', schedules);
  } catch (err) {
    console.error('Error in scheduling:', err);
  } finally {
    db.close();
  }
}

testScheduling();
