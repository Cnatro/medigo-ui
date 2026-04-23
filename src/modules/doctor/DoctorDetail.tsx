/* eslint-disable react-hooks/immutability */
// src/modules/doctor/pages/DoctorDetail.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/doctor-detail.css';
import { useDoctor } from './hooks/useDoctor';
import type { Doctor } from './doctorService';
import TimeSlotPicker from './TimeSlotPicker';

const DoctorDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();
  const { getDoctorById, loading, error } = useDoctor();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'schedule'>('profile');

  const specialtyId = searchParams.get('specialtyId');

  useEffect(() => {
    if (id) {
      loadDoctor();
    }
  }, [id]);

  const loadDoctor = async () => {
    const data = await getDoctorById(id!, specialtyId!);
    setDoctor(data);
  };

  const handleBack = () => {
    navigate('/');
  };

  const handleBooking = () => {
    // Navigate to booking page
    navigate(`/booking/${id}`);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          {error || 'Không tìm thấy bác sĩ'}
        </div>
        <button className="btn btn-primary" onClick={handleBack}>
          Quay lại
        </button>
      </div>
    );
  }

  return (
    <div className="doctor-detail-page">
      <div className="container-fluid px-4 py-3">
        {/* Header */}
        <div className="doctor-detail-header mb-4">
          <button
            className="btn btn-link text-decoration-none p-0"
            onClick={handleBack}
          >
            <i className="fas fa-arrow-left me-2"></i>
            Quay lại danh sách
          </button>
        </div>

        <div className="row">
          {/* Left Sidebar - Doctor Info */}
          <div className="col-lg-3 mb-4">
            <div className="doctor-info-card card border-0 shadow-sm rounded-3">
              <div className="card-body p-4">
                {/* Avatar */}
                <div className="text-center mb-3">
                  <div className="doctor-avatar-large mx-auto">
                    <i className="fas fa-user-md fa-4x text-primary"></i>
                  </div>
                </div>

                {/* Doctor Name */}
                <h3 className="doctor-name-detail text-center mb-2">
                  {doctor.name}
                </h3>
                <p className="doctor-specialty-detail text-center text-secondary mb-3">
                  {doctor.specialty}
                </p>

                {/* Hospital */}
                <div className="info-row d-flex align-items-center mb-2">
                  <i className="fas fa-hospital me-2 text-secondary"></i>
                  <span className="text-secondary">{doctor.clinic}</span>
                </div>

                {/* Experience */}
                <div className="info-row d-flex align-items-center mb-2">
                  <i className="fas fa-user-md me-2 text-secondary"></i>
                  <span className="text-secondary">
                    {doctor.experience} năm kinh nghiệm
                  </span>
                </div>

                {/* Languages */}
                <div className="info-row d-flex align-items-center mb-2">
                  <i className="fas fa-globe-asia me-2 text-secondary"></i>
                  <span className="text-secondary">
                    {doctor.languages.join(', ')}
                  </span>
                </div>

                {/* Qualifications */}
                <div className="mt-3">
                  <label className="qualification-label small text-secondary mb-2">
                    HỌC VỊ
                  </label>
                  <div className="d-flex gap-2 mb-2">
                    <div className="qualification-badge">
                      <span className="small">Thạc sĩ Y</span>
                      <span className="small d-block">khoa</span>
                    </div>
                    <div className="qualification-badge">
                      <span className="small">Chuyên khoa I</span>
                      <span className="small d-block">Nhi</span>
                    </div>
                  </div>
                </div>

                {/* Rating */}
                <div className="rating-box bg-warning bg-opacity-10 p-3 rounded-3 mt-3">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-2">
                      <i className="fas fa-star text-warning"></i>
                      <span className="rating-value-large fw-bold text-dark">
                        {doctor.rating}
                      </span>
                      <span className="rating-total text-secondary">/ 5.0</span>
                    </div>
                    <span className="review-count text-secondary">
                      ({doctor.reviewCount} đánh giá)
                    </span>
                  </div>
                </div>

                {/* Price */}
                <div className="price-section mt-3">
                  <p className="price-label text-secondary small mb-0">
                    Phí khám
                  </p>
                  <p className="price-value fw-bold text-dark mb-0">
                    {doctor.price.toLocaleString('vi-VN')} ₫
                  </p>
                </div>

                {/* Insurance */}
                {doctor.acceptsInsurance && (
                  <div className="insurance-badge d-flex align-items-center gap-2 mt-2">
                    <i className="fas fa-heart text-secondary"></i>
                    <span className="text-secondary small">Hỗ trợ BHYT</span>
                  </div>
                )}

                {/* Book Button */}
                <button
                  className="btn btn-primary w-100 mt-4 py-2"
                  onClick={handleBooking}
                >
                  <i className="fas fa-check me-2"></i>
                  Đặt lịch khám
                </button>
              </div>
            </div>
          </div>

          {/* Right Content - Tabs and Schedule */}
          <div className="col-lg-9">
            <div className="main-content-card card border-0 shadow-sm rounded-3">
              <div className="card-body p-4">
                {/* Tabs */}
                <div className="tabs-container mb-4">
                  <button
                    className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
                    onClick={() => setActiveTab('profile')}
                  >
                    Hồ sơ chi tiết
                  </button>
                  <button
                    className={`tab-btn ${activeTab === 'schedule' ? 'active' : ''}`}
                    onClick={() => setActiveTab('schedule')}
                  >
                    Lịch làm việc
                  </button>
                </div>

                {/* Profile Tab Content */}
                {activeTab === 'profile' && (
                  <div className="profile-content">
                    <h5 className="section-title mb-3">Giới thiệu</h5>
                    <p className="text-secondary mb-4">
                      Bác sĩ {doctor.name} có hơn {doctor.experience} năm kinh
                      nghiệm trong lĩnh vực {doctor.specialty}. Tốt nghiệp loại
                      giỏi trường Đại học Y Hà Nội, sau đó hoàn thành chương
                      trình chuyên khoa cấp I và cấp II.
                    </p>

                    <h5 className="section-title mb-3">Quá trình đào tạo</h5>
                    <ul className="training-list text-secondary mb-4">
                      <li>✓ Tốt nghiệp Thạc sĩ Y khoa - Đại học Y Hà Nội</li>
                      <li>✓ Chứng chỉ chuyên khoa I Nhi khoa</li>
                      <li>✓ Chứng chỉ đào tạo liên tục về Sơ sinh</li>
                      <li>✓ Tham gia nhiều hội thảo quốc tế về Nhi khoa</li>
                    </ul>

                    <h5 className="section-title mb-3">Kinh nghiệm làm việc</h5>
                    <ul className="experience-list text-secondary mb-4">
                      <li>
                        ✓ Bác sĩ Nhi khoa tại {doctor.clinic} (2014 - nay)
                      </li>
                      <li>✓ Giảng viên bộ môn Nhi - Đại học Y Hà Nội</li>
                      <li>
                        ✓ Trưởng khoa Nhi tại Bệnh viện Đa khoa tỉnh (2010-2014)
                      </li>
                    </ul>

                    <h5 className="section-title mb-3">Lĩnh vực chuyên môn</h5>
                    <div className="d-flex flex-wrap gap-2">
                      <span className="specialty-tag">Khám nhi tổng quát</span>
                      <span className="specialty-tag">Tiêm chủng</span>
                      <span className="specialty-tag">Dinh dưỡng trẻ em</span>
                      <span className="specialty-tag">Sơ sinh</span>
                      <span className="specialty-tag">Hô hấp nhi</span>
                    </div>
                  </div>
                )}

                {/* Schedule Tab Content */}
                {activeTab === 'schedule' && (
                  <div className="schedule-content">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h5 className="section-title mb-0">
                        Lịch làm việc tuần này
                      </h5>
                      <div className="week-navigation d-flex align-items-center gap-3">
                        <button className="nav-btn">
                          <i className="fas fa-chevron-left"></i>
                        </button>
                        <span className="week-range small fw-medium">
                          19/4/2026 - 25/4/2026
                        </span>
                        <button className="nav-btn">
                          <i className="fas fa-chevron-right"></i>
                        </button>
                      </div>
                    </div>

                    {/* Legend */}
                    <div className="legend-container d-flex gap-4 mb-4">
                      <div className="legend-item d-flex align-items-center gap-2">
                        <div className="legend-dot available"></div>
                        <span className="small text-secondary">Còn trống</span>
                      </div>
                      <div className="legend-item d-flex align-items-center gap-2">
                        <div className="legend-dot booked"></div>
                        <span className="small text-secondary">Đã đặt</span>
                      </div>
                      <div className="legend-item d-flex align-items-center gap-2">
                        <div className="legend-dot selected"></div>
                        <span className="small text-secondary">Đã chọn</span>
                      </div>
                    </div>

                    {/* Schedule Calendar */}
                    <TimeSlotPicker doctorId={doctor.id} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetail;
