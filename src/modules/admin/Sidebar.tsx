import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { useAuth } from '../../shared/components/AuthContext';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const { logout } = useAuth();

  const location = useLocation();

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();

    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const menuItems = [
    {
      label: 'Dashboard',
      icon: 'fas fa-tachometer-alt',
      path: '/admin',
    },

    {
      label: 'Quản lý User',
      icon: 'fas fa-users',
      path: '/admin/users',
    },

    {
      label: 'Quản lý Bệnh viện',
      icon: 'fas fa-hospital',
      path: '/admin/hospitals',
    },

    {
      label: 'Quản lý Lịch làm việc',
      icon: 'fas fa-calendar-alt',
      path: '/admin/schedule',
    },

    {
      label: 'Quản lý Thanh toán',
      icon: 'fas fa-credit-card',
      path: '/admin/payments',
    },

    {
      label: 'Yêu cầu lịch',
      icon: 'fas fa-calendar-check',
      path: '/admin/schedule-requests',
    },

    {
      label: 'Cài đặt',
      icon: 'fas fa-cog',
      path: '/admin/settings',
    },
  ];

  const sidebarClass = `
    sidebar-wrapper
    ${isCollapsed && !isMobile ? 'collapsed' : ''}
    ${isMobileOpen ? 'mobile-open' : ''}
  `;

  return (
    <>
      {isMobile && isMobileOpen && (
        <div className="overlay" onClick={() => setIsMobileOpen(false)} />
      )}

      <div className={sidebarClass}>
        <div className="logo-section">
          <h2>MediGo</h2>
          <p>Hệ thống quản lý y tế</p>
        </div>

        <div className="sidebar-nav">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className="text-decoration-none"
                onClick={() => {
                  if (isMobile) {
                    setIsMobileOpen(false);
                  }
                }}
              >
                <div className="nav-item">
                  <div
                    className={`nav-link-custom ${isActive ? 'active' : ''}`}
                  >
                    <i className={`${item.icon} nav-icon`}></i>

                    <span className="nav-text">{item.label}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="sidebar-footer">
          <div className="logout-btn" onClick={logout}>
            <i className="fas fa-sign-out-alt"></i>
            <span>Đăng xuất</span>
          </div>
        </div>
      </div>

      <button
        className={`toggle-sidebar-btn ${isCollapsed ? 'collapsed' : ''}`}
        onClick={isMobile ? () => setIsMobileOpen(!isMobileOpen) : onToggle}
      >
        <i
          className={`fas ${
            isCollapsed && !isMobile ? 'fa-chevron-right' : 'fa-chevron-left'
          }`}
        ></i>
      </button>
    </>
  );
};

export default Sidebar;
