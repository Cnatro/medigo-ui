/* eslint-disable @typescript-eslint/no-explicit-any */
export const mapDoctor = (d: any) => ({
  id: d.id,
  name: d.name,
  clinic: d.clinic,
  experience: d.experience,
  rating: d.rating,
  reviewCount: d.reviewCount,
  languages: d.languages,
  acceptsInsurance: d.acceptsInsurance,
  isOnline: d.isOnline,
  avatar: d.avatar,

  specialties: d.specialties?.map((s: any) => ({
    id: s.id,
    name: s.name,
    price: s.price,
    doctorSpecialtyId: s.doctor_specialty_id,
  })),
  clinicId: d.clinic_id,
});

export const mapSchedule = (s: any) => ({
  id: s.id,
  doctorSpecialtyId: s.doctor_specialty_id,
  dayOfWeek: s.day_of_week,
  dayLabel: s.day_label,
  startTime: s.start_time,
  endTime: s.end_time,
  isActive: s.is_active,
  type: s.type,
  status: s.status,
  reason: s.reason,

  specialty: s.specialty
    ? {
        id: s.specialty.id,
        name: s.specialty.name,
        description: s.specialty.description,
      }
    : {
        id: null,
        name: null,
        description: null,
      },
  date: s.date,
});

export const mapTimeSlot = (t: any) => ({
  id: t.id,
  doctorSpecialtyId: t.doctor_specialty_id,
  scheduleId: t.schedule_id,
  date: t.date,
  startTime: t.start_time,
  endTime: t.end_time,
  isAvailable: t.is_available,
});

export const mapScheduleStatistics = (d: any) => ({
  extraShiftCount: d.extra_shift_count,
  leaveCount: d.leave_count,
  regularShiftCount: d.regular_shift_count,
  weekendShiftCount: d.weekend_shift_count,
});
