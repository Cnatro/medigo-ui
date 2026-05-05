import React, { useMemo, useState } from 'react';
import {
  startOfYear,
  endOfYear,
  eachWeekOfInterval,
  endOfWeek,
  addDays,
  format,
  parse,
  isWithinInterval,
} from 'date-fns';

import './styles/ScheduleAppointment..css';
import { specialties, timeRanges, timeSlots, weekDays, type TimeSlot, type WeekItem } from './service/scheduleAppointmentService';

const ScheduleAppointment = () => {
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

 
  const [selectedWeek, setSelectedWeek] = useState(defaultWeekIndex);

  const [selectedSpecialty, setSelectedSpecialty] = useState('all');

  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

 
  const currentWeek = weeksInYear[selectedWeek];

  const currentWeekDays = useMemo(() => {
    if (!currentWeek) return [];

    return Array.from({ length: 7 }, (_, i) => {
      const date = addDays(currentWeek.start, i);

      return {
        label: weekDays[i],
        fullDate: date,
        dateText: format(date, 'dd/MM'),
      };
    });
  }, [currentWeek]);

  const filteredSlots = useMemo(() => {
    let result = [...timeSlots];

    // filter specialty
    if (selectedSpecialty !== 'all') {
      result = result.filter((slot) => slot.specialtyId === selectedSpecialty);
    }

    // filter week
    if (currentWeek) {
      result = result.filter((slot) => {
        const slotDate = parse(slot.date, 'dd/MM/yyyy', new Date());

        return isWithinInterval(slotDate, {
          start: currentWeek.start,
          end: currentWeek.end,
        });
      });
    }

    return result;
  }, [selectedSpecialty, currentWeek]);

  const getSlot = (date: Date, time: string) => {
    return filteredSlots.find((slot) => {
      const slotDate = parse(slot.date, 'dd/MM/yyyy', new Date());

      return (
        format(slotDate, 'dd/MM/yyyy') === format(date, 'dd/MM/yyyy') &&
        slot.start === time
      );
    });
  };


  const getSlotClass = (status?: string) => {
    switch (status) {
      case 'available':
        return 'slot available';
      case 'booked':
        return 'slot booked';
      case 'closed':
        return 'slot closed';
      default:
        return 'slot empty';
    }
  };


  const availableCount = filteredSlots.filter(
    (s) => s.status === 'available',
  ).length;

  const bookedCount = filteredSlots.filter((s) => s.status === 'booked').length;

  const closedCount = filteredSlots.filter((s) => s.status === 'closed').length;

  return (
    <div className="schedule-page">
      {/* Header */}
      <div className="schedule-header">
        <div>
          <h2>Quản lý lịch khám</h2>
          {/* <p>Tự động chọn tuần hiện tại</p> */}
        </div>

        {/* <button className="create-btn">+ Tạo slot mới</button> */}
      </div>

      {/* Stats */}
      {/* Stats */}
      <div className="stats-wrapper">
        <div className="stat-card available">
          <div className="stat-icon">
            <i className="fa-solid fa-circle-check"></i>
          </div>

          <div className="stat-content">
            <h3>{availableCount}</h3>
            <p>Slot trống</p>
          </div>
        </div>

        <div className="stat-card booked">
          <div className="stat-icon">
            <i className="fa-solid fa-calendar-check"></i>
          </div>

          <div className="stat-content">
            <h3>{bookedCount}</h3>
            <p>Đã đặt lịch</p>
          </div>
        </div>

        <div className="stat-card closed">
          <div className="stat-icon">
            <i className="fa-solid fa-lock"></i>
          </div>

          <div className="stat-content">
            <h3>{closedCount}</h3>
            <p>Đã đóng</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filter-wrapper">
        {/* Year */}
        <select
          value={selectedYear}
          onChange={(e) => {
            const newYear = Number(e.target.value);

            setSelectedYear(newYear);

            if (newYear === currentYear) {
              setSelectedWeek(defaultWeekIndex);
            } else {
              setSelectedWeek(0);
            }
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
          onChange={(e) => setSelectedWeek(Number(e.target.value))}
        >
          {weeksInYear.map((week) => (
            <option key={week.value} value={week.value}>
              {week.label}
            </option>
          ))}
        </select>

        {/* Specialty */}
        <select
          value={selectedSpecialty}
          onChange={(e) => setSelectedSpecialty(e.target.value)}
        >
          {specialties.map((sp) => (
            <option key={sp.id} value={sp.id}>
              {sp.name}
            </option>
          ))}
        </select>
      </div>

      {/* Calendar */}
      <div className="calendar-wrapper">
        <table className="calendar-table">
          <thead>
            <tr>
              <th>Giờ</th>

              {currentWeekDays.map((day) => (
                <th key={day.dateText}>
                  <div>{day.label}</div>

                  <small>{day.dateText}</small>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {timeRanges.map((time) => (
              <tr key={time}>
                <td className="time-column">{time}</td>

                {currentWeekDays.map((day) => {
                  const slot = getSlot(day.fullDate, time);

                  return (
                    <td
                      key={`${day.dateText}-${time}`}
                      className={getSlotClass(slot?.status)}
                      onClick={() => slot && setSelectedSlot(slot)}
                    >
                      {slot?.status === 'booked' && '👤'}

                      {slot?.status === 'available' && '✔'}

                      {slot?.status === 'closed' && '🔒'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selectedSlot && (
        <div
          className="slot-modal-overlay"
          onClick={() => setSelectedSlot(null)}
        >
          <div className="slot-modal" onClick={(e) => e.stopPropagation()}>
            <h4>Chi tiết lịch</h4>

            <p>
              <strong>Ngày:</strong> {selectedSlot.date}
            </p>

            <p>
              <strong>Chuyên khoa:</strong> {selectedSlot.specialtyName}
            </p>

            <p>
              <strong>Giờ:</strong> {selectedSlot.start} - {selectedSlot.end}
            </p>

            {selectedSlot.patient && (
              <p>
                <strong>Bệnh nhân:</strong> {selectedSlot.patient}
              </p>
            )}

            <button className="close-btn" onClick={() => setSelectedSlot(null)}>
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleAppointment;
