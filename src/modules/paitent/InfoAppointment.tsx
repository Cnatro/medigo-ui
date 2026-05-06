/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import './styles/infoAppointment.css';
import type { Doctor, TimeSlot } from './service/doctorService';
import { useAuth } from '../../shared/components/AuthContext';
import ConfirmAppointment from './ConfirmAppointment';

interface AppointmentInfoProps {
  onBack?: () => void;
  onContinue?: (data: any) => void;
  onClose?: () => void;
  doctor: Doctor;
  selectedSlot: TimeSlot | null;
  doctorSpecialtyId: string;
  amount?: number;
  selectedDate?: string | null;
}

const InfoAppointment: React.FC<AppointmentInfoProps> = ({
  onContinue,
  onClose,
  doctor,
  selectedSlot,
  doctorSpecialtyId,
  amount,
  selectedDate,
}) => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    fullName: currentUser?.full_name,
    phone: currentUser?.phone,
    email: currentUser?.email,
    reason: '',
  });
  const [showAppointmentPopup, setShowAppointmentPopup] = useState(false);
  const [appointmentData, setAppointmentData] = useState<any>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContinue = () => {
    if (!selectedSlot) {
      alert('Vui lòng chọn lịch khám');
      return;
    }

    if (!formData.fullName?.trim()) {
      alert('Vui lòng nhập họ và tên');
      return;
    }

    if (!formData.phone?.trim()) {
      alert('Vui lòng nhập số điện thoại');
      return;
    }

    if (!formData.email?.trim()) {
      alert('Vui lòng nhập email');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Email không hợp lệ');
      return;
    }

    const appointmentPayload = {
      time: selectedSlot.time,
      time_slot_id: selectedSlot.id,

      patientName: formData.fullName,
      phone: formData.phone,
      email: formData.email,
      reason: formData.reason,

      doctorName: `BS ${doctor.name}`,
      doctorSpecialty: `${doctor.specialties
        ?.map((s) => s.name)
        .join(', ')} • ${doctor.clinic}`,
      doctor_specialty_id: doctorSpecialtyId,
      amout: amount,
      date: selectedDate ? selectedDate : '',

      // suggestedSpecialty: doctor.specialties?.[0]?.name || '',
      // suggestedDoctor: doctor.name,
      // symptomGroup: 'Chung',
    };

    setAppointmentData(appointmentPayload);

    if (onContinue) {
      onContinue(appointmentPayload);
    }

    setShowAppointmentPopup(true);
  };

  return (
    <div className="info-appointment-container">
      <div className="info-appointment-card">
        {/* Header */}
        <div className="card-header">
          <h2 className="card-title">Đặt lịch khám</h2>
          <button className="close-button" aria-label="Close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Doctor Info */}
        <div className="doctor-info">
          <div className="doctor-avatar">
            {/* Placeholder for doctor image */}
            <div className="avatar-placeholder"></div>
          </div>
          <div className="doctor-details">
            <h3 className="doctor-name">BS {doctor.name}</h3>
            <p className="doctor-specialty">
              {doctor.specialties?.map((s) => s.name).join(', ')} •{' '}
              {doctor.clinic}
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="form-section">
          <h3 className="section-title">Thông tin bệnh nhân</h3>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Họ và tên <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <i className="fas fa-user input-icon"></i>
                <input
                  type="text"
                  name="fullName"
                  className="form-input"
                  placeholder="Nhập họ và tên"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                Số điện thoại <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <i className="fas fa-phone input-icon"></i>
                <input
                  type="tel"
                  name="phone"
                  className="form-input"
                  placeholder="Nhập số điện thoại"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              Email <span className="required">*</span>
            </label>
            <div className="input-wrapper">
              <i className="fas fa-envelope input-icon"></i>
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="Nhập địa chỉ email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Mô tả triệu chứng</label>
            <div className="textarea-wrapper">
              <textarea
                name="reason"
                className="form-textarea"
                placeholder="Mô tả chi tiết các triệu chứng bạn đang gặp phải..."
                rows={4}
                value={formData.reason}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="form-actions">
          <button className="btn btn-outline" onClick={onClose}>
            <i className="fas fa-arrow-left"></i> Quay lại
          </button>
          <button className="btn btn-primary" onClick={handleContinue}>
            Tiếp tục <i className="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>
      {showAppointmentPopup && (
        <ConfirmAppointment
          onClose={() => setShowAppointmentPopup(false)}
          onCloseInfo={() => onClose?.()}
          appointmentData={appointmentData}
        />
      )}
    </div>
  );
};

export default InfoAppointment;
