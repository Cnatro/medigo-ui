import React from 'react';

interface Appointment {
  appointment_id: string;
  doctor_id: string;
  doctor_name: string;
  patient_name: string;
  specialty: string;
  date_time: string;
  status: 'confirmed' | 'pending' | 'completed';
}

interface RecentAppointmentsTableProps {
  appointments: Appointment[];
}

const RecentAppointmentsTable: React.FC<RecentAppointmentsTableProps> = ({
  appointments,
}) => {
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'status-confirmed';
      case 'pending':
        return 'status-pending';
      case 'completed':
        return 'status-completed';
      default:
        return '';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'Đã xác nhận';
      case 'CANCELLED':
        return 'Hủy lịch';
      case 'PENDING':
        return 'Chờ xác nhận';
      case 'COMPLETED':
        return 'Hoàn thành';
      default:
        return status;
    }
  };

  return (
    <table className="table-custom">
      <thead>
        <tr>
          <th>Người khám</th>
          <th>Bác sĩ</th>
          <th>Chuyên khoa</th>
          <th>Ngày giờ</th>
          <th>Trạng thái</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        {appointments.map((appointment, index) => (
          <tr key={index}>
            <td>{appointment.patient_name}</td>
            <td>{appointment.doctor_name}</td>
            <td>{appointment.specialty}</td>
            <td>{appointment.date_time}</td>
            <td>
              <span
                className={`status-badge ${getStatusClass(appointment.status)}`}
              >
                {getStatusText(appointment.status)}
              </span>
            </td>
            <td>
              <div className="action-icons">
                <i className="fas fa-eye"></i>
                <i className="fas fa-pencil-alt"></i>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default RecentAppointmentsTable;
