import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const RoleRedirect = () => {
  const { currentUser, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  const role = currentUser.role?.toLowerCase();

  if (role === 'DOCTOR') {
    return <Navigate to="/doctor-dashboard" />;
  }

  if (role === 'PATIENT') {
    return <Navigate to="/doctor-page" />;
  }

  return <Navigate to="/login" />;
};

export default RoleRedirect;