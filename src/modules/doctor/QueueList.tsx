import React from 'react';
import styles from'./styles/DoctorDashboard.module.css'
import type { QueueItem } from './doctorDashboardService';

interface QueueListProps {
  queueItems: QueueItem[];
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'examining': return '#2563eb';
    case 'next': return '#16a34a';
    case 'waiting': return '#ca8a04';
    case 'online': return '#9333ea';
    default: return '#9ca3af';
  }
};

export const QueueList: React.FC<QueueListProps> = ({ queueItems }) => {
  return (
    <div className={styles.queueCard}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>Hàng chờ hôm nay</h3>
      </div>
      <div className={styles.queueList}>
        {queueItems.map((item) => (
          <div key={item.id} className={styles.queueItem}>
            <div className={styles.queueNumber} style={{ backgroundColor: getStatusColor(item.status) }}>
              {item.orderNumber}
            </div>
            <div className={styles.queueInfo}>
              <p className={styles.patientNameQueue}>{item.patientName}</p>
              <p className={styles.queueSpecialty}>{item.specialty}</p>
            </div>
            <div className={styles.queueTime}>{item.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
};