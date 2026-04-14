import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { get } from '../utils/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [departmentStats, setDepartmentStats] = useState([]);
  const [memberStats, setMemberStats] = useState([]);
  const [taskStats, setTaskStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week');
  const [dragging, setDragging] = useState(null);
  const [positions, setPositions] = useState({
    department: { x: 20, y: 20 },
    member: { x: 400, y: 20 },
    task: { x: 20, y: 400 }
  });
  const containerRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, [timeRange]);

  const fetchData = async () => {
    try {
      setDepartmentStats([
        { id: 1, name: '部门 1', on_duty_count: 15, attendance_rate: 92.5, week_on_duty: 8, month_on_duty: 32 },
        { id: 2, name: '部门 2', on_duty_count: 8, attendance_rate: 87.5, week_on_duty: 4, month_on_duty: 16 },
        { id: 3, name: '部门 3', on_duty_count: 12, attendance_rate: 95.0, week_on_duty: 6, month_on_duty: 24 }
      ]);
      setMemberStats([
        { id: 1, name: '张三', department_id: 1, on_duty_count: 12, attendance_count: 10, volunteer_hours: 24.5, attendance_rate: 83.3 },
        { id: 2, name: '李四', department_id: 1, on_duty_count: 8, attendance_count: 7, volunteer_hours: 16.0, attendance_rate: 87.5 },
        { id: 3, name: '王五', department_id: 2, on_duty_count: 6, attendance_count: 6, volunteer_hours: 12.0, attendance_rate: 100.0 },
        { id: 4, name: '赵六', department_id: 3, on_duty_count: 10, attendance_count: 9, volunteer_hours: 20.0, attendance_rate: 90.0 }
      ]);
      setTaskStats([
        { id: 1, name: '前台值班', completed_count: 12, total_count: 15, absent_count: 3, absent_members: ['张三', '李四'] },
        { id: 2, name: '图书馆值班', completed_count: 8, total_count: 8, absent_count: 0, absent_members: [] },
        { id: 3, name: '活动现场', completed_count: 6, total_count: 8, absent_count: 2, absent_members: ['王五', '赵六'] }
      ]);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleMouseDown = (e, id) => {
    const container = containerRef.current;
    if (container) {
      const rect = container.getBoundingClientRect();
      setDragging({
        id,
        offsetX: e.clientX - rect.left - positions[id].x,
        offsetY: e.clientY - rect.top - positions[id].y
      });
    }
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      const container = containerRef.current;
      if (container) {
        const rect = container.getBoundingClientRect();
        setPositions(prev => ({
          ...prev,
          [dragging.id]: {
            x: e.clientX - rect.left - dragging.offsetX,
            y: e.clientY - rect.top - dragging.offsetY
          }
        }));
      }
    }
  };

  const handleMouseUp = () => {
    setDragging(null);
  };

  useEffect(() => {
    if (dragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragging]);

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
                <Link to="/dashboard" className="nav-link active">
                  <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  统计看板
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
                <Link to="/statistics" className="nav-link">
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
            <h2 className="page-title">值班数据统计看板</h2>
            <div className="header-actions">
              <div className="time-range-buttons">
                <button 
                  className={`time-btn ${timeRange === 'week' ? 'active' : ''}`}
                  onClick={() => setTimeRange('week')}
                >
                  周
                </button>
                <button 
                  className={`time-btn ${timeRange === 'month' ? 'active' : ''}`}
                  onClick={() => setTimeRange('month')}
                >
                  月
                </button>
              </div>
              <button onClick={handleExportExcel} className="btn-primary">
                <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                导出Excel
              </button>
            </div>
          </div>

          <div ref={containerRef} className="drag-container">
            <div 
              className="dashboard-card"
              style={{ left: `${positions.department.x}px`, top: `${positions.department.y}px`, width: '350px' }}
            >
              <div 
                className="card-header draggable"
                onMouseDown={(e) => handleMouseDown(e, 'department')}
              >
                <h3 className="card-title">部门数据统计</h3>
                <svg className="card-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14m-7-7h14" />
                </svg>
              </div>
              <div className="card-body">
                <div className="stats-list">
                  {departmentStats.map((dept) => (
                    <div key={dept.id} className="stat-item">
                      <div className="stat-header">
                        <h4 className="stat-name">{dept.name}</h4>
                        <span className={`stat-rate ${dept.attendance_rate >= 90 ? 'high' : dept.attendance_rate >= 80 ? 'medium' : 'low'}`}>
                          {dept.attendance_rate}%
                        </span>
                      </div>
                      <div className="stat-details">
                        <span>{timeRange === 'week' ? '本周值班' : '本月值班'}: {timeRange === 'week' ? dept.week_on_duty : dept.month_on_duty}次</span>
                        <span>出勤率: {dept.attendance_rate}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div 
              className="dashboard-card"
              style={{ left: `${positions.member.x}px`, top: `${positions.member.y}px`, width: '350px' }}
            >
              <div 
                className="card-header draggable info"
                onMouseDown={(e) => handleMouseDown(e, 'member')}
              >
                <h3 className="card-title">成员数据统计</h3>
                <svg className="card-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14m-7-7h14" />
                </svg>
              </div>
              <div className="card-body">
                <div className="stats-list">
                  {memberStats.map((member) => (
                    <div key={member.id} className="stat-item">
                      <div className="stat-header">
                        <h4 className="stat-name">{member.name}</h4>
                        <span className="stat-dept">部门 {member.department_id}</span>
                      </div>
                      <div className="stat-details">
                        <span>值班: {member.on_duty_count}次</span>
                        <span>出勤: {member.attendance_count}次</span>
                      </div>
                      <div className="stat-details">
                        <span>志愿时长: {member.volunteer_hours}小时</span>
                        <span className={`stat-rate ${member.attendance_rate >= 90 ? 'high' : member.attendance_rate >= 80 ? 'medium' : 'low'}`}>
                          出勤率: {member.attendance_rate}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div 
              className="dashboard-card"
              style={{ left: `${positions.task.x}px`, top: `${positions.task.y}px`, width: '720px' }}
            >
              <div 
                className="card-header draggable success"
                onMouseDown={(e) => handleMouseDown(e, 'task')}
              >
                <h3 className="card-title">任务数据统计</h3>
                <svg className="card-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14m-7-7h14" />
                </svg>
              </div>
              <div className="card-body">
                <div className="table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>任务名称</th>
                        <th>总次数</th>
                        <th>完成次数</th>
                        <th>未出勤次数</th>
                        <th>未出勤人员</th>
                      </tr>
                    </thead>
                    <tbody>
                      {taskStats.map((task) => (
                        <tr key={task.id}>
                          <td className="font-medium">{task.name}</td>
                          <td>{task.total_count}</td>
                          <td>{task.completed_count}</td>
                          <td className="text-danger">{task.absent_count}</td>
                          <td>
                            {task.absent_members.length > 0 ? (
                              task.absent_members.join(', ')
                            ) : (
                              <span className="text-success">无</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div className="hint-text">
            <p>提示：点击卡片标题栏可拖拽调整位置</p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
