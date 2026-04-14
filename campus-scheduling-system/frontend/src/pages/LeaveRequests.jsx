import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LeaveRequests = () => {
  const { user } = useAuth();
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    schedule_id: '',
    member_id: '',
    reason: '',
    start_time: '',
    end_time: ''
  });

  useEffect(() => {
    // 模拟数据，实际项目中需要从API获取
    setLeaveRequests([
      {
        id: 1,
        schedule_id: 3,
        member_id: 3,
        member_name: '测试用户3',
        task_id: 3,
        task_title: '图书馆日常值班3',
        reason: '身体不适',
        start_time: '2026-04-15 08:00:00',
        end_time: '2026-04-15 12:00:00',
        status: 'pending',
        created_at: '2026-04-13 16:00:00'
      }
    ]);
    setLoading(false);
  }, []);

  const handleAddLeaveRequest = () => {
    // 实际项目中需要调用API
    const newRequest = {
      id: leaveRequests.length + 1,
      ...formData,
      member_name: '测试用户3',
      task_id: 3,
      task_title: '图书馆日常值班3',
      status: 'pending',
      created_at: new Date().toISOString()
    };
    setLeaveRequests([...leaveRequests, newRequest]);
    setShowAddModal(false);
    setFormData({
      schedule_id: '',
      member_id: '',
      reason: '',
      start_time: '',
      end_time: ''
    });
  };

  const handleApprove = (id, status) => {
    // 实际项目中需要调用API
    const updatedRequests = leaveRequests.map(req => 
      req.id === id ? { ...req, status } : req
    );
    setLeaveRequests(updatedRequests);
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
                <Link to="/leave-requests" className="nav-link active">
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
            <h2 className="page-title">请假申请</h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary"
            >
              提交请假申请
            </button>
          </div>

          {loading ? (
            <div className="loading-container">
              <p>加载中...</p>
            </div>
          ) : (
            <div className="card">
              <div className="card-header">
                <div className="search-container">
                  <input
                    type="text"
                    placeholder="搜索请假申请"
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
                      <th>成员姓名</th>
                      <th>任务名称</th>
                      <th>请假原因</th>
                      <th>开始时间</th>
                      <th>结束时间</th>
                      <th>状态</th>
                      <th>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaveRequests.map((request) => (
                      <tr key={request.id}>
                        <td>{request.id}</td>
                        <td>{request.member_name}</td>
                        <td>{request.task_title}</td>
                        <td>{request.reason}</td>
                        <td>{request.start_time}</td>
                        <td>{request.end_time}</td>
                        <td>
                          <span className={`badge ${request.status === 'pending' ? 'warning' : request.status === 'approved' ? 'success' : 'danger'}`}>
                            {request.status === 'pending' ? '待审批' : request.status === 'approved' ? '已批准' : '已拒绝'}
                          </span>
                        </td>
                        <td>
                          {request.status === 'pending' && (
                            <div className="action-buttons">
                              <button
                                onClick={() => handleApprove(request.id, 'approved')}
                                className="action-btn success"
                              >
                                批准
                              </button>
                              <button
                                onClick={() => handleApprove(request.id, 'rejected')}
                                className="action-btn danger"
                              >
                                拒绝
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="card-footer">
                <div className="pagination-info">
                  显示 1 至 {leaveRequests.length} 条，共 {leaveRequests.length} 条
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
          )}
        </main>
      </div>

      {/* 提交请假申请模态框 */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">提交请假申请</h3>
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
                <label className="form-label">排班ID</label>
                <input
                  type="number"
                  value={formData.schedule_id}
                  onChange={(e) => setFormData({ ...formData, schedule_id: e.target.value })}
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">成员ID</label>
                <input
                  type="number"
                  value={formData.member_id}
                  onChange={(e) => setFormData({ ...formData, member_id: e.target.value })}
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">请假原因</label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  required
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
                  onClick={handleAddLeaveRequest}
                  className="btn-primary"
                >
                  提交
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveRequests;
