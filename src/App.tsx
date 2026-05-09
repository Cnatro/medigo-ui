import { BrowserRouter, Routes, Route } from 'react-router-dom';

import LoginPage from './modules/auth/LoginPage';
import RegisterPage from './modules/auth/RegisterPage';
import ProtectedRoute from './shared/components/ProtectedRoute';
import PublicRoute from './shared/components/PublicRoute';
import { AuthProvider } from './shared/components/AuthContext';
import ProfilePage from './modules/auth/ProfilePage';
import { DashboardDoctor } from './modules/doctor/DashboardDoctor';
import RoleRedirect from './shared/components/RoleRedirect';
import DoctorPage from './modules/paitent/DoctorPage';
import DoctorDetail from './modules/paitent/DoctorDetail';
import { DashboardDoctorLayout } from './modules/doctor/DashboardDoctorLayout';
import ScheduleAppointment from './modules/doctor/ScheduleAppointment';
import ScheduleWork from './modules/doctor/ScheduleWork';
import AdminLayout from './modules/admin/AdminLayout';
import DashboardHome from './modules/admin/DashboardHome';
import UsersManagement from './modules/admin/UsersManagement';
import ClinicsManagement from './modules/admin/ClinicesManagement';
import ScheuleManagement from './modules/admin/ScheduleManagement';
import PaymentsManagement from './modules/admin/PaymentsManagement';
import ScheduleRequestsManagement from './modules/admin/ScheduleRequestsManagement';
import SettingsManagement from './modules/admin/SettingsManagement';
import PatientAppointmentsPage from './modules/paitent/AppointmentsPage';
import PatientProfilePage from './modules/paitent/ProfilePage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <RoleRedirect />
              </ProtectedRoute>
            }
          />

          {/* <Route
            path="/doctor-dashboard"
            element={
              <ProtectedRoute>
                <DashboardDoctor />
              </ProtectedRoute>
            }
          /> */}

          <Route
            path="/doctor-page"
            element={
              <ProtectedRoute>
                <DoctorPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/doctors/:id"
            element={
              <ProtectedRoute>
                <DoctorDetail />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/patient"
            element={
              <ProtectedRoute>
                <PatientProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/appointments"
            element={
              <ProtectedRoute>
                <PatientAppointmentsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/doctor"
            element={
              <ProtectedRoute>
                <DashboardDoctorLayout />
              </ProtectedRoute>
            }
          >
            <Route
              path="dashboard"
              element={
                <ProtectedRoute>
                  <DashboardDoctor />
                </ProtectedRoute>
              }
            />
            <Route
              path="schedule-work"
              element={
                <ProtectedRoute>
                  <ScheduleWork />
                </ProtectedRoute>
              }
            />

            <Route
              path="schedule-appointment"
              element={
                <ProtectedRoute>
                  <ScheduleAppointment />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardHome />} />

            <Route path="dashboard" element={<DashboardHome />} />

            <Route path="users" element={<UsersManagement />} />

            <Route path="hospitals" element={<ClinicsManagement />} />

            <Route path="schedule" element={<ScheuleManagement />} />

            <Route path="payments" element={<PaymentsManagement />} />

            <Route
              path="schedule-requests"
              element={<ScheduleRequestsManagement />}
            />

            <Route path="settings" element={<SettingsManagement />} />
          </Route>

          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />

          <Route
            path="/register"
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
