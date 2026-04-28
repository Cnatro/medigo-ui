import React from 'react';
import styles from './styles/DoctorDashboard.module.css';
import type { User } from '../../shared/components/AuthContext';

interface WelcomeHeaderProps {
  doctor: User | null;
}

export const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({ doctor }) => {
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const clinic =
    doctor?.profile && 'clinic' in doctor.profile
      ? doctor.profile.clinic
      : '';

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

        <p className={styles.dateInfo}>
          {formattedDate} - 8 cuộc hẹn hôm nay
        </p>
      </div>

      <div className={styles.headerActions}>
        <button className={styles.exportBtn}>
          <i className="fa-solid fa-file-export me-2"></i>
          Xuất lịch
        </button>

        <button className={styles.lockBtn}>
          <i className="fa-solid fa-lock me-2"></i>
          + Khóa thời gian
        </button>

        <div className={styles.profileSection}>
          <div className={styles.avatar} />

          <div className={styles.profileInfo}>
            <p className={styles.doctorTitle}>
              {doctor?.full_name || ''}
            </p>

            <p className={styles.doctorDept}>
              {specialty} {clinic ? `- ${clinic}` : ''}
            </p>
          </div>

          <div className={styles.notificationIcon}>
            <i className="fa-solid fa-bell"></i>
          </div>
        </div>
      </div>
    </header>
  );
};