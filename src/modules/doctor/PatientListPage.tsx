import { useNavigate } from 'react-router-dom';
import './styles/PatientListPage.css';
import { usePatient } from './hooks/usePatient';
import { useAuth } from '../../shared/components/AuthContext';
import ScreenLoading from '../../shared/utils/loading';

const PatientListPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const { patients, loading, error } = usePatient(
    currentUser?.profile?.id || null,
  );

  const handleViewDetail = (id: string) => {
    navigate(`/doctor/patients/${id}`);
  };

  if (loading) {
    return <ScreenLoading message="Đang tải..." show={loading} />;
  }

  return (
    <div className="patient-list-page container-fluid p-4">
      <div className="card shadow-sm">
        <div className="card-header bg-white">
          <h5>Danh sách bệnh nhân chờ khám</h5>
        </div>

        <div className="card-body p-0">
          {error && <div className="p-3 text-danger">{error}</div>}

          {patients.length === 0 ? (
            <div className="empty-slots">
              <i className="fas fa-calendar-times"></i>
              <p>Không có bệnh nhân trống trong tuần này</p>
            </div>
          ) : (
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>Mã BN</th>
                  <th>Họ tên</th>
                  <th>Ngày khám</th>
                  <th>Giới tính</th>
                  <th>SĐT</th>
                  <th>Trạng thái</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {patients.map((p) => (
                  <tr key={p.id}>
                    <td className="patient-id">
                      {`BN${p.patientId.replace(/-/g, '').slice(0, 6)}`}
                    </td>
                    <td>{p.name}</td>
                    <td>{p.examDate}</td>

                    <td>
                      <span
                        className={`gender-badge ${
                          p.gender === 'MALE' ? 'gender-male' : 'gender-female'
                        }`}
                      >
                        {p.gender === 'MALE' ? 'Nam' : 'Nữ'}
                      </span>
                    </td>

                    <td>{p.phone}</td>

                    <td>
                      {p.status === 'CONFIRMED' ? 'Đang chờ khám' : 'Đã khám'}
                    </td>

                    <td>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleViewDetail(p.id)}
                      >
                        Xem chi tiết
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientListPage;
