export interface DoctorSchedule {
  id: string;
  doctor_specialty_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_active: boolean;
}

// export interface TimeSlot {
//   id: string;
//   doctor_specialty_id: string;
//   schedule_id: string;
//   date: string;
//   start_time: string;
//   end_time: string;
//   is_available: boolean;
//   schedule?: {
//     day_of_week: number;
//   };
// }

export interface DoctorSpecialty {
  id: string;
  doctor_id: string;
  specialty_id: string;
  consultation_fee: number;
  specialty?: {
    id: string;
    name: string;
  };
}

export interface TimeSlot {
  id: string;
  date: string;
  start: string;
  end: string;
  status: 'available' | 'booked' | 'closed';
  specialtyId: string;
  specialtyName: string;
  patient?: string;
}

export interface Specialty {
  id: string;
  name: string;
}

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

export const timeRanges = [
  '07:00',
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
];

export const specialties: Specialty[] = [
  { id: 'all', name: 'Tất cả chuyên khoa' },
  { id: 'tim-mach', name: 'Tim mạch' },
  { id: 'da-lieu', name: 'Da liễu' },
  { id: 'noi', name: 'Nội tổng quát' },
];

export const timeSlots: TimeSlot[] = [
  {
    id: '1',
    date: '27/04/2026',
    start: '08:00',
    end: '09:00',
    status: 'booked',
    specialtyId: 'tim-mach',
    specialtyName: 'Tim mạch',
    patient: 'Nguyễn Văn A',
  },
  {
    id: '2',
    date: '28/04/2026',
    start: '10:00',
    end: '11:00',
    status: 'available',
    specialtyId: 'da-lieu',
    specialtyName: 'Da liễu',
  },
  {
    id: '3',
    date: '30/04/2026',
    start: '14:00',
    end: '15:00',
    status: 'closed',
    specialtyId: 'noi',
    specialtyName: 'Nội tổng quát',
  },
];

const doctorDashboardService = {};
export default doctorDashboardService;
