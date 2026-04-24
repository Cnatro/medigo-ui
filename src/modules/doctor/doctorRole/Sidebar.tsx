import React from 'react';
import styles from './styles/DoctorDashboard.module.css';

interface MenuItem {
  icon: string; // giữ string cho giống logic cũ
  label: string;
  active?: boolean;
  badge?: number;
}

const menuItems: MenuItem[] = [
  { icon: 'fa-solid fa-house', label: 'Tổng quan', active: true },
  { icon: 'fa-solid fa-calendar-check', label: 'Lịch làm việc', badge: 3 },
  { icon: 'fa-solid fa-clock', label: 'Cuộc hẹn', badge: 8 },
  { icon: 'fa-solid fa-user', label: 'Hồ sơ bệnh nhân' },
  { icon: 'fa-solid fa-chart-bar', label: 'Thống kê' },
  { icon: 'fa-solid fa-gear', label: 'Cài đặt' },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className={`${styles.sidebar} d-flex flex-column`}>
      
      <div className={`${styles.sidebarHeader} p-3`}>
        <div className={`${styles.logo} fw-bold fs-5`}>MedCare</div>
      </div>

      <nav className="nav flex-column">
        {menuItems.map((item, idx) => (
          <div
            key={idx}
            className={`${styles.navItem} d-flex align-items-center justify-content-between px-3 py-2 ${
              item.active ? styles.active : ''
            }`}
          >
            <div className="d-flex align-items-center gap-2">
              
              {/* ICON FONT AWESOME */}
              <i className={`${item.icon} ${styles.navIcon}`}></i>

              <span className={styles.navLabel}>{item.label}</span>
            </div>

            {item.badge && (
              <span className="badge bg-primary">{item.badge}</span>
            )}
          </div>
        ))}
      </nav>

    </aside>
  );
};