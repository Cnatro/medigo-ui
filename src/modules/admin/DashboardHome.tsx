import { useEffect } from 'react';
import ScreenLoading from '../../shared/utils/loading';
import { useAdmin } from './hooks/useAdmin';
import RecentAppointmentsTable from './RecentAppointmentsTable';
import StatCard from './StatCard';
import TopDoctorsList from './TopDoctorsList';
import WeeklyAppointmentsChart from './WeeklyAppointmentsChart';

const DashboardHome = () => {
  const { dashboardOverview, loading, fetchDashboardOverview } = useAdmin();

  useEffect(() => {
    fetchDashboardOverview();
  }, []);

  if (loading) {
    return (
      <div className="p-5 text-center">
        <ScreenLoading message="Đang tải..." />
      </div>
    );
  }

  return (
    <>
      <div className="dashboard-header">
        <h1>Dashboard</h1>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-xl-3 col-md-6">
          <StatCard
            title="Tổng bệnh nhân"
            value={dashboardOverview?.stats?.total_patients}
          />
        </div>
        <div className="col-xl-3 col-md-6">
          <StatCard
            title="Lịch hẹn tháng này"
            value={dashboardOverview?.stats?.monthly_appointments}
          />
        </div>

        <div className="col-xl-3 col-md-6">
          <StatCard
            title="Thời gian chờ"
            value={dashboardOverview?.stats?.average_wait_time || 'N/A'}
          />
        </div>

        <div className="col-xl-3 col-md-6">
          <StatCard
            title="Tỉ lệ hài lòng"
            value={`${dashboardOverview?.stats?.satisfaction_rate}%`}
          />
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-xl-6">
          <div className="card-custom">
            <div className="card-header-custom">
              <h3>Lịch hẹn trong tuần</h3>
            </div>

            <div className="card-body">
              <WeeklyAppointmentsChart
                data={dashboardOverview?.weekly_appointments || []}
              />
            </div>
          </div>
        </div>

        <div className="col-xl-6">
          <div className="card-custom">
            <div className="card-header-custom">
              <h3>Bác sĩ hàng đầu</h3>
            </div>

            <div className="card-body">
              <TopDoctorsList doctors={dashboardOverview?.top_doctors || []} />
            </div>
          </div>
        </div>
      </div>

      <div className="card-custom">
        <div className="card-header-custom">
          <h3>Lịch hẹn gần đây</h3>
        </div>

        <div className="card-body">
          <RecentAppointmentsTable
            appointments={dashboardOverview?.recent_appointments || []}
          />
        </div>
      </div>
    </>
  );
};

export default DashboardHome;
