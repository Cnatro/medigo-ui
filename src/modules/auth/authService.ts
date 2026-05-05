import axiosClient from '../../api/axiosClient';

export interface LoginPayload {
  email: string;
  password: string;
}

export type RegisterPayload =
  | {
      full_name: string;
      email: string;
      password: string;
      role: 'DOCTOR';
      profile: {
        bio: string;
        experience_years: number;
        clinic_id: string;
      };
    }
  | {
      full_name: string;
      email: string;
      password: string;
      role: 'PATIENT';
      profile: {
        date_of_birth: string;
        gender: 'MALE' | 'FEMALE';
      };
    };

export const loginApi = (data: LoginPayload) => {
  return axiosClient.post('/auth/login', data);
};

export const registerApi = (data: RegisterPayload) => {
  return axiosClient.post('/auth/register', data);
};

export const currentUserApi = () => {
  return axiosClient.get('/users/me');
};

export const updateCurrentUserApi = (formData: FormData) => {
  return axiosClient.patch('/users/me', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
