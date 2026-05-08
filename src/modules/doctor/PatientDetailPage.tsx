/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/PatientDetailPage.tsx
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './styles/PatientDetailPage.css';
import { usePatient } from './hooks/usePatient';
import ScreenLoading from '../../shared/utils/loading';

const mockPatient = {
  id: 'BN20260001',
  name: 'Nguyễn Văn An',
  gender: 'Nam',
  age: 32,
  dob: '01/01/1992',
  phone: '0901 234 567',
  email: 'nguyenvanan@gmail.com',
  address: '123 Đường ABC, Phường 1',
  occupation: 'Nhân viên văn phòng',
  bloodType: 'O+',
  height: 170,
  weight: 65,
  bmi: 22.5,
  bloodPressure: '120/80',
  heartRate: 72,
  medicalHistory: 'Không có bệnh nền',
  surgicalHistory: 'Chưa có phẫu thuật',
  allergies: 'Penicillin',
  emergencyContact: {
    name: 'Nguyễn Thị Bình',
    relationship: 'Vợ',
    phone: '0902 345 678',
    address: '123 Đường ABC',
  },
  insurance: {
    type: 'BHYT',
    number: 'HS1234567890',
    issuedPlace: 'TP.HCM',
    effectiveDate: '2026-01-01',
    expiryDate: '2026-12-31',
  },
  notes: 'Bệnh nhân cần tái khám',
  sysmptoms: 'Đau đầu, mệt mỏi',
};

const PatientDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    'general' | 'medical' | 'emergency' | 'insurance' | 'notes' | 'symptoms'
  >('general');

  const { getDetail, loading, completePatient } = usePatient(null);
  const [apiData, setApiData] = useState<any>(null);
  const [symptomInput, setSymptomInput] = useState('');

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      const res = await getDetail(id);
      setApiData(res || null);
    };

    load();
  }, [id]);

  const handleComplete = async () => {
    if (!apiData?.id) return;

    await completePatient(apiData.id, symptomInput);

    navigate('/doctor/patients');
  };

  if (loading) {
    return <ScreenLoading message="Đang tải..." show={loading} />;
  }

  const patient = {
    id: apiData?.id ?? mockPatient.id,

    name: apiData?.patient?.full_name ?? mockPatient.name,
    gender:
      (apiData?.patient?.gender ?? mockPatient.gender) === 'FEMALE'
        ? 'Nữ'
        : 'Nam',
    dob: apiData?.patient?.dob ?? mockPatient.dob,
    email: apiData?.patient?.email ?? mockPatient.email,
    phone: apiData?.patient?.phone ?? mockPatient.phone,

    age: mockPatient.age,
    address: mockPatient.address,
    occupation: mockPatient.occupation,
    bloodType: mockPatient.bloodType,

    height: mockPatient.height,
    weight: mockPatient.weight,
    bmi: mockPatient.bmi,
    bloodPressure: mockPatient.bloodPressure,
    heartRate: mockPatient.heartRate,

    medicalHistory: mockPatient.medicalHistory,
    surgicalHistory: mockPatient.surgicalHistory,
    allergies: mockPatient.allergies,

    emergencyContact: mockPatient.emergencyContact,
    insurance: mockPatient.insurance,

    notes: apiData?.reason ?? mockPatient.notes,
    sysmptoms: apiData?.symptom ?? mockPatient.sysmptoms,
  };

  const getStartDateTime = () => {
    if (!apiData) return null;

    return new Date(`${apiData.date}T${apiData.start_time}`);
  };

  const isStartTimeReached = () => {
    const start = getStartDateTime();
    if (!start) return false;

    // return new Date() >= start;
    return true;
  };
  return (
    <div className="patient-detail-page container-fluid p-4">
      {/* Nút quay lại */}
      <div className="d-flex align-items-center gap-2 mb-4">
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={() => navigate('/doctor/patients')}
        >
          <i className="fas fa-arrow-left me-1"></i> Quay lại danh sách
        </button>
      </div>

      {/* Header thông tin tổng quan */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body p-4">
          <div className="d-flex flex-wrap align-items-start gap-4">
            {/* Avatar */}
            <div className="avatar-circle bg-primary-soft">
              <span className="avatar-text">{patient.name.charAt(0)}</span>
            </div>
            <div className="flex-grow-1">
              <div className="d-flex flex-wrap align-items-center gap-3 mb-2">
                <h3 className="mb-0 fw-bold">{patient.name}</h3>
                <span className="badge bg-success-light text-success px-3 py-1 rounded-pill">
                  {patient.gender}
                </span>
                <span className="badge bg-success-light text-success px-3 py-1 rounded-pill">
                  {patient.age} tuổi
                </span>
              </div>
              <div className="row g-3">
                <div className="col-md-3 col-sm-6 d-flex align-items-center gap-2">
                  <i className="fas fa-calendar-alt text-secondary"></i>
                  <span className="text-muted">{patient.dob}</span>
                </div>
                <div className="col-md-3 col-sm-6 d-flex align-items-center gap-2">
                  <i className="fas fa-phone text-secondary"></i>
                  <span className="text-muted">{patient.phone}</span>
                </div>
                <div className="col-md-3 col-sm-6 d-flex align-items-center gap-2">
                  <i className="fas fa-id-card text-secondary"></i>
                  <span className="text-muted">
                    ID: {`BN${patient.id.replace(/-/g, '').slice(0, 6)}`}
                  </span>
                </div>
                <div className="col-12 d-flex align-items-center gap-2">
                  <i className="fas fa-map-marker-alt text-secondary"></i>
                  <span className="text-muted">{patient.address}</span>
                </div>
              </div>
            </div>
            {/* Thông tin nhân viên & thông báo (theo wireframe) */}
            {/* <div className="d-flex gap-3 align-items-center">
              <div className="position-relative">
                <i className="fas fa-bell text-secondary fs-5"></i>
                <span className="notification-dot"></span>
              </div>
              <div className="avatar-circle-sm bg-primary-soft">
                <span className="avatar-text-sm">NV</span>
              </div>
              <div>
                <div className="fw-semibold">Nguyễn Văn A</div>
                <div className="small text-muted">Nhân viên</div>
              </div>
            </div> */}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-header bg-white border-bottom p-0">
          <ul className="nav nav-tabs border-0">
            <li className="nav-item">
              <button
                className={`nav-link fw-medium px-4 py-3 ${activeTab === 'general' ? 'active text-primary border-bottom border-primary border-2' : 'text-secondary'}`}
                onClick={() => setActiveTab('general')}
              >
                Thông tin chung
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link fw-medium px-4 py-3 ${activeTab === 'medical' ? 'active text-primary border-bottom border-primary border-2' : 'text-secondary'}`}
                onClick={() => setActiveTab('medical')}
              >
                Thông tin y tế
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link fw-medium px-4 py-3 ${activeTab === 'emergency' ? 'active text-primary border-bottom border-primary border-2' : 'text-secondary'}`}
                onClick={() => setActiveTab('emergency')}
              >
                Liên hệ khẩn cấp
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link fw-medium px-4 py-3 ${activeTab === 'insurance' ? 'active text-primary border-bottom border-primary border-2' : 'text-secondary'}`}
                onClick={() => setActiveTab('insurance')}
              >
                Thông tin bảo hiểm
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link fw-medium px-4 py-3 ${activeTab === 'notes' ? 'active text-primary border-bottom border-primary border-2' : 'text-secondary'}`}
                onClick={() => setActiveTab('notes')}
              >
                Ghi chú
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link fw-medium px-4 py-3 ${activeTab === 'symptoms' ? 'active text-primary border-bottom border-primary border-2' : 'text-secondary'}`}
                onClick={() => setActiveTab('symptoms')}
              >
                Triệu chứng khám bệnh
              </button>
            </li>
          </ul>
        </div>

        <div className="card-body p-4">
          {/* Tab Thông tin chung */}
          {activeTab === 'general' && (
            <div>
              <h6 className="fw-semibold mb-4">Thông tin cá nhân</h6>
              <div className="row g-4">
                <div className="col-md-6">
                  <label className="form-label fw-medium small text-secondary">
                    Họ và tên *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue={patient.name}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-medium small text-secondary">
                    Giới tính *
                  </label>
                  <select className="form-select" defaultValue={patient.gender}>
                    <option>Nam</option>
                    <option>Nữ</option>
                    <option>Khác</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-medium small text-secondary">
                    Ngày sinh *
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    defaultValue="1992-01-01"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-medium small text-secondary">
                    Tuổi
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    defaultValue={patient.age}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-medium small text-secondary">
                    Số điện thoại *
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    defaultValue={patient.phone}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-medium small text-secondary">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    defaultValue={patient.email}
                  />
                </div>
                <div className="col-12">
                  <label className="form-label fw-medium small text-secondary">
                    Địa chỉ *
                  </label>
                  <textarea
                    className="form-control"
                    rows={2}
                    defaultValue={patient.address}
                  ></textarea>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-medium small text-secondary">
                    Nghề nghiệp
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue={patient.occupation}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-medium small text-secondary">
                    Nhóm máu
                  </label>
                  <select
                    className="form-select"
                    defaultValue={patient.bloodType}
                  >
                    <option>A+</option>
                    <option>A-</option>
                    <option>B+</option>
                    <option>B-</option>
                    <option>AB+</option>
                    <option>AB-</option>
                    <option>O+</option>
                    <option>O-</option>
                  </select>
                </div>
                <div className="col-12">
                  <small className="text-danger">* Thông tin bắt buộc</small>
                </div>
              </div>
            </div>
          )}

          {/* Tab Thông tin y tế */}
          {activeTab === 'medical' && (
            <div>
              <h6 className="fw-semibold mb-4">Thông tin y tế</h6>
              <div className="row g-4">
                <div className="col-md-4">
                  <label className="form-label fw-medium small text-secondary">
                    Chiều cao (cm)
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    defaultValue={patient.height}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-medium small text-secondary">
                    Cân nặng (kg)
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    defaultValue={patient.weight}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-medium small text-secondary">
                    Chỉ số BMI
                  </label>
                  <div className="bg-success-light text-success py-2 px-3 rounded">
                    {patient.bmi}
                  </div>
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-medium small text-secondary">
                    Huyết áp (mmHg)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue={patient.bloodPressure}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-medium small text-secondary">
                    Nhịp tim (nhịp/phút)
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    defaultValue={patient.heartRate}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-medium small text-secondary">
                    Nhóm máu
                  </label>
                  <select
                    className="form-select"
                    defaultValue={patient.bloodType}
                  >
                    <option>A+</option>
                    <option>B+</option>
                    <option>O+</option>
                    <option>AB+</option>
                  </select>
                </div>
                <div className="col-12">
                  <label className="form-label fw-medium small text-secondary">
                    Tiền sử bệnh
                  </label>
                  <textarea
                    className="form-control"
                    rows={2}
                    defaultValue={patient.medicalHistory}
                  ></textarea>
                </div>
                <div className="col-12">
                  <label className="form-label fw-medium small text-secondary">
                    Tiền sử phẫu thuật
                  </label>
                  <textarea
                    className="form-control"
                    rows={2}
                    defaultValue={patient.surgicalHistory}
                  ></textarea>
                </div>
                <div className="col-12">
                  <label className="form-label fw-medium small text-secondary">
                    Dị ứng
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue={patient.allergies}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab Liên hệ khẩn cấp */}
          {activeTab === 'emergency' && (
            <div>
              <h6 className="fw-semibold mb-4">Liên hệ khẩn cấp</h6>
              <div className="row g-4">
                <div className="col-md-6">
                  <label className="form-label fw-medium small text-secondary">
                    Họ tên *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue={patient.emergencyContact.name}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-medium small text-secondary">
                    Mối quan hệ *
                  </label>
                  <select
                    className="form-select"
                    defaultValue={patient.emergencyContact.relationship}
                  >
                    <option>Vợ</option>
                    <option>Chồng</option>
                    <option>Cha</option>
                    <option>Mẹ</option>
                    <option>Anh/Chị/Em</option>
                    <option>Bạn bè</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-medium small text-secondary">
                    Số điện thoại *
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    defaultValue={patient.emergencyContact.phone}
                  />
                </div>
                <div className="col-12">
                  <label className="form-label fw-medium small text-secondary">
                    Địa chỉ *
                  </label>
                  <textarea
                    className="form-control"
                    rows={2}
                    defaultValue={patient.emergencyContact.address}
                  ></textarea>
                </div>
              </div>
            </div>
          )}

          {/* Tab Thông tin bảo hiểm */}
          {activeTab === 'insurance' && (
            <div>
              <h6 className="fw-semibold mb-4">Thông tin bảo hiểm</h6>
              <div className="row g-4">
                <div className="col-md-6">
                  <label className="form-label fw-medium small text-secondary">
                    Loại bảo hiểm
                  </label>
                  <select
                    className="form-select"
                    defaultValue={patient.insurance.type}
                  >
                    <option>BHYT</option>
                    <option>Bảo hiểm sức khỏe</option>
                    <option>Bảo hiểm nhân thọ</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-medium small text-secondary">
                    Bảo hiểm y tế
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue={patient.insurance.number}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-medium small text-secondary">
                    Nơi cấp
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue={patient.insurance.issuedPlace}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-medium small text-secondary">
                    Ngày hiệu lực
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    defaultValue="2026-01-01"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-medium small text-secondary">
                    Ngày hết hạn
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    defaultValue="2026-12-31"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab Ghi chú */}
          {activeTab === 'notes' && (
            <div>
              <h6 className="fw-semibold mb-4">Ghi chú y tế</h6>
              <div className="row g-4">
                <div className="col-12">
                  <textarea
                    className="form-control"
                    rows={6}
                    defaultValue={patient.notes}
                  ></textarea>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'symptoms' && (
            <div>
              <h6 className="fw-semibold mb-4">Triệu chứng</h6>
              <div className="row g-4">
                <div className="col-12">
                  <textarea
                    className="form-control"
                    rows={6}
                    value={symptomInput}
                    onChange={(e) => setSymptomInput(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Nút hành động */}
          <div className="d-flex justify-content-end gap-3 mt-5 pt-3 border-top">
            <button className="btn btn-outline-secondary px-4">Hủy bỏ</button>
            {!isStartTimeReached() ? (
              <small className="text-danger d-block mt-2">
                Chưa đến giờ khám ({apiData?.start_time})
              </small>
            ) : (
              <button
                className="btn btn-primary px-4"
                disabled={loading}
                onClick={handleComplete}
              >
                Hoàn tất khám
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetailPage;
