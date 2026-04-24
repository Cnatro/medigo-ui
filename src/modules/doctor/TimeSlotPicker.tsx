/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import type { ScheduleDay, TimeSlot } from './doctorService';
import { doctorService } from './doctorService';

interface TimeSlotPickerProps {
  doctorId: string;
}

const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({ doctorId }) => {
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [scheduleDays, setScheduleDays] = useState<ScheduleDay[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSlots = async () => {
      if (!doctorId) return;

      setLoading(true);
      try {
        const today = new Date();
        const end = new Date();
        end.setDate(today.getDate() + 6);

        const formatDate = (d: Date) =>
          d.toISOString().split('T')[0];

        const res = await doctorService.getTimeSlots(
          doctorId,
          formatDate(today),
          formatDate(end)
        );

        const raw = res.data.data;

        console.log(raw);

        //  FIX CHÍNH Ở ĐÂY
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
          })
        );

        setScheduleDays(mapped);
      } catch (err) {
        console.error('Fetch slots error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, [doctorId]);

  const handleSlotClick = (slot: TimeSlot) => {
    if (slot.available && !slot.isBooked) {
      setSelectedSlot(slot);
    }
  };

  if (loading) return <div>Đang tải lịch...</div>;

  return (
    <div className="time-slot-picker">
      <div className="schedule-grid">
        {scheduleDays.map((day, dayIndex) => (
          <div key={dayIndex} className="day-column">
            <div className="day-header text-center mb-3">
              <div className="day-name small text-secondary">
                {day.dayOfWeek}
              </div>
              <div className="day-date small fw-semibold">{day.date}</div>
            </div>

            <div className="time-slots">
              {day.slots.map((slot) => (
                <button
                  key={slot.id}
                  className={`time-slot-btn w-100 mb-2 py-2 rounded-2 ${
                    slot.isBooked
                      ? 'booked'
                      : selectedSlot?.id === slot.id
                      ? 'selected'
                      : 'available'
                  }`}
                  onClick={() => handleSlotClick(slot)}
                  disabled={slot.isBooked || !slot.available}
                >
                  {slot.time}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimeSlotPicker;