/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/immutability */
// src/modules/doctor/pages/DoctorDetail.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/doctor-detail.css';
import { useDoctor } from './hooks/useDoctor';
import type { Doctor } from './doctorService';
import TimeSlotPicker from './TimeSlotPicker';
import ScreenLoading from '../../shared/utils/loading';

const DoctorDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();
  const { getDoctorById, loading, error } = useDoctor();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'schedule'>('profile');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('');
  const [weekOffset, setWeekOffset] = useState(0);

  useEffect(() => {
    if (id) {
      loadDoctor();
    }
  }, [id]);

  useEffect(() => {
    if (doctor?.specialties?.length) {
      const first = doctor.specialties[0];
      setSelectedSpecialty(first.doctorSpecialtyId);
    }
  }, [doctor]);

  const loadDoctor = async () => {
    const data = await getDoctorById(id!);
    setDoctor(data);
  };

  const handleBack = () => {
    navigate('/');
  };

  const handleBooking = () => {
    // Navigate to booking page
    navigate(`/booking/${id}`);
  };

  const getWeek = (offset = 0) => {
    const now = new Date();

    // chuyển về thứ 2
    const monday = new Date(now);
    const day = now.getDay(); // 0 = CN

    const diff = day === 0 ? -6 : 1 - day;
    monday.setDate(now.getDate() + diff + offset * 7);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    return { monday, sunday };
  };

  const getWeekRange = (params: { monday: Date; sunday: Date }) => {
    const { monday, sunday } = params;

    const format = (d: Date) =>
      `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;

    return `${format(monday)} - ${format(sunday)}`;
  };

  if (loading) {
    return <ScreenLoading message="Đang tải..." show={loading} />;
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
          <button className="btn-back" onClick={handleBack}>
            <i className="fas fa-arrow-left me-2"></i>
            Quay lại danh sách
          </button>
        </div>

        <div className="row g-4">
          {/* Left Sidebar - Doctor Info */}
          <div className="col-lg-3 mb-4">
            <div className="doctor-info-card">
              <div className="card-inner">
                {/* Avatar */}
                <div className="avatar-wrapper text-center mb-4">
                  <div className="doctor-avatar-large">
                    <i className="fas fa-user-md"></i>
                  </div>
                </div>

                {/* Doctor Name */}
                <h3 className="doctor-name-detail text-center mb-3">
                  {doctor.name}
                </h3>

                {/* Specialties */}
                {doctor.specialties?.length > 0 && (
                  <div className="info-section mb-3">
                    <label className="info-label">
                      <i className="fas fa-stethoscope me-1"></i>
                      Chuyên khoa
                    </label>
                    <div className="specialty-badges">
                      {doctor.specialties.map((s) => (
                        <span key={s.id} className="specialty-badge">
                          {s.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Hospital */}
                <div className="info-row">
                  <i className="fas fa-hospital"></i>
                  <span>{doctor.clinic}</span>
                </div>

                {/* Experience */}
                <div className="info-row">
                  <i className="fas fa-briefcase"></i>
                  <span>{doctor.experience} năm kinh nghiệm</span>
                </div>

                {/* Languages */}
                <div className="info-row">
                  <i className="fas fa-language"></i>
                  <span>{doctor.languages.join(', ')}</span>
                </div>

                {/* Qualifications */}
                <div className="info-section mt-3">
                  <label className="info-label">
                    <i className="fas fa-graduation-cap me-1"></i>
                    HỌC VỊ
                  </label>
                  <div className="qualification-list">
                    <div className="qualification-item">
                      <span>Thạc sĩ Y khoa</span>
                    </div>
                    <div className="qualification-item">
                      <span>Chuyên khoa I Nhi</span>
                    </div>
                  </div>
                </div>

                {/* Rating */}
                <div className="rating-card">
                  <div className="rating-stars">
                    <i className="fas fa-star"></i>
                    <span className="rating-value">{doctor.rating}</span>
                    <span className="rating-divider">/</span>
                    <span className="rating-max">5.0</span>
                  </div>
                  <div className="rating-review">
                    <i className="fas fa-comment"></i>
                    <span>{doctor.reviewCount} đánh giá</span>
                  </div>
                </div>

                {/* Price */}
                <div className="price-section">
                  <label className="info-label">
                    <i className="fas fa-tag me-1"></i>
                    Phí khám
                  </label>
                  <div className="price-list">
                    {doctor.specialties.map((s) => (
                      <div key={s.id} className="price-item">
                        <span className="price-specialty">{s.name}</span>
                        <span className="price-amount">
                          {s.price.toLocaleString('vi-VN')} ₫
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Insurance */}
                {doctor.acceptsInsurance && (
                  <div className="insurance-badge">
                    <i className="fas fa-shield-alt"></i>
                    <span>Hỗ trợ BHYT</span>
                  </div>
                )}

                {/* Book Button */}
                <button
                  className="btn-book-appointment"
                  onClick={handleBooking}
                >
                  <i className="fas fa-calendar-check me-2"></i>
                  Đặt lịch khám ngay
                </button>
              </div>
            </div>
          </div>

          {/* Right Content - Tabs and Schedule */}
          <div className="col-lg-9">
            <div className="main-content-card">
              <div className="card-inner">
                {/* Tabs */}
                <div className="tabs-container">
                  <button
                    className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
                    onClick={() => setActiveTab('profile')}
                  >
                    <i className="fas fa-user-circle me-2"></i>
                    Hồ sơ chi tiết
                  </button>
                  <button
                    className={`tab-btn ${activeTab === 'schedule' ? 'active' : ''}`}
                    onClick={() => setActiveTab('schedule')}
                  >
                    <i className="fas fa-calendar-alt me-2"></i>
                    Lịch làm việc
                  </button>
                </div>

                {/* Profile Tab Content */}
                {activeTab === 'profile' && (
                  <div className="profile-content">
                    <div className="content-section">
                      <h5 className="section-title">
                        <i className="fas fa-user-md me-2"></i>
                        Giới thiệu
                      </h5>
                      <p className="section-text">
                        Bác sĩ {doctor.name} có hơn {doctor.experience} năm kinh
                        nghiệm trong lĩnh vực{' '}
                        {doctor.specialties?.map((s) => s.name).join(', ')}. Tốt
                        nghiệp loại giỏi trường Đại học Y Hà Nội, sau đó hoàn
                        thành chương trình chuyên khoa cấp I và cấp II.
                      </p>
                    </div>

                    <div className="content-section">
                      <h5 className="section-title">
                        <i className="fas fa-graduation-cap me-2"></i>
                        Quá trình đào tạo
                      </h5>
                      <ul className="section-list">
                        <li>✓ Tốt nghiệp Thạc sĩ Y khoa - Đại học Y Hà Nội</li>
                        <li>✓ Chứng chỉ chuyên khoa I Nhi khoa</li>
                        <li>✓ Chứng chỉ đào tạo liên tục về Sơ sinh</li>
                        <li>✓ Tham gia nhiều hội thảo quốc tế về Nhi khoa</li>
                      </ul>
                    </div>

                    <div className="content-section">
                      <h5 className="section-title">
                        <i className="fas fa-briefcase me-2"></i>
                        Kinh nghiệm làm việc
                      </h5>
                      <ul className="section-list">
                        <li>
                          ✓ Bác sĩ Nhi khoa tại {doctor.clinic} (2014 - nay)
                        </li>
                        <li>✓ Giảng viên bộ môn Nhi - Đại học Y Hà Nội</li>
                        <li>
                          ✓ Trưởng khoa Nhi tại Bệnh viện Đa khoa tỉnh
                          (2010-2014)
                        </li>
                      </ul>
                    </div>

                    <div className="content-section">
                      <h5 className="section-title">
                        <i className="fas fa-heartbeat me-2"></i>
                        Lĩnh vực chuyên môn
                      </h5>
                      <div className="expertise-tags">
                        <span className="expertise-tag">
                          Khám nhi tổng quát
                        </span>
                        <span className="expertise-tag">Tiêm chủng</span>
                        <span className="expertise-tag">Dinh dưỡng trẻ em</span>
                        <span className="expertise-tag">Sơ sinh</span>
                        <span className="expertise-tag">Hô hấp nhi</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Schedule Tab Content */}
                {activeTab === 'schedule' && (
                  <div className="schedule-content">
                    <div className="schedule-header">
                      <h5 className="section-title mb-0">
                        <i className="fas fa-calendar-week me-2"></i>
                        Lịch làm việc
                      </h5>
                      <div className="week-navigation">
                        <button
                          className="nav-btn"
                          disabled={weekOffset === 0}
                          onClick={() =>
                            setWeekOffset((prev) => Math.max(0, prev - 1))
                          }
                        >
                          <i className="fas fa-chevron-left"></i>
                        </button>
                        <span className="week-range">
                          {getWeekRange(getWeek(weekOffset))}
                        </span>
                        <button
                          className="nav-btn"
                          disabled={weekOffset === 1}
                          onClick={() =>
                            setWeekOffset((prev) => Math.min(1, prev + 1))
                          }
                        >
                          <i className="fas fa-chevron-right"></i>
                        </button>
                      </div>
                    </div>

                    {/* Legend */}
                    <div className="legend-container">
                      <div className="legend-item">
                        <div className="legend-dot available"></div>
                        <span>Có thể đặt</span>
                      </div>
                      <div className="legend-item">
                        <div className="legend-dot booked"></div>
                        <span>Đã đặt / không khả dụng</span>
                      </div>
                      <div className="legend-item">
                        <div className="legend-dot selected"></div>
                        <span>Đang chọn</span>
                      </div>
                    </div>

                    {/* Schedule Calendar */}
                    {doctor.specialties?.length > 0 && (
                      <div className="specialty-selector">
                        <label className="selector-label">
                          <i className="fas fa-stethoscope me-1"></i>
                          Chọn chuyên khoa
                        </label>
                        <select
                          className="form-select-custom"
                          id="doctor-specialty"
                          name="doctor_specialty_id"
                          value={selectedSpecialty}
                          onChange={(e) => setSelectedSpecialty(e.target.value)}
                        >
                          {doctor.specialties.map((s) => (
                            <option
                              key={s.doctorSpecialtyId}
                              value={s.doctorSpecialtyId}
                            >
                              {s.name} - {s.price.toLocaleString('vi-VN')}đ
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    <TimeSlotPicker
                      doctorSpecialtyId={selectedSpecialty}
                      weekOffset={weekOffset}
                      getWeek={getWeek}
                    />
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
