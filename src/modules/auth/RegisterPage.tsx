import React, { useState } from 'react';
import type { RegisterPayload } from './authService';
import { useAuth } from '../../shared/components/AuthContext';

const RegisterPage: React.FC = () => {
  const [accountType, setAccountType] = useState<'patient' | 'doctor'>('patient');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register, isLoading, error } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',

    // doctor
    bio: '',
    experienceYears: '',
    clinicId: '',

    // patient
    dateOfBirth: '',
    gender: 'MALE',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Mật khẩu xác nhận không khớp');
      return;
    }

    let payload : RegisterPayload;

    if (accountType === 'doctor') {
      payload = {
        full_name: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: 'DOCTOR',
        profile: {
          bio: formData.bio,
          experience_years: Number(formData.experienceYears),
          clinic_id: formData.clinicId,
        },
      };
    } else {
      payload = {
        full_name: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: 'PATIENT',
        profile: {
          date_of_birth: formData.dateOfBirth,
          gender: formData.gender as "MALE" | "FEMALE",
        },
      };
    }

    await register(payload);
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-5">

            <div className="card p-4">
              <h3 className="text-center mb-3">Đăng ký</h3>

              {/* chọn role */}
              <div className="d-flex gap-2 mb-3">
                <button type="button" onClick={() => setAccountType('patient')} className="btn btn-outline-primary w-50">
                  Bệnh nhân
                </button>
                <button type="button" onClick={() => setAccountType('doctor')} className="btn btn-outline-primary w-50">
                  Bác sĩ
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <input
                  name="fullName"
                  placeholder="Họ tên"
                  className="form-control mb-2"
                  onChange={handleInputChange}
                  required
                />

                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  className="form-control mb-2"
                  onChange={handleInputChange}
                  required
                />

                {/* PASSWORD */}
                <div className="position-relative mb-2">
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Mật khẩu"
                    className="form-control pe-5"
                    onChange={handleInputChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    className="position-absolute top-50 end-0 translate-middle-y me-3 border-0 bg-transparent"
                  >
                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>

                {/* CONFIRM PASSWORD */}
                <div className="position-relative mb-2">
                  <input
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Xác nhận mật khẩu"
                    className="form-control pe-5"
                    onChange={handleInputChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(prev => !prev)}
                    className="position-absolute top-50 end-0 translate-middle-y me-3 border-0 bg-transparent"
                  >
                    <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>

                {/* DOCTOR */}
                {accountType === 'doctor' && (
                  <>
                    <input
                      name="bio"
                      placeholder="Chuyên khoa"
                      className="form-control mb-2"
                      onChange={handleInputChange}
                    />

                    <input
                      name="experienceYears"
                      type="number"
                      placeholder="Số năm kinh nghiệm"
                      className="form-control mb-2"
                      onChange={handleInputChange}
                    />

                    <input
                      name="clinicId"
                      placeholder="Clinic ID"
                      className="form-control mb-2"
                      onChange={handleInputChange}
                    />
                  </>
                )}

                {/* PATIENT */}
                {accountType === 'patient' && (
                  <>
                    <input
                      name="dateOfBirth"
                      type="date"
                      className="form-control mb-2"
                      onChange={handleInputChange}
                    />

                    <select
                      name="gender"
                      className="form-control mb-2"
                      onChange={handleInputChange}
                    >
                      <option value="MALE">Nam</option>
                      <option value="FEMALE">Nữ</option>
                    </select>
                  </>
                )}

                <button className="btn btn-primary w-100" disabled={isLoading}>
                  {isLoading ? 'Đang xử lý...' : 'Đăng ký'}
                </button>

                {error && <div className="text-danger mt-2">{error}</div>}
              </form>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;