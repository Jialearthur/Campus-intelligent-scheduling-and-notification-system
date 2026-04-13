import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
    // 模拟数据，实际项目中需要从API获取
    setNotifications([
      { id: 1, schedule_id: 1, member_id: 1, channel: 'email', content: '您被安排在2026-04-14 08:00-12:00值班', status: 'sent', sent_at: '2026-04-13 10:00:00', created_at: '2026-04-13 09:59:00' },
      { id: 2, schedule_id: 1, member_id: 2, channel: 'email', content: '您被安排在2026-04-14 08:00-12:00值班', status: 'sent', sent_at: '2026-04-13 10:00:00', created_at: '2026-04-13 09:59:00' },
      { id: 3, schedule_id: 2, member_id: 1, channel: 'email', content: '您被安排在2026-04-15 14:00-18:00值班', status: 'pending', sent_at: null, created_at: '2026-04-13 11:00:00' }
    ]);
    setLoading(false);
  }, []);

  const handleSendNotification = () => {
    // 实际项目中需要调用API
    const newNotification = {
      id: notifications.length + 1,
      schedule_id: 1,
      member_id: formData.member_id,
      channel: formData.channels[0],
      content: formData.content,
      status: 'pending',
      sent_at: null,
      created_at: new Date().toISOString()
    };
    setNotifications([...notifications, newNotification]);
    setShowSendModal(false);
    setFormData({
      member_id: '',
      channels: ['email'],
      content: ''
    });
  };

  const toggleNotificationSetting = (channel) => {
    setNotificationSettings({
      ...notificationSettings,
      [channel]: !notificationSettings[channel]
    });
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
                  className="flex items-center px-3 py-2 text-primary bg-blue-50 rounded-md"
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
            <h2 className="text-2xl font-bold text-gray-800">通知管理</h2>
            <button
              onClick={() => setShowSendModal(true)}
              className="px-4 py-2 text-white bg-primary rounded-md hover:bg-primary/90"
            >
              发送通知
            </button>
          </div>

          {/* 通知设置 */}
          <div className="bg-white rounded-lg shadow-sm mb-6 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">通知设置</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">校园邮箱</h4>
                  <p className="text-sm text-gray-600">通过校园邮箱发送通知</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationSettings.email}
                    onChange={() => toggleNotificationSetting('email')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">微信</h4>
                  <p className="text-sm text-gray-600">通过微信发送通知</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationSettings.wechat}
                    onChange={() => toggleNotificationSetting('wechat')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">企业微信</h4>
                  <p className="text-sm text-gray-600">通过企业微信发送通知</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationSettings.qywechat}
                    onChange={() => toggleNotificationSetting('qywechat')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </div>

          {/* 通知历史 */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b">
              <div className="flex items-center">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="搜索通知"
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
                      内容
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      渠道
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      状态
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      发送时间
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      创建时间
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {notifications.map((notification) => (
                    <tr key={notification.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {notification.id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {notification.content}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${notification.channel === 'email' ? 'bg-blue-100 text-blue-800' : notification.channel === 'wechat' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'}`}>
                          {notification.channel === 'email' ? '校园邮箱' : notification.channel === 'wechat' ? '微信' : '企业微信'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${notification.status === 'sent' ? 'bg-green-100 text-green-800' : notification.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                          {notification.status === 'sent' ? '已发送' : notification.status === 'pending' ? '待发送' : '发送失败'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {notification.sent_at || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {notification.created_at}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t flex justify-between items-center">
              <p className="text-sm text-gray-600">
                显示 1 至 {notifications.length} 条，共 {notifications.length} 条
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
        </div>
      </div>

      {/* 发送通知模态框 */}
      {showSendModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">发送通知</h3>
              <button
                onClick={() => setShowSendModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form className="space-y-4">
              <div>
                <label htmlFor="member_id" className="block mb-2 text-sm font-medium text-gray-700">
                  成员
                </label>
                <select
                  id="member_id"
                  value={formData.member_id}
                  onChange={(e) => setFormData({ ...formData, member_id: e.target.value })}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">选择成员</option>
                  <option value="1">张三</option>
                  <option value="2">李四</option>
                  <option value="3">王五</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  通知渠道
                </label>
                <div className="space-y-2">
                  <div className="flex items-center">
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
                      className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label htmlFor="channel-email" className="ml-2 block text-sm text-gray-700">
                      校园邮箱
                    </label>
                  </div>
                  <div className="flex items-center">
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
                      className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label htmlFor="channel-wechat" className="ml-2 block text-sm text-gray-700">
                      微信
                    </label>
                  </div>
                  <div className="flex items-center">
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
                      className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label htmlFor="channel-qywechat" className="ml-2 block text-sm text-gray-700">
                      企业微信
                    </label>
                  </div>
                </div>
              </div>
              <div>
                <label htmlFor="content" className="block mb-2 text-sm font-medium text-gray-700">
                  通知内容
                </label>
                <textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={4}
                />
              </div>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setShowSendModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 border rounded-md hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleSendNotification}
                  className="flex-1 px-4 py-2 text-white bg-primary rounded-md hover:bg-primary/90"
                >
                  发送
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;