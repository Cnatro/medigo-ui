/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from 'react';
import ScreenLoading from '../../shared/utils/loading';
import { useAdmin } from './hooks/useAdmin';
import './styles/users-management.css';
import RegisterPopup from './RegisterPopup';

const PAGE_SIZE = 6;

const UsersManagement = () => {
  const { users, loading, fetchUsers } = useAdmin();

  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [page, setPage] = useState(1);
  const [openRegister, setOpenRegister] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  /* FILTER */
  const filteredUsers = useMemo(() => {
    return (users || [])
      .filter(
        (u: any) =>
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase()),
      )
      .filter((u: any) => (role ? u.role === role : true));
  }, [users, search, role]);

  /* PAGINATION */
  const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE);

  const pagedUsers = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredUsers.slice(start, start + PAGE_SIZE);
  }, [filteredUsers, page]);

  const goPrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const goNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  /* RESET PAGE WHEN FILTER CHANGE */
  useEffect(() => {
    setPage(1);
  }, [search, role]);

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
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Created</th>
            </tr>
          </thead>

          <tbody>
            {pagedUsers?.length > 0 ? (
              pagedUsers.map((user: any) => (
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
          Trang <b>{page}</b> / {totalPages || 1}
        </div>

        <button
          onClick={goNext}
          disabled={page === totalPages || totalPages === 0}
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
    </div>
  );
};

export default UsersManagement;
