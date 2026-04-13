import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
      // 模拟数据，实际项目中需要从API获取
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
      const response = await fetch('http://localhost:5000/statistics/export', {
        method: 'GET',
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
    <div className="min-h-screen bg-secondary">
      {/* 顶部导航栏 */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-primary">校园智能排班系统</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">欢迎, {user?.name || '用户'}</span>
              <Link to="/login" className="px-3 py-1 text-sm text-white bg-primary rounded hover:bg-primary/90">
                退出登录
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* 侧边导航栏 */}
      <div className="flex">
        <div className="w-64 bg-white shadow-sm">
          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">导航</h2>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/dashboard"
                  className="flex items-center px-3 py-2 text-primary bg-blue-50 rounded-md"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  统计看板
                </Link>
              </li>
              <li>
                <Link
                  to="/members"
                  className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  成员管理
                </Link>
              </li>
              <li>
                <Link
                  to="/scheduling"
                  className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  排班管理
                </Link>
              </li>
              <li>
                <Link
                  to="/notifications"
                  className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  通知管理
                </Link>
              </li>
              <li>
                <Link
                  to="/statistics"
                  className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  数据统计
                </Link>
              </li>
              <li>
                <Link
                  to="/volunteer-hours"
                  className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  志愿时长
                </Link>
              </li>
              <li>
                <Link
                  to="/leave-requests"
                  className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  请假申请
                </Link>
              </li>
              <li>
                <Link
                  to="/attendance"
                  className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  签到打卡
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* 主内容区 */}
        <div className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">值班数据统计看板</h2>
            <div className="flex space-x-4">
              <div className="flex space-x-2">
                <button 
                  className={`px-4 py-2 rounded-md ${timeRange === 'week' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}
                  onClick={() => setTimeRange('week')}
                >
                  周
                </button>
                <button 
                  className={`px-4 py-2 rounded-md ${timeRange === 'month' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}
                  onClick={() => setTimeRange('month')}
                >
                  月
                </button>
              </div>
              <button
                onClick={handleExportExcel}
                className="px-4 py-2 text-white bg-primary rounded-md hover:bg-primary/90 flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                导出Excel
              </button>
            </div>
          </div>

          {/* 拖拽容器 */}
          <div 
            ref={containerRef}
            className="relative min-h-[700px] border border-dashed border-gray-300 rounded-lg bg-gray-50"
          >
            {/* 部门数据卡片 */}
            <div 
              className="absolute w-[350px] bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden"
              style={{ left: `${positions.department.x}px`, top: `${positions.department.y}px` }}
            >
              <div 
                className="bg-primary text-white p-4 cursor-move flex justify-between items-center"
                onMouseDown={(e) => handleMouseDown(e, 'department')}
              >
                <h3 className="font-semibold">部门数据统计</h3>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14m-7-7h14" />
                </svg>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  {departmentStats.map((dept) => (
                    <div key={dept.id} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">{dept.name}</h4>
                        <span className={`text-sm font-semibold ${dept.attendance_rate >= 90 ? 'text-success' : dept.attendance_rate >= 80 ? 'text-warning' : 'text-danger'}`}>
                          {dept.attendance_rate}%
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>{timeRange === 'week' ? '本周值班' : '本月值班'}: {timeRange === 'week' ? dept.week_on_duty : dept.month_on_duty}次</span>
                        <span>出勤率: {dept.attendance_rate}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 成员数据卡片 */}
            <div 
              className="absolute w-[350px] bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden"
              style={{ left: `${positions.member.x}px`, top: `${positions.member.y}px` }}
            >
              <div 
                className="bg-info text-white p-4 cursor-move flex justify-between items-center"
                onMouseDown={(e) => handleMouseDown(e, 'member')}
              >
                <h3 className="font-semibold">成员数据统计</h3>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14m-7-7h14" />
                </svg>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  {memberStats.map((member) => (
                    <div key={member.id} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="font-medium">{member.name}</h4>
                        <span className="text-sm text-gray-600">部门 {member.department_id}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>值班: {member.on_duty_count}次</span>
                        <span>出勤: {member.attendance_count}次</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600 mt-1">
                        <span>志愿时长: {member.volunteer_hours}小时</span>
                        <span className={`${member.attendance_rate >= 90 ? 'text-success' : member.attendance_rate >= 80 ? 'text-warning' : 'text-danger'}`}>
                          出勤率: {member.attendance_rate}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 任务数据卡片 */}
            <div 
              className="absolute w-[720px] bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden"
              style={{ left: `${positions.task.x}px`, top: `${positions.task.y}px` }}
            >
              <div 
                className="bg-success text-white p-4 cursor-move flex justify-between items-center"
                onMouseDown={(e) => handleMouseDown(e, 'task')}
              >
                <h3 className="font-semibold">任务数据统计</h3>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14m-7-7h14" />
                </svg>
              </div>
              <div className="p-4">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-3">任务名称</th>
                        <th className="text-left py-2 px-3">总次数</th>
                        <th className="text-left py-2 px-3">完成次数</th>
                        <th className="text-left py-2 px-3">未出勤次数</th>
                        <th className="text-left py-2 px-3">未出勤人员</th>
                      </tr>
                    </thead>
                    <tbody>
                      {taskStats.map((task) => (
                        <tr key={task.id} className="border-b">
                          <td className="py-2 px-3 font-medium">{task.name}</td>
                          <td className="py-2 px-3">{task.total_count}</td>
                          <td className="py-2 px-3">{task.completed_count}</td>
                          <td className="py-2 px-3 text-danger">{task.absent_count}</td>
                          <td className="py-2 px-3">
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

          {/* 说明文字 */}
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>提示：点击卡片标题栏可拖拽调整位置</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;