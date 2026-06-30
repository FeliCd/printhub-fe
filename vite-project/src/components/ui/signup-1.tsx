'use client'

import * as React from 'react'
import { useState } from 'react'

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
      { label && 
        <label className='block mb-2 text-sm text-[var(--color-text-primary)]'>
          {label}
        </label>
      }
      <div className="relative w-full">
        <input
          className="peer relative z-10 border-2 border-[var(--color-border)] h-11 w-full rounded-md bg-[var(--color-surface)] px-4 font-thin outline-none drop-shadow-sm transition-all duration-200 ease-in-out focus:bg-[var(--color-bg)] placeholder:font-medium text-white text-sm"
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
  )
}

interface SignUpCardProps {
  onSignUpSuccess?: () => void;
}

const SignUpCard: React.FC<SignUpCardProps> = ({ onSignUpSuccess }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'BUYER' | 'MAKER'>('BUYER');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    const leftSection = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - leftSection.left,
      y: e.clientY - leftSection.top
    });
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !password || !confirmPassword) {
      setError('Vui lòng điền đầy đủ thông tin đăng ký.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp!');
      return;
    }

    if (password.length < 6) {
      setError('Mật khẩu phải chứa ít nhất 6 ký tự.');
      return;
    }

    // Success registration simulation
    setSuccess('Đăng ký tài khoản thành công! Đang chuyển hướng...');
    setTimeout(() => {
      if (onSignUpSuccess) {
        onSignUpSuccess();
      } else {
        window.location.hash = '#/login';
      }
    }, 1500);
  };

  return (
    <div className='card w-full max-w-[850px] flex justify-between h-[600px] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-2xl'>
      <div
        className='w-full lg:w-1/2 px-6 lg:px-12 left h-full relative overflow-hidden flex flex-col justify-center'
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className={`absolute pointer-events-none w-[500px] h-[500px] bg-gradient-to-r from-green-400/20 via-blue-400/10 to-emerald-400/20 rounded-full blur-3xl transition-opacity duration-200 ${
            isHovering ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            transform: `translate(${mousePosition.x - 250}px, ${mousePosition.y - 250}px)`,
            transition: 'transform 0.1s ease-out'
          }}
        />
        <div className="form-container sign-up-container w-full z-10">
          <form className='text-center flex flex-col gap-3.5' onSubmit={handleFormSubmit}>
            <div>
              <h1 className='text-3xl font-extrabold text-white mb-1'>Đăng ký</h1>
              <span className='text-xs text-[var(--color-text-secondary)]'>tạo tài khoản PrintHub 3D mới</span>
            </div>

            {error && (
              <div className="text-xs text-red-400 bg-red-950/40 border border-red-900/60 rounded px-3 py-2 text-left">
                {error}
              </div>
            )}

            {success && (
              <div className="text-xs text-green-400 bg-green-950/40 border border-green-900/60 rounded px-3 py-2 text-left">
                {success}
              </div>
            )}

            <div className='flex flex-col gap-2.5'>
              <AppInput 
                placeholder="Họ và tên" 
                type="text" 
                value={fullName}
                onChange={(e: any) => { setFullName(e.target.value); setError(''); }}
                required
              />
              <AppInput 
                placeholder="Địa chỉ Email" 
                type="email" 
                value={email}
                onChange={(e: any) => { setEmail(e.target.value); setError(''); }}
                required
              />
              <AppInput 
                placeholder="Mật khẩu" 
                type="password" 
                value={password}
                onChange={(e: any) => { setPassword(e.target.value); setError(''); }}
                required
              />
              <AppInput 
                placeholder="Xác nhận mật khẩu" 
                type="password" 
                value={confirmPassword}
                onChange={(e: any) => { setConfirmPassword(e.target.value); setError(''); }}
                required
              />
            </div>

            {/* Choose Role */}
            <div className="w-full text-left">
              <span className="text-xs text-[var(--color-text-secondary)] block mb-1.5 font-medium">Bạn là ai?</span>
              <div className="flex gap-3">
                <label className={`flex-1 flex items-center justify-center py-2 rounded border cursor-pointer transition-all ${
                  role === 'BUYER' 
                    ? 'border-[#39FF14] bg-[rgba(57,255,20,0.06)] text-[#39FF14]' 
                    : 'border-[var(--color-border)] bg-[var(--color-muted-surface)] text-[var(--color-text-secondary)] hover:text-white'
                }`}>
                  <input 
                    type="radio" 
                    name="role" 
                    value="BUYER" 
                    checked={role === 'BUYER'} 
                    onChange={() => setRole('BUYER')}
                    className="hidden" 
                  />
                  <span className="text-xs font-bold">Người mua thiết kế</span>
                </label>
                <label className={`flex-1 flex items-center justify-center py-2 rounded border cursor-pointer transition-all ${
                  role === 'MAKER' 
                    ? 'border-[#39FF14] bg-[rgba(57,255,20,0.06)] text-[#39FF14]' 
                    : 'border-[var(--color-border)] bg-[var(--color-muted-surface)] text-[var(--color-text-secondary)] hover:text-white'
                }`}>
                  <input 
                    type="radio" 
                    name="role" 
                    value="MAKER" 
                    checked={role === 'MAKER'} 
                    onChange={() => setRole('MAKER')}
                    className="hidden" 
                  />
                  <span className="text-xs font-bold">Chủ xưởng in 3D</span>
                </label>
              </div>
            </div>

            <div className='flex flex-col gap-3 items-center mt-1.5'>
              <button 
                type="submit"
                className="group/button relative w-full inline-flex justify-center items-center overflow-hidden rounded-md bg-[#39FF14] text-black px-6 py-2.5 text-sm font-bold transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(57,255,20,0.5)] cursor-pointer"
              >
                <span>Đăng Ký Ngay</span>
                <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-13deg)_translateX(-100%)] group-hover/button:duration-1000 group-hover/button:[transform:skew(-13deg)_translateX(100%)]">
                  <div className="relative h-full w-8 bg-white/30" />
                </div>
              </button>

              <div className="text-xs text-[var(--color-text-secondary)] mt-1">
                Đã có tài khoản?{' '}
                <a href="#/login" className="text-[#39FF14] hover:underline font-bold transition-all">
                  Đăng nhập
                </a>
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
          alt="Carousel image"
          className="w-full h-full object-cover transition-transform duration-300 opacity-60 filter grayscale brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg)] via-transparent to-transparent flex flex-col justify-end p-8">
          <h2 className="text-xl font-bold text-white mb-2">PrintHub 3D</h2>
          <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
            Tham gia cộng đồng in ấn 3D ngay hôm nay. Bắt đầu in ấn và đặt hàng các sản phẩm 3D chất lượng cao vô cùng tiện lợi.
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignUpCard
