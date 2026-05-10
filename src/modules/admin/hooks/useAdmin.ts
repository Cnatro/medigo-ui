/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { adminService } from '../services/adminService';

interface ScheduleState {
  items: any[];
  pagination: {
    page?: number;
    pages?: number;
    total?: number;
    limit?: number;
  };
}

interface UserState {
  items: any[];
  pagination: {
    page?: number;
    pages?: number;
    total?: number;
    limit?: number;
  };
}

export const useAdmin = () => {
  const [dashboardOverview, setDashboardOverview] = useState<any>(null);

  const [users, setUsers] = useState<UserState>({ items: [], pagination: {} });

  const [clinics, setClinics] = useState<any[]>([]);

  const [schedules, setSchedules] = useState<ScheduleState>({
    items: [],
    pagination: {},
  });

  const [paymentStats, setPaymentStats] = useState<any>(null);

  const [payments, setPayments] = useState<any[]>([]);

  const [settings, setSettings] = useState<any>(null);

  const [scheduleRequests, setScheduleRequests] = useState<any[]>([]);

  const [specialties, setSpecialties] = useState<any[]>([]);

  const [userDetail, setUserDetail] = useState<any>(null);

  const [loading, setLoading] = useState(false);

  const fetchDashboardOverview = async () => {
    setLoading(true);

    try {
      const res = await adminService.getDashboardOverview();

      setDashboardOverview(res);
    } catch (error) {
      console.log('Fetch dashboard overview error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async ({
    page,
    limit,
    filters,
  }: {
    page: number;
    limit: number;
    filters: {
      search: string;
      role: string;
    };
  }) => {
    setLoading(true);

    try {
      const res = await adminService.getUsers({ page, limit, filters });

      setUsers(res);
    } catch (error) {
      console.log('Fetch users error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClinics = async () => {
    setLoading(true);

    try {
      const res = await adminService.getClinics();

      setClinics(res);
    } catch (error) {
      console.log('Fetch clinics error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSchedules = async ({
    page,
    limit,
    filters,
  }: {
    page: number;
    limit: number;
    filters: {
      doctor_name: string;
      clinic_id: string;
      specialty_id: string;
    };
  }) => {
    setLoading(true);

    try {
      const res = await adminService.getSchedules({
        page,
        limit,
        filters: filters,
      });

      setSchedules(res);
    } catch (error) {
      console.log('Fetch schedules error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentStats = async () => {
    setLoading(true);

    try {
      const res = await adminService.getPaymentStats();

      setPaymentStats(res);
    } catch (error) {
      console.log('Fetch payment stats error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPayments = async () => {
    setLoading(true);

    try {
      const res = await adminService.getPayments();

      setPayments(res);
    } catch (error) {
      console.log('Fetch payments error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    setLoading(true);

    try {
      const res = await adminService.getSettings();

      setSettings(res);
    } catch (error) {
      console.log('Fetch settings error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchScheduleRequests = async () => {
    setLoading(true);

    try {
      const res = await adminService.getScheduleRequests();

      setScheduleRequests(res.data);
    } catch (error) {
      console.log('Fetch schedule requests error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fectchSpecialties = async () => {
    setLoading(true);

    try {
      const res = await adminService.getSpecialties();

      setSpecialties(res);
    } catch (error) {
      console.log('Fetch specialties error:', error);
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async (payload: any) => {
    setLoading(true);

    try {
      const res = await adminService.registerUser(payload);
      if (res.status === 201) {
        alert('tạo tài khoản thành công');
        return res.data.data;
      }
    } catch (error: any) {
      if (error.response?.status === 409) {
        alert(
          'Tài khoản với email này đã tồn tại. Vui lòng sử dụng email khác hoặc đăng nhập nếu bạn đã có tài khoản.',
        );
        return;
      }
      const msg = error?.message || 'Register failed';
      console.log('Register user error:', msg);
    } finally {
      setLoading(false);
    }
  };

  const getDetailDoctor = async (id: string) => {
    setLoading(true);
    try {
      const res = await adminService.getDetailDoctor(id);
      setUserDetail(res);
    } catch (error: any) {
      const msg = error?.message || 'Register failed';
      console.log('Register user error:', msg);
    } finally {
      setLoading(false);
    }
  };

  const createSchedule = async (payload: any) => {
    setLoading(true);
    try {
      const res = await adminService.createSchedule(payload);
      if (res.status === 201) {
        alert('Tạo lịch làm việc thành công');

        return res.data.data;
      }
    } catch (error: any) {
      const msg = error?.message || 'Register failed';
      console.log('Register user error:', msg);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,

    dashboardOverview,
    users,
    clinics,
    schedules,
    paymentStats,
    payments,
    settings,
    scheduleRequests,
    specialties,
    userDetail,

    fetchDashboardOverview,
    fetchUsers,
    fetchClinics,
    fetchSchedules,
    fetchPaymentStats,
    fetchPayments,
    fetchSettings,
    fetchScheduleRequests,
    fectchSpecialties,
    registerUser,
    getDetailDoctor,
    createSchedule,
  };
};
