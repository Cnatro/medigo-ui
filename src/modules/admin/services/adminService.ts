/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosClient from '../../../api/axiosClient';

const ADMIN_PREFIX = '/admin';

export const adminService = {
  // dashboard overview
  getDashboardOverview: async () => {
    const res = await axiosClient.get(`${ADMIN_PREFIX}/dashboard/overview`);
    return res.data.data;
  },

  // users
  getUsers: async ({
    page,
    limit,
    filters,
  }: {
    page: number;
    limit: number;
    filters: {
      search: string;
      role: string;
    };
  }) => {
    const res = await axiosClient.get(`${ADMIN_PREFIX}/users`, {
      params: {
        page,
        limit,
        'filter[search]': filters.search,
        'filter[role]': filters.role,
      },
    });
    return res.data.data;
  },

  // clinics
  getClinics: async () => {
    const res = await axiosClient.get(`${ADMIN_PREFIX}/clinics`);
    return res.data.data;
  },

  // schedules
  getSchedules: async ({
    page,
    limit,
    filters,
  }: {
    page: number;
    limit: number;
    filters: {
      doctor_name: string;
      clinic_id: string;
      specialty_id: string;
    };
  }) => {
    const res = await axiosClient.get(`${ADMIN_PREFIX}/schedules`, {
      params: {
        page,
        limit,
        'filter[doctor_name]': filters.doctor_name,
        'filter[clinic_id]': filters.clinic_id,
        'filter[specialty_id]': filters.specialty_id,
      },
    });

    return res.data.data;
  },

  // payment stats
  getPaymentStats: async () => {
    const res = await axiosClient.get(`${ADMIN_PREFIX}/payments/stats`);
    return res.data.data;
  },

  // payments list
  getPayments: async (filter: any) => {
    const res = await axiosClient.get(`${ADMIN_PREFIX}/payments`, {
      params: filter,
    });
    return res.data.data;
  },

  // settings
  getSettings: async () => {
    const res = await axiosClient.get(`${ADMIN_PREFIX}/settings`);
    return res.data.data;
  },

  approveScheduleRequest: async (id: string) => {
    const res = await axiosClient.patch(
      `${ADMIN_PREFIX}/schedule-requests/${id}/approve`,
    );
    return res.data;
  },

  rejectScheduleRequest: async (id: string) => {
    const res = await axiosClient.patch(
      `${ADMIN_PREFIX}/schedule-requests/${id}/reject`,
    );
    return res.data;
  },

  getScheduleRequests: async () => {
    const res = await axiosClient.get(`${ADMIN_PREFIX}/schedule-requests`);
    return res.data;
  },

  getSpecialties: async () => {
    const res = await axiosClient.get(`/specialties/all`);
    return res.data.data;
  },
  registerUser: async (payload: any) => {
    const res = await axiosClient.post('/auth/register', payload);
    return res;
  },
  getDetailDoctor: async (id: string) => {
    const res = await axiosClient.get(`${ADMIN_PREFIX}/doctors/${id}`);
    return res.data.data;
  },
  createSchedule: async (payload: any) => {
    const res = await axiosClient.post(`/schedules`, payload);
    return res;
  },
};
