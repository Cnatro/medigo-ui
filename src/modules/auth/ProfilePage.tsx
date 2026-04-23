/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../shared/components/AuthContext';
import './styles/profile.css';
import { useNavigate } from 'react-router-dom';

const ProfilePage: React.FC = () => {
  const { currentUser, logout, fetchCurrentUser, updateCurrentUser } =
    useAuth();

  const navigate = useNavigate();

  const [isEdit, setIsEdit] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      setFullName(currentUser.full_name || '');
      setPhone(currentUser.phone || '');
    }
  }, [currentUser]);

  if (!currentUser) return <div className="loading">Loading...</div>;

  const handleUpdate = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('full_name', fullName);
      formData.append('phone', phone);

      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      await updateCurrentUser(formData);
      await fetchCurrentUser();

      setIsEdit(false);
      setAvatarFile(null);
      setPreview(null);
    } finally {
      setLoading(false);
    }
  };

  const handleChooseAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const renderProfile = () => {
    if (!currentUser?.profile) return null;

    switch (currentUser.role) {
      case 'PATIENT': {
        const p = currentUser.profile as any;
        return (
          <>
            <div className="info-item">
              <span>Ngày sinh</span>
              <b>{p.date_of_birth || '---'}</b>
            </div>
            <div className="info-item">
              <span>Giới tính</span>
              <b>{p.gender || '---'}</b>
            </div>
          </>
        );
      }

      case 'DOCTOR': {
        const d = currentUser.profile as any;
        return (
          <>
            <div className="info-item">
              <span>Chuyên khoa</span>
              <b>{d.specialty || '---'}</b>
            </div>
            <div className="info-item">
              <span>Kinh nghiệm</span>
              <b>{d.experience || 0} năm</b>
            </div>
          </>
        );
      }
    }
  };

  return (
    <div className="profile-page">
      <div className="top-bar">
        <button className="back-btn" onClick={() => navigate('/')}>
          ← Home
        </button>
      </div>

      <div className="profile-card">
        {/* AVATAR */}
        <div className="avatar-section">
          <label className="avatar">
            <input
              type="file"
              hidden
              onChange={handleChooseAvatar}
              disabled={!isEdit}
              accept="image/*"
            />

            <img
              src={
                preview ||
                currentUser.avatar_url ||
                'https://i.imgur.com/6VBx3io.png'
              }
            />

            {isEdit && <span className="edit-badge">Change</span>}
          </label>

          {!isEdit ? (
            <>
              <h2>{currentUser.full_name}</h2>
              <p>{currentUser.email}</p>
            </>
          ) : (
            <div className="edit-form">
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full name"
              />
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone"
              />
            </div>
          )}
        </div>

        {/* INFO */}
        <div className="info-box">
          <div className="info-item">
            <span>Role</span>
            <b>{currentUser.role}</b>
          </div>

          <div className="info-item">
            <span>Phone</span>
            <b>{currentUser.phone || '---'}</b>
          </div>

          {renderProfile()}
        </div>

        {/* ACTION */}
        <div className="actions">
          {!isEdit ? (
            <button className="btn edit" onClick={() => setIsEdit(true)}>
              Edit profile
            </button>
          ) : (
            <button
              className="btn save"
              disabled={loading}
              onClick={handleUpdate}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          )}

          <button className="btn danger" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
