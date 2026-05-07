/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from 'react';
import ScreenLoading from '../../shared/utils/loading';
import { useAdmin } from './hooks/useAdmin';
import './styles/schedule.css';

const DAYS = ['THỨ 2', 'THỨ 3', 'THỨ 4', 'THỨ 5', 'THỨ 6', 'T7', 'CN'];

const PAGE_SIZE = 6;

/* NORMALIZE + DEDUPE */
const normalizeSchedule = (doc: any) => {
  const map = new Map();

  const add = (list: any[], type: string) => {
    (list || []).forEach((s: any) => {
      map.set(s.id, {
        ...s,
        type,
      });
    });
  };

  add(doc.regular, 'REGULAR');
  add(doc.extra_shift, 'EXTRA');
  add(doc.weekend_shift, 'WEEKEND');

  return Array.from(map.values());
};

/* GET BY DAY */
const getSlotsByDay = (list: any[], day: number) =>
  list?.filter((i) => i.day_of_week === day) || [];

/* STATUS CLASS */
const getStatusClass = (status: string) => {
  switch (status) {
    case 'ACTIVE':
      return 'active';
    case 'LEAVE_PENDING':
      return 'leave_pending';
    case 'LEAVE_APPROVED':
      return 'leave_approved';
    default:
      return '';
  }
};

/* TYPE LABEL */
const getTypeLabel = (type: string) => {
  switch (type) {
    case 'EXTRA':
      return 'Tăng ca';
    case 'WEEKEND':
      return 'Cuối tuần';
    default:
      return 'Thường';
  }
};

const ScheduleManagement = () => {
  const { schedules, loading, fetchSchedules, clinics, fetchClinics } =
    useAdmin();

  const [search, setSearch] = useState('');
  const [clinicId, setClinicId] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchSchedules();
    fetchClinics();
  }, []);

  const filtered = useMemo(() => {
    return (schedules || [])
      .filter((doc: any) =>
        doc.doctor_name.toLowerCase().includes(search.toLowerCase()),
      )
      .filter((doc: any) => (clinicId ? doc.clinic_id === clinicId : true));
  }, [schedules, search, clinicId]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const pagedData = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  if (loading || schedules.length === 0) {
    return (
      <div className="loading-wrap">
        <ScreenLoading message="Đang tải lịch làm việc..." />
      </div>
    );
  }

  return (
    <div className="schedule-page">
      {/* HEADER */}
      <div className="schedule-header">
        <h2>Lịch làm việc bác sĩ</h2>
        <p>Quản lý lịch làm việc theo tuần</p>
      </div>

      {/* FILTER */}
      <div className="filter-bar">
        <input
          className="search-input"
          placeholder="Tìm bác sĩ..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="select"
          value={clinicId}
          onChange={(e) => setClinicId(e.target.value)}
        >
          <option value="">Tất cả bệnh viện</option>
          {clinics?.map((c: any) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* GRID */}
      <div className="doctor-grid">
        {pagedData?.map((doc: any) => {
          const schedules = normalizeSchedule(doc);

          return (
            <div
              key={`${doc.doctor_name}-${doc.doctor_specialty_id}`}
              className="doctor-card"
            >
              {/* HEADER */}
              <div className="doctor-header">
                <img
                  className="avatar"
                  src={`https://ui-avatars.com/api/?name=${doc.doctor_name}`}
                  alt="doctor"
                />

                <div className="info">
                  <h3>{doc.doctor_name}</h3>
                  <span>{doc.specialty}</span>
                </div>
              </div>

              {/* WEEK */}
              <div className="week-row">
                {DAYS.map((d, idx) => {
                  const slots = getSlotsByDay(schedules, idx);
                  const hasWorking = slots.length > 0;
                  const hasLeave = slots.some((s) =>
                    ['LEAVE_PENDING', 'LEAVE_APPROVED'].includes(s.status),
                  );

                  return (
                    <div
                      key={d}
                      className={`day-box ${hasWorking ? 'active' : ''} ${
                        hasLeave ? 'leave' : ''
                      }`}
                    >
                      <div className="day">{d}</div>

                      {hasWorking ? (
                        <div className="slot-list">
                          {slots.map((s: any) => {
                            const typeLabel = getTypeLabel(s.type);
                            const statusClass = getStatusClass(s.status);

                            return (
                              <div
                                key={s.id}
                                className={`slot ${statusClass} ${s.type.toLowerCase()}`}
                              >
                                <div className="time">
                                  {s.start_time.slice(0, 5)} -{' '}
                                  {s.end_time.slice(0, 5)}
                                </div>

                                <div className="type-tag">{typeLabel}</div>

                                {s.status === 'LEAVE_APPROVED' && (
                                  <div className="status-tag leave">
                                    Nghỉ đã duyệt
                                  </div>
                                )}

                                {s.status === 'LEAVE_PENDING' && (
                                  <div className="status-tag pending">
                                    Chờ duyệt nghỉ
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="empty">Không có ca làm</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* PAGINATION */}
      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          ← Trước
        </button>

        <span>
          Trang {page} / {totalPages || 1}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Sau →
        </button>
      </div>
    </div>
  );
};

export default ScheduleManagement;
