import React, { useState } from 'react';
import type { RegisterPayload } from './authService';
import { useAuth } from '../../shared/components/AuthContext';
import ScreenLoading from '../../shared/utils/loading';
import './styles/register.css';

const RegisterPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register, isLoading, error } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    gender: 'MALE',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      gender: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Mật khẩu xác nhận không khớp');
      return;
    }

    const payload: RegisterPayload = {
      full_name: formData.fullName,
      email: formData.email,
      password: formData.password,
      role: 'PATIENT',
      profile: {
        date_of_birth: formData.dateOfBirth,
        gender: formData.gender as 'MALE' | 'FEMALE',
      },
    };

    await register(payload);
  };

  return (
    <>
      {isLoading ? (
        <ScreenLoading message="Đang đănhg ký..." show={isLoading} />
      ) : (
        <div className="register-wrapper">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-6 col-md-8">
                <div className="card register-card p-4 p-md-5">
                  <div className="register-header">
                    <h3>
                      <i className="fas fa-user-plus me-2"></i>
                      Đăng ký tài khoản
                    </h3>
                    <p>Điền thông tin để tạo tài khoản mới</p>
                  </div>

                  <form onSubmit={handleSubmit}>
                    {/* FULL NAME */}
                    <div className="input-group-custom">
                      <i className="fas fa-user input-icon"></i>
                      <input
                        name="fullName"
                        placeholder="Họ và tên"
                        className="form-control"
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    {/* EMAIL */}
                    <div className="input-group-custom">
                      <i className="fas fa-envelope input-icon"></i>
                      <input
                        name="email"
                        type="email"
                        placeholder="Địa chỉ email"
                        className="form-control"
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    {/* PASSWORD */}
                    <div className="input-group-custom">
                      <i className="fas fa-lock input-icon"></i>
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
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="toggle-password"
                      >
                        <i
                          className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}
                        ></i>
                      </button>
                    </div>

                    {/* CONFIRM PASSWORD */}
                    <div className="input-group-custom">
                      <i className="fas fa-check-circle input-icon"></i>
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
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="toggle-password"
                      >
                        <i
                          className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}
                        ></i>
                      </button>
                    </div>

                    {/* DATE OF BIRTH */}
                    <div className="input-group-custom">
                      <i className="fas fa-calendar-alt input-icon"></i>
                      <input
                        name="dateOfBirth"
                        type="date"
                        className="form-control"
                        onChange={handleInputChange}
                      />
                    </div>

                    {/* GENDER - Professional Card Style */}
                    <div className="gender-section">
                      <div className="gender-label">
                        <i className="fas fa-venus-mars"></i>
                        <span>Giới tính</span>
                      </div>
                      <div className="gender-group">
                        <label className="gender-option">
                          <input
                            type="radio"
                            name="gender"
                            value="MALE"
                            checked={formData.gender === 'MALE'}
                            onChange={handleGenderChange}
                          />
                          <div className="gender-card">
                            <i className="fas fa-mars"></i>
                            <span>Nam</span>
                          </div>
                        </label>
                        <label className="gender-option">
                          <input
                            type="radio"
                            name="gender"
                            value="FEMALE"
                            checked={formData.gender === 'FEMALE'}
                            onChange={handleGenderChange}
                          />
                          <div className="gender-card">
                            <i className="fas fa-venus"></i>
                            <span>Nữ</span>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* SUBMIT BUTTON */}
                    <button className="btn register-btn" type="submit">
                      Đăng ký ngay
                    </button>

                    {/* LOGIN LINK */}
                    <div className="login-link">
                      <span>Đã có tài khoản? </span>
                      <a href="/login">
                        <i className="fas fa-sign-in-alt me-1"></i>
                        Đăng nhập ngay
                      </a>
                    </div>

                    {error && (
                      <div className="error-message">
                        <i className="fas fa-exclamation-circle"></i>
                        {error}
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RegisterPage;
// import React, { useState } from 'react';
// import type { RegisterPayload } from './authService';
// import { useAuth } from '../../shared/components/AuthContext';
// import ScreenLoading from '../../shared/utils/loading';

// const RegisterPage: React.FC = () => {
//   const [accountType, setAccountType] = useState<'patient' | 'doctor'>(
//     'patient',
//   );
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const { register, isLoading, error } = useAuth();

//   const [formData, setFormData] = useState({
//     fullName: '',
//     email: '',
//     password: '',
//     confirmPassword: '',

//     // doctor
//     bio: '',
//     experienceYears: '',
//     clinicId: '',

//     // patient
//     dateOfBirth: '',
//     gender: 'MALE',
//   });

//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (formData.password !== formData.confirmPassword) {
//       alert('Mật khẩu xác nhận không khớp');
//       return;
//     }

//     let payload: RegisterPayload;

//     if (accountType === 'doctor') {
//       payload = {
//         full_name: formData.fullName,
//         email: formData.email,
//         password: formData.password,
//         role: 'DOCTOR',
//         profile: {
//           bio: formData.bio,
//           experience_years: Number(formData.experienceYears),
//           clinic_id: formData.clinicId,
//         },
//       };
//     } else {
//       payload = {
//         full_name: formData.fullName,
//         email: formData.email,
//         password: formData.password,
//         role: 'PATIENT',
//         profile: {
//           date_of_birth: formData.dateOfBirth,
//           gender: formData.gender as 'MALE' | 'FEMALE',
//         },
//       };
//     }

//     await register(payload);
//   };

//   return (
//     <div className="min-vh-100 d-flex align-items-center justify-content-center">
//       <div className="container">
//         <div className="row justify-content-center">
//           <div className="col-lg-5">
//             <div className="card p-4">
//               <h3 className="text-center mb-3">Đăng ký</h3>

//               {/* chọn role */}
//               <div className="d-flex gap-2 mb-3">
//                 <button
//                   type="button"
//                   onClick={() => setAccountType('patient')}
//                   className="btn btn-outline-primary w-50"
//                 >
//                   Bệnh nhân
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => setAccountType('doctor')}
//                   className="btn btn-outline-primary w-50"
//                 >
//                   Bác sĩ
//                 </button>
//               </div>

//               <form onSubmit={handleSubmit}>
//                 <input
//                   name="fullName"
//                   placeholder="Họ tên"
//                   className="form-control mb-2"
//                   onChange={handleInputChange}
//                   required
//                 />

//                 <input
//                   name="email"
//                   type="email"
//                   placeholder="Email"
//                   className="form-control mb-2"
//                   onChange={handleInputChange}
//                   required
//                 />

//                 {/* PASSWORD */}
//                 <div className="position-relative mb-2">
//                   <input
//                     name="password"
//                     type={showPassword ? 'text' : 'password'}
//                     placeholder="Mật khẩu"
//                     className="form-control pe-5"
//                     onChange={handleInputChange}
//                     required
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword((prev) => !prev)}
//                     className="position-absolute top-50 end-0 translate-middle-y me-3 border-0 bg-transparent"
//                   >
//                     <i
//                       className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}
//                     ></i>
//                   </button>
//                 </div>

//                 {/* CONFIRM PASSWORD */}
//                 <div className="position-relative mb-2">
//                   <input
//                     name="confirmPassword"
//                     type={showConfirmPassword ? 'text' : 'password'}
//                     placeholder="Xác nhận mật khẩu"
//                     className="form-control pe-5"
//                     onChange={handleInputChange}
//                     required
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowConfirmPassword((prev) => !prev)}
//                     className="position-absolute top-50 end-0 translate-middle-y me-3 border-0 bg-transparent"
//                   >
//                     <i
//                       className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}
//                     ></i>
//                   </button>
//                 </div>

//                 {/* DOCTOR */}
//                 {accountType === 'doctor' && (
//                   <>
//                     <input
//                       name="bio"
//                       placeholder="Chuyên khoa"
//                       className="form-control mb-2"
//                       onChange={handleInputChange}
//                     />

//                     <input
//                       name="experienceYears"
//                       type="number"
//                       placeholder="Số năm kinh nghiệm"
//                       className="form-control mb-2"
//                       onChange={handleInputChange}
//                     />

//                     <input
//                       name="clinicId"
//                       placeholder="Clinic ID"
//                       className="form-control mb-2"
//                       onChange={handleInputChange}
//                     />
//                   </>
//                 )}

//                 {/* PATIENT */}
//                 {accountType === 'patient' && (
//                   <>
//                     <input
//                       name="dateOfBirth"
//                       type="date"
//                       className="form-control mb-2"
//                       onChange={handleInputChange}
//                     />

//                     <select
//                       name="gender"
//                       className="form-control mb-2"
//                       onChange={handleInputChange}
//                     >
//                       <option value="MALE">Nam</option>
//                       <option value="FEMALE">Nữ</option>
//                     </select>
//                   </>
//                 )}
//                 {isLoading ? (
//                   <ScreenLoading message="Đang đăng ký..." show={isLoading} />
//                 ) : (
//                   <button
//                     className="btn btn-primary w-100"
//                     disabled={isLoading}
//                   >
//                     {isLoading ? 'Đang xử lý...' : 'Đăng ký'}
//                   </button>
//                 )}

//                 {error && <div className="text-danger mt-2">{error}</div>}
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RegisterPage;
