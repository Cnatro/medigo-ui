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
  onFinish?: () => void;
  doctor: Doctor;
  selectedSlot: TimeSlot | null;
  doctorSpecialtyId: string;
  amount?: number;
  selectedDate?: string | null;
}

const InfoAppointment: React.FC<AppointmentInfoProps> = ({
  onContinue,
  onClose,
  onFinish,
  doctor,
  selectedSlot,
  doctorSpecialtyId,
  amount,
  selectedDate,
}) => {
  const { currentUser } = useAuth();

  const [formData, setFormData] = useState({
    fullName: currentUser?.full_name || '',
    phone: currentUser?.phone || '',
    email: currentUser?.email || '',
    reason: '',
  });

  const [showAppointmentPopup, setShowAppointmentPopup] = useState(false);
  const [showInfoStep, setShowInfoStep] = useState(true);
  const [appointmentData, setAppointmentData] = useState<any>(null);

  console.log('Amount in InfoAppointment:', amount);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleContinue = () => {
    if (!selectedSlot) {
      alert('Vui lòng chọn lịch khám');
      return;
    }

    if (!formData.fullName.trim()) {
      alert('Vui lòng nhập họ tên');
      return;
    }

    if (!formData.phone.trim()) {
      alert('Vui lòng nhập số điện thoại');
      return;
    }

    if (!formData.email.trim()) {
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
      amount: amount,
      date: selectedDate || '',
    };

    setAppointmentData(appointmentPayload);

    if (onContinue) {
      onContinue(appointmentPayload);
    }

    // Ẩn info step
    setShowInfoStep(false);

    // Hiện confirm step
    setShowAppointmentPopup(true);
  };

  return (
    <>
      {showInfoStep && (
        <div className="info-appointment-container">
          <div className="info-appointment-card">
            {/* Header */}
            <div className="info-booking-header">
              <h2 className="info-booking-title">Đặt lịch khám</h2>

              <button className="info-booking-close-btn" onClick={onClose}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* Doctor info */}
            <div className="info-booking-doctor-info">
              <div className="info-booking-avatar">
                <i className="fas fa-user-md"></i>
              </div>

              <div className="info-booking-doctor-details">
                <h3 className="info-booking-doctor-name">BS {doctor.name}</h3>

                <p className="info-booking-specialty">
                  {doctor.specialties?.map((s) => s.name).join(', ')} •{' '}
                  {doctor.clinic}
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="info-booking-form-section">
              <h3 className="info-booking-section-title">
                Thông tin bệnh nhân
              </h3>

              <div className="info-booking-form-row">
                <div className="info-booking-form-group">
                  <label className="info-booking-label">Họ và tên *</label>

                  <div className="info-booking-input-wrapper">
                    <i className="fas fa-user info-booking-input-icon"></i>

                    <input
                      type="text"
                      name="fullName"
                      className="info-booking-input"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Nhập họ tên"
                    />
                  </div>
                </div>

                <div className="info-booking-form-group">
                  <label className="info-booking-label">Số điện thoại *</label>

                  <div className="info-booking-input-wrapper">
                    <i className="fas fa-phone info-booking-input-icon"></i>

                    <input
                      type="text"
                      name="phone"
                      className="info-booking-input"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Nhập số điện thoại"
                    />
                  </div>
                </div>
              </div>

              <div className="info-booking-form-group">
                <label className="info-booking-label">Email *</label>

                <div className="info-booking-input-wrapper">
                  <i className="fas fa-envelope info-booking-input-icon"></i>

                  <input
                    type="email"
                    name="email"
                    className="info-booking-input"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Nhập email"
                  />
                </div>
              </div>

              <div className="info-booking-form-group">
                <label className="info-booking-label">Mô tả triệu chứng</label>

                <textarea
                  name="reason"
                  className="info-booking-textarea"
                  rows={4}
                  value={formData.reason}
                  onChange={handleChange}
                  placeholder="Mô tả triệu chứng..."
                />
              </div>
            </div>

            {/* Actions */}
            <div className="info-booking-actions">
              <button
                className="info-booking-btn info-booking-btn-outline"
                onClick={onClose}
              >
                Quay lại
              </button>

              <button
                className="info-booking-btn info-booking-btn-primary"
                onClick={handleContinue}
              >
                Tiếp tục
              </button>
            </div>
          </div>
        </div>
      )}

      {showAppointmentPopup && (
        <ConfirmAppointment
          appointmentData={appointmentData}
          onClose={() => {
            setShowAppointmentPopup(false);
            setShowInfoStep(true);
          }}
          onCloseInfo={() => {
            onFinish?.();
          }}
        />
      )}
    </>
  );
};

export default InfoAppointment;
