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
