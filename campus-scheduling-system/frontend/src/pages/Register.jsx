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
      let role = 'normal';
      if (inviteCode === 'admin') {
        role = 'department_admin';
      } else if (inviteCode === 'system') {
        role = 'system_admin';
      }

      const response = await fetch('/api/auth/register', {
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
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2 className="auth-title">校园智能排班系统</h2>
          <p className="auth-subtitle">创建您的账号</p>
        </div>

        {error && (
          <div className="alert error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">姓名</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="form-input"
              placeholder="请输入姓名"
            />
          </div>

          <div className="form-group">
            <label className="form-label">邮箱</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
              placeholder="请输入邮箱"
            />
          </div>

          <div className="form-group">
            <label className="form-label">密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
              placeholder="请输入密码"
            />
          </div>

          <div className="form-group">
            <label className="form-label">确认密码</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="form-input"
              placeholder="请再次输入密码"
            />
          </div>

          <div className="form-group">
            <label className="form-label">手机号</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="form-input"
              placeholder="请输入手机号"
            />
          </div>

          <div className="form-group">
            <label className="form-label">成员类型</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="form-input"
            >
              <option value="normal">普通成员</option>
              <option value="core">核心成员</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">邀请码 (选填)</label>
            <input
              type="text"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              className="form-input"
              placeholder="输入邀请码以获取管理员权限"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary btn-full"
          >
            {loading ? '注册中...' : '注册'}
          </button>

          <div className="auth-footer">
            <p className="auth-footer-text">
              已有账号？
              <Link to="/login" className="link">
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
