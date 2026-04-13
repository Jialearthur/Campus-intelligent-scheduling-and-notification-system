import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [department_id, setDepartment_id] = useState('1');
  const [phone, setPhone] = useState('');
  const [priority, setPriority] = useState('normal');
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      return setError('两次输入的密码不一致');
    }

    setLoading(true);

    try {
      // 简化处理，实际项目中需要验证邀请码
      let role = 'normal';
      if (inviteCode === 'admin') {
        role = 'department_admin';
      } else if (inviteCode === 'system') {
        role = 'system_admin';
      }

      const response = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          password, 
          role, 
          name, 
          department_id, 
          phone, 
          priority 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '注册失败');
      }

      login(data.token, data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary">校园智能排班系统</h2>
          <p className="mt-2 text-gray-600">创建您的账号</p>
        </div>

        {error && (
          <div className="p-3 text-red-600 bg-red-100 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700">
              姓名
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="请输入姓名"
            />
          </div>

          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
              邮箱
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="请输入邮箱"
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">
              密码
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="请输入密码"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-700">
              确认密码
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="请再次输入密码"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-700">
              手机号
            </label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="请输入手机号"
            />
          </div>

          <div>
            <label htmlFor="priority" className="block mb-2 text-sm font-medium text-gray-700">
              成员类型
            </label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="normal">普通成员</option>
              <option value="core">核心成员</option>
            </select>
          </div>

          <div>
            <label htmlFor="inviteCode" className="block mb-2 text-sm font-medium text-gray-700">
              邀请码 (选填)
            </label>
            <input
              type="text"
              id="inviteCode"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="输入邀请码以获取管理员权限"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 font-medium text-white bg-primary rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '注册中...' : '注册'}
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              已有账号？
              <Link to="/login" className="font-medium text-primary hover:text-primary/80 ml-1">
                立即登录
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;