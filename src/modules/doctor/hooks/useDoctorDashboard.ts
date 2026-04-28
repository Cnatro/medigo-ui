import { useState, useEffect } from 'react';
import doctorDashboardService, { type Appointment, type DashboardStats, type QueueItem } from '../doctorDashboardService';

export const useDoctorDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    todayAppointments: 0,
    pendingConfirmations: 0,
    monthlyAppointments: 0,
    averageRating: 0,
  });
  const [weekAppointments, setWeekAppointments] = useState<Appointment[]>([]);
  const [queueItems, setQueueItems] = useState<QueueItem[]>([]);
  const [pendingAppointments, setPendingAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [statsData, weekData, queueData, pendingData] = await Promise.all([
          doctorDashboardService.getDashboardStats(),
          doctorDashboardService.getWeekAppointments(),
          doctorDashboardService.getQueue(),
          doctorDashboardService.getPendingAppointments(),
        ]);
        setStats(statsData);
        setWeekAppointments(weekData);
        setQueueItems(queueData);
        setPendingAppointments(pendingData);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const handleConfirmAppointment = async (id: string) => {
    try {
      await doctorDashboardService.confirmAppointment(id);
      setPendingAppointments(prev => prev.filter(apt => apt.id !== id));
      setStats(prev => ({
        ...prev,
        pendingConfirmations: prev.pendingConfirmations - 1,
        todayAppointments: prev.todayAppointments + 1,
      }));
    } catch (error) {
      console.error('Failed to confirm appointment:', error);
    }
  };

  const handleRejectAppointment = async (id: string) => {
    try {
      await doctorDashboardService.rejectAppointment(id);
      setPendingAppointments(prev => prev.filter(apt => apt.id !== id));
      setStats(prev => ({
        ...prev,
        pendingConfirmations: prev.pendingConfirmations - 1,
      }));
    } catch (error) {
      console.error('Failed to reject appointment:', error);
    }
  };

  return {
    stats,
    weekAppointments,
    queueItems,
    pendingAppointments,
    loading,
    handleConfirmAppointment,
    handleRejectAppointment,
  };
};