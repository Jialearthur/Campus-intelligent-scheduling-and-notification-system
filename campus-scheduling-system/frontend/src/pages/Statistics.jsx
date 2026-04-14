import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Statistics = () => {
  const { user } = useAuth();
  const [departmentStats, setDepartmentStats] = useState([]);
  const [memberStats, setMemberStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });

  useEffect(() => {
    // 模拟数据，实际项目中需要从API获取
    setDepartmentStats([
      { id: 1, name: '部门 1', task_count: 15, schedule_count: 60 },
      { id: 2, name: '部门 2', task_count: 8, schedule_count: 32 },
      { id: 3, name: '部门 3', task_count: 12, schedule_count: 48 }
    ]);
    setMemberStats([
      { id: 1, name: '张三', department_id: 1, schedule_count: 12, attendance_count: 10 },
      { id: 2, name: '李四', department_id: 1, schedule_count: 8, attendance_count: 7 },
      { id: 3, name: '王五', department_id: 2, schedule_count: 6, attendance_count: 6 },
      { id: 4, name: '赵六', department_id: 3, schedule_count: 10, attendance_count: 9 }
    ]);
    setLoading(false);
  }, []);

  const handleExportExcel = async () => {
    try {
      const response = await fetch('/api/statistics/export', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = '值班统计数据.xlsx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } else {
        const errorData = await response.json();
        console.error('Export failed:', errorData.error);
      }
    } catch (error) {
      console.error('Failed to export Excel:', error);
    }
  };

  return (
    <div className="app-container">
      <nav className="top-nav">
        <div className="nav-content">
          <div className="nav-left">
            <h1 className="app-title">校园智能排班系统</h1>
          </div>
          <div className="nav-right">
            <span className="user-greeting">欢迎, {user?.name || '用户'}</span>
            <Link to="/login" className="btn-secondary">
              退出登录
            </Link>
          </div>
        </div>
      </nav>

      <div className="main-layout">
        <aside className="sidebar">
          <div className="sidebar-content">
            <h2 className="sidebar-title">导航</h2>
            <ul className="nav-list">
              <li>
                <Link to="/dashboard" className="nav-link">
                  <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  仪表盘
                </Link>
              </li>
              <li>
                <Link to="/members" className="nav-link">
                  <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  成员管理
                </Link>
              </li>
              <li>
                <Link to="/scheduling" className="nav-link">
                  <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  排班管理
                </Link>
              </li>
              <li>
                <Link to="/notifications" className="nav-link">
                  <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  通知管理
                </Link>
              </li>
              <li>
                <Link to="/statistics" className="nav-link active">
                  <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  数据统计
                </Link>
              </li>
              <li>
                <Link to="/volunteer-hours" className="nav-link">
                  <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  志愿时长
                </Link>
              </li>
              <li>
                <Link to="/leave-requests" className="nav-link">
                  <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  请假申请
                </Link>
              </li>
              <li>
                <Link to="/attendance" className="nav-link">
                  <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  签到打卡
                </Link>
              </li>
            </ul>
          </div>
        </aside>

        <main className="main-content">
          <div className="content-header">
            <h2 className="page-title">数据统计</h2>
            <div className="header-actions">
              <div className="date-range">
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  className="date-input"
                />
                <span className="date-separator">至</span>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  className="date-input"
                />
              </div>
              <button
                onClick={handleExportExcel}
                className="btn primary-btn"
              >
                导出Excel
              </button>
            </div>
          </div>

          {/* 部门统计 */}
          <div className="card mb-6">
            <div className="card-header">
              <h3 className="card-title">部门统计</h3>
            </div>
            <div className="card-body">
              <div className="stats-grid">
                {departmentStats.map((dept) => (
                  <div key={dept.id} className="stat-card">
                    <h4 className="stat-title">{dept.name}</h4>
                    <div className="stat-details">
                      <div className="stat-item">
                        <span className="stat-label">任务数量</span>
                        <span className="stat-value">{dept.task_count}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">排班数量</span>
                        <span className="stat-value">{dept.schedule_count}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="chart-container">
                <p className="chart-placeholder">部门统计图表</p>
              </div>
            </div>
          </div>

          {/* 成员统计 */}
          <div className="card">
            <div className="card-header">
              <div className="search-container">
                <input
                  type="text"
                  placeholder="搜索成员"
                  className="search-input"
                />
                <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>姓名</th>
                    <th>部门</th>
                    <th>排班次数</th>
                    <th>出勤次数</th>
                    <th>出勤率</th>
                  </tr>
                </thead>
                <tbody>
                  {memberStats.map((member) => {
                    const attendanceRate = member.schedule_count > 0 ? ((member.attendance_count / member.schedule_count) * 100).toFixed(2) : '0.00';
                    return (
                      <tr key={member.id}>
                        <td>{member.id}</td>
                        <td>{member.name}</td>
                        <td>部门 {member.department_id}</td>
                        <td>{member.schedule_count}</td>
                        <td>{member.attendance_count}</td>
                        <td>{attendanceRate}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="card-footer">
              <div className="pagination-info">
                显示 1 至 {memberStats.length} 条，共 {memberStats.length} 条
              </div>
              <div className="pagination">
                <button className="pagination-btn" disabled>
                  上一页
                </button>
                <button className="pagination-btn" disabled>
                  下一页
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Statistics;