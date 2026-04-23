/* eslint-disable @typescript-eslint/no-explicit-any */
export const mapDoctor = (d: any) => ({
  id: d.id,
  name: d.name,
  specialty: d.specialty,
  clinic: d.clinic,
  experience: d.experience,
  rating: d.rating,
  reviewCount: d.reviewCount,
  price: d.price,
  languages: d.languages,
  acceptsInsurance: d.acceptsInsurance,
  isOnline: d.isOnline,
  avatar: d.avatar,

  specialtyId: d.specialty_id,
  clinicId: d.clinic_id,
});