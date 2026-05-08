/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/usePatient.ts
import { useEffect, useState } from 'react';
import patientService from '../service/patientService';

export const usePatient = (doctorId: string | null) => {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPatients = async () => {
    if (!doctorId) return;

    try {
      setLoading(true);
      setError(null);

      const data = await patientService.getPendingAppointments(doctorId);

      setPatients(data);
    } catch (err: any) {
      setError(err.message || 'Lỗi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const getDetail = async (appointmentId: string) => {
    try {
      setLoading(true);
      setError(null);
      return await patientService.getAppointmentDetail(appointmentId);
    } catch (err: any) {
      setError(err.message || 'Lỗi tải dữ liệu');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const completePatient = async (appointmentId: string, symptom: string) => {
    try {
      setLoading(true);
      setError(null);

      await patientService.updateAppointment(appointmentId, symptom);

    } catch (err: any) {
      setError(err.message || 'Lỗi cập nhật');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [doctorId]);

  return {
    patients,
    loading,
    error,
    refetch: fetchPatients,
    getDetail,
    completePatient,
  };
};
