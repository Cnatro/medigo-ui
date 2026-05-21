import React from 'react';
import styles from './styles/DoctorDashboard.module.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface MenuItem {
  icon: string;
  label: string;
  badge?: number;
  path: string;
}

const menuItems: MenuItem[] = [
  {
    icon: 'fa-solid fa-house',
    label: 'Tổng quan',
    path: '/doctor/dashboard',
  },
  {
    icon: 'fa-solid fa-calendar-check',
    label: 'Lịch làm việc',
    path: '/doctor/schedule-work',
    badge: 3,
  },
  {
    icon: 'fa-solid fa-clock',
    label: 'Cuộc hẹn',
    path: '/doctor/schedule-appointment',
    badge: 8,
  },
  {
    icon: 'fa-solid fa-user',
    label: 'Hồ sơ bệnh nhân',
    path: '/doctor/patients',
  },
  // {
  //   icon: 'fa-solid fa-chart-bar',
  //   label: 'Thống kê',
  //   path: '/doctor/statistics',
  // },
  // {
  //   icon: 'fa-solid fa-gear',
  //   label: 'Cài đặt',
  //   path: '/doctor/settings',
  // },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside className={`${styles.sidebar} d-flex flex-column`}>
      <div className={styles.sidebarHeader}>
        <div className={styles.logo} onClick={() => navigate("/doctor/dashboard")}>MediGo</div>
      </div>

      <nav className="nav flex-column p-3">
        {menuItems.map((item, idx) => {
          const isActive = location.pathname === item.path;

          return (
            <Link key={idx} to={item.path} className="text-decoration-none">
              <div
                className={`${styles.navItem} ${isActive ? styles.active : ''}`}
              >
                <div className="d-flex align-items-center gap-2">
                  <i className={`${item.icon} ${styles.navIcon}`}></i>

                  <span className={styles.navLabel}>{item.label}</span>
                </div>

                {item.badge && (
                  <span className={styles.navBadge}>{item.badge}</span>
                )}
              </div>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
