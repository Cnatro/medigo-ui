import React from 'react';
import styles from'./styles/DoctorDashboard.module.css'
import type { Appointment } from './doctorDashboardService';

interface PendingConfirmationsProps {
  appointments: Appointment[];
  onConfirm: (id: string) => void;
  onReject: (id: string) => void;
}

export const PendingConfirmations: React.FC<PendingConfirmationsProps> = ({
  appointments,
  onConfirm,
  onReject,
}) => {
  return (
    <div className={styles.pendingCard}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>Chờ xác nhận</h3>
        <span className={styles.pendingBadge}>{appointments.filter(a => a.isNew).length} mới</span>
      </div>
      <div className={styles.pendingList}>
        {appointments.map((apt) => (
          <div key={apt.id} className={styles.pendingItem}>
            <div className={styles.patientInitial} style={{ backgroundColor: '#2563eb' }}>
              {apt.patientInitials}
            </div>
            <div className={styles.pendingInfo}>
              <p className={styles.patientNamePending}>{apt.patientName}</p>
              <p className={styles.pendingDateTime}>{apt.dateTime} · {apt.type}</p>
            </div>
            <div className={styles.pendingActions}>
              <button 
                className={styles.confirmBtn}
                onClick={() => onConfirm(apt.id)}
              >
                Xác nhận
              </button>
              <button 
                className={styles.rejectBtn}
                onClick={() => onReject(apt.id)}
              >
                Từ chối
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};