/* eslint-disable @typescript-eslint/no-explicit-any */
// src/modules/appointment/hooks/useAppointment.ts

import { useState } from 'react';
import { appointmentService } from '../service/appointmentService';

export const useAppointment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createAppointment = async (payload: any) => {
    try {
      setLoading(true);
      setError(null);

      const data = await appointmentService.createAppointment(payload);
      return data.data;
    } catch (err: any) {
      setError(err?.message || 'Error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createAppointment,
  };
};
