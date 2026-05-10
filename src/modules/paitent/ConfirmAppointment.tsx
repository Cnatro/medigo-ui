/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useAppointment } from './hooks/useAppointment';
import './styles/confirmAppointment.css';

interface ConfirmAppointmentProps {
  appointmentData?: {
    time?: string;
    patientName?: string;
    time_slot_id?: string;
    doctor_specialty_id?: string;
    phone?: string;
    email?: string;
    reason?: string;
    doctorName?: string;
    doctorSpecialty?: string;
    amount?: number;
    date?: string;
  };
  onBack?: () => void;
  onClose: () => void;
  onCloseInfo: () => void;
}

const ConfirmAppointment: React.FC<ConfirmAppointmentProps> = ({
  appointmentData,
  onClose,
  onCloseInfo,
}) => {
  const { createAppointment, loading } = useAppointment();
  const [submitting, setSubmitting] = useState(false);

  console.log('Appointment Data in ConfirmAppointment:', appointmentData);

  const handleConfirm = async () => {
    if (submitting) return;

    try {
      setSubmitting(true);

      const payload = {
        time: appointmentData?.time,
        time_slot_id: appointmentData?.time_slot_id,
        amount: appointmentData?.amount,
        doctor_specialty_id: appointmentData?.doctor_specialty_id,
        reason: appointmentData?.reason,
      };

      const res = await createAppointment(payload);

      const payUrl = res?.payment?.payUrl;

      if (!payUrl) {
        alert('Không lấy được link thanh toán');
        return;
      }

      window.location.href = payUrl;
    } catch (err) {
      console.error(err);
      alert('Thanh toán thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="confirm-appointment-container">
      <div className="confirm-appointment-card">
        {/* Header */}
        <div className="card-header">
          <h2 className="card-title">Đặt lịch khám</h2>
          <button
            className="close-button"
            aria-label="Close"
            onClick={() => {
              onClose();
              onCloseInfo();
            }}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Selected Doctor Info */}
        <div className="doctor-info">
          <div className="doctor-avatar">
            <div className="avatar-placeholder"></div>
          </div>
          <div className="doctor-details">
            <h3 className="doctor-name">{appointmentData?.doctorName}</h3>
            <p className="doctor-specialty">
              {appointmentData?.doctorSpecialty}
            </p>
          </div>
        </div>

        {/* AI Analysis Section */}
        {/* <div className="ai-analysis">
          <div className="ai-header">
            <i className="fas fa-robot ai-icon"></i>
            <h4 className="ai-title">Phân tích AI</h4>
          </div>
          <div className="ai-content">
            <div className="ai-row">
              <span className="ai-label">Nhóm triệu chứng:</span>
              <span className="ai-value">{appointmentData?.symptomGroup}</span>
            </div>
            <div className="ai-row">
              <span className="ai-label">Chuyên khoa gợi ý:</span>
              <span className="ai-value">
                {appointmentData?.suggestedSpecialty}
              </span>
            </div>
            <div className="ai-row">
              <span className="ai-label">Bác sĩ phù hợp:</span>
              <span className="ai-value">
                {appointmentData?.suggestedDoctor}
              </span>
              <span className="badge-selected">(Đã chọn)</span>
            </div>
          </div>
        </div> */}

        {/* Appointment Information */}
        <div className="appointment-info">
          <div className="info-header">
            <i className="fas fa-clock info-icon"></i>
            <h4 className="info-title">Thông tin đặt lịch</h4>
          </div>

          <div className="info-grid">
            <div className="info-card">
              <div className="info-label">Thời gian</div>
              <div className="info-value">
                {appointmentData?.date} ( {appointmentData?.time} )
              </div>
            </div>
             <div className="info-card">
              <div className="info-label">Giá tiền</div>
              <div className="info-value">{appointmentData?.amount?.toLocaleString('vi-VN') ?? 'Chưa có tiền'} đ</div>
            </div>
            <div className="info-card">
              <div className="info-label">Bệnh nhân</div>
              <div className="info-value">{appointmentData?.patientName}</div>
            </div>
            <div className="info-card">
              <div className="info-label">Số điện thoại</div>
              <div className="info-value">{appointmentData?.phone}</div>
            </div>
            <div className="info-card">
              <div className="info-label">Email</div>
              <div className="info-value">{appointmentData?.email}</div>
            </div>
            <div className="info-card full-width">
              <div className="info-label">Mô tả triệu chứng</div>
              <div className="info-value symptoms">
                {appointmentData?.reason}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="form-actions">
          <button className="btn btn-outline" onClick={onClose}>
            <i className="fas fa-arrow-left"></i> Quay lại
          </button>
          <button
            className="btn btn-primary"
            onClick={handleConfirm}
            disabled={submitting || loading}
          >
            {submitting ? 'Đang xử lý...' : 'Xác nhận & thanh toán'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmAppointment;
