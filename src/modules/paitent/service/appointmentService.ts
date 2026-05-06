/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosClient from "../../../api/axiosClient";

export const appointmentService = {
  createAppointment: async (payload: any) => {
    const res = await axiosClient.post('/appointments', payload);
    return res.data;
  },
};