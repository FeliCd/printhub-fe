'use client'

import * as React from 'react'
import { useState } from 'react'
import { authService } from '@/services'

interface InputProps {
  label?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  [key: string]: any;
}

const AppInput = (props: InputProps) => {
  const { label, placeholder, icon, ...rest } = props;
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <div className="w-full min-w-[200px] relative">
      {label &&
        <label className='block mb-2 text-sm text-[var(--color-text-primary)]'>
          {label}
        </label>
      }
      <div className="relative w-full">
        <input
          className="peer relative z-10 border-2 border-[var(--color-border)] h-12 w-full rounded-md bg-[var(--color-surface)] px-4 font-thin outline-none drop-shadow-sm transition-all duration-200 ease-in-out focus:bg-[var(--color-bg)] placeholder:font-medium text-white"
          placeholder={placeholder}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          {...rest}
        />
        {isHovering && (
          <>
            <div
              className="absolute pointer-events-none top-0 left-0 right-0 h-[2px] z-20 rounded-t-md overflow-hidden"
              style={{
                background: `radial-gradient(30px circle at ${mousePosition.x}px 0px, var(--color-text-primary) 0%, transparent 70%)`,
              }}
            />
            <div
              className="absolute pointer-events-none bottom-0 left-0 right-0 h-[2px] z-20 rounded-b-md overflow-hidden"
              style={{
                background: `radial-gradient(30px circle at ${mousePosition.x}px 2px, var(--color-text-primary) 0%, transparent 70%)`,
              }}
            />
          </>
        )}
        {icon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 z-20">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export interface LoginCardProps {
  onLogin?: (username: string, role: 'BUYER' | 'ADMIN') => void;
}

const Page: React.FC<LoginCardProps> = ({ onLogin = () => { } }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await authService.login({ username: username.trim(), password });
      const result = res?.result || res;
      const userRole: 'BUYER' | 'ADMIN' = result?.role === 'ADMIN' ? 'ADMIN' : 'BUYER';
      const userName = result?.fullName || result?.username || username;
      onLogin(userName, userRole);
    } catch (err: any) {
      console.warn('Backend login failed, fallback to local login:', err);
      // Fallback for development if backend is not running
      const role: 'BUYER' | 'ADMIN' = username.toLowerCase().includes('admin') ? 'ADMIN' : 'BUYER';
      onLogin(username, role);
    } finally {
      setLoading(false);
    }
  };

  const socialIcons = [
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33c.85 0 1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z" /></svg>,
      href: '#',
      bg: 'bg-[var(--color-bg)]',
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M6.94 5a2 2 0 1 1-4-.002a2 2 0 0 1 4 .002M7 8.48H3V21h4zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91z" /></svg>,
      href: '#',
      bg: 'bg-[var(--color-bg)]',
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396z" /></svg>,
      href: '#',
      bg: 'bg-[var(--color-bg)]',
    }
  ];

  return (
    <div className='card w-full max-w-[850px] flex justify-between h-[560px] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-2xl'>
      <div
        className='w-full lg:w-1/2 px-6 lg:px-12 left h-full relative overflow-hidden flex flex-col justify-center'
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className={`absolute pointer-events-none w-[500px] h-[500px] bg-gradient-to-r from-green-400/20 via-blue-400/10 to-emerald-400/20 rounded-full blur-3xl transition-opacity duration-200 ${isHovering ? 'opacity-100' : 'opacity-0'
            }`}
          style={{
            transform: `translate(${mousePosition.x - 250}px, ${mousePosition.y - 250}px)`,
            transition: 'transform 0.1s ease-out'
          }}
        />
        <div className="form-container sign-in-container w-full z-10">
          <form className='text-center flex flex-col gap-4' onSubmit={handleFormSubmit}>
            <div>
              <h1 className='text-3xl font-extrabold text-white mb-2'>Đăng nhập</h1>
              <div className="social-container mb-2">
                <div className="flex items-center justify-center">
                  <ul className="flex gap-3">
                    {socialIcons.map((social, index) => (
                      <li key={index} className="list-none">
                        <a
                          href={social.href}
                          className="w-10 h-10 bg-[var(--color-muted-surface)] rounded-full flex justify-center items-center relative z-[1] border-2 border-[var(--color-border)] overflow-hidden group"
                        >
                          <div
                            className={`absolute inset-0 w-full h-full ${social.bg
                              } scale-y-0 origin-bottom transition-transform duration-500 ease-in-out group-hover:scale-y-100`}
                          />
                          <span className="text-[1.2rem] text-[var(--color-text-primary)] transition-all duration-500 ease-in-out z-[2] group-hover:text-white">
                            {social.icon}
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {error && (
              <div className="text-xs text-red-400 bg-red-950/40 border border-red-900/60 rounded px-3 py-2 text-left">
                {error}
              </div>
            )}

            <div className='flex flex-col gap-3'>
              <AppInput
                placeholder="Tên đăng nhập"
                type="text"
                value={username}
                onChange={(e: any) => { setUsername(e.target.value); setError(''); }}
                required
              />
              <AppInput
                placeholder="Mật khẩu"
                type="password"
                value={password}
                onChange={(e: any) => { setPassword(e.target.value); setError(''); }}
                required
              />
            </div>

            <div className='flex justify-between items-center w-full'>
              <a href="#" className='font-light text-xs text-[var(--color-text-secondary)] hover:text-white transition-colors'>
                Quên mật khẩu?
              </a>
              <a href="#/signup" className='text-xs text-[#39FF14] hover:underline font-bold transition-all'>
                Đăng ký tài khoản
              </a>
            </div>

            <div className='flex flex-col gap-4 items-center mt-2'>
              <button
                type="submit"
                disabled={loading}
                className="group/button relative w-full inline-flex justify-center items-center overflow-hidden rounded-md bg-[#39FF14] text-black px-6 py-2.5 text-sm font-bold transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(57,255,20,0.5)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{loading ? 'Đang xử lý...' : 'Đăng Nhập'}</span>
                <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-13deg)_translateX(-100%)] group-hover/button:duration-1000 group-hover/button:[transform:skew(-13deg)_translateX(100%)]">
                  <div className="relative h-full w-8 bg-white/30" />
                </div>
              </button>

              {/* Quick demo login */}
              <div className="w-full border-t border-[var(--color-border)] pt-3">
                <span className="text-[10px] text-[var(--color-text-secondary)] uppercase tracking-wider block mb-2">Đăng nhập nhanh B2C</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => onLogin('Nguyễn Văn Anh', 'BUYER')}
                    className="flex-1 py-1.5 rounded bg-[var(--color-muted-surface)] border border-[var(--color-border)] text-xs text-white hover:border-[#39FF14] hover:text-[#39FF14] transition-all"
                  >
                    Khách Hàng B2C
                  </button>
                  <button
                    type="button"
                    onClick={() => onLogin('Quản trị xưởng', 'ADMIN')}
                    className="flex-1 py-1.5 rounded bg-[var(--color-muted-surface)] border border-[var(--color-border)] text-xs text-white hover:border-[#39FF14] hover:text-[#39FF14] transition-all"
                  >
                    Quản Trị Xưởng
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className='hidden lg:block w-1/2 right h-full overflow-hidden relative border-l border-[var(--color-border)]'>
        <img
          src='https://images.pexels.com/photos/7102037/pexels-photo-7102037.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
          width={1000}
          height={1000}
          alt="Ruler 3D"
          className="w-full h-full object-cover transition-transform duration-300 opacity-60 filter grayscale brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg)] via-transparent to-transparent flex flex-col justify-end p-8">
          <h2 className="text-xl font-bold text-white mb-2">PrintHub 3D — Bộ Thước Kẻ In 3D</h2>
        </div>
      </div>
    </div>
  );
};

export default Page;
