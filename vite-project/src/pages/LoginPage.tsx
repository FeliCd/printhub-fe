import React, { useState } from 'react';
import { Layers, LogIn, ShieldAlert } from 'lucide-react';

interface LoginPageProps {
  onLogin: (username: string, role: 'BUYER' | 'MAKER' | 'ADMIN') => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Vui lòng điền đầy đủ tên đăng nhập và mật khẩu.');
      return;
    }

    // Default credential validation
    if (username === 'admin' && password === 'admin') {
      onLogin('Quản trị viên', 'ADMIN');
    } else if (username === 'maker' && password === '123') {
      onLogin('DragonCreator3D', 'MAKER');
    } else if (username === 'buyer' && password === '123') {
      onLogin('Nguyễn Văn Anh', 'BUYER');
    } else {
      setError('Tên tài khoản hoặc mật khẩu không đúng!');
    }
  };

  const handleQuickLogin = (role: 'BUYER' | 'MAKER' | 'ADMIN') => {
    if (role === 'BUYER') {
      onLogin('Nguyễn Văn Anh', 'BUYER');
    } else if (role === 'MAKER') {
      onLogin('DragonCreator3D', 'MAKER');
    } else if (role === 'ADMIN') {
      onLogin('Quản trị viên', 'ADMIN');
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: 'var(--bg-primary)',
      padding: '16px'
    }}>
      <div className="glass-card" style={{
        maxWidth: '400px',
        width: '100%',
        padding: '24px',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        textAlign: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '16px' }}>
          <Layers className="logo-accent" size={30} style={{ color: 'var(--primary)' }} />
          <span style={{ fontSize: '20px', fontWeight: 'bold', letterSpacing: '-0.5px' }}>
            Print<span style={{ color: 'var(--primary)' }}>Hub 3D</span>
          </span>
        </div>

        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>Chào mừng quay trở lại</h2>
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px' }}>Đăng nhập tài khoản của bạn để tiếp tục</p>

        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(255, 59, 48, 0.1)',
            border: '1px solid #ff3b30',
            padding: '8px 12px',
            borderRadius: '8px',
            color: '#ff3b30',
            fontSize: '11px',
            textAlign: 'left',
            marginBottom: '12px'
          }}>
            <ShieldAlert size={14} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleFormSubmit} style={{ textAlign: 'left', marginBottom: '16px' }}>
          <div className="form-group" style={{ marginBottom: '12px' }}>
            <label style={{ marginBottom: '6px', fontSize: '12px' }}>Tên đăng nhập</label>
            <input
              type="text"
              className="form-control"
              placeholder="Nhập buyer, maker hoặc admin"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError('');
              }}
              style={{ padding: '8px 12px' }}
              required
            />
          </div>
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label style={{ marginBottom: '6px', fontSize: '12px' }}>Mật khẩu</label>
            <input
              type="password"
              className="form-control"
              placeholder="Nhập 123 hoặc admin"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              style={{ padding: '8px 12px' }}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '8px 16px', fontSize: '13px', gap: '8px' }}>
            <LogIn size={14} />
            Đăng nhập
          </button>
        </form>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Đăng nhập nhanh thử nghiệm:
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-secondary" style={{ flex: 1, fontSize: '12px', padding: '8px 4px', whiteSpace: 'nowrap' }} onClick={() => handleQuickLogin('BUYER')} title="buyer / 123">
              Người Mua
            </button>
            <button className="btn btn-secondary" style={{ flex: 1, fontSize: '12px', padding: '8px 4px', whiteSpace: 'nowrap' }} onClick={() => handleQuickLogin('MAKER')} title="maker / 123">
              Nhà In
            </button>
            <button className="btn btn-secondary" style={{ flex: 1, fontSize: '12px', padding: '8px 4px', whiteSpace: 'nowrap' }} onClick={() => handleQuickLogin('ADMIN')} title="admin / admin">
              Quản Trị
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
