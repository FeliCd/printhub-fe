import React from 'react';
import { Search, Bell, ShoppingCart } from 'lucide-react';
import type { AppNotification, CartItem } from '@/types';
import { useApp } from '@/contexts/AppContext';
import { useNavigate, useLocation } from 'react-router-dom';

interface HeaderProps {
  walletBalance: number;
  notifications: AppNotification[];
  setNotifications: React.Dispatch<React.SetStateAction<AppNotification[]>>;
  isNotificationOpen: boolean;
  setIsNotificationOpen: (open: boolean) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  cart: CartItem[];
}

export const Header: React.FC<HeaderProps> = ({
  walletBalance,
  notifications,
  setNotifications,
  isNotificationOpen,
  setIsNotificationOpen,
  cart,
  setIsCartOpen,
}) => {
  const { searchQuery, setSearchQuery, currentUser } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    
    // Redirect to home/catalog page if searching from another page
    if (location.pathname !== '/' && val.trim() !== '') {
      navigate('/');
    }
  };

  return (
    <header className="app-header">
      <div className="search-bar">
        <Search size={16} className="text-muted" />
        <input 
          type="text" 
          placeholder="Tìm sản phẩm, máy in, file STL..." 
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      <div className="header-actions">
        {/* Role Badge */}
        {currentUser && (
          <div 
            className={`tag-role-${currentUser.role.toLowerCase()}`} 
            style={{
              fontSize: '11px',
              fontWeight: 'bold',
              padding: '6px 12px',
              borderRadius: '20px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 
                currentUser.role === 'BUYER' 
                  ? 'rgba(0, 122, 255, 0.1)' 
                  : currentUser.role === 'MAKER' 
                    ? 'rgba(57, 255, 20, 0.1)' 
                    : 'rgba(255, 59, 48, 0.1)',
              color: 
                currentUser.role === 'BUYER' 
                  ? '#007aff' 
                  : currentUser.role === 'MAKER' 
                    ? 'var(--primary)' 
                    : '#ff3b30',
              border: `1px solid ${
                currentUser.role === 'BUYER' 
                  ? 'rgba(0, 122, 255, 0.2)' 
                  : currentUser.role === 'MAKER' 
                    ? 'rgba(57, 255, 20, 0.2)' 
                    : 'rgba(255, 59, 48, 0.2)'
              }`
            }}
          >
            {currentUser.role === 'BUYER' 
              ? 'Khách mua hàng' 
              : currentUser.role === 'MAKER' 
                ? 'Nhà in ấn (Maker)' 
                : 'Quản trị viên (Admin)'}
          </div>
        )}

        {/* Quick Wallet View */}
        {currentUser?.role !== 'ADMIN' && (
          <div className="wallet-quick">
            <span>Ví:</span> {walletBalance.toLocaleString()}đ
          </div>
        )}

        {/* Notifications Bell */}
        <div style={{ position: 'relative' }}>
          <button
            className="btn btn-secondary"
            style={{ borderRadius: '50%', padding: '10px', display: 'flex', alignItems: 'center' }}
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
          >
            <Bell size={18} />
            {notifications.some((n) => !n.isRead) && (
              <span className="badge">
                {notifications.filter((n) => !n.isRead).length}
              </span>
            )}
          </button>

          {isNotificationOpen && (
            <div className="notification-popover">
              <div className="popover-header">
                <h3>Thông báo</h3>
                <button onClick={() => setNotifications(notifications.map((n) => ({ ...n, isRead: true })))}>
                  Đánh dấu đã đọc
                </button>
              </div>
              <div className="notification-list">
                {notifications.length === 0 ? (
                  <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    Không có thông báo mới.
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className={`notification-item ${!n.isRead ? 'unread' : ''}`}>
                      <div className="notif-content">
                        <div className="notif-title">{n.title}</div>
                        <div className="notif-desc">{n.description}</div>
                        <div className="notif-time">{n.date}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Shopping Cart Button */}
        {currentUser?.role !== 'ADMIN' && (
          <button
            className="btn btn-primary"
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingCart size={18} />
            <span>Giỏ hàng ({cart.reduce((sum, item) => sum + item.quantity, 0)})</span>
          </button>
        )}
      </div>
    </header>
  );
};
