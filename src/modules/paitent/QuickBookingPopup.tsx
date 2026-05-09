/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import './styles/quick-booking-popup.css';
import type { Doctor } from './service/doctorService';
import TimeSlotPicker from './TimeSlotPicker';
import InfoAppointment from './InfoAppointment';

interface Props {
  doctor: Doctor;
  onClose: () => void;
}

const QuickBookingPopup: React.FC<Props> = ({ doctor, onClose }) => {
  const [selectedSpecialty, setSelectedSpecialty] = useState(
    doctor.specialties?.[0]?.doctorSpecialtyId || '',
  );

  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<any>(null);
  const [showInfoPopup, setShowInfoPopup] = useState(false);
  const [showBookingStep, setShowBookingStep] = useState(true);

  // NEW
  const [weekOffset, setWeekOffset] = useState(0);

  const selectedSpecialtyData = doctor.specialties.find(
    (s) => s.doctorSpecialtyId === selectedSpecialty,
  );

  const selectedPrice = selectedSpecialtyData?.price;

  const getWeek = (offset = 0) => {
    const now = new Date();

    const monday = new Date(now);
    const day = now.getDay();

    const diff = day === 0 ? -6 : 1 - day;
    monday.setDate(now.getDate() + diff + offset * 7);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    return { monday, sunday };
  };

  const getWeekRange = ({ monday, sunday }: { monday: Date; sunday: Date }) => {
    const format = (d: Date) =>
      `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;

    return `${format(monday)} - ${format(sunday)}`;
  };

  return (
    <>
      {showBookingStep && (
        <div className="booking-overlay">
          <div className="booking-modal">
            {/* doctor info */}
            <div className="booking-doctor-info">
              <div className="doctor-avatar-small">
                <i className="fas fa-user-md"></i>
              </div>

              <div>
                <h5>{doctor.name}</h5>
                <p>
                  {doctor.specialties.map((s) => s.name).join(', ')} •{' '}
                  {doctor.clinic}
                </p>
              </div>
            </div>

            {/* specialty */}
            <div className="mb-3">
              <label className="booking-label">Chọn chuyên khoa</label>

              <select
                className="form-select"
                value={selectedSpecialty}
                onChange={(e) => {
                  setSelectedSpecialty(e.target.value);

                  // reset slot khi đổi chuyên khoa
                  setSelectedSlot(null);
                  setSelectedDate(null);
                }}
              >
                {doctor.specialties.map((s) => (
                  <option key={s.doctorSpecialtyId} value={s.doctorSpecialtyId}>
                    {s.name} - {s.price.toLocaleString('vi-VN')}đ
                  </option>
                ))}
              </select>
            </div>

            {/* week navigation */}
            <div className="booking-week-header">
              <h6>Chọn ngày & giờ khám</h6>

              <div className="week-navigation">
                <button
                  className="week-nav-btn"
                  disabled={weekOffset === 0}
                  onClick={() => setWeekOffset((prev) => Math.max(0, prev - 1))}
                >
                  <i className="fas fa-chevron-left"></i>
                </button>

                <span className="week-range">
                  {getWeekRange(getWeek(weekOffset))}
                </span>

                <button
                  className="week-nav-btn"
                  disabled={weekOffset === 4}
                  onClick={() => setWeekOffset((prev) => Math.min(4, prev + 1))}
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>

            {/* time picker */}
            <TimeSlotPicker
              doctorSpecialtyId={selectedSpecialty}
              weekOffset={weekOffset}
              getWeek={getWeek}
              onSelectSlot={setSelectedSlot}
              onSelectDate={setSelectedDate}
            />

            {/* footer */}
            <div className="booking-footer">
              <button className="btn-cancel" onClick={onClose}>
                Hủy
              </button>

              <button
                className="btn-next"
                disabled={!selectedSlot}
                onClick={() => {
                  setShowBookingStep(false); // ẩn step chọn lịch
                  setShowInfoPopup(true); // mở step info
                }}
              >
                Tiếp tục
              </button>
            </div>
          </div>
        </div>
      )}

      {showInfoPopup && (
        <InfoAppointment
          doctor={doctor}
          selectedSlot={selectedSlot}
          selectedDate={selectedDate}
          doctorSpecialtyId={selectedSpecialty}
          amount={selectedPrice}
          onClose={() => {
            // quay lại step chọn lịch
            setShowInfoPopup(false);
            setShowBookingStep(true);
          }}
          onFinish={() => {
            // đóng toàn bộ flow sau confirm
            onClose();
          }}
        />
      )}
    </>
  );
};

export default QuickBookingPopup;
