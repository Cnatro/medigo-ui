/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import type { RegisterPayload } from '../auth/authService';
import './styles/admin-register.css';
import { useAdmin } from './hooks/useAdmin';

type Props = {
  onClose: () => void;
};

const RegisterPopup: React.FC<Props> = ({ onClose }) => {
  const {
    clinics,
    specialties,
    fetchClinics,
    fectchSpecialties,
    registerUser,
    loading,
  } = useAdmin();
  const [accountType, setAccountType] = useState<'patient' | 'doctor'>(
    'patient',
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    bio: '',
    experienceYears: '',
    clinicId: '',
    dateOfBirth: '',
    gender: 'MALE',
  });

  useEffect(() => {
    fetchClinics();
    fectchSpecialties();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Mật khẩu xác nhận không khớp');
      return;
    }

    let payload: RegisterPayload;

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
          specialty_ids: selectedSpecialties,
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
          gender: formData.gender as 'MALE' | 'FEMALE',
        },
      };
    }

    await registerUser(payload);
    onClose();
  };

  return (
    <div className="register-wrapper" onClick={onClose}>
      <div className="register-card" onClick={(e) => e.stopPropagation()}>
        {/* CLOSE */}
        <button className="register-close" onClick={onClose}>
          Đóng
        </button>

        {/* HEADER */}
        <div className="register-header">
          <h3>Đăng ký người dùng</h3>
          <p>Thêm bác sĩ hoặc bệnh nhân vào hệ thống</p>
        </div>

        {/* ROLE SWITCH */}
        <div className="users-toolbar" style={{ marginBottom: 16 }}>
          <button
            className="btn-add"
            style={{
              flex: 1,
              background: accountType === 'patient' ? '#111827' : '#e5e7eb',
            }}
            onClick={() => setAccountType('patient')}
            type="button"
          >
            Bệnh nhân
          </button>

          <button
            className="btn-add"
            style={{
              flex: 1,
              background: accountType === 'doctor' ? '#111827' : '#e5e7eb',
            }}
            onClick={() => setAccountType('doctor')}
            type="button"
          >
            Bác sĩ
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* INPUTS */}
          <div className="input-group-custom">
            <input
              name="fullName"
              placeholder="Họ tên"
              className="form-control"
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="input-group-custom">
            <input
              name="email"
              type="email"
              placeholder="Email"
              className="form-control"
              onChange={handleInputChange}
              required
            />
          </div>

          {/* PASSWORD */}
          <div className="input-group-custom">
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Mật khẩu"
              className="form-control"
              onChange={handleInputChange}
              required
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? 'Ẩn' : 'Hiện'}
            </button>
          </div>

          {/* CONFIRM */}
          <div className="input-group-custom">
            <input
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Xác nhận mật khẩu"
              className="form-control"
              onChange={handleInputChange}
              required
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? 'Ẩn' : 'Hiện'}
            </button>
          </div>

          {/* DOCTOR */}
          {accountType === 'doctor' && (
            <>
              <div className="specialty-box">
                {specialties?.map((s: any) => (
                  <label key={s.id} className="specialty-item">
                    <input
                      type="checkbox"
                      checked={selectedSpecialties.includes(s.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedSpecialties([
                            ...selectedSpecialties,
                            s.id,
                          ]);
                        } else {
                          setSelectedSpecialties(
                            selectedSpecialties.filter((id) => id !== s.id),
                          );
                        }
                      }}
                    />
                    <span>{s.name}</span>
                  </label>
                ))}
              </div>

              <div className="input-group-custom">
                <input
                  name="experienceYears"
                  type="number"
                  placeholder="Kinh nghiệm (năm)"
                  className="form-control"
                  min={0}
                  max={100}
                  onChange={handleInputChange}
                />
              </div>

              <div className="input-group-custom">
                <select
                  name="clinicId"
                  className="form-control"
                  onChange={handleInputChange}
                >
                  <option value="">Chọn phòng khám</option>
                  {clinics?.map((c: any) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* PATIENT */}
          {accountType === 'patient' && (
            <>
              <div className="input-group-custom">
                <input
                  name="dateOfBirth"
                  type="date"
                  className="form-control"
                  onChange={handleInputChange}
                />
              </div>

              <div className="gender-group">
                <label className="gender-option">
                  <input
                    type="radio"
                    name="gender"
                    value="MALE"
                    onChange={handleInputChange}
                  />
                  <div className="gender-card">Nam</div>
                </label>

                <label className="gender-option">
                  <input
                    type="radio"
                    name="gender"
                    value="FEMALE"
                    onChange={handleInputChange}
                  />
                  <div className="gender-card">Nữ</div>
                </label>
              </div>
            </>
          )}

          <button className="register-btn" type="submit">
            {loading ? 'Đang xử lý đăng ký...' : 'Đăng ký'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPopup;
