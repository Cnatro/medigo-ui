/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import type { ScheduleDay, TimeSlot } from './doctorService';

interface TimeSlotPickerProps {
  doctorId: string;
}

const TimeSlotPicker: React.FC<TimeSlotPickerProps> = () => {
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  // Mock data - sẽ được thay thế bằng API call
  const scheduleDays: ScheduleDay[] = [
    {
      date: '19/4/2026',
      dayOfWeek: 'Chủ nhật',
      slots: [
        { id: '1', time: '08:00', available: true },
        { id: '2', time: '08:30', available: true },
        { id: '3', time: '09:00', available: true },
        { id: '4', time: '09:30', available: true },
        { id: '5', time: '10:00', available: false, isBooked: true },
      ],
    },
    {
      date: '20/4/2026',
      dayOfWeek: 'Thứ 2',
      slots: [
        { id: '6', time: '08:00', available: true },
        { id: '7', time: '08:30', available: false, isBooked: true },
        { id: '8', time: '09:00', available: true },
        { id: '9', time: '09:30', available: true },
      ],
    },
    {
      date: '21/4/2026',
      dayOfWeek: 'Thứ 3',
      slots: [
        { id: '10', time: '08:00', available: true },
        { id: '11', time: '08:30', available: true },
        { id: '12', time: '09:00', available: false, isBooked: true },
      ],
    },
    {
      date: '22/4/2026',
      dayOfWeek: 'Thứ 4',
      slots: [
        { id: '13', time: '08:00', available: true },
        { id: '14', time: '08:30', available: true },
        { id: '15', time: '09:00', available: true },
      ],
    },
    {
      date: '23/4/2026',
      dayOfWeek: 'Thứ 5',
      slots: [
        { id: '16', time: '08:00', available: true },
        { id: '17', time: '08:30', available: false, isBooked: true },
      ],
    },
    {
      date: '24/4/2026',
      dayOfWeek: 'Thứ 6',
      slots: [
        { id: '18', time: '08:00', available: true },
        { id: '19', time: '08:30', available: true },
        { id: '20', time: '09:00', available: true },
      ],
    },
    {
      date: '25/4/2026',
      dayOfWeek: 'Thứ 7',
      slots: [
        { id: '21', time: '08:00', available: true },
        { id: '22', time: '08:30', available: true },
      ],
    },
  ];

  const handleSlotClick = (slot: TimeSlot) => {
    if (slot.available && !slot.isBooked) {
      setSelectedSlot(slot);
    }
  };

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
