/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import './styles/create-schedule-popup.css';
import { useAdmin } from './hooks/useAdmin';
import ScreenLoading from '../../shared/utils/loading';

interface Props {
  doctor: any;
  onClose: () => void;
}

const CreateSchedulePopup = ({ doctor, onClose }: Props) => {
  const [specialty, setSpecialty] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const { userDetail, getDetailDoctor, loading, createSchedule } = useAdmin();
//   const navigate = useNavigate();

  useEffect(() => {
    getDetailDoctor(doctor?.doctor_id);
  }, []);

  const handleSubmit = async () => {
    try {
      const payload = {
        doctor_id: doctor.doctor_id,
        doctor_name: doctor.name,
        specialty_id: specialty,
        start_date: fromDate,
        end_date: toDate,
      };
     await createSchedule(payload);

    //   const doctorName = res?.doctor_name;

      onClose();

    //   navigate(
    //     `/admin/schedules?doctor_name=${encodeURIComponent(doctorName)}`,
    //   );
    } catch (error) {
      alert('Tạo lịch thất bại. Vui lòng thử lại.');
      console.log(error);
    }
  };

  if (loading) {
    return (
      <div className="users-loading">
        <ScreenLoading message="Đang tải..." />
      </div>
    );
  }

  return (
    <>
      {!loading && (
        <div className="schedule-popup">
          <div className="schedule-header">
            <h3>Tạo lịch làm việc</h3>
            <button onClick={onClose}>
              <i className="bi bi-x-lg"></i>
            </button>
          </div>

          <p className="doctor-name">
            Bác sĩ: <strong>{doctor.name}</strong>
          </p>

          <div className="form-group">
            <label>Chuyên khoa</label>
            <select
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
            >
              <option value="">Chọn chuyên khoa</option>
              {userDetail?.specialties.map((sp: any) => (
                <option key={sp.id} value={sp.id}>
                  {sp.name}
                </option>
              ))}
            </select>
          </div>

          <div className="date-row">
            <div className="form-group">
              <label>Từ ngày</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Đến ngày</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
          </div>

          <div className="schedule-note">
            Nếu chọn từ thứ 2 tuần sau, hệ thống sẽ tự động tạo lịch mặc định từ
            7:00 - 17:00.
          </div>

          <div className="schedule-actions">
            <button className="cancel-btn" onClick={onClose}>
              Hủy
            </button>

            <button className="submit-btn" onClick={handleSubmit}>
              Tạo lịch
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateSchedulePopup;
