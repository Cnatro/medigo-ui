/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosClient from '../../api/axiosClient';

export interface Specialty {
  id: string;
  name: string;
  price: number;
  doctorSpecialtyId: string;
}

export interface Doctor {
  id: string;
  name: string;
  clinic: string;
  experience: number;
  rating: number;
  reviewCount: number;
  languages: string[];
  acceptsInsurance: boolean;
  isOnline: boolean;
  avatar?: string;
  clinicId?: string;

  specialties: Specialty[];
}

export interface FilterOptions {
  sortBy: 'rating' | 'price_asc' | 'price_desc' | 'createdAt';
  specialties: string[];
  clinics: string[];
  priceRange: {
    min: number;
    max: number;
  };
  minRating: number;
}

export interface Qualification {
  title: string;
  field: string;
}

export interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
  isBooked?: boolean;
  isSelected?: boolean;
}

export interface ScheduleDay {
  date: string;
  dayOfWeek: string;
  slots: TimeSlot[];
}

export interface SpecialtyItem {
  id: string;
  name: string;
  description: string;
}
export interface ClinicItem {
  id: string;
  name: string;
  address: string;
  phone: string;
  latitude: number;
  longitude: number;
}

export const doctorService = {
  getDoctors: (params?: any) => {
    return axiosClient.get('/doctors', { params });
  },

  getDoctorById: (id: string) => {
    return axiosClient.get(`/doctors/${id}`);
  },

  getDoctorSchedule: (doctorId: string, date: string) => {
    return axiosClient.get(`/doctors/${doctorId}/schedule`, {
      params: { date },
    });
  },

  getClinics: () => {
    return axiosClient.get('/clinics');
  },

  getSpecialties: () => {
    return axiosClient.get('/specialties');
  },

  getTimeSlots: (
    doctor_specialty_id: string,
    startDate: string,
    endDate: string,
  ) => {
    return axiosClient.get(`/time_slots/${doctor_specialty_id}/slots`, {
      params: {
        start_date: startDate,
        end_date: endDate,
      },
    });
  },
};
