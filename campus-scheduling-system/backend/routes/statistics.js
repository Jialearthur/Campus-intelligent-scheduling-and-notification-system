const express = require('express');
const db = require('../database');
const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// 获取部门统计数据
router.get('/departments', (req, res) => {
  db.all(
    `
    SELECT d.id, d.name, COUNT(t.id) as task_count, COUNT(s.id) as schedule_count
    FROM departments d
    LEFT JOIN tasks t ON d.id = t.department_id
    LEFT JOIN schedules s ON t.id = s.task_id
    GROUP BY d.id, d.name
    `,
    (err, departments) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(departments);
    }
  );
});

// 获取成员统计数据
router.get('/members', (req, res) => {
  db.all(
    `
    SELECT m.id, m.name, m.department_id, COUNT(s.id) as schedule_count, COUNT(a.id) as attendance_count
    FROM members m
    LEFT JOIN schedules s ON m.id = s.member_id
    LEFT JOIN attendance a ON s.id = a.schedule_id AND a.status = 'present'
    GROUP BY m.id, m.name, m.department_id
    `,
    (err, members) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(members);
    }
  );
});

// 获取成员志愿时长统计
router.get('/volunteer-hours', (req, res) => {
  const { period, start_date, end_date } = req.query;
  let query = `
    SELECT m.id, m.name, m.department_id, SUM(t.volunteer_hours) as total_hours
    FROM members m
    LEFT JOIN schedules s ON m.id = s.member_id
    LEFT JOIN tasks t ON s.task_id = t.id
    LEFT JOIN attendance a ON s.id = a.schedule_id AND a.status = 'present'
  `;
  
  if (start_date && end_date) {
    query += ` WHERE t.start_time >= '${start_date}' AND t.end_time <= '${end_date}'`;
  }
  
  query += ` GROUP BY m.id, m.name, m.department_id
    ORDER BY total_hours DESC`;
  
  db.all(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// 导出志愿时长统计Excel表格
router.get('/export/volunteer-hours', (req, res) => {
  const { start_date, end_date } = req.query;
  const workbook = new ExcelJS.Workbook();
  const volunteerSheet = workbook.addWorksheet('志愿时长统计');

  // 志愿时长统计表头
  volunteerSheet.columns = [
    { header: '成员ID', key: 'id', width: 10 },
    { header: '成员姓名', key: 'name', width: 20 },
    { header: '部门ID', key: 'department_id', width: 15 },
    { header: '总志愿时长', key: 'total_hours', width: 15 }
  ];

  // 构建查询语句
  let query = `
    SELECT m.id, m.name, m.department_id, SUM(t.volunteer_hours) as total_hours
    FROM members m
    LEFT JOIN schedules s ON m.id = s.member_id
    LEFT JOIN tasks t ON s.task_id = t.id
    LEFT JOIN attendance a ON s.id = a.schedule_id AND a.status = 'present'
  `;
  
  if (start_date && end_date) {
    query += ` WHERE t.start_time >= '${start_date}' AND t.end_time <= '${end_date}'`;
  }
  
  query += ` GROUP BY m.id, m.name, m.department_id
    ORDER BY total_hours DESC`;

  // 填充数据
  db.all(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    results.forEach(result => {
      volunteerSheet.addRow(result);
    });

    // 生成Excel文件
    const filePath = path.join(__dirname, '../volunteer_hours.xlsx');
    workbook.xlsx.writeFile(filePath)
      .then(() => {
        res.download(filePath, 'volunteer_hours.xlsx', (err) => {
          if (err) {
            return res.status(500).json({ error: 'Failed to download file' });
          }
          // 删除临时文件
          fs.unlinkSync(filePath);
        });
      })
      .catch(err => {
        return res.status(500).json({ error: 'Failed to generate Excel file' });
      });
  });
});

// 导出Excel表格
router.get('/export', (req, res) => {
  const workbook = new ExcelJS.Workbook();
  const departmentsSheet = workbook.addWorksheet('部门统计');
  const membersSheet = workbook.addWorksheet('成员统计');
  const volunteerSheet = workbook.addWorksheet('志愿时长统计');

  // 部门统计表头
  departmentsSheet.columns = [
    { header: '部门ID', key: 'id', width: 10 },
    { header: '部门名称', key: 'name', width: 20 },
    { header: '任务数量', key: 'task_count', width: 15 },
    { header: '排班数量', key: 'schedule_count', width: 15 }
  ];

  // 成员统计表头
  membersSheet.columns = [
    { header: '成员ID', key: 'id', width: 10 },
    { header: '成员姓名', key: 'name', width: 20 },
    { header: '部门ID', key: 'department_id', width: 15 },
    { header: '排班次数', key: 'schedule_count', width: 15 },
    { header: '出勤次数', key: 'attendance_count', width: 15 }
  ];

  // 志愿时长统计表头
  volunteerSheet.columns = [
    { header: '成员ID', key: 'id', width: 10 },
    { header: '成员姓名', key: 'name', width: 20 },
    { header: '部门ID', key: 'department_id', width: 15 },
    { header: '总志愿时长', key: 'total_hours', width: 15 }
  ];

  // 填充部门数据
  db.all(
    `
    SELECT d.id, d.name, COUNT(t.id) as task_count, COUNT(s.id) as schedule_count
    FROM departments d
    LEFT JOIN tasks t ON d.id = t.department_id
    LEFT JOIN schedules s ON t.id = s.task_id
    GROUP BY d.id, d.name
    `,
    (err, departments) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      departments.forEach(dept => {
        departmentsSheet.addRow(dept);
      });

      // 填充成员数据
      db.all(
        `
        SELECT m.id, m.name, m.department_id, COUNT(s.id) as schedule_count, COUNT(a.id) as attendance_count
        FROM members m
        LEFT JOIN schedules s ON m.id = s.member_id
        LEFT JOIN attendance a ON s.id = a.schedule_id AND a.status = 'present'
        GROUP BY m.id, m.name, m.department_id
        `,
        (err, members) => {
          if (err) {
            return res.status(500).json({ error: 'Database error' });
          }

          members.forEach(member => {
            membersSheet.addRow(member);
          });

          // 填充志愿时长数据
          db.all(
            `
            SELECT m.id, m.name, m.department_id, SUM(t.volunteer_hours) as total_hours
            FROM members m
            LEFT JOIN schedules s ON m.id = s.member_id
            LEFT JOIN tasks t ON s.task_id = t.id
            LEFT JOIN attendance a ON s.id = a.schedule_id AND a.status = 'present'
            GROUP BY m.id, m.name, m.department_id
            ORDER BY total_hours DESC
            `,
            (err, volunteerData) => {
              if (err) {
                return res.status(500).json({ error: 'Database error' });
              }

              volunteerData.forEach(data => {
                volunteerSheet.addRow(data);
              });

              // 生成Excel文件
              const filePath = path.join(__dirname, '../statistics.xlsx');
              workbook.xlsx.writeFile(filePath)
                .then(() => {
                  res.download(filePath, 'statistics.xlsx', (err) => {
                    if (err) {
                      return res.status(500).json({ error: 'Failed to download file' });
                    }
                    // 删除临时文件
                    fs.unlinkSync(filePath);
                  });
                })
                .catch(err => {
                  return res.status(500).json({ error: 'Failed to generate Excel file' });
                });
            }
          );
        }
      );
    }
  );
});

module.exports = router;