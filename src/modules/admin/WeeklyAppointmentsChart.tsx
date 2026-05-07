import React from 'react';

interface WeeklyAppointmentsChartProps {
  data: Array<{ day: string; appointments: number }>;
}

const WeeklyAppointmentsChart: React.FC<WeeklyAppointmentsChartProps> = ({ data }) => {
  const maxValue = Math.max(...data.map(item => item.appointments));
  
  return (
    <div>
      <div className="chart-legend">
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#2563eb' }}></div>
          <span>Lịch hẹn</span>
        </div>
        <div className="legend-item">
          <span>Tuần này</span>
        </div>
      </div>
      
      <div className="bar-chart-container">
        <div className="bar-chart">
          {data.map((item, index) => (
            <div key={index} className="bar-item">
              <div 
                className="bar" 
                style={{ height: `${(item.appointments / maxValue) * 150}px` }}
              ></div>
              <div className="bar-label">{item.day}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeeklyAppointmentsChart;