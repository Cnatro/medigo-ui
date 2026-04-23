/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginApi, registerApi, type LoginPayload, type RegisterPayload } from '../authService';
import { handleApiError } from '../../../shared/utils/error';

export const useAuth = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (data: LoginPayload) => {
    try {
      setIsLoading(true);
      setError(null);

      const res = await loginApi(data);

      if (res.status === 200) {
        localStorage.setItem('token', res.data.data.access_token);
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
    navigate('/login');
  };

  return { login, register, logout, isLoading, error };
};