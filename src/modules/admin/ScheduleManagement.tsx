/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import ScreenLoading from '../../shared/utils/loading';
import { useAdmin } from './hooks/useAdmin';
import './styles/schedule.css';

const DAYS = ['THỨ 2', 'THỨ 3', 'THỨ 4', 'THỨ 5', 'THỨ 6', 'T7', 'CN'];

const PAGE_SIZE = 6;

/* NORMALIZE + DEDUPE */
const normalizeSchedule = (doc: any) => {
  const map = new Map();

  const specialtyMap = (doc.specialties || []).reduce((acc: any, sp: any) => {
    acc[sp.id] = sp.name;
    return acc;
  }, {});

  const add = (list: any[], type: string) => {
    (list || []).forEach((s: any) => {
      map.set(s.id, {
        ...s,
        type,
        specialty_name: specialtyMap[s.specialty_id] || '---',
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
    case 'EXTRA_PENDING':
    case 'WEEKEND_PENDING':
      return 'pending';

    case 'LEAVE_APPROVED':
    case 'EXTRA_APPROVED':
    case 'WEEKEND_APPROVED':
      return 'approved';

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

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'LEAVE_PENDING':
      return 'Chờ duyệt nghỉ';

    case 'LEAVE_APPROVED':
      return 'Nghỉ đã duyệt';

    case 'EXTRA_PENDING':
      return 'Tăng ca chờ duyệt';

    case 'EXTRA_APPROVED':
      return 'Tăng ca đã duyệt';

    case 'WEEKEND_PENDING':
      return 'Cuối tuần chờ duyệt';

    case 'WEEKEND_APPROVED':
      return 'Cuối tuần đã duyệt';

    default:
      return null;
  }
};

const ScheduleManagement = () => {
  const {
    schedules,
    loading,
    fetchSchedules,
    clinics,
    fetchClinics,
    specialties,
    fectchSpecialties,
  } = useAdmin();

  const [search, setSearch] = useState('');
  const [clinicId, setClinicId] = useState('');
  const [page, setPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [specialtyId, setSpecialtyId] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    fetchSchedules({
      page,
      limit: PAGE_SIZE,
      filters: {
        doctor_name: debouncedSearch,
        clinic_id: clinicId,
        specialty_id: specialtyId,
      },
    });
  }, [page, debouncedSearch, clinicId, specialtyId]);

  useEffect(() => {
    fetchClinics();
  }, []);

  useEffect(() => {
    fectchSpecialties();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, clinicId, specialtyId]);

  if (loading || schedules.items.length === 0) {
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

        <select
          className="select"
          value={specialtyId}
          onChange={(e) => setSpecialtyId(e.target.value)}
        >
          <option value="">Tất cả chuyên khoa</option>

          {specialties?.map((sp: any) => (
            <option key={sp.id} value={sp.id}>
              {sp.name}
            </option>
          ))}
        </select>
      </div>

      {/* GRID */}
      <div className="doctor-grid">
        {schedules?.items?.map((doc: any) => {
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
                            const statusLabel = getStatusLabel(s.status);

                            return (
                              <div
                                key={s.id}
                                className={`slot ${statusClass} ${s.type.toLowerCase()}`}
                              >
                                <div className="time">
                                  {s.specialty_name} |{' '}
                                  {s.start_time.slice(0, 5)} -{' '}
                                  {s.end_time.slice(0, 5)}
                                </div>

                                <div className="type-tag">{typeLabel}</div>

                                {statusLabel && (
                                  <div className={`status-tag ${statusClass}`}>
                                    {statusLabel}
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
          Trang {page} / {schedules?.pagination?.pages || 1}
        </span>

        <button
          disabled={page === schedules?.pagination?.pages}
          onClick={() => setPage(page + 1)}
        >
          Sau →
        </button>
      </div>
    </div>
  );
};

export default ScheduleManagement;
