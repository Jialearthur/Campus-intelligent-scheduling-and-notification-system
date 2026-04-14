import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Scheduling = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [currentSchedule, setCurrentSchedule] = useState(null);
  const [showEditScheduleModal, setShowEditScheduleModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    type: '日常值班',
    description: '',
    start_time: '',
    end_time: '',
    required_count: 2,
    department_id: 1
  });
  const [editFormData, setEditFormData] = useState({
    member_id: ''
  });
  const [replacements, setReplacements] = useState([]);

  useEffect(() => {
    setTasks([
      { id: 1, title: '日常值班', type: '日常值班', description: '日常办公室值班', start_time: '2026-04-14 08:00', end_time: '2026-04-14 12:00', required_count: 2, department_id: 1, created_by: 1 },
      { id: 2, title: '活动值班', type: '活动值班', description: '社团活动值班', start_time: '2026-04-15 14:00', end_time: '2026-04-15 18:00', required_count: 3, department_id: 1, created_by: 1 },
      { id: 3, title: '图书馆日常值班3', type: '日常值班', description: '负责图书馆的日常管理和秩序维护', start_time: '2026-04-15 08:00', end_time: '2026-04-15 12:00', required_count: 1, department_id: 1, created_by: 1 },
      { id: 4, title: '图书馆日常值班4', type: '日常值班', description: '负责图书馆的日常管理和秩序维护', start_time: '2026-04-16 08:00', end_time: '2026-04-16 12:00', required_count: 1, department_id: 1, created_by: 1 }
    ]);
    setSchedules([
      { id: 1, task_id: 1, member_id: 1, status: 'assigned' },
      { id: 2, task_id: 1, member_id: 2, status: 'assigned' },
      { id: 3, task_id: 3, member_id: 3, status: 'assigned' },
      { id: 4, task_id: 4, member_id: 3, status: 'assigned' }
    ]);
    setMembers([
      { id: 1, name: '测试用户', priority: 'normal', department_id: 1 },
      { id: 2, name: '测试用户2', priority: 'normal', department_id: 1 },
      { id: 3, name: '测试用户3', priority: 'core', department_id: 1 }
    ]);
    setLoading(false);
  }, []);

  const handleAddTask = () => {
    const newTask = {
      id: tasks.length + 1,
      ...formData,
      created_by: user.id
    };
    setTasks([...tasks, newTask]);
    setShowAddTaskModal(false);
    setFormData({
      title: '',
      type: '日常值班',
      description: '',
      start_time: '',
      end_time: '',
      required_count: 2,
      department_id: 1
    });
  };

  const handleGenerateSchedule = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    setCurrentTask(task);
    setShowScheduleModal(true);
  };

  const handleEditSchedule = (schedule) => {
    setCurrentSchedule(schedule);
    setEditFormData({ member_id: schedule.member_id });
    setReplacements([
      { id: 1, name: '测试用户', priority: 'normal', department_id: 1, duty_count: 1 },
      { id: 2, name: '测试用户2', priority: 'normal', department_id: 1, duty_count: 1 }
    ]);
    setShowEditScheduleModal(true);
  };

  const handleUpdateSchedule = () => {
    const updatedSchedules = schedules.map(s => 
      s.id === currentSchedule.id ? { ...s, member_id: parseInt(editFormData.member_id) } : s
    );
    setSchedules(updatedSchedules);
    setShowEditScheduleModal(false);
  };

  const getMemberName = (memberId) => {
    const member = members.find(m => m.id === memberId);
    return member ? member.name : '未知成员';
  };

  const getMemberPriority = (memberId) => {
    const member = members.find(m => m.id === memberId);
    return member ? member.priority : 'normal';
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
            <Link to="/dashboard" className="btn-secondary">
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
                <Link to="/scheduling" className="nav-link active">
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
            </ul>
          </div>
        </aside>

        <main className="main-content">
          <div className="content-header">
            <h2 className="page-title">排班管理</h2>
            <button onClick={() => setShowAddTaskModal(true)} className="btn-primary">
              创建任务
            </button>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
            </div>
          ) : (
            <div className="table-wrapper">
              <div className="table-header">
                <div className="search-box">
                  <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="搜索任务"
                    className="search-input"
                  />
                </div>
              </div>
              <div className="table-scroll">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>任务名称</th>
                      <th>类型</th>
                      <th>开始时间</th>
                      <th>结束时间</th>
                      <th>所需人数</th>
                      <th>状态</th>
                      <th>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map((task) => {
                      const taskSchedules = schedules.filter(s => s.task_id === task.id);
                      const isScheduled = taskSchedules.length >= task.required_count;
                      return (
                        <tr key={task.id}>
                          <td>{task.id}</td>
                          <td className="font-medium">{task.title}</td>
                          <td>
                            <span className={`badge ${task.type === '日常值班' ? 'primary' : task.type === '活动值班' ? 'success' : 'secondary'}`}>
                              {task.type}
                            </span>
                          </td>
                          <td>{task.start_time}</td>
                          <td>{task.end_time}</td>
                          <td>{task.required_count}</td>
                          <td>
                            <span className={`badge ${isScheduled ? 'success' : 'warning'}`}>
                              {isScheduled ? '已排班' : '待排班'}
                            </span>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button
                                onClick={() => handleGenerateSchedule(task.id)}
                                className="action-btn primary"
                              >
                                排班
                              </button>
                              <button className="action-btn secondary">
                                查看
                              </button>
                              <button className="action-btn info">
                                编辑
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="table-footer">
                <p className="pagination-info">显示 1 至 {tasks.length} 条，共 {tasks.length} 条</p>
                <div className="pagination-buttons">
                  <button className="pagination-btn" disabled>上一页</button>
                  <button className="pagination-btn" disabled>下一页</button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {showAddTaskModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">创建任务</h3>
              <button
                onClick={() => setShowAddTaskModal(false)}
                className="modal-close"
              >
                <svg className="modal-close-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form className="modal-form">
              <div className="form-group">
                <label className="form-label">任务名称</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">任务类型</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="form-input"
                >
                  <option value="日常值班">日常值班</option>
                  <option value="活动值班">活动值班</option>
                  <option value="事务值班">事务值班</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">任务描述</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="form-input"
                  rows={3}
                />
              </div>
              <div className="form-group">
                <label className="form-label">开始时间</label>
                <input
                  type="datetime-local"
                  value={formData.start_time}
                  onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">结束时间</label>
                <input
                  type="datetime-local"
                  value={formData.end_time}
                  onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">所需人数</label>
                <input
                  type="number"
                  value={formData.required_count}
                  onChange={(e) => setFormData({ ...formData, required_count: parseInt(e.target.value })}
                  min="1"
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">部门</label>
                <select
                  value={formData.department_id}
                  onChange={(e) => setFormData({ ...formData, department_id: parseInt(e.target.value })}
                  className="form-input"
                >
                  <option value={1}>部门 1</option>
                  <option value={2}>部门 2</option>
                </select>
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setShowAddTaskModal(false)}
                  className="btn-secondary"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleAddTask}
                  className="btn-primary"
                >
                  创建
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showScheduleModal && currentTask && (
        <div className="modal-overlay">
          <div className="modal large">
            <div className="modal-header">
              <h3 className="modal-title">排班结果 - {currentTask.title}</h3>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="modal-close"
              >
                <svg className="modal-close-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <div className="mb-4">
                <p className="text-sm text-gray-600">开始时间: {currentTask.start_time}</p>
                <p className="text-sm text-gray-600">结束时间: {currentTask.end_time}</p>
                <p className="text-sm text-gray-600">所需人数: {currentTask.required_count}</p>
              </div>
              <div className="mb-4">
                <h4 className="text-md font-medium text-gray-700 mb-2">已分配成员</h4>
                <div className="space-y-2">
                  {schedules
                    .filter(s => s.task_id === currentTask.id)
                    .map(schedule => (
                      <div key={schedule.id} className="stat-item">
                        <div className="flex justify-between">
                          <div>
                            <p className="font-medium">{getMemberName(schedule.member_id)}</p>
                            <p className="text-sm text-gray-600">{getMemberPriority(schedule.member_id) === 'core' ? '核心成员' : '普通成员'}</p>
                          </div>
                          <div className="action-buttons">
                            <button
                              onClick={() => handleEditSchedule(schedule)}
                              className="action-btn primary"
                            >
                              调整
                            </button>
                            <button className="action-btn danger">
                              移除
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="btn-secondary"
                >
                  取消
                </button>
                <button
                  type="button"
                  className="btn-primary"
                >
                  确认排班
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEditScheduleModal && currentSchedule && (
        <div className="modal-overlay">
          <div className="modal large">
            <div className="modal-header">
              <h3 className="modal-title">调整排班</h3>
              <button
                onClick={() => setShowEditScheduleModal(false)}
                className="modal-close"
              >
                <svg className="modal-close-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">选择成员</label>
                <select
                  value={editFormData.member_id}
                  onChange={(e) => setEditFormData({ ...editFormData, member_id: e.target.value })}
                  className="form-input"
                >
                  {members.map(member => (
                    <option key={member.id} value={member.id}>
                      {member.name} ({member.priority === 'core' ? '核心成员' : '普通成员'})
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <h4 className="text-md font-medium text-gray-700 mb-2">推荐成员</h4>
                <div className="space-y-2">
                  {replacements.map(member => (
                    <div 
                      key={member.id} 
                      className="stat-item cursor-pointer"
                      onClick={() => setEditFormData({ ...editFormData, member_id: member.id })}
                    >
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-gray-600">{member.priority === 'core' ? '核心成员' : '普通成员'}</p>
                        </div>
                        <p className="text-sm text-gray-600">本周值班次数: {member.duty_count}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setShowEditScheduleModal(false)}
                  className="btn-secondary"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleUpdateSchedule}
                  className="btn-primary"
                >
                  确认调整
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Scheduling;
