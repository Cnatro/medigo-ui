import React from 'react';

interface StatCardProps {
  title: string;
  value?: string;
  trend?: string;
  trendPositive?: boolean;
  icon?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, trend, trendPositive, icon }) => {
  return (
    <div className="stat-card">
      <div className="stat-title">{title}</div>
      <div className="stat-value">{value}</div>
      <div className={`stat-trend ${trendPositive ? 'trend-positive' : 'trend-negative'}`}>
        <i className={`fas fa-arrow-${trendPositive ? 'up' : 'down'}`}></i>
        <span>{trend}</span>
      </div>
      <div className="stat-icon">
        <i className={icon}></i>
      </div>
    </div>
  );
};

export default StatCard;