const express = require('express');
const db = require('../database');
const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');
const os = require('os');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// 格式化Excel表头样式
const applyHeaderStyle = (worksheet) => {
  const headerRow = worksheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF4F46E5' }
  };
  headerRow.alignment = { horizontal: 'center', vertical: 'middle' };
};

// 获取部门统计数据
router.get('/departments', authMiddleware, (req, res) => {
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
router.get('/members', authMiddleware, (req, res) => {
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
router.get('/volunteer-hours', authMiddleware, (req, res) => {
  const { period, start_date, end_date } = req.query;
  let query = `
    SELECT m.id, m.name, m.department_id, COALESCE(SUM(t.volunteer_hours), 0) as total_hours
    FROM members m
    LEFT JOIN schedules s ON m.id = s.member_id
    LEFT JOIN tasks t ON s.task_id = t.id
    LEFT JOIN attendance a ON s.id = a.schedule_id AND a.status = 'present'
  `;
  const params = [];
  
  if (start_date && end_date) {
    query += ` WHERE t.start_time >= ? AND t.end_time <= ?`;
    params.push(start_date, end_date);
  }
  
  query += ` GROUP BY m.id, m.name, m.department_id
    ORDER BY total_hours DESC`;
  
  db.all(query, params, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// 导出志愿时长统计Excel表格
router.get('/export/volunteer-hours', authMiddleware, async (req, res) => {
  const { start_date, end_date } = req.query;
  
  try {
    const workbook = new ExcelJS.Workbook();
    const volunteerSheet = workbook.addWorksheet('志愿时长统计');

    volunteerSheet.columns = [
      { header: '成员ID', key: 'id', width: 12 },
      { header: '成员姓名', key: 'name', width: 20 },
      { header: '部门ID', key: 'department_id', width: 12 },
      { header: '总志愿时长(小时)', key: 'total_hours', width: 20 }
    ];

    let query = `
      SELECT m.id, m.name, m.department_id, COALESCE(SUM(t.volunteer_hours), 0) as total_hours
      FROM members m
      LEFT JOIN schedules s ON m.id = s.member_id
      LEFT JOIN tasks t ON s.task_id = t.id
      LEFT JOIN attendance a ON s.id = a.schedule_id AND a.status = 'present'
    `;
    const params = [];
    
    if (start_date && end_date) {
      query += ` WHERE t.start_time >= ? AND t.end_time <= ?`;
      params.push(start_date, end_date);
    }
    
    query += ` GROUP BY m.id, m.name, m.department_id
      ORDER BY total_hours DESC`;

    const results = await new Promise((resolve, reject) => {
      db.all(query, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    results.forEach(result => {
      volunteerSheet.addRow({
        id: result.id,
        name: result.name,
        department_id: result.department_id,
        total_hours: result.total_hours
      });
    });

    applyHeaderStyle(volunteerSheet);

    volunteerSheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        row.alignment = { horizontal: 'left', vertical: 'middle' };
      }
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=volunteer_hours.xlsx');
    
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Failed to export Excel file' });
  }
});

// 导出Excel表格
router.get('/export', authMiddleware, async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const departmentsSheet = workbook.addWorksheet('部门统计');
    const membersSheet = workbook.addWorksheet('成员统计');
    const volunteerSheet = workbook.addWorksheet('志愿时长统计');

    departmentsSheet.columns = [
      { header: '部门ID', key: 'id', width: 12 },
      { header: '部门名称', key: 'name', width: 25 },
      { header: '任务数量', key: 'task_count', width: 15 },
      { header: '排班数量', key: 'schedule_count', width: 15 }
    ];

    membersSheet.columns = [
      { header: '成员ID', key: 'id', width: 12 },
      { header: '成员姓名', key: 'name', width: 20 },
      { header: '部门ID', key: 'department_id', width: 12 },
      { header: '排班次数', key: 'schedule_count', width: 15 },
      { header: '出勤次数', key: 'attendance_count', width: 15 },
      { header: '出勤率(%)', key: 'attendance_rate', width: 15 }
    ];

    volunteerSheet.columns = [
      { header: '成员ID', key: 'id', width: 12 },
      { header: '成员姓名', key: 'name', width: 20 },
      { header: '部门ID', key: 'department_id', width: 12 },
      { header: '总志愿时长(小时)', key: 'total_hours', width: 20 }
    ];

    const departments = await new Promise((resolve, reject) => {
      db.all(
        `
        SELECT d.id, d.name, COUNT(t.id) as task_count, COUNT(s.id) as schedule_count
        FROM departments d
        LEFT JOIN tasks t ON d.id = t.department_id
        LEFT JOIN schedules s ON t.id = s.task_id
        GROUP BY d.id, d.name
        `,
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });

    departments.forEach(dept => {
      departmentsSheet.addRow(dept);
    });

    const members = await new Promise((resolve, reject) => {
      db.all(
        `
        SELECT m.id, m.name, m.department_id, COUNT(s.id) as schedule_count, COUNT(a.id) as attendance_count
        FROM members m
        LEFT JOIN schedules s ON m.id = s.member_id
        LEFT JOIN attendance a ON s.id = a.schedule_id AND a.status = 'present'
        GROUP BY m.id, m.name, m.department_id
        `,
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });

    members.forEach(member => {
      const attendance_rate = member.schedule_count > 0 
        ? ((member.attendance_count / member.schedule_count) * 100).toFixed(2)
        : '0.00';
      membersSheet.addRow({
        id: member.id,
        name: member.name,
        department_id: member.department_id,
        schedule_count: member.schedule_count,
        attendance_count: member.attendance_count,
        attendance_rate: `${attendance_rate}%`
      });
    });

    const volunteerData = await new Promise((resolve, reject) => {
      db.all(
        `
        SELECT m.id, m.name, m.department_id, COALESCE(SUM(t.volunteer_hours), 0) as total_hours
        FROM members m
        LEFT JOIN schedules s ON m.id = s.member_id
        LEFT JOIN tasks t ON s.task_id = t.id
        LEFT JOIN attendance a ON s.id = a.schedule_id AND a.status = 'present'
        GROUP BY m.id, m.name, m.department_id
        ORDER BY total_hours DESC
        `,
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });

    volunteerData.forEach(data => {
      volunteerSheet.addRow({
        id: data.id,
        name: data.name,
        department_id: data.department_id,
        total_hours: data.total_hours
      });
    });

    applyHeaderStyle(departmentsSheet);
    applyHeaderStyle(membersSheet);
    applyHeaderStyle(volunteerSheet);

    [departmentsSheet, membersSheet, volunteerSheet].forEach(sheet => {
      sheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) {
          row.alignment = { horizontal: 'left', vertical: 'middle' };
        }
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=statistics.xlsx');
    
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Failed to export Excel file' });
  }
});

module.exports = router;