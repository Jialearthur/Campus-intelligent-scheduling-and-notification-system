import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Members = () => {
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentMember, setCurrentMember] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department_id: '1',
    priority: 'normal'
  });

  useEffect(() => {
    // 模拟数据，实际项目中需要从API获取
    setMembers([
      { id: 1, name: '张三', email: 'zhangsan@example.com', phone: '13800138001', department_id: 1, priority: 'core' },
      { id: 2, name: '李四', email: 'lisi@example.com', phone: '13900139001', department_id: 1, priority: 'normal' },
      { id: 3, name: '王五', email: 'wangwu@example.com', phone: '13700137001', department_id: 2, priority: 'normal' }
    ]);
    setLoading(false);
  }, []);

  const handleAddMember = () => {
    // 实际项目中需要调用API
    const newMember = {
      id: members.length + 1,
      ...formData
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
    // 实际项目中需要调用API
    const updatedMembers = members.map(member => 
      member.id === currentMember.id ? { ...member, ...formData } : member
    );
    setMembers(updatedMembers);
    setShowEditModal(false);
    setCurrentMember(null);
  };

  const handleDeleteMember = (id) => {
    // 实际项目中需要调用API
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
                  className="flex items-center px-3 py-2 text-primary bg-blue-50 rounded-md"
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
            </ul>
          </div>
        </div>

        {/* 主内容区 */}
        <div className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">成员管理</h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 text-white bg-primary rounded-md hover:bg-primary/90"
            >
              添加成员
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
                      placeholder="搜索成员"
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
                        姓名
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        邮箱
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        手机号
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        部门
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        类型
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {members.map((member) => (
                      <tr key={member.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {member.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {member.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {member.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {member.phone}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          部门 {member.department_id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${member.priority === 'core' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                            {member.priority === 'core' ? '核心成员' : '普通成员'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => openEditModal(member)}
                            className="text-primary hover:text-primary/80 mr-3"
                          >
                            编辑
                          </button>
                          <button
                            onClick={() => handleDeleteMember(member.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            删除
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 border-t flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  显示 1 至 {members.length} 条，共 {members.length} 条
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

      {/* 添加成员模态框 */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">添加成员</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form className="space-y-4">
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
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
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
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
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
                  onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
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
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="normal">普通成员</option>
                  <option value="core">核心成员</option>
                </select>
              </div>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 border rounded-md hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleAddMember}
                  className="flex-1 px-4 py-2 text-white bg-primary rounded-md hover:bg-primary/90"
                >
                  添加
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 编辑成员模态框 */}
      {showEditModal && currentMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">编辑成员</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form className="space-y-4">
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
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
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
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
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
                  onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
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
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="normal">普通成员</option>
                  <option value="core">核心成员</option>
                </select>
              </div>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 border rounded-md hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleEditMember}
                  className="flex-1 px-4 py-2 text-white bg-primary rounded-md hover:bg-primary/90"
                >
                  保存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Members;