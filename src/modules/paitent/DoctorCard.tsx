import React from 'react';
import type { Doctor } from './doctorService';
import { useNavigate } from 'react-router-dom';
import './styles/doctor-card.css';

interface DoctorCardProps {
  doctor: Doctor;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor }) => {
  const navigate = useNavigate();

  const handleViewDetail = () => {
    navigate(`/doctors/${doctor.id}`);
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
      <div className="card border-0 rounded-3 overflow-hidden">
        <div className="card-body p-4">
          <div className="row g-3">
            {/* Avatar */}
            <div className="col-auto">
              <div className="doctor-avatar">
                <i className="fas fa-user-md fa-3x"></i>
              </div>
            </div>

            {/* Doctor Info */}
            <div className="col">
              <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                <div>
                  <h5 className="doctor-name mb-1">{doctor.name}</h5>
                </div>
              </div>

              <p className="doctor-specialty mb-1">
                {doctor.specialties?.map((s) => s.name).join(', ')}
              </p>

              <p className="doctor-hospital mb-1">
                <i className="fas fa-hospital me-1"></i>
                {doctor.clinic}
              </p>
              <p className="doctor-experience mb-2">
                <i className="fas fa-briefcase me-1"></i>
                {doctor.experience} năm kinh nghiệm
              </p>

              {/* Rating */}
              <div className="rating-wrapper d-flex align-items-center gap-2 mb-3">
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <i
                      key={i}
                      className={`fas fa-star ${i < Math.floor(doctor.rating) ? 'filled' : i < doctor.rating ? 'half' : ''}`}
                      style={{ fontSize: '14px' }}
                    ></i>
                  ))}
                </div>
                <span className="rating-value fw-semibold">
                  {doctor.rating} / 5.0
                </span>
                <span className="rating-count">
                  ({doctor.reviewCount} đánh giá)
                </span>
              </div>

              {/* Tags */}
              <div className="tags-wrapper d-flex gap-2 mb-3 flex-wrap">
                {doctor.languages.slice(0, 2).map((lang) => (
                  <span key={lang} className="tag-language">
                    <i className="fas fa-language me-1"></i>
                    {lang}
                  </span>
                ))}
                {doctor.acceptsInsurance && (
                  <span className="tag-insurance">
                    <i className="fas fa-shield-alt me-1"></i>
                    BHYT
                  </span>
                )}
              </div>

              {/* Price and Actions */}
              <div className="d-flex justify-content-between align-items-end flex-wrap gap-3">
                <div className="price-wrapper">
                  <p className="fee-label mb-1">
                    <i className="fas fa-tag me-1"></i>
                    Phí theo chuyên khoa
                  </p>
                  <div className="price-list">
                    {doctor.specialties.map((s) => (
                      <div key={s.id} className="price-item">
                        <span className="specialty-name">{s.name}:</span>
                        <b className="price-value">
                          {s.price.toLocaleString('vi-VN')} ₫
                        </b>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="action-buttons d-flex gap-2">
                  <button
                    className="btn-chat"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <i className="fas fa-comment-dots me-1"></i>
                    Chat
                  </button>
                  <button
                    className="btn-book"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <i className="fas fa-calendar-check me-1"></i>
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
