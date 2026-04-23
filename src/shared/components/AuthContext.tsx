/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  currentUserApi,
  loginApi,
  registerApi,
  updateCurrentUserApi,
  type LoginPayload,
  type RegisterPayload,
} from '../../modules/auth/authService';
import { handleApiError } from '../utils/error';

interface PatientProfile {
  date_of_birth: string;
  gender: string;
}

interface DoctorProfile {
  specialty: string;
  experience: number;
  clinic?: string;
}

interface User {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  avatar_url?: string | null;
  role: string;
  profile: PatientProfile | DoctorProfile;
}

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
  login: (data: LoginPayload) => Promise<void>;
  register: (data: RegisterPayload) => Promise<void>;
  logout: () => void;
  fetchCurrentUser: () => Promise<void>;
  updateCurrentUser: (formData: FormData) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCurrentUser = async () => {
    try {
      const res = await currentUserApi();

      if (res.status === 200) {
        setCurrentUser(res.data['data']);
      }
    } catch (err) {
      console.error('Fetch user error:', err);
    }
  };

  const login = async (data: LoginPayload) => {
    try {
      setIsLoading(true);
      setError(null);

      const res = await loginApi(data);

      if (res.status === 200) {
        localStorage.setItem('token', res.data.data.access_token);

        await fetchCurrentUser();

        navigate('/');
      }
    } catch (err: any) {
      const msg = handleApiError(err);
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterPayload) => {
    try {
      setIsLoading(true);
      setError(null);

      const res = await registerApi(data);

      if (res.status === 201) {
        alert('Đăng ký thành công!');
        navigate('/login');
      }
    } catch (err: any) {
      const msg = handleApiError(err);
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    navigate('/login');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchCurrentUser();
    }
  }, []);

  const updateCurrentUser = async (formData: FormData) => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('Updating user with data:', formData);
      await updateCurrentUserApi(formData);
      await fetchCurrentUser();
    } catch (err: any) {
      const msg = handleApiError(err);
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoading,
        error,
        login,
        register,
        logout,
        fetchCurrentUser,
        updateCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
