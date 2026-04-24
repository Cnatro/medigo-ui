import React from 'react';
import styles from'./styles/DoctorDashboard.module.css'
import { useDoctorDashboard } from './hooks/useDoctorDashboard';
import { DashboardDoctorLayout } from './DashboardDoctorLayout';
import { Sidebar } from './Sidebar';
import { WelcomeHeader } from './WelcomeHeader';
import { StatCard } from './StatCard';
import { AppointmentList } from './AppointmentList';
import { PendingConfirmations } from './PendingConfirmations';
import { QueueList } from './QueueList';
import { useAuth } from '../../../shared/components/AuthContext';

export const DashboardDoctor: React.FC = () => {
  const {
    stats,
    weekAppointments,
    queueItems,
    pendingAppointments,
    loading,
    handleConfirmAppointment,
    handleRejectAppointment,
  } = useDoctorDashboard();

  const {currentUser : doctor} = useAuth();

  if (loading) {
    return <div className={styles.loading}>Loading dashboard...</div>;
  }

  return (
    <DashboardDoctorLayout>
      <Sidebar />
      <div className={styles.mainContent}>
        <WelcomeHeader doctor={doctor} />
        
        <div className={styles.statsGrid}>
          <StatCard
            value={stats.todayAppointments}
            label="Cuộc hẹn hôm nay"
            subtext="3 trực tiếp · 5 trực tuyến"
            color="blue"
          />
          <StatCard
            value={stats.pendingConfirmations}
            label="Chờ xác nhận"
            subtext="Cần phản hồi"
            color="green"
          />
          <StatCard
            value={stats.monthlyAppointments}
            label="Lịch hẹn tháng này"
            subtext="+12% so với tháng trước"
            color="purple"
          />
          <StatCard
            value={stats.averageRating}
            label="Đánh giá trung bình"
            subtext="314 đánh giá · 96% hài lòng"
            color="yellow"
          />
        </div>

        <div className={styles.twoColumnLayout}>
          <AppointmentList 
            appointments={weekAppointments} 
            title="Lịch tuần này"
            viewAllLink="#"
          />
          <QueueList queueItems={queueItems} />
        </div>

        <PendingConfirmations 
          appointments={pendingAppointments}
          onConfirm={handleConfirmAppointment}
          onReject={handleRejectAppointment}
        />
      </div>
    </DashboardDoctorLayout>
  );
};