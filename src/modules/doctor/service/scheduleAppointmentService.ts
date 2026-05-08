/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosClient from '../../../api/axiosClient';
import type { Specialty } from './doctorScheduleService';

export interface WeekItem {
  value: number;
  start: Date;
  end: Date;
  label: string;
}

export const weekDays = [
  'Thứ 2',
  'Thứ 3',
  'Thứ 4',
  'Thứ 5',
  'Thứ 6',
  'Thứ 7',
  'Chủ nhật',
];

export interface PatientAppointment {
  id: string;
  name: string;
}

export interface TimeSlot {
  id: string;
  date: string;
  start: string;
  end: string;
  status: 'available' | 'booked' | 'closed' | 'completed';
  specialtyId: string;
  specialtyName: string;
  patient: PatientAppointment;
}

export interface WeekItem {
  value: number;
  start: Date;
  end: Date;
  label: string;
}

const scheduleAppointmentService = {
  async getTimeSlots(params?: {
    start_date?: string;
    end_date?: string;
    specialty_id?: string;
  }): Promise<any> {
    const res = await axiosClient.get('/schedules/calendar-appointment', {
      params,
    });

    return res.data;
  },

  // Lấy specialties
  async getSpecialties(): Promise<Specialty[]> {
    const res = await axiosClient.get('/specialties/my-specialties');
    return res.data.data;
  },
};

export default scheduleAppointmentService;
