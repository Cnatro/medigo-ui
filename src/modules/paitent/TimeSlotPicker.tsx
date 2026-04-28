/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import type { ScheduleDay, TimeSlot } from './doctorService';
import { doctorService } from './doctorService';
import './styles/timeslot.css';
import logo from '@/images/logo.png'; // Import logo trực tiếp

interface TimeSlotPickerProps {
  doctorSpecialtyId: string;
  weekOffset: number;
  getWeek: (offset: number) => { monday: Date; sunday: Date };
}

// Component loading inline đơn giản
const InlineLoading: React.FC<{ message?: string }> = ({
  message = 'Đang tải lịch khám',
}) => {
  return (
    <div className="inline-loading">
      <div className="inline-loading-logo">
        <img src={logo} alt="Loading" />
        <div className="inline-loading-ring"></div>
      </div>
      <div className="inline-loading-text">
        {message}
        <div className="inline-loading-dots">
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </div>
      </div>
    </div>
  );
};

const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  doctorSpecialtyId,
  weekOffset,
  getWeek,
}) => {
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [scheduleDays, setScheduleDays] = useState<ScheduleDay[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSlots = async () => {
      if (!doctorSpecialtyId) return;

      setLoading(true);
      try {
        const { monday, sunday } = getWeek(weekOffset);
        const formatDate = (d: Date) => d.toISOString().split('T')[0];

        const res = await doctorService.getTimeSlots(
          doctorSpecialtyId,
          formatDate(monday),
          formatDate(sunday),
        );

        const raw = res.data.data;

        const mapped: ScheduleDay[] = Object.entries(raw).map(
          ([date, slots]: any) => ({
            date: new Date(date).toLocaleDateString('vi-VN'),
            dayOfWeek: new Date(date).toLocaleDateString('vi-VN', {
              weekday: 'long',
            }),
            slots: slots.map((s: any) => ({
              id: s.id,
              time: `${s.start_time} - ${s.end_time}`,
              available: s.is_available,
              isBooked: !s.is_available,
            })),
          }),
        );

        setScheduleDays(mapped);
      } catch (err) {
        console.error('Fetch slots error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, [doctorSpecialtyId, weekOffset, getWeek]);

  const handleSlotClick = (slot: TimeSlot) => {
    if (slot.available && !slot.isBooked) {
      setSelectedSlot(slot);
    }
  };

  // Loading state - hiển thị inline loading giữa khung
  if (loading) {
    return (
      <div className="timeslot-loading-container">
        <InlineLoading message="Đang tải lịch khám" />
      </div>
    );
  }

  return (
    <div className="time-slot-picker">
      {scheduleDays.length === 0 ? (
        <div className="empty-slots">
          <i className="fas fa-calendar-times"></i>
          <p>Không có lịch trống trong tuần này</p>
          <span>Vui lòng chọn tuần khác</span>
        </div>
      ) : (
        <div className="schedule-wrapper">
          <div className="schedule-grid">
            {scheduleDays.map((day, dayIndex) => (
              <div key={dayIndex} className="day-column">
                <div className="day-header">
                  <div className="day-name">{day.dayOfWeek}</div>
                  <div className="day-date">{day.date}</div>
                </div>

                <div className="time-slots">
                  {day.slots.map((slot) => (
                    <button
                      key={slot.id}
                      className={`time-slot-btn ${
                        slot.isBooked
                          ? 'booked'
                          : selectedSlot?.id === slot.id
                            ? 'selected'
                            : 'available'
                      }`}
                      onClick={() => handleSlotClick(slot)}
                      disabled={slot.isBooked || !slot.available}
                    >
                      <i className="far fa-clock"></i>
                      {slot.time}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeSlotPicker;
