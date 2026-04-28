import React from 'react';
import styles from'./styles/DoctorDashboard.module.css'


interface DoctorLayoutProps {
  children: React.ReactNode;
}

export const DashboardDoctorLayout: React.FC<DoctorLayoutProps> = ({ children }) => {
  return (
    <div className={styles.layout}>
      <div className={styles.background} />
      {children}
    </div>
  );
};