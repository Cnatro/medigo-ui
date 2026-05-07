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
  getUsers: async () => {
    const res = await axiosClient.get(`${ADMIN_PREFIX}/users`);
    return res.data.data;
  },

  // clinics
  getClinics: async () => {
    const res = await axiosClient.get(`${ADMIN_PREFIX}/clinics`);
    return res.data.data;
  },

  // schedules
  getSchedules: async () => {
    const res = await axiosClient.get(`${ADMIN_PREFIX}/schedules`);
    return res.data.data;
  },

  // payment stats
  getPaymentStats: async () => {
    const res = await axiosClient.get(`${ADMIN_PREFIX}/payments/stats`);
    return res.data.data;
  },

  // payments list
  getPayments: async () => {
    const res = await axiosClient.get(`${ADMIN_PREFIX}/payments`);
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
    const res = await axiosClient.get(`/specialties`);
    return res.data.data;
  },
  registerUser: async (payload: any) => {
    const res = await axiosClient.post('/auth/register', payload);
    return res.data;
  },
};
