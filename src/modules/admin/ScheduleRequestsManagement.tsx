/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import ScreenLoading from '../../shared/utils/loading';
import { useAdmin } from './hooks/useAdmin';
import { adminService } from './services/adminService';

const ScheduleRequestsManagement = () => {
  const { scheduleRequests, fetchScheduleRequests, loading } = useAdmin();
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  useEffect(() => {
    fetchScheduleRequests();
  }, []);

  if (loading) {
    return (
      <div className="p-5 text-center">
        <ScreenLoading message="Đang tải..." />
      </div>
    );
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'Đang làm';

      case 'CANCELLED':
        return 'Đã hủy';

      case 'LEAVE_PENDING':
        return 'Chờ duyệt nghỉ';
      case 'LEAVE_APPROVED':
        return 'Đã duyệt nghỉ';

      case 'EXTRA_PENDING':
        return 'Chờ duyệt ca trực';
      case 'EXTRA_APPROVED':
        return 'Đã duyệt ca trực';
      case 'EXTRA_REJECTED':
        return 'Từ chối ca trực';

      case 'WEEKEND_PENDING':
        return 'Chờ duyệt ca cuối tuần';
      case 'WEEKEND_APPROVED':
        return 'Đã duyệt ca cuối tuần';
      case 'WEEKEND_REJECTED':
        return 'Từ chối ca cuối tuần';

      default:
        return status;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'REGULAR':
        return 'Ca thường';

      case 'EXTRA_SHIFT':
        return 'Ca tăng ca';

      case 'WEEKEND_SHIFT':
        return 'Ca cuối tuần';

      default:
        return type;
    }
  };

  return (
    <div className="card-custom">
      <div className="card-header-custom">
        <h3>Quản lý yêu cầu lịch làm việc</h3>
      </div>

      <div className="card-body">
        <table className="table-custom request-table">
          <thead>
            <tr>
              <th>Bác sĩ</th>
              <th>Chuyên khoa</th>
              <th>Loại yêu cầu</th>
              <th>Lý do</th>
              <th>Ngày</th>
              <th>Giờ</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>

          <tbody>
            {scheduleRequests?.map((item: any) => (
              <tr key={item.id}>
                <td>{item.doctor_name}</td>
                <td>{item.specialty}</td>

                <td>
                  <span className={`request-type ${item.type.toLowerCase()}`}>
                    {getTypeLabel(item.type)}
                  </span>
                </td>

                <td>
                  <button
                    className="reason-btn"
                    onClick={() =>
                      setSelectedReason(item.reason || 'Không có lý do')
                    }
                  >
                    Xem lý do
                  </button>
                </td>

                <td>{item.day_label}</td>

                <td>
                  {item.start_time} - {item.end_time}
                </td>

                <td>
                  <span className="status-badge status-pending">
                    {getStatusLabel(item.status)}
                  </span>
                </td>

                <td>
                  <div className="request-actions">
                    <button
                      className="approve-btn"
                      onClick={async () => {
                        try {
                          setLoadingId(item.id);

                          await adminService.approveScheduleRequest(item.id);

                          await fetchScheduleRequests();
                        } finally {
                          setLoadingId(null);
                        }
                      }}
                    >
                      {loadingId === item.id ? 'Đang xử lý...' : <i className="fas fa-circle-check"></i>}
                    </button>

                    <button
                      className="reject-btn"
                      onClick={async () => {
                        try {
                          setLoadingId(item.id);

                          await adminService.rejectScheduleRequest(item.id);
                          fetchScheduleRequests();
                        } finally {
                          setLoadingId(null);
                        }
                      }}
                    >
                      {loadingId === item.id ? 'Đang xử lý...' : <i className="fas fa-circle-xmark"></i>}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedReason && (
        <div className="modal-overlay" onClick={() => setSelectedReason(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h4>Lý do yêu cầu</h4>

            <p style={{ whiteSpace: 'pre-wrap' }}>
              {selectedReason || 'Không có lý do'}
            </p>

            <button
              className="close-btn"
              onClick={() => setSelectedReason(null)}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default ScheduleRequestsManagement;
