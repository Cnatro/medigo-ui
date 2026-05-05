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

          {/* <Route
            path="/doctor/schedule-work"
            element={
              <ProtectedRoute>
                <ScheduleWork />
              </ProtectedRoute>
            }
          /> */}

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
