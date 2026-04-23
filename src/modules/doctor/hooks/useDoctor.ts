/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import {
  doctorService,
  type Doctor,
  type FilterOptions,
} from '../doctorService';
import { handleApiError } from '../../../shared/utils/error';
import { mapDoctor } from '../../../api/apiMapper';
export const useDoctor = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDoctors = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await doctorService.getDoctors();
      const mapped = response.data['data'].map(mapDoctor);
      setDoctors(mapped);
      setFilteredDoctors(mapped);
    } catch (err: any) {
      const msg = handleApiError(err);
      setError(msg || 'Không thể tải danh sách bác sĩ');
    } finally {
      setLoading(false);
    }
  };

  const getDoctorById = async (id: string, specialtyId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await doctorService.getDoctorById(id, specialtyId);
      const doctor = mapDoctor(response.data['data']);
      return doctor;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể tải thông tin bác sĩ');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const filterDoctors = (filters: FilterOptions) => {
    let filtered = [...doctors];

    // SPECIALTY (ID)
    if (filters.specialties.length > 0) {
      filtered = filtered.filter((doctor) =>
        filters.specialties.includes(doctor.specialtyId as any),
      );
    }

    // CLINIC (ID)
    if (filters.clinics.length > 0) {
      filtered = filtered.filter((doctor) =>
        filters.clinics.includes(doctor.clinicId as any),
      );
    }

    // PRICE
    filtered = filtered.filter(
      (doctor) =>
        doctor.price >= filters.priceRange.min &&
        doctor.price <= filters.priceRange.max,
    );

    // RATING
    if (filters.minRating > 0) {
      filtered = filtered.filter(
        (doctor) => doctor.rating >= filters.minRating,
      );
    }

    // SORT
    switch (filters.sortBy) {
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'price_asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
    }

    setFilteredDoctors(filtered);
  };

  return {
    doctors: filteredDoctors,
    loading,
    error,
    fetchDoctors,
    filterDoctors,
    getDoctorById,
  };
};
