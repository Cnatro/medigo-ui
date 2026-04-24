import axiosClient from '../../api/axiosClient';

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  clinic: string;
  experience: number;
  rating: number;
  reviewCount: number;
  price: number;
  languages: string[];
  acceptsInsurance: boolean;
  isOnline: boolean;
  avatar?: string;
  specialtyId?: string;
  clinicId?: string;
}

export interface FilterOptions {
  sortBy: 'rating' | 'price_asc' | 'price_desc';
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
  getDoctors: () => {
    return axiosClient.get('/doctors');
  },

  getDoctorById: (id: string, specialtyId: string) => {
    return axiosClient.get(`/doctors/${id}?specialty_id=${specialtyId}`);
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

  getTimeSlots: (doctorId: string, startDate: string, endDate: string) => {
    return axiosClient.get(`/time_slots/${doctorId}/slots`, {
      params: {
        start_date: startDate,
        end_date: endDate,
      },
    });
  },
};
