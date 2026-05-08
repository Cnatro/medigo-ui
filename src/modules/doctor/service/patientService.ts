import axiosClient from '../../../api/axiosClient';

/* eslint-disable @typescript-eslint/no-explicit-any */
const patientService = {
  async getPendingAppointments(id: any): Promise<any> {
    const res = await axiosClient.get(`/doctors/${id}/appointments`);

    return res.data.data;
  },

  getAppointmentDetail: async (id: string) => {
    const res = await axiosClient.get(`/appointments/${id}`);
    return res.data.data;
  },

  async updateAppointment(id: string, symptom: string) {
    const res = await axiosClient.patch(`/appointments/${id}/complete`, {
      symptom,
    });
    return res.data;
  },
};

export default patientService;
