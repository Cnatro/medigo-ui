// src/modules/doctor/AppointmentList.tsx
import React from 'react';
import styles from'./styles/DoctorDashboard.module.css'
import type { Appointment } from './doctorDashboardService';

interface AppointmentListProps {
  appointments: Appointment[];
  title: string;
  viewAllLink: string;
}

const getStatusColor = (type: string) => {
  return type === 'trực tiếp' ? '#60a5fa' : '#4ade80';
};

export const AppointmentList: React.FC<AppointmentListProps> = ({ 
  appointments, 
  title, 
  viewAllLink 
}) => {
  return (
    <div className={styles.appointmentCard}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>{title}</h3>
        <a href={viewAllLink} className={styles.viewAll}>Xem tất cả</a>
      </div>
      <div className={styles.appointmentList}>
        {appointments.map((apt) => (
          <div key={apt.id} className={styles.appointmentItem}>
            <div 
              className={styles.statusDot} 
              style={{ backgroundColor: getStatusColor(apt.type) }}
            />
            <div className={styles.appointmentInfo}>
              <p className={styles.patientName}>{apt.patientName} ({apt.type})</p>
              <p className={styles.appointmentTime}>{apt.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};