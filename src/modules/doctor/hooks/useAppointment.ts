/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from 'react';
import {
  startOfYear,
  endOfYear,
  eachWeekOfInterval,
  endOfWeek,
  addDays,
  format,
  parse,
  isWithinInterval,
} from 'date-fns';

import type { TimeSlot, WeekItem } from '../service/scheduleAppointmentService';

import scheduleAppointmentService from '../service/scheduleAppointmentService';
import type { Specialty } from '../service/doctorScheduleService';

interface Params {
  start_date?: string;
  end_date?: string;
  specialty_id?: string;
}

const useAppointment = () => {
  const today = new Date();
  const currentYear = today.getFullYear();

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  const [timeRanges, setTimeRanges] = useState<string[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ================= API =================
  const fetchTimeSlots = async (params: Params) => {
    try {
      setLoading(true);

      const res = await scheduleAppointmentService.getTimeSlots({
        start_date: params.start_date,
        end_date: params.end_date,
        specialty_id: params.specialty_id,
      });

      setTimeSlots(res?.data?.timeSlots || []);
      setTimeRanges(res?.data?.timeRanges || []);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch time slots');
      setTimeSlots([]);
      setTimeRanges([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSpecialties = async () => {
    try {
      const res = await scheduleAppointmentService.getSpecialties();
      setSpecialties(res || []);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch specialties');
    }
  };

  // ================= WEEKS (GIỮ NGUYÊN LOGIC UI) =================
  const weeksInYear: WeekItem[] = useMemo(() => {
    const yearStart = startOfYear(new Date(selectedYear, 0, 1));
    const yearEnd = endOfYear(new Date(selectedYear, 11, 31));

    const weeks = eachWeekOfInterval(
      { start: yearStart, end: yearEnd },
      { weekStartsOn: 1 },
    );

    return weeks.map((weekStart, index) => {
      const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });

      return {
        value: index,
        start: weekStart,
        end: weekEnd,
        label: `Tuần ${index + 1} (${format(weekStart, 'dd/MM')} - ${format(
          weekEnd,
          'dd/MM',
        )})`,
      };
    });
  }, [selectedYear]);

  // ================= DAYS =================

  const defaultWeekIndex = useMemo(() => {
    const foundIndex = weeksInYear.findIndex((week) =>
      isWithinInterval(today, {
        start: week.start,
        end: week.end,
      }),
    );

    return foundIndex >= 0 ? foundIndex : 0;
  }, [weeksInYear]);

  const [selectedWeek, setSelectedWeek] = useState(defaultWeekIndex);
  const currentWeek = weeksInYear[selectedWeek];

  const currentWeekDays = useMemo(() => {
    if (!currentWeek) return [];

    return Array.from({ length: 7 }, (_, i) => {
      const date = addDays(currentWeek.start, i);

      return {
        label: [
          'Thứ 2',
          'Thứ 3',
          'Thứ 4',
          'Thứ 5',
          'Thứ 6',
          'Thứ 7',
          'Chủ nhật',
        ][i],
        fullDate: date,
        dateText: format(date, 'dd/MM'),
      };
    });
  }, [currentWeek]);

  // ================= FILTER (GIỮ NGUYÊN LOGIC) =================
  const filteredSlots = useMemo(() => {
    let result = [...timeSlots];

    if (selectedSpecialty !== 'all') {
      result = result.filter((s) => s.specialtyId === selectedSpecialty);
    }

    if (currentWeek) {
      result = result.filter((slot) => {
        const slotDate = parse(slot.date, 'dd/MM/yyyy', new Date());

        return isWithinInterval(slotDate, {
          start: currentWeek.start,
          end: currentWeek.end,
        });
      });
    }

    return result;
  }, [timeSlots, selectedSpecialty, currentWeek]);

  // ================= HELPERS (GIỮ NGUYÊN) =================
  const getSlot = (date: Date, time: string) => {
    return filteredSlots.find((slot) => {
      const slotDate = parse(slot.date, 'dd/MM/yyyy', new Date());

      return (
        format(slotDate, 'dd/MM/yyyy') === format(date, 'dd/MM/yyyy') &&
        slot.start === time
      );
    });
  };

  const getSlotClass = (status?: string) => {
    switch (status) {
      case 'available':
        return 'slot available';

      case 'booked':
        return 'slot booked';

      case 'completed':
        return 'slot completed';

      case 'closed':
        return 'slot closed';

      default:
        return 'slot empty';
    }
  };

  // ================= STATS =================
  const availableCount = filteredSlots.filter(
    (s) => s.status === 'available',
  ).length;
  const bookedCount = filteredSlots.filter((s) => s.status === 'booked').length;
  const closedCount = filteredSlots.filter((s) => s.status === 'closed').length;
  const completedCount = filteredSlots.filter( (s) => s.status === 'completed' ).length;

  // ================= EFFECT =================
  useEffect(() => {
    const currentWeek = weeksInYear[selectedWeek];

    if (!currentWeek) return;

    const params: Params & {
      specialty_id?: string;
    } = {
      start_date: format(currentWeek.start, 'yyyy-MM-dd'),
      end_date: format(currentWeek.end, 'yyyy-MM-dd'),
    };

    if (selectedSpecialty !== 'all') {
      params.specialty_id = selectedSpecialty;
    }

    fetchTimeSlots(params);
  }, [selectedWeek, selectedYear, selectedSpecialty]);

  useEffect(() => {
    fetchSpecialties();
  }, []);

  return {
    selectedYear,
    setSelectedYear,
    selectedWeek,
    setSelectedWeek,
    selectedSpecialty,
    setSelectedSpecialty,
    selectedSlot,
    setSelectedSlot,

    timeSlots,
    timeRanges,
    specialties,
    weeksInYear,
    currentWeek,
    currentWeekDays,
    filteredSlots,
    defaultWeekIndex,

    getSlot,
    getSlotClass,

    availableCount,
    bookedCount,
    closedCount,
    completedCount,

    loading,
    error,
  };
};

export default useAppointment;
