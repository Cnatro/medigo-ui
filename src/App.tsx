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

      
          <Route
            path="/doctor-dashboard"
            element={
              <ProtectedRoute>
                <DashboardDoctor />
              </ProtectedRoute>
            }
          />

    
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