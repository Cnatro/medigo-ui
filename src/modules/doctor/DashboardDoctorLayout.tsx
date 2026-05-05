import styles from './styles/DoctorDashboard.module.css';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export const DashboardDoctorLayout = () => {
  return (
    <div className={styles.layout}>
      <div className={styles.background}>
        <Sidebar />
        <div className={styles.mainContent}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};
