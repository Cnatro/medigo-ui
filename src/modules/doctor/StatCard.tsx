import React from 'react';
import styles from'./styles/DoctorDashboard.module.css'

interface StatCardProps {
  value: string | number;
  label: string;
  subtext: string;
  color: 'blue' | 'green' | 'purple' | 'yellow';
}

export const StatCard: React.FC<StatCardProps> = ({ value, label, subtext, color }) => {
  const colorClass = styles[`statCard${color.charAt(0).toUpperCase() + color.slice(1)}`];
  
  return (
    <div className={`${styles.statCard} ${colorClass}`}>
      <div className={styles.statValue}>{value}</div>
      <div className={styles.statLabel}>{label}</div>
      <div className={styles.statSubtext}>{subtext}</div>
    </div>
  );
};