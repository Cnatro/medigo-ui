/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import type {
  Schedule,
  ScheduleStatistics,
  Specialty,
  TimeSlot,
} from '../service/doctorScheduleService';
import scheduleService from '../service/doctorScheduleService';

const useSchedules = (params: { start_date?: string; end_date?: string }) => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [statistics, setStatistics] = useState<ScheduleStatistics | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSchedulesByDate = async (p: {
    start_date?: string;
    end_date?: string;
  }) => {
    try {
      setLoading(true);
      const data = await scheduleService.getSchedules(p);
      setSchedules(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to fetch schedules');
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const data = await scheduleService.getScheduleStatistics();
      setStatistics(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to fetch statistics');
    }
  };

  const fetchTimeSlots = async (
    scheduleId: string,
    doctor_specialty_id: string,
  ) => {
    try {
      setLoading(true);
      const data = await scheduleService.getTimeSlotsSchedule(
        scheduleId,
        doctor_specialty_id,
      );
      setTimeSlots(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to fetch time slots');
    } finally {
      setLoading(false);
    }
  };

  const fetchSpecialties = async () => {
    try {
      const data = await scheduleService.getMySpecialty();
      setSpecialties(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to fetch Specialties');
    }
  };

  const updateLeaveSchedule = async (data: {
    schedule_id: string;
    status: string;
    reason: string;
  }) => {
    try {
      setLoading(true);

      await scheduleService.updateLeaveSchedule(data);

      if (params.start_date && params.end_date) {
        await fetchSchedulesByDate(params);
      }

      await fetchStatistics();
    } catch (err: any) {
      setError(
        err?.response?.data?.message || 'Failed to update leave schedule',
      );
    } finally {
      setLoading(false);
    }
  };

  const registerExtraShift = async (data: {
    workDate: string;
    specialty_id: string;
  }) => {
    try {
      setLoading(true);

      await scheduleService.registerExtraShift(data);

      if (params.start_date && params.end_date) {
        await fetchSchedulesByDate(params);
      }
      await fetchStatistics();
    } catch (err: any) {
      if (err.response?.status === 409) {
        alert(
          'Ca làm này đã có người đăng ký. Vui lòng chọn ca khác phù hợp hơn.',
        );
        return;
      }

      setError(
        err?.response?.data?.message ||
          'Failed to update resgiter extra shift schedule',
      );
    } finally {
      setLoading(false);
    }
  };

  const registerWeekendShift = async (data: {
    workDate: string;
    specialty_id: string;
  }) => {
    try {
      setLoading(true);

      await scheduleService.registerWeekendShift(data);

      if (params.start_date && params.end_date) {
        await fetchSchedulesByDate(params);
      }
      await fetchStatistics();
    } catch (err: any) {
      if (err.response?.status === 409) {
       alert(
          'Ca làm này đã có người đăng ký. Vui lòng chọn ca khác phù hợp hơn.',
        );
        return;
      }
      setError(
        err?.response?.data?.message ||
          'Failed to update resgiter extra shift schedule',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!params.start_date || !params.end_date) return;

    fetchSchedulesByDate(params);
  }, [params.start_date, params.end_date]);

  useEffect(() => {
    fetchStatistics();
    fetchSpecialties();
  }, []);

  return {
    schedules,
    statistics,
    timeSlots,
    specialties,
    loading,
    error,

    fetchSchedulesByDate,
    fetchStatistics,
    fetchTimeSlots,
    fetchSpecialties,
    updateLeaveSchedule,
    registerExtraShift,
    registerWeekendShift,
  };
};

export default useSchedules;
