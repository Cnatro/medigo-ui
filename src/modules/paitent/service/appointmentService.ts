/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosClient from '../../../api/axiosClient';

export const appointmentService = {
  createAppointment: async (payload: any) => {
    const res = await axiosClient.post('/appointments', payload);
    return res.data;
  },

  getHistoryAppointment: async () => {
    const res = await axiosClient.get('/appointments/history');
    return res.data;
  },

  getDetailAppointment: async (id: string) => {
    const res = await axiosClient.get(`/appointments/${id}`);
    return res.data;
  },
  cancelAppointment: async (id: string, reason: string) => {
    const res = await axiosClient.patch(`/orders/cancel-order`, {
      appointment_id: id,
      reason,
    });
    return res.data;
  },
};
