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
    // 模拟数据，实际项目中需要从API获取
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
    // 实际项目中需要调用API
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
    // 实际项目中需要调用API
    const task = tasks.find(t => t.id === taskId);
    setCurrentTask(task);
    setShowScheduleModal(true);
  };

  const handleEditSchedule = (schedule) => {
    // 实际项目中需要调用API获取可替换的成员
    setCurrentSchedule(schedule);
    setEditFormData({ member_id: schedule.member_id });
    // 模拟可替换的成员
    setReplacements([
      { id: 1, name: '测试用户', priority: 'normal', department_id: 1, duty_count: 1 },
      { id: 2, name: '测试用户2', priority: 'normal', department_id: 1, duty_count: 1 }
    ]);
    setShowEditScheduleModal(true);
  };

  const handleUpdateSchedule = () => {
    // 实际项目中需要调用API
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
              <Link to="/dashboard" className="px-3 py-1 text-sm text-white bg-gray-600 rounded hover:bg-gray-700">
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
                  className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  仪表盘
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
                  className="flex items-center px-3 py-2 text-primary bg-blue-50 rounded-md"
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
            </ul>
          </div>
        </div>

        {/* 主内容区 */}
        <div className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">排班管理</h2>
            <button
              onClick={() => setShowAddTaskModal(true)}
              className="px-4 py-2 text-white bg-primary rounded-md hover:bg-primary/90"
            >
              创建任务
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p>加载中...</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 border-b">
                <div className="flex items-center">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="搜索任务"
                      className="w-full px-4 py-2 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <div className="absolute left-3 top-2.5">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        任务名称
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        类型
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        开始时间
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        结束时间
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        所需人数
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        状态
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {tasks.map((task) => {
                      const taskSchedules = schedules.filter(s => s.task_id === task.id);
                      const isScheduled = taskSchedules.length >= task.required_count;
                      return (
                        <tr key={task.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {task.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {task.title}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${task.type === '日常值班' ? 'bg-blue-100 text-blue-800' : task.type === '活动值班' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'}`}>
                              {task.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {task.start_time}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {task.end_time}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {task.required_count}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${isScheduled ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                              {isScheduled ? '已排班' : '待排班'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleGenerateSchedule(task.id)}
                              className="text-primary hover:text-primary/80 mr-3"
                            >
                              排班
                            </button>
                            <button className="text-gray-600 hover:text-gray-800 mr-3">
                              查看
                            </button>
                            <button className="text-blue-600 hover:text-blue-800">
                              编辑
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="p-4 border-t flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  显示 1 至 {tasks.length} 条，共 {tasks.length} 条
                </p>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 border rounded-md text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                    上一页
                  </button>
                  <button className="px-3 py-1 border rounded-md text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                    下一页
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 创建任务模态框 */}
      {showAddTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">创建任务</h3>
              <button
                onClick={() => setShowAddTaskModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form className="space-y-4">
              <div>
                <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-700">
                  任务名称
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label htmlFor="type" className="block mb-2 text-sm font-medium text-gray-700">
                  任务类型
                </label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="日常值班">日常值班</option>
                  <option value="活动值班">活动值班</option>
                  <option value="事务值班">事务值班</option>
                </select>
              </div>
              <div>
                <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-700">
                  任务描述
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={3}
                />
              </div>
              <div>
                <label htmlFor="start_time" className="block mb-2 text-sm font-medium text-gray-700">
                  开始时间
                </label>
                <input
                  type="datetime-local"
                  id="start_time"
                  value={formData.start_time}
                  onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                  required
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label htmlFor="end_time" className="block mb-2 text-sm font-medium text-gray-700">
                  结束时间
                </label>
                <input
                  type="datetime-local"
                  id="end_time"
                  value={formData.end_time}
                  onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                  required
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label htmlFor="required_count" className="block mb-2 text-sm font-medium text-gray-700">
                  所需人数
                </label>
                <input
                  type="number"
                  id="required_count"
                  value={formData.required_count}
                  onChange={(e) => setFormData({ ...formData, required_count: parseInt(e.target.value) })}
                  min="1"
                  required
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label htmlFor="department_id" className="block mb-2 text-sm font-medium text-gray-700">
                  部门
                </label>
                <select
                  id="department_id"
                  value={formData.department_id}
                  onChange={(e) => setFormData({ ...formData, department_id: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value={1}>部门 1</option>
                  <option value={2}>部门 2</option>
                </select>
              </div>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddTaskModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 border rounded-md hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleAddTask}
                  className="flex-1 px-4 py-2 text-white bg-primary rounded-md hover:bg-primary/90"
                >
                  创建
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 排班结果模态框 */}
      {showScheduleModal && currentTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">排班结果 - {currentTask.title}</h3>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
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
                    <div key={schedule.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                      <div>
                        <p className="font-medium">{getMemberName(schedule.member_id)}</p>
                        <p className="text-sm text-gray-600">{getMemberPriority(schedule.member_id) === 'core' ? '核心成员' : '普通成员'}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditSchedule(schedule)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          调整
                        </button>
                        <button className="text-red-600 hover:text-red-800 text-sm">
                          移除
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setShowScheduleModal(false)}
                className="flex-1 px-4 py-2 text-gray-700 border rounded-md hover:bg-gray-50"
              >
                取消
              </button>
              <button
                type="button"
                className="flex-1 px-4 py-2 text-white bg-primary rounded-md hover:bg-primary/90"
              >
                确认排班
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 编辑排班模态框 */}
      {showEditScheduleModal && currentSchedule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">调整排班</h3>
              <button
                onClick={() => setShowEditScheduleModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mb-4">
              <h4 className="text-md font-medium text-gray-700 mb-2">选择成员</h4>
              <select
                value={editFormData.member_id}
                onChange={(e) => setEditFormData({ ...editFormData, member_id: e.target.value })}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
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
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-md cursor-pointer hover:bg-gray-100"
                    onClick={() => setEditFormData({ ...editFormData, member_id: member.id })}
                  >
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-gray-600">{member.priority === 'core' ? '核心成员' : '普通成员'}</p>
                    </div>
                    <p className="text-sm text-gray-600">本周值班次数: {member.duty_count}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setShowEditScheduleModal(false)}
                className="flex-1 px-4 py-2 text-gray-700 border rounded-md hover:bg-gray-50"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleUpdateSchedule}
                className="flex-1 px-4 py-2 text-white bg-primary rounded-md hover:bg-primary/90"
              >
                确认调整
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Scheduling;