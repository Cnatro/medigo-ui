/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import './styles/ScheduleWork.css';
import useSchedules from './hooks/useSchedules';
import ScreenLoading from '../../shared/utils/loading';
import {
  eachWeekOfInterval,
  endOfWeek,
  endOfYear,
  format,
  isWithinInterval,
  startOfYear,
} from 'date-fns';
import type { WeekItem } from './service/doctorScheduleService';
import { formatHourMinute } from '../../shared/utils/styles/utils';

export default function ScheduleWork() {
  const [selectedSchedule, setSelectedSchedule] = useState<any>(null);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showExtraShiftModal, setShowExtraShiftModal] = useState(false);
  const [showWeekendModal, setShowWeekendModal] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'calendar'>('table');

  const [leaveReason, setLeaveReason] = useState('');

  const [extraShiftForm, setExtraShiftForm] = useState({
    date: '',
    specialty_id: '',
  });

  const [weekendForm, setWeekendForm] = useState({
    date: '',
    specialty_id: '',
  });

  const today = new Date();
  const currentYear = today.getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const weeksInYear: WeekItem[] = useMemo(() => {
    const yearStart = startOfYear(new Date(selectedYear, 0, 1));
    const yearEnd = endOfYear(new Date(selectedYear, 11, 31));

    const weeks = eachWeekOfInterval(
      {
        start: yearStart,
        end: yearEnd,
      },
      {
        weekStartsOn: 1,
      },
    );

    return weeks.map((weekStart, index) => {
      const weekEnd = endOfWeek(weekStart, {
        weekStartsOn: 1,
      });

      return {
        value: index,
        start: weekStart,
        end: weekEnd,
        label: `Tuần ${index + 1} (${format(
          weekStart,
          'dd/MM',
        )} - ${format(weekEnd, 'dd/MM')})`,
      };
    });
  }, [selectedYear]);

  const defaultWeekIndex = useMemo(() => {
    const foundIndex = weeksInYear.findIndex((week) =>
      isWithinInterval(today, {
        start: week.start,
        end: week.end,
      }),
    );

    return foundIndex >= 0 ? foundIndex : 0;
  }, [weeksInYear]);

  const getWeekRange = (weekIndex: number) => {
    const week = weeksInYear[weekIndex];
    if (!week) return null;

    const formatDate = (d: Date) => format(d, 'yyyy-MM-dd');

    return {
      start: formatDate(week.start),
      end: formatDate(week.end),
    };
  };

  const [range, setRange] = useState(() => getWeekRange(defaultWeekIndex));

  const [selectedWeek, setSelectedWeek] = useState(defaultWeekIndex);

  const {
    schedules,
    statistics,
    timeSlots,
    specialties,
    loading,
    error,
    fetchTimeSlots,
    updateLeaveSchedule,
    registerExtraShift,
    registerWeekendShift,
  } = useSchedules({
    start_date: range?.start,
    end_date: range?.end,
  });

  const closeAllModals = () => {
    setSelectedSchedule(null);
    setShowLeaveModal(false);
    setShowExtraShiftModal(false);
    setShowWeekendModal(false);
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'REGULAR':
        return 'Ca thường';
      case 'EXTRA_SHIFT':
        return 'Ca trực';
      case 'WEEKEND_SHIFT':
        return 'Ca cuối tuần';
      default:
        return type;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'Đang làm';

      case 'CANCELLED':
        return 'Đã hủy';

      case 'LEAVE_PENDING':
        return 'Chờ duyệt nghỉ';
      case 'LEAVE_APPROVED':
        return 'Đã duyệt nghỉ';

      case 'EXTRA_PENDING':
        return 'Chờ duyệt ca trực';
      case 'EXTRA_APPROVED':
        return 'Đã duyệt ca trực';
      case 'EXTRA_REJECTED':
        return 'Từ chối ca trực';

      case 'WEEKEND_PENDING':
        return 'Chờ duyệt ca cuối tuần';
      case 'WEEKEND_APPROVED':
        return 'Đã duyệt ca cuối tuần';
      case 'WEEKEND_REJECTED':
        return 'Từ chối ca cuối tuần';

      default:
        return status;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'schedule-work-status active';

      case 'CANCELLED':
        return 'schedule-work-status cancelled';

      case 'LEAVE_PENDING':
        return 'schedule-work-status pending';
      case 'LEAVE_APPROVED':
        return 'schedule-work-status leave';

      case 'EXTRA_PENDING':
        return 'schedule-work-status extra-pending';
      case 'EXTRA_APPROVED':
        return 'schedule-work-status extra-approved';
      case 'EXTRA_REJECTED':
        return 'schedule-work-status extra-rejected';

      case 'WEEKEND_PENDING':
        return 'schedule-work-status weekend-pending';
      case 'WEEKEND_APPROVED':
        return 'schedule-work-status weekend-approved';
      case 'WEEKEND_REJECTED':
        return 'schedule-work-status weekend-rejected';

      default:
        return 'schedule-work-status';
    }
  };

  const handleLeaveRequest = async () => {
    if (!leaveReason.trim()) {
      alert('Vui lòng nhập lý do nghỉ');
      return;
    }

    if (!selectedSchedule) {
      alert('Không tìm thấy lịch');
      return;
    }

    try {
      closeAllModals();
      await updateLeaveSchedule({
        schedule_id: selectedSchedule.id,
        status: 'LEAVE_PENDING',
        reason: leaveReason,
      });

      setLeaveReason('');
    } catch (error: any) {
      alert(error?.response?.data?.message || 'Gửi yêu cầu thất bại');
    }
  };

  const handleRegisterExtraShift = async () => {
    if (!extraShiftForm.date || !extraShiftForm.specialty_id) {
      alert('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    if (!isNextWeekAllowed(extraShiftForm.date)) {
      alert(
        'Chỉ được đăng ký ca trực từ tuần sau trở đi và trong tuần đang xem lịch',
      );
      return;
    }

    await registerExtraShift({
      workDate: extraShiftForm.date,
      specialty_id: extraShiftForm.specialty_id,
    });

    setExtraShiftForm({ date: '', specialty_id: '' });
    closeAllModals();
  };

  const handleRegisterWeekend = async () => {
    if (!weekendForm.date || !weekendForm.specialty_id) {
      alert('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    if (!isNextWeekAllowed(weekendForm.date)) {
      alert(
        'Chỉ được đăng ký ca trực từ tuần sau trở đi và trong tuần đang xem lịch',
      );
      return;
    }

    if (!isWeekend(weekendForm.date)) {
      alert('Chỉ được đăng ký ca vào thứ 7 hoặc chủ nhật');
      return;
    }

    await registerWeekendShift({
      workDate: weekendForm.date,
      specialty_id: weekendForm.specialty_id,
    });

    setExtraShiftForm({ date: '', specialty_id: '' });

    setWeekendForm({
      date: '',
      specialty_id: '',
    });

    closeAllModals();
  };

  const renderModalWrapper = (content: React.ReactNode) =>
    createPortal(
      <div className="schedule-work-modal-overlay" onClick={closeAllModals}>
        <div
          className="schedule-work-modal"
          onClick={(e) => e.stopPropagation()}
        >
          {content}
        </div>
      </div>,
      document.body,
    );

  const isNextWeekAllowed = (date: string) => {
    if (!range?.start || !range?.end) return false;

    const selected = new Date(date);

    const currentWeekStart = new Date(range.start);
    const currentWeekEnd = new Date(range.end);

    return selected >= currentWeekStart && selected <= currentWeekEnd;
  };

  const isWeekend = (date: string) => {
    const d = new Date(date);
    const day = d.getDay(); // 0 = Sunday, 6 = Saturday
    return day === 0 || day === 6;
  };

  const DAYS = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'];

  const groupedSchedules = useMemo(() => {
    const grouped: Record<number, any[]> = {
      0: [],
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
      6: [],
    };

    schedules.forEach((item: any) => {
      grouped[item.dayOfWeek]?.push(item);
    });

    return grouped;
  }, [schedules]);

  if (loading) {
    return <ScreenLoading message="Đang tải..." />;
  }

  if (error) {
    return (
      <div className="schedule-work-page">
        <div className="schedule-work-error">
          <h3>Đã xảy ra lỗi</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="schedule-work-page">
      {/* Header */}
      <div className="schedule-work-header">
        <h2>Quản lý lịch làm việc</h2>
        <p>Lịch thường được hệ thống tự động tạo mỗi tuần</p>
      </div>

      {/* Stats */}
      <div className="schedule-work-stats-wrapper">
        <div className="schedule-work-stat-card">
          <h3>{statistics?.regularShiftCount || 0}</h3>
          <p>Ca thường</p>
        </div>

        <div className="schedule-work-stat-card">
          <h3>{statistics?.extraShiftCount || 0}</h3>
          <p>Ca trực</p>
        </div>

        <div className="schedule-work-stat-card">
          <h3>{statistics?.leaveCount || 0}</h3>
          <p>Đơn nghỉ</p>
        </div>

        <div className="schedule-work-stat-card">
          <h3>{statistics?.weekendShiftCount || 0}</h3>
          <p>Ca cuối tuần</p>
        </div>
      </div>

      {/* Actions */}
      <div className="schedule-work-toolbar">
        <div className="schedule-view-toggle">
          <button
            className={viewMode === 'table' ? 'active' : ''}
            onClick={() => setViewMode('table')}
          >
            Dạng bảng
          </button>

          <button
            className={viewMode === 'calendar' ? 'active' : ''}
            onClick={() => setViewMode('calendar')}
          >
            Dạng lịch
          </button>
        </div>

        <div className="schedule-work-action-wrapper schedule-work-action-wrapper--left">
          <button onClick={() => setShowExtraShiftModal(true)}>
            Đăng ký ca trực
          </button>

          <button onClick={() => setShowWeekendModal(true)}>
            Đăng ký T7/CN
          </button>
        </div>

        <div className="schedule-work-filter-wrapper">
          {/* Year */}
          <select
            value={selectedYear}
            onChange={(e) => {
              const newYear = Number(e.target.value);
              setSelectedYear(newYear);

              const weekIndex = newYear === currentYear ? defaultWeekIndex : 0;
              setSelectedWeek(weekIndex);

              const r = getWeekRange(weekIndex);
              if (r) setRange(r);
            }}
          >
            {[2025, 2026, 2027].map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          {/* Week */}
          <select
            value={selectedWeek}
            onChange={(e) => {
              const weekIndex = Number(e.target.value);
              setSelectedWeek(weekIndex);

              const r = getWeekRange(weekIndex);
              if (r) setRange(r);
            }}
          >
            {weeksInYear.map((week) => (
              <option key={week.value} value={week.value}>
                {week.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      {viewMode === 'table' ? (
        <div className="schedule-work-table-wrapper">
          <table className="schedule-work-table">
            <thead>
              <tr>
                <th>Ngày</th>
                <th>Chuyên khoa</th>
                <th>Loại ca</th>
                <th>Thời gian</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>

            <tbody>
              {schedules.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className="empty-slots">Không có lịch làm việc</div>
                  </td>
                </tr>
              ) : (
                schedules.map((schedule) => (
                  <tr
                    key={schedule.id}
                    onClick={() => {
                      setSelectedSchedule(schedule);
                      fetchTimeSlots(schedule.id, schedule.doctorSpecialtyId);
                    }}
                  >
                    <td>
                      {schedule.dayLabel} ({schedule.date})
                    </td>

                    <td>{schedule.specialty?.name}</td>
                    <td>{getTypeLabel(schedule.type)}</td>

                    <td>
                      {formatHourMinute(schedule.startTime)} - {formatHourMinute(schedule.endTime)}
                    </td>

                    <td>
                      <span className={getStatusClass(schedule.status)}>
                        {getStatusLabel(schedule.status)}
                      </span>
                    </td>

                    <td>
                      <button
                      className="btn btn-outline-primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSchedule(schedule);
                          setShowLeaveModal(true);
                        }}
                      >
                        Xin nghỉ
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="schedule-calendar-wrapper">
          {DAYS.map((day, index) => {
            const daySchedules = groupedSchedules[index] || [];

            return (
              <div key={index} className="calendar-day-card">
                <div className="calendar-day-header">{day}</div>

                <div className="calendar-day-body">
                  {daySchedules.length === 0 ? (
                    <div className="calendar-empty">Không có ca</div>
                  ) : (
                    daySchedules.map((schedule) => (
                      <div
                        key={schedule.id}
                        className={`calendar-slot ${schedule.type.toLowerCase()}`}
                        onClick={() => {
                          setSelectedSchedule(schedule);
                          fetchTimeSlots(
                            schedule.id,
                            schedule.doctorSpecialtyId,
                          );
                        }}
                      >
                        <div className="calendar-slot-time small">
                          {schedule.date}
                        </div>

                        <div className="calendar-slot-time">
                          {formatHourMinute(schedule.startTime)} - {formatHourMinute(schedule.endTime)}
                        </div>

                        <div className="calendar-slot-specialty">
                          {schedule.specialty?.name}
                        </div>

                        <div className="calendar-slot-type">
                          {getTypeLabel(schedule.type)}
                        </div>

                        <span className={getStatusClass(schedule.status)}>
                          {getStatusLabel(schedule.status)}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      {selectedSchedule &&
        renderModalWrapper(
          <>
            <h3>Chi tiết thời gian</h3>

            <ul>
              {timeSlots.map((slot) => (
                <li key={slot.id} className="text-center">
                  {formatHourMinute(slot.startTime)} - {(slot.endTime)}
                </li>
              ))}
            </ul>

            <div className="schedule-work-modal-actions">
              <button onClick={closeAllModals}>Đóng</button>
            </div>
          </>,
        )}

      {/* Leave Modal */}
      {showLeaveModal &&
        renderModalWrapper(
          <>
            <h3>Xin nghỉ</h3>
            <textarea
              placeholder="Nhập lý do nghỉ..."
              value={leaveReason}
              onChange={(e) => setLeaveReason(e.target.value)}
            />

            <div className="schedule-work-modal-actions">
              <button onClick={handleLeaveRequest}>Gửi yêu cầu</button>
              <button onClick={closeAllModals}>Hủy</button>
            </div>
          </>,
        )}

      {/* Extra Shift Modal */}
      {showExtraShiftModal &&
        renderModalWrapper(
          <>
            <h3>Đăng ký ca trực</h3>

            <input
              type="date"
              value={extraShiftForm.date}
              onChange={(e) =>
                setExtraShiftForm({
                  ...extraShiftForm,
                  date: e.target.value,
                })
              }
            />

            <select
              value={extraShiftForm.specialty_id}
              onChange={(e) =>
                setExtraShiftForm({
                  ...extraShiftForm,
                  specialty_id: e.target.value,
                })
              }
            >
              <option value="">Chọn chuyên khoa</option>

              {specialties.map((sp) => (
                <option key={sp.id} value={sp.id}>
                  {sp.name}
                </option>
              ))}
            </select>

            <div className="schedule-work-modal-actions">
              <button onClick={handleRegisterExtraShift}>Đăng ký</button>
              <button onClick={closeAllModals}>Hủy</button>
            </div>
          </>,
        )}

      {/* Weekend Modal */}
      {showWeekendModal &&
        renderModalWrapper(
          <>
            <h3>Đăng ký làm T7/CN</h3>

            <input
              type="date"
              value={weekendForm.date}
              onChange={(e) =>
                setWeekendForm({
                  ...weekendForm,
                  date: e.target.value,
                })
              }
            />

            <select
              value={weekendForm.specialty_id}
              onChange={(e) =>
                setWeekendForm({
                  ...weekendForm,
                  specialty_id: e.target.value,
                })
              }
            >
              <option value="">Chọn chuyên khoa</option>

              {specialties.map((sp) => (
                <option key={sp.id} value={sp.id}>
                  {sp.name}
                </option>
              ))}
            </select>

            <div className="schedule-work-modal-actions">
              <button onClick={handleRegisterWeekend}>Đăng ký</button>
              <button onClick={closeAllModals}>Hủy</button>
            </div>
          </>,
        )}
    </div>
  );
}
