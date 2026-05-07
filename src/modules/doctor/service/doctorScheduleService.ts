import {
  mapSchedule,
  mapScheduleStatistics,
  mapTimeSlot,
} from '../../../api/apiMapper';
import axiosClient from '../../../api/axiosClient';

export interface Schedule {
  id: string;
  doctorSpecialtyId: string;
  dayOfWeek: number;
  dayLabel: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
  type: string;
  status: string;
  reason: string | null;
  specialty: Specialty;
  date: string;
}

export interface TimeSlot {
  id: string;
  doctorSpecialtyId: string;
  scheduleId: string;
  date: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface Specialty {
  id: string;
  name: string;
  description: string;
}

export interface WeekItem {
  value: number;
  start: Date;
  end: Date;
  label: string;
}

export interface ScheduleStatistics {
  extraShiftCount: number;
  leaveCount: number;
  regularShiftCount: number;
  weekendShiftCount: number;
}

const scheduleService = {
  async getSchedules(params?: {
    start_date?: string;
    end_date?: string;
  }): Promise<Schedule[]> {
    const response = await axiosClient.get('/schedules/my-schedules', {
      params,
    });
    return response.data.data.map(mapSchedule);
  },

  async getScheduleStatistics(): Promise<ScheduleStatistics> {
    const response = await axiosClient.get('/schedules/stats');
    return mapScheduleStatistics(response.data.data);
  },

  async getTimeSlotsSchedule(
    scheduleId: string,
    doctor_specialty_id: string,
  ): Promise<TimeSlot[]> {
    const response = await axiosClient.get(
      `/schedules/${scheduleId}/time-slots?doctor_specialty_id=${doctor_specialty_id}`,
    );

    return response.data.data.map(mapTimeSlot);
  },

  async getMySpecialty(): Promise<Specialty[]> {
    const response = await axiosClient.get('/specialties/my-specialties');
    return response.data.data;
  },

  async updateLeaveSchedule(data: {
    schedule_id: string;
    status: string;
    reason: string;
  }) {
    const response = await axiosClient.patch('/schedules/leave', data);
    return mapSchedule(response.data.data);
  },

  async registerExtraShift(data: {
    workDate: string;
    specialty_id: string;
  }): Promise<Schedule> {
    const response = await axiosClient.post(
      '/schedules/extra-shift/register',
      data,
    );

    return mapSchedule(response.data.data);
  },

  async registerWeekendShift(data: {
    workDate: string;
    specialty_id: string;
  }): Promise<Schedule> {
    const response = await axiosClient.post(
      '/schedules/weekend-shift/register',
      data,
    );

    return mapSchedule(response.data.data);
  },
};
export default scheduleService;
