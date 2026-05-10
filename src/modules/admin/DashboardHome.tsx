/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react';
import ScreenLoading from '../../shared/utils/loading';
import { useAdmin } from './hooks/useAdmin';
import RecentAppointmentsTable from './RecentAppointmentsTable';
import StatCard from './StatCard';
import TopDoctorsList from './TopDoctorsList';
import WeeklyAppointmentsChart from './WeeklyAppointmentsChart';
import AppointmentStatusChart from './AppointmentStatusChart';
import RevenueChart from './RevenueChart';

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

  const weeklyData = dashboardOverview?.weekly_appointments || [];
  const revenueData = dashboardOverview?.revenue_chart || [];

  const appointmentStatusData = Object.entries(
    dashboardOverview?.appointment_status_summary || {},
  ).map(([status, count]) => ({
    status,
    count,
  }));

  const uniqueDoctors =
    dashboardOverview?.top_doctors?.filter(
      (doctor: any, index: number, self: any[]) =>
        index === self.findIndex((d: any) => d.doctor_id === doctor.doctor_id),
    ) || [];

  const recentAppointments =
    dashboardOverview?.recent_appointments?.map((item: any) => ({
      ...item,
      date_time: new Date(item.date_time).toLocaleString('vi-VN'),
    })) || [];

  const averageWaitTime =
    dashboardOverview?.stats?.average_wait_time !== null &&
    dashboardOverview?.stats?.average_wait_time !== undefined
      ? `${dashboardOverview.stats.average_wait_time} phút`
      : 'N/A';

  return (
    <>
      <div className="dashboard-header">
        <h1>Dashboard</h1>
      </div>

      {/* Stats */}
      <div className="row g-4 mb-4">
        <div className="col-xl-3 col-md-6">
          <StatCard
            title="Tổng bệnh nhân"
            value={dashboardOverview?.stats?.total_patients || 0}
          />
        </div>

        <div className="col-xl-3 col-md-6">
          <StatCard
            title="Lịch hẹn tháng này"
            value={dashboardOverview?.stats?.monthly_appointments || 0}
          />
        </div>

        <div className="col-xl-3 col-md-6">
          <StatCard title="Thời gian chờ" value={averageWaitTime} />
        </div>

        <div className="col-xl-3 col-md-6">
          <StatCard
            title="Tỉ lệ hài lòng"
            value={`${dashboardOverview?.stats?.satisfaction_rate || 0}%`}
          />
        </div>
      </div>

      {/* Weekly + Revenue */}
      <div className="row g-4 mb-4">
        <div className="col-xl-6">
          <div className="card-custom">
            <div className="card-header-custom">
              <h3>Lịch hẹn trong tuần</h3>
            </div>

            <div className="card-body">
              <WeeklyAppointmentsChart data={weeklyData} />
            </div>
          </div>
        </div>

        <div className="col-xl-6">
          <div className="card-custom">
            <div className="card-header-custom">
              <h3>Doanh thu tuần này</h3>
            </div>

            <div className="card-body">
              <RevenueChart data={revenueData} />
            </div>
          </div>
        </div>
      </div>

      {/* Status + Top doctors */}
      <div className="row g-4 mb-4">
        <div className="col-xl-6">
          <div className="card-custom">
            <div className="card-header-custom">
              <h3>Trạng thái lịch hẹn</h3>
            </div>

            <div className="card-body">
              <AppointmentStatusChart data={appointmentStatusData} />
            </div>
          </div>
        </div>

        <div className="col-xl-6">
          <div className="card-custom">
            <div className="card-header-custom">
              <h3>Bác sĩ hàng đầu</h3>
            </div>

            <div className="card-body">
              <TopDoctorsList doctors={uniqueDoctors} />
            </div>
          </div>
        </div>
      </div>

      {/* Recent appointments */}
      <div className="card-custom">
        <div className="card-header-custom">
          <h3>Lịch hẹn gần đây</h3>
        </div>

        <div className="card-body">
          <RecentAppointmentsTable appointments={recentAppointments} />
        </div>
      </div>
    </>
  );
};

export default DashboardHome;
