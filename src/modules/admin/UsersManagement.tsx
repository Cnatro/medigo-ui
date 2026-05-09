/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import ScreenLoading from '../../shared/utils/loading';
import { useAdmin } from './hooks/useAdmin';
import './styles/users-management.css';
import RegisterPopup from './RegisterPopup';
import CreateSchedulePopup from './CreateSchedulePopup';

const PAGE_SIZE = 6;

const UsersManagement = () => {
  const { users, loading, fetchUsers } = useAdmin();

  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [page, setPage] = useState(1);
  const [openRegister, setOpenRegister] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [openSchedule, setOpenSchedule] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    fetchUsers({
      page,
      limit: PAGE_SIZE,
      filters: {
        search: debouncedSearch,
        role,
      },
    });
  }, [page, debouncedSearch, role]);

  const goPrev = () => {
    if (page > 1) setPage(page - 1);
  };

  /* RESET PAGE WHEN FILTER CHANGE */
  useEffect(() => {
    setPage(1);
    setOpenMenuId(null);
  }, [debouncedSearch, role]);

  useEffect(() => {
    const handleClickOutside = () => {
      setOpenMenuId(null);
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  if (loading) {
    return (
      <div className="users-loading">
        <ScreenLoading message="Đang tải danh sách người dùng..." />
      </div>
    );
  }

  return (
    <div className="users-page">
      {/* HEADER */}
      <div className="users-header">
        <div>
          <h2>Quản lý người dùng</h2>
          <p>Quản lý bác sĩ và bệnh nhân trong hệ thống</p>
        </div>

        <button className="btn-add" onClick={() => setOpenRegister(true)}>
          Thêm người dùng
        </button>
      </div>

      {/* TOOLBAR */}
      <div className="users-toolbar">
        <input
          className="search-input"
          placeholder="Tìm theo tên hoặc email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="filter-select"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="">Tất cả vai trò</option>
          <option value="DOCTOR">Doctor</option>
          <option value="PATIENT">Patient</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="table-wrapper">
        <table className="users-table">
          <thead>
            <tr>
              <th>Người dùng</th>
              <th>Email</th>
              <th>Vai trò</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {users?.items?.length > 0 ? (
              users.items.map((user: any) => (
                <tr key={user.id}>
                  {/* USER */}
                  <td>
                    <div className="user-box">
                      <div className="avatar">
                        {user.name?.charAt(0)?.toUpperCase()}
                      </div>

                      <div>
                        <div className="name">{user.name}</div>
                        <div className="sub">{user.id.slice(0, 8)}...</div>
                      </div>
                    </div>
                  </td>

                  {/* EMAIL */}
                  <td className="email">{user.email}</td>

                  {/* ROLE */}
                  <td>
                    <span className={`role role-${user.role.toLowerCase()}`}>
                      {user.role}
                    </span>
                  </td>

                  {/* STATUS */}
                  <td>
                    <span className={`status status-${user.status}`}>
                      {user.status}
                    </span>
                  </td>

                  {/* DATE */}
                  <td className="date">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>

                  <td className="action-cell">
                    <div className="action-wrapper">
                      <button
                        className="action-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId((prev) =>
                            prev === user.id ? null : user.id,
                          );
                        }}
                      >
                        <i className="fas fa-ellipsis-v"></i>
                      </button>

                      {openMenuId === user.id && (
                        <div className="action-dropdown">
                          <button className="dropdown-item">
                            <i className="bi bi-person-lines-fill"></i>
                            <span>Xem chi tiết</span>
                          </button>

                          <button className="dropdown-item">
                            <i className="bi bi-pencil-square"></i>
                            <span>Chỉnh sửa</span>
                          </button>

                          {user.role === 'DOCTOR' && (
                            <button
                              className="dropdown-item"
                              onClick={() => {
                                setSelectedDoctor(user);
                                setOpenSchedule(true);
                                setOpenMenuId(null);
                              }}
                            >
                              <i className="bi bi-calendar2-plus"></i>
                              <span>Tạo lịch làm</span>
                            </button>
                          )}

                          <div className="dropdown-divider" hidden></div>

                          <button className="dropdown-item danger" hidden>
                            <i className="bi bi-lock-fill"></i>
                            <span>Khóa tài khoản</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="empty">
                  Không tìm thấy người dùng
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="pagination">
        <button onClick={goPrev} disabled={page === 1}>
          Trước
        </button>

        <div className="page-info">
          Trang <b>{page}</b> / {users?.pagination?.pages || 1}
        </div>

        <button
          onClick={() => setPage(page + 1)}
          disabled={page >= (users?.pagination?.pages || 1)}
        >
          Sau
        </button>
      </div>

      {openRegister && (
        <div
          className="register-modal-overlay"
          onClick={() => setOpenRegister(false)}
        >
          <div
            className="register-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <RegisterPopup onClose={() => setOpenRegister(false)} />
          </div>
        </div>
      )}

      {openSchedule && selectedDoctor && (
        <div
          className="register-modal-overlay"
          onClick={() => setOpenSchedule(false)}
        >
          <div
            className="register-modal-content p-0"
            onClick={(e) => e.stopPropagation()}
          >
            <CreateSchedulePopup
              doctor={selectedDoctor}
              onClose={() => setOpenSchedule(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;
