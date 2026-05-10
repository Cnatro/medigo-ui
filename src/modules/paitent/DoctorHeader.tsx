import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../shared/components/AuthContext';
import logo from '@/images/logo.png';

const DoctorHeader: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <div className="doctor-header py-3 shadow-sm bg-white">
      <div className="container d-flex align-items-center justify-content-between">
        {/* LOGO */}
        <div
          className="d-flex align-items-center gap-2"
          onClick={() => navigate('/doctor-page')}
          style={{ cursor: 'pointer' }}
        >
          <img src={logo} className="header-logo" alt="logo" />
          <h5 className="mb-0 fw-bold">MediGo</h5>
        </div>

        {/* RIGHT */}
        <div className="d-flex align-items-center gap-3 position-relative">
          <i className="fas fa-bell text-secondary"></i>

          {/* PROFILE */}
          <div
            className="d-flex align-items-center gap-2"
            style={{ cursor: 'pointer' }}
            onClick={() => setShowProfileMenu((prev) => !prev)}
          >
            <div className="doctor-avatar-mini">
              {currentUser?.avatar_url ? (
                <img src={currentUser.avatar_url} alt="avatar" />
              ) : (
                <div className="avatar-fallback">
                  <i className="fas fa-user-md"></i>
                </div>
              )}
            </div>

            <span>{currentUser?.full_name || 'User'}</span>
          </div>

          {/* DROPDOWN */}
          {showProfileMenu && (
            <div className="profile-dropdown shadow-sm">
              <div
                className="dropdown-item"
                onClick={() => {
                  setShowProfileMenu(false);
                  navigate('/profile');
                }}
              >
                Hồ sơ cá nhân
              </div>

              <div
                className="dropdown-item"
                onClick={() => {
                  setShowProfileMenu(false);
                  navigate('/appointments');
                }}
              >
                Quản lý lịch hẹn
              </div>

              <div
                className="dropdown-item"
                onClick={logout}
              >
                Đăng xuất
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorHeader;
