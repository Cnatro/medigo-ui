import axiosClient from "../../api/axiosClient";
import type { User } from "../../shared/components/AuthContext";


export interface DashboardStats {
  todayAppointments: number;
  pendingConfirmations: number;
  monthlyAppointments: number;
  averageRating: number;
}

export interface Appointment {
  id: string;
  patientName: string;
  patientInitials: string;
  dateTime: string;
  type: 'trực tiếp' | 'trực tuyến';
  time: string;
  status?: 'pending' | 'confirmed' | 'rejected';
  specialty?: string;
  isNew?: boolean;
}

export interface QueueItem {
  id: string;
  patientName: string;
  orderNumber: number;
  time: string;
  status: 'examining' | 'next' | 'waiting' | 'online';
  specialty: string;
}

const doctorDashboardService = {
  async getDoctorProfile(): Promise<User> {
    const response = await axiosClient.get('/doctor/profile');
    return response.data;
  },

  async getDashboardStats(): Promise<DashboardStats> {
    const response = await axiosClient.get('/doctor/dashboard/stats');
    return response.data;
  },

  async getWeekAppointments(): Promise<Appointment[]> {
    const response = await axiosClient.get('/doctor/appointments/week');
    return response.data;
  },

  async getQueue(): Promise<QueueItem[]> {
    const response = await axiosClient.get('/doctor/queue');
    return response.data;
  },

  async getPendingAppointments(): Promise<Appointment[]> {
    const response = await axiosClient.get('/doctor/appointments/pending');
    return response.data;
  },

  async confirmAppointment(id: string): Promise<void> {
    await axiosClient.post(`/doctor/appointments/${id}/confirm`);
  },

  async rejectAppointment(id: string): Promise<void> {
    await axiosClient.post(`/doctor/appointments/${id}/reject`);
  },
};

export default doctorDashboardService;