import React from 'react';
import type { Doctor } from './doctorService';
import { useNavigate } from 'react-router-dom';

interface DoctorCardProps {
  doctor: Doctor;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor }) => {
  const navigate = useNavigate();

  const handleViewDetail = () => {
    navigate(`/doctors/${doctor.id}?specialtyId=${doctor.specialtyId}`);
  };

  //   const handleBookAppointment = (e: React.MouseEvent) => {
  //     e.stopPropagation();
  //     navigate(`/booking/${doctor.id}`);
  //   };

  //   const handleChat = (e: React.MouseEvent) => {
  //     e.stopPropagation();
  //     navigate(`/chat/${doctor.id}`);
  //   };
  return (
    <div
      className="doctor-card mb-4"
      onClick={handleViewDetail}
      style={{ cursor: 'pointer' }}
    >
      <div className="card border-0 shadow-sm rounded-3">
        <div className="card-body p-4">
          <div className="row">
            {/* Avatar */}
            <div className="col-auto">
              <div className="doctor-avatar">
                <i className="fas fa-user-md fa-3x text-primary"></i>
              </div>
            </div>

            {/* Doctor Info */}
            <div className="col">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h5 className="doctor-name mb-1">{doctor.name}</h5>
                  <span className="badge bg-success bg-opacity-10 text-success mb-2">
                    {doctor.isOnline ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>

              <p className="doctor-specialty text-secondary mb-1">
                {doctor.specialty}
              </p>
              <p className="doctor-hospital text-muted small mb-1">
                {doctor.clinic}
              </p>
              <p className="doctor-experience text-muted small mb-2">
                {doctor.experience} năm kinh nghiệm
              </p>

              {/* Rating */}
              <div className="d-flex align-items-center gap-2 mb-3">
                <i className="fas fa-star text-warning"></i>
                <span className="rating-value fw-semibold">
                  {doctor.rating} / 5.0
                </span>
                <span className="rating-count text-muted small">
                  ({doctor.reviewCount} đánh giá)
                </span>
              </div>

              {/* Tags */}
              <div className="d-flex gap-2 mb-3">
                {doctor.languages.slice(0, 2).map((lang) => (
                  <span
                    key={lang}
                    className="badge bg-light text-dark px-3 py-2 rounded-2"
                  >
                    {lang}
                  </span>
                ))}
                {doctor.acceptsInsurance && (
                  <span className="badge bg-info bg-opacity-10 text-info px-3 py-2 rounded-2">
                    BHYT
                  </span>
                )}
              </div>

              {/* Price and Actions */}
              <div className="d-flex justify-content-between align-items-end">
                <div>
                  <p className="fee-label text-muted small mb-0">Phí khám</p>
                  <p className="fee-value fw-bold text-dark mb-0">
                    {doctor.price.toLocaleString('vi-VN')} ₫
                  </p>
                </div>
                <div className="d-flex gap-2">
                  <button className="btn btn-light border btn-sm px-3">
                    Chat
                  </button>
                  <button className="btn btn-primary btn-sm px-3">
                    Đặt lịch khám
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
