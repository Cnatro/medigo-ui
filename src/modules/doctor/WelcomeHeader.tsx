import React, { useState } from 'react';
import styles from './styles/DoctorDashboard.module.css';
import type { User } from '../../shared/components/AuthContext';
import { useNavigate } from 'react-router-dom';

interface WelcomeHeaderProps {
  doctor: User | null;
  logout: () => void;
}

export const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({
  doctor,
  logout,
}) => {
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const navigate = useNavigate();

  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const clinic =
    doctor?.profile && 'clinic' in doctor.profile ? doctor.profile.clinic : '';

  const specialty =
    doctor?.profile && 'specialty' in doctor.profile
      ? doctor.profile.specialty
      : '';

  return (
    <header className={styles.welcomeHeader}>
      <div className={styles.headerLeft}>
        <h1 className={styles.greeting}>
          Xin chào, Bác sĩ {doctor?.full_name?.split(' ').pop() || ''}
        </h1>

        <p className={styles.fullName}>{doctor?.full_name || ''}</p>

        <p className={styles.dateInfo}>{formattedDate} - 8 cuộc hẹn hôm nay</p>
      </div>

      <div className={styles.headerActions}>
        <button className={styles.exportBtn}>
          <i className="fa-solid fa-file-export me-2"></i>
          Xuất lịch
        </button>

        <button className={styles.lockBtn}>
          <i className="fa-solid fa-lock me-2"></i>+ Khóa thời gian
        </button>

        <div className={styles.profileSection}>
          <div className={styles.avatar} />

          <div className={styles.profileInfo} onClick={() => setShowProfileMenu(!showProfileMenu)}>
            <p className={styles.doctorTitle}>{doctor?.full_name || ''}</p>

            <p className={styles.doctorDept}>
              {specialty} {clinic ? `- ${clinic}` : ''}
            </p>
          </div>

          <div className={styles.notificationIcon}>
            <i className="fa-solid fa-bell"></i>
          </div>
          {showProfileMenu && (
            <div className="profile-dropdown shadow-sm">
              <div
                className="dropdown-item"
                onClick={() => {
                  setShowProfileMenu(false);
                  navigate('/doctor/doctor-profile');
                }}
              >
                Hồ sơ cá nhân
              </div>

              <div
                className="dropdown-item"
                onClick={logout}
              >
                Đăng xuất
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
