import './styles/ScheduleAppointment..css';
import useAppointment from './hooks/useAppointment';

const ScheduleAppointment = () => {
  const today = new Date();
  const currentYear = today.getFullYear();

  const {
    selectedYear,
    setSelectedYear,
    selectedWeek,
    setSelectedWeek,
    selectedSpecialty,
    setSelectedSpecialty,
    selectedSlot,
    setSelectedSlot,

    availableCount,
    bookedCount,
    closedCount,


    weeksInYear,
    timeRanges,
    currentWeekDays,
    getSlot,
    getSlotClass,

    specialties,
    defaultWeekIndex,
  } = useAppointment();

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
          <option value="all">Tất cả chuyên khoa</option>
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
                <strong>Bệnh nhân:</strong> {selectedSlot.patient.name}
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
