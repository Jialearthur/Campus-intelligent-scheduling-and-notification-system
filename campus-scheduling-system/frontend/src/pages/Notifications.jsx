import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { get, post } from '../utils/api';

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSendModal, setShowSendModal] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    wechat: false,
    qywechat: false
  });
  const [formData, setFormData] = useState({
    member_id: '',
    channels: ['email'],
    content: ''
  });

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await get('/notifications');
      setNotifications(data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      setNotifications([
        { id: 1, schedule_id: 1, member_id: 1, member_name: '张三', channel: 'email', content: '您被安排在2026-04-14 08:00-12:00值班', status: 'sent', sent_at: '2026-04-13 10:00:00', created_at: '2026-04-13 09:59:00' },
        { id: 2, schedule_id: 1, member_id: 2, member_name: '李四', channel: 'wechat', content: '您被安排在2026-04-14 08:00-12:00值班', status: 'failed', sent_at: null, created_at: '2026-04-13 09:59:00' },
        { id: 3, schedule_id: 2, member_id: 1, member_name: '张三', channel: 'email', content: '您被安排在2026-04-15 14:00-18:00值班', status: 'pending', sent_at: null, created_at: '2026-04-13 11:00:00' }
      ]);
    }
    setLoading(false);
  };

  const handleResendNotification = async (notificationId) => {
    try {
      await post(`/notifications/${notificationId}/resend`);
      fetchNotifications();
    } catch (error) {
      console.error('Failed to resend notification:', error);
    }
  };

  const handleSendNotification = async () => {
    try {
      await post('/notifications', formData);
      fetchNotifications();
      setShowSendModal(false);
      setFormData({
        member_id: '',
        channels: ['email'],
        content: ''
      });
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  };

  const toggleNotificationSetting = (channel) => {
    setNotificationSettings({
      ...notificationSettings,
      [channel]: !notificationSettings[channel]
    });
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
                <Link to="/notifications" className="nav-link active">
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
            <h2 className="page-title">通知管理</h2>
            <button
              onClick={() => setShowSendModal(true)}
              className="btn primary-btn"
            >
              发送通知
            </button>
          </div>

          {/* 通知设置 */}
          <div className="card mb-6">
            <div className="card-header">
              <h3 className="card-title">通知设置</h3>
            </div>
            <div className="card-body">
              <div className="settings-list">
                <div className="setting-item">
                  <div className="setting-info">
                    <h4 className="setting-title">校园邮箱</h4>
                    <p className="setting-description">通过校园邮箱发送通知</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={notificationSettings.email}
                      onChange={() => toggleNotificationSetting('email')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                <div className="setting-item">
                  <div className="setting-info">
                    <h4 className="setting-title">微信</h4>
                    <p className="setting-description">通过微信发送通知</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={notificationSettings.wechat}
                      onChange={() => toggleNotificationSetting('wechat')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                <div className="setting-item">
                  <div className="setting-info">
                    <h4 className="setting-title">企业微信</h4>
                    <p className="setting-description">通过企业微信发送通知</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={notificationSettings.qywechat}
                      onChange={() => toggleNotificationSetting('qywechat')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* 通知历史 */}
          <div className="card">
            <div className="card-header">
              <div className="search-container">
                <input
                  type="text"
                  placeholder="搜索通知"
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
                    <th>成员</th>
                    <th>内容</th>
                    <th>渠道</th>
                    <th>状态</th>
                    <th>发送时间</th>
                    <th>创建时间</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {notifications.map((notification) => (
                    <tr key={notification.id}>
                      <td>{notification.id}</td>
                      <td>{notification.member_name || '未知成员'}</td>
                      <td>{notification.content}</td>
                      <td>
                        <span className={`status-badge ${notification.channel === 'email' ? 'status-email' : notification.channel === 'wechat' ? 'status-wechat' : 'status-qywechat'}`}>
                          {notification.channel === 'email' ? '校园邮箱' : notification.channel === 'wechat' ? '微信' : '企业微信'}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${notification.status === 'sent' ? 'status-sent' : notification.status === 'pending' ? 'status-pending' : 'status-failed'}`}>
                          {notification.status === 'sent' ? '已发送' : notification.status === 'pending' ? '待发送' : '发送失败'}
                        </span>
                      </td>
                      <td>{notification.sent_at || 'N/A'}</td>
                      <td>{notification.created_at}</td>
                      <td>
                        {notification.status === 'failed' && (
                          <button
                            onClick={() => handleResendNotification(notification.id)}
                            className="action-btn"
                          >
                            重新发送
                          </button>
                        )}
                        {notification.status === 'sent' && (
                          <span className="text-muted">-</span>
                        )}
                        {notification.status === 'pending' && (
                          <span className="text-muted">等待中</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="card-footer">
              <div className="pagination-info">
                显示 1 至 {notifications.length} 条，共 {notifications.length} 条
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

      {/* 发送通知模态框 */}
      {showSendModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">发送通知</h3>
              <button
                onClick={() => setShowSendModal(false)}
                className="modal-close"
              >
                <svg className="close-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="member_id">成员</label>
                <select
                  id="member_id"
                  value={formData.member_id}
                  onChange={(e) => setFormData({ ...formData, member_id: e.target.value })}
                  className="form-input"
                >
                  <option value="">选择成员</option>
                  <option value="1">张三</option>
                  <option value="2">李四</option>
                  <option value="3">王五</option>
                </select>
              </div>
              <div className="form-group">
                <label>通知渠道</label>
                <div className="checkbox-group">
                  <div className="checkbox-item">
                    <input
                      type="checkbox"
                      id="channel-email"
                      checked={formData.channels.includes('email')}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({ ...formData, channels: [...formData.channels, 'email'] });
                        } else {
                          setFormData({ ...formData, channels: formData.channels.filter(c => c !== 'email') });
                        }
                      }}
                      className="form-checkbox"
                    />
                    <label htmlFor="channel-email">校园邮箱</label>
                  </div>
                  <div className="checkbox-item">
                    <input
                      type="checkbox"
                      id="channel-wechat"
                      checked={formData.channels.includes('wechat')}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({ ...formData, channels: [...formData.channels, 'wechat'] });
                        } else {
                          setFormData({ ...formData, channels: formData.channels.filter(c => c !== 'wechat') });
                        }
                      }}
                      className="form-checkbox"
                    />
                    <label htmlFor="channel-wechat">微信</label>
                  </div>
                  <div className="checkbox-item">
                    <input
                      type="checkbox"
                      id="channel-qywechat"
                      checked={formData.channels.includes('qywechat')}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({ ...formData, channels: [...formData.channels, 'qywechat'] });
                        } else {
                          setFormData({ ...formData, channels: formData.channels.filter(c => c !== 'qywechat') });
                        }
                      }}
                      className="form-checkbox"
                    />
                    <label htmlFor="channel-qywechat">企业微信</label>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="content">通知内容</label>
                <textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                  className="form-input"
                  rows={4}
                />
              </div>
            </div>
            <div className="modal-actions">
              <button
                type="button"
                onClick={() => setShowSendModal(false)}
                className="btn btn-secondary"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleSendNotification}
                className="btn btn-primary"
              >
                发送
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;