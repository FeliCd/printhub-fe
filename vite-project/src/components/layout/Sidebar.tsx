import React from 'react';
import { NavLink } from 'react-router-dom';
import { Layers, LogOut } from 'lucide-react';
import { route } from '../../router/routes';

interface SidebarProps {
  userName: string;
  userRole: 'BUYER' | 'MAKER' | 'ADMIN';
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  userName,
  userRole,
  onLogout,
}) => {
  // Select the appropriate route array based on the role
  const menuList = 
    userRole === 'ADMIN' 
      ? route.menu.admin 
      : userRole === 'MAKER' 
        ? route.menu.maker 
        : route.menu.buyer;

  return (
    <aside className="sidebar">
      <div className="logo-container">
        <Layers className="logo-accent" size={28} />
        <span className="logo-text">
          Print<span className="logo-accent">Hub 3D</span>
        </span>
      </div>

      {/* User info snippet */}
      <div style={{
        padding: '12px',
        backgroundColor: 'var(--bg-primary)',
        borderRadius: '8px',
        border: '1px solid var(--border)',
        marginTop: '12px'
      }}>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
          Đang đăng nhập:
        </div>
        <div style={{ fontSize: '14px', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {userName}
        </div>
        <div style={{
          fontSize: '10px',
          fontWeight: 'bold',
          color: 'var(--primary)',
          marginTop: '2px',
          display: 'inline-block',
          backgroundColor: 'rgba(57, 255, 20, 0.1)',
          padding: '2px 6px',
          borderRadius: '4px'
        }}>
          {userRole}
        </div>
      </div>

      <nav className="nav-links" style={{ marginTop: '24px' }}>
        {menuList
          .filter((route) => route.allowedRoles.includes(userRole))
          .map((route) => (
          <NavLink
            key={route.path}
            to={route.path}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            {route.icon}
            <span>{route.label}</span>
          </NavLink>
        ))}
      </nav>

      <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
        <button
          className="btn btn-secondary"
          style={{ width: '100%', display: 'flex', gap: '8px', justifyContent: 'center', borderColor: '#ff3b30', color: '#ff3b30' }}
          onClick={onLogout}
        >
          <LogOut size={16} />
          Đăng xuất
        </button>
      </div>
    </aside>
  );
};
