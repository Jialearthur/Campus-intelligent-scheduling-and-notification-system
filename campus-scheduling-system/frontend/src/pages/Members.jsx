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
                  统计看板
                </Link>
              </li>
              <li>
                <Link to="/members" className="nav-link active">
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
            <h2 className="page-title">成员管理</h2>
            <button onClick={() => setShowAddModal(true)} className="btn-primary">
              <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              添加成员
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
                    placeholder="搜索成员姓名或邮箱..."
                    className="search-input"
                  />
                </div>
              </div>
              <div className="table-scroll">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>姓名</th>
                      <th className="hidden-sm">邮箱</th>
                      <th className="hidden-md">手机号</th>
                      <th>类型</th>
                      <th className="hidden-lg">空闲天数</th>
                      <th>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map((member) => (
                      <tr key={member.id}>
                        <td>{member.id}</td>
                        <td>
                          <div className="member-cell">
                            <div className="member-avatar">{member.name.charAt(0)}</div>
                            <span className="member-name">{member.name}</span>
                          </div>
                        </td>
                        <td className="hidden-sm">{member.email}</td>
                        <td className="hidden-md">{member.phone}</td>
                        <td>
                          <span className={`badge ${member.priority === 'core' ? 'primary' : 'secondary'}`}>
                            {member.priority === 'core' ? '核心成员' : '普通成员'}
                          </span>
                        </td>
                        <td className="hidden-lg">
                          <span className="text-success">{member.availability_count} 天</span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              onClick={() => openAvailabilityModal(member)}
                              className="action-btn info"
                              title="设置空闲时间"
                            >
                              <svg className="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => openEditModal(member)}
                              className="action-btn primary"
                            >
                              编辑
                            </button>
                            <button
                              onClick={() => handleDeleteMember(member.id)}
                              className="action-btn danger"
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
              <div className="table-footer">
                <p className="pagination-info">显示 1 至 {members.length} 条，共 {members.length} 条</p>
                <div className="pagination-buttons">
                  <button className="pagination-btn" disabled>上一页</button>
                  <button className="pagination-btn" disabled>下一页</button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">添加成员</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="modal-close"
              >
                <svg className="modal-close-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form className="modal-form">
              <div className="form-group">
                <label className="form-label">姓名</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">邮箱</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">手机号</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">部门</label>
                <select
                  value={formData.department_id}
                  onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
                  className="form-input"
                >
                  <option value="1">部门 1</option>
                  <option value="2">部门 2</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">成员类型</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="form-input"
                >
                  <option value="normal">普通成员</option>
                  <option value="core">核心成员</option>
                </select>
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleAddMember}
                  className="btn-primary"
                >
                  添加
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && currentMember && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">编辑成员</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="modal-close"
              >
                <svg className="modal-close-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form className="modal-form">
              <div className="form-group">
                <label className="form-label">姓名</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">邮箱</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">手机号</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">部门</label>
                <select
                  value={formData.department_id}
                  onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
                  className="form-input"
                >
                  <option value="1">部门 1</option>
                  <option value="2">部门 2</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">成员类型</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="form-input"
                >
                  <option value="normal">普通成员</option>
                  <option value="core">核心成员</option>
                </select>
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="btn-secondary"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleEditMember}
                  className="btn-primary"
                >
                  保存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAvailabilityModal && currentMember && (
        <div className="modal-overlay">
          <div className="modal large">
            <div className="modal-header">
              <div>
                <h3 className="modal-title">设置空闲时间</h3>
                <p className="modal-subtitle">为 {currentMember.name} 选择空闲日期</p>
              </div>
              <button
                onClick={() => setShowAvailabilityModal(false)}
                className="modal-close"
              >
                <svg className="modal-close-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <CalendarPicker
                selectedDates={availabilityDates}
                onChange={setAvailabilityDates}
              />
              {availabilityDates.length > 0 && (
                <div className="selected-dates">
                  <h4 className="selected-dates-title">已选择的日期 ({availabilityDates.length} 天)</h4>
                  <div className="date-chips">
                    {availabilityDates.slice(0, 10).map((date, index) => (
                      <span key={index} className="date-chip">{date}</span>
                    ))}
                    {availabilityDates.length > 10 && (
                      <span className="date-chip more">+{availabilityDates.length - 10} 更多</span>
                    )}
                  </div>
                </div>
              )}
              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setShowAvailabilityModal(false)}
                  className="btn-secondary"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={saveAvailability}
                  className="btn-primary"
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
