/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { doctorService, type Doctor } from '../doctorService';
import { handleApiError } from '../../../shared/utils/error';
import { mapDoctor } from '../../../api/apiMapper';

export const useDoctor = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDoctors = async (params?: any) => {
    setLoading(true);
    setError(null);

    try {
      const response = await doctorService.getDoctors(params);
      const mapped = response.data['data'].map(mapDoctor);
      setDoctors(mapped);
    } catch (err: any) {
      const msg = handleApiError(err);
      setError(msg || 'Không thể tải danh sách bác sĩ');
    } finally {
      setLoading(false);
    }
  };

  const getDoctorById = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await doctorService.getDoctorById(id);
      return mapDoctor(response.data['data']);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể tải thông tin bác sĩ');
      return {
        id: '',
        name: '',
        clinic: '',
        experience: 0,
        rating: 0,
        reviewCount: 0,
        languages: [],
        acceptsInsurance: false,
        isOnline: false,
        specialties: [],
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    doctors,
    loading,
    error,
    fetchDoctors,
    getDoctorById,
  };
};
