import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CalendarPicker from '../components/CalendarPicker';

const Members = () => {
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [currentMember, setCurrentMember] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department_id: '1',
    priority: 'normal'
  });
  const [availabilityDates, setAvailabilityDates] = useState([]);

  useEffect(() => {
    setMembers([
      { id: 1, name: '张三', email: 'zhangsan@example.com', phone: '13800138001', department_id: 1, priority: 'core', availability_count: 12 },
      { id: 2, name: '李四', email: 'lisi@example.com', phone: '13900139001', department_id: 1, priority: 'normal', availability_count: 8 },
      { id: 3, name: '王五', email: 'wangwu@example.com', phone: '13700137001', department_id: 2, priority: 'normal', availability_count: 10 }
    ]);
    setLoading(false);
  }, []);

  const handleAddMember = () => {
    const newMember = {
      id: members.length + 1,
      ...formData,
      availability_count: 0
    };
    setMembers([...members, newMember]);
    setShowAddModal(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      department_id: '1',
      priority: 'normal'
    });
  };

  const handleEditMember = () => {
    const updatedMembers = members.map(member => 
      member.id === currentMember.id ? { ...member, ...formData } : member
    );
    setMembers(updatedMembers);
    setShowEditModal(false);
    setCurrentMember(null);
  };

  const handleDeleteMember = (id) => {
    const updatedMembers = members.filter(member => member.id !== id);
    setMembers(updatedMembers);
  };

  const openEditModal = (member) => {
    setCurrentMember(member);
    setFormData({
      name: member.name,
      email: member.email,
      phone: member.phone,
      department_id: member.department_id.toString(),
      priority: member.priority
    });
    setShowEditModal(true);
  };

  const openAvailabilityModal = (member) => {
    setCurrentMember(member);
    setAvailabilityDates([]);
    setShowAvailabilityModal(true);
  };

  const saveAvailability = () => {
    const updatedMembers = members.map(member => 
      member.id === currentMember.id ? { ...member, availability_count: availabilityDates.length } : member
    );
    setMembers(updatedMembers);
    setShowAvailabilityModal(false);
    setCurrentMember(null);
    setAvailabilityDates([]);
  };

  return (
    <div className="min-h-screen bg-secondary">
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-primary">校园智能排班系统</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">欢迎, {user?.name || '用户'}</span>
              <Link to="/dashboard" className="px-3 py-1.5 text-sm text-white bg-gray-600 rounded-xl hover:bg-gray-700 transition-colors">
                退出登录
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)]">
        <aside className="w-full lg:w-64 bg-white shadow-sm lg:border-r border-gray-100">
          <div className="p-4 lg:p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">导航</h2>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/dashboard"
                  className="nav-link"
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  仪表盘
                </Link>
              </li>
              <li>
                <Link
                  to="/members"
                  className="nav-link active"
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  成员管理
                </Link>
              </li>
              <li>
                <Link
                  to="/scheduling"
                  className="nav-link"
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  排班管理
                </Link>
              </li>
              <li>
                <Link
                  to="/notifications"
                  className="nav-link"
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  通知管理
                </Link>
              </li>
              <li>
                <Link
                  to="/statistics"
                  className="nav-link"
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  数据统计
                </Link>
              </li>
            </ul>
          </div>
        </aside>

        <main className="flex-1 p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-800">成员管理</h2>
              <button
                onClick={() => setShowAddModal(true)}
                className="btn-primary flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                添加成员
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
              </div>
            ) : (
              <div className="table-wrapper">
                <div className="p-4 lg:p-6 border-b border-gray-100">
                  <div className="flex items-center">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="搜索成员姓名或邮箱..."
                        className="w-full px-4 py-3 pl-12 rounded-xl border-gray-200 focus:ring-2 focus:ring-primary/20"
                      />
                      <div className="absolute left-4 top-1/2 -translate-y-1/2">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-100">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 lg:px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-4 lg:px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          姓名
                        </th>
                        <th className="px-4 lg:px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                          邮箱
                        </th>
                        <th className="px-4 lg:px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                          手机号
                        </th>
                        <th className="px-4 lg:px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          类型
                        </th>
                        <th className="px-4 lg:px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                          空闲天数
                        </th>
                        <th className="px-4 lg:px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          操作
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {members.map((member) => (
                        <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {member.id}
                          </td>
                          <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-primary-light text-primary flex items-center justify-center font-semibold text-sm mr-3">
                                {member.name.charAt(0)}
                              </div>
                              <span className="text-sm font-medium text-gray-900">{member.name}</span>
                            </div>
                          </td>
                          <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                            {member.email}
                          </td>
                          <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                            {member.phone}
                          </td>
                          <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${member.priority === 'core' ? 'bg-primary-light text-primary' : 'bg-gray-100 text-gray-700'}`}>
                              {member.priority === 'core' ? '核心成员' : '普通成员'}
                            </span>
                          </td>
                          <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                            <span className="font-medium text-success">{member.availability_count} 天</span>
                          </td>
                          <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => openAvailabilityModal(member)}
                                className="text-info hover:text-info/80 px-2 py-1 rounded-lg hover:bg-blue-50 transition-colors"
                                title="设置空闲时间"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => openEditModal(member)}
                                className="text-primary hover:text-primary/80 px-2 py-1 rounded-lg hover:bg-primary-light transition-colors"
                              >
                                编辑
                              </button>
                              <button
                                onClick={() => handleDeleteMember(member.id)}
                                className="text-danger hover:text-danger/80 px-2 py-1 rounded-lg hover:bg-red-50 transition-colors"
                              >
                                删除
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="p-4 lg:p-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <p className="text-sm text-gray-600">
                    显示 1 至 {members.length} 条，共 {members.length} 条
                  </p>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" disabled>
                      上一页
                    </button>
                    <button className="px-3 py-1.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" disabled>
                      下一页
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800">添加成员</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form className="p-6 space-y-5">
              <div>
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700">
                  姓名
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full"
                />
              </div>
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
                  邮箱
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-700">
                  手机号
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full"
                />
              </div>
              <div>
                <label htmlFor="department_id" className="block mb-2 text-sm font-medium text-gray-700">
                  部门
                </label>
                <select
                  id="department_id"
                  value={formData.department_id}
                  onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
                  className="w-full"
                >
                  <option value="1">部门 1</option>
                  <option value="2">部门 2</option>
                </select>
              </div>
              <div>
                <label htmlFor="priority" className="block mb-2 text-sm font-medium text-gray-700">
                  成员类型
                </label>
                <select
                  id="priority"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full"
                >
                  <option value="normal">普通成员</option>
                  <option value="core">核心成员</option>
                </select>
              </div>
              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 btn-secondary"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleAddMember}
                  className="flex-1 btn-primary"
                >
                  添加
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && currentMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800">编辑成员</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form className="p-6 space-y-5">
              <div>
                <label htmlFor="edit-name" className="block mb-2 text-sm font-medium text-gray-700">
                  姓名
                </label>
                <input
                  type="text"
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full"
                />
              </div>
              <div>
                <label htmlFor="edit-email" className="block mb-2 text-sm font-medium text-gray-700">
                  邮箱
                </label>
                <input
                  type="email"
                  id="edit-email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full"
                />
              </div>
              <div>
                <label htmlFor="edit-phone" className="block mb-2 text-sm font-medium text-gray-700">
                  手机号
                </label>
                <input
                  type="tel"
                  id="edit-phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full"
                />
              </div>
              <div>
                <label htmlFor="edit-department_id" className="block mb-2 text-sm font-medium text-gray-700">
                  部门
                </label>
                <select
                  id="edit-department_id"
                  value={formData.department_id}
                  onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
                  className="w-full"
                >
                  <option value="1">部门 1</option>
                  <option value="2">部门 2</option>
                </select>
              </div>
              <div>
                <label htmlFor="edit-priority" className="block mb-2 text-sm font-medium text-gray-700">
                  成员类型
                </label>
                <select
                  id="edit-priority"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full"
                >
                  <option value="normal">普通成员</option>
                  <option value="core">核心成员</option>
                </select>
              </div>
              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 btn-secondary"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleEditMember}
                  className="flex-1 btn-primary"
                >
                  保存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAvailabilityModal && currentMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl my-8">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">设置空闲时间</h3>
                <p className="text-sm text-gray-500 mt-1">为 {currentMember.name} 选择空闲日期</p>
              </div>
              <button
                onClick={() => setShowAvailabilityModal(false)}
                className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <CalendarPicker
                selectedDates={availabilityDates}
                onChange={setAvailabilityDates}
              />
              {availabilityDates.length > 0 && (
                <div className="mt-6 p-4 bg-primary-light rounded-xl">
                  <h4 className="font-medium text-primary mb-2">已选择的日期 ({availabilityDates.length} 天)</h4>
                  <div className="flex flex-wrap gap-2">
                    {availabilityDates.slice(0, 10).map((date, index) => (
                      <span key={index} className="px-3 py-1 bg-white text-dark rounded-lg text-sm">
                        {date}
                      </span>
                    ))}
                    {availabilityDates.length > 10 && (
                      <span className="px-3 py-1 bg-white text-gray-500 rounded-lg text-sm">
                        +{availabilityDates.length - 10} 更多
                      </span>
                    )}
                  </div>
                </div>
              )}
              <div className="flex space-x-3 pt-6">
                <button
                  type="button"
                  onClick={() => setShowAvailabilityModal(false)}
                  className="flex-1 btn-secondary"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={saveAvailability}
                  className="flex-1 btn-primary"
                >
                  保存
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Members;
