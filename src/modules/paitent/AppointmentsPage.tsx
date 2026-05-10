/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../shared/components/AuthContext';
import { appointmentService } from './service/appointmentService';
import { userService } from './service/userService';
import { reviewService } from './service/reviewService';
import ScreenLoading from '../../shared/utils/loading';

const Modal = ({ show, onClose, title, children, footer }: any) =>
  !show ? null : (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: 12,
          width: 500,
          maxWidth: '90vw',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        }}
      >
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #f3f4f6',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ fontWeight: 700, fontSize: 16 }}>{title}</span>
          <button
            onClick={onClose}
            style={{
              border: 'none',
              background: 'none',
              fontSize: 20,
              cursor: 'pointer',
              color: '#9ca3af',
            }}
          >
            ✕
          </button>
        </div>
        <div style={{ padding: 24 }}>{children}</div>
        {footer && (
          <div
            style={{
              padding: '16px 24px',
              borderTop: '1px solid #f3f4f6',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 10,
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );

/* ---- TYPES (updated to match API) ---- */
interface AppointmentListItem {
  id: string;
  reason: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  symptom: string | null;
  has_reviewed: boolean;
  doctor: {
    id: string;
    full_name: string;
  };
  specialty: {
    id: string;
    name: string;
  };
  schedule: {
    date: string;
    start_time: string;
    end_time: string;
  };
  clinic: {
    id: string;
    name: string;
    address: string;
  };
}

interface AppointmentDetail {
  id: string;
  status: string;
  reason: string;
  symptom: string | null;
  date: string;
  start_time: string;
  end_time: string;
  doctor: {
    id: string;
    full_name: string;
    avatar: string | null;
    experience_years: number;
    rating_avg: number;
    total_reviews: number;
    bio: string | null;
  };
  clinic: {
    id: string;
    name: string;
    address: string;
    phone: string | null;
  };
  specialty: {
    id: string;
    name: string;
    fee: string;
  };
  patient: {
    id: string;
    full_name: string;
    email: string;
    gender: string;
    avatar: string | null;
    dob: string | null;
    phone: string | null;
  };
}

/* ---- STATUS CONFIG (unchanged) ---- */
const statusConfig: Record<
  string,
  { label: string; bg: string; color: string; border: string }
> = {
  PENDING: {
    label: 'Chờ thanh toán',
    bg: '#fff7ed',
    color: '#ea580c',
    border: '#fed7aa',
  },
  CONFIRMED: {
    label: 'Đã thanh toán',
    bg: '#f0fdf4',
    color: '#16a34a',
    border: '#bbf7d0',
  },
  COMPLETED: {
    label: 'Khám thành công',
    bg: '#eff6ff',
    color: '#2563eb',
    border: '#bfdbfe',
  },
  CANCELLED: {
    label: 'Đã hủy',
    bg: '#fef2f2',
    color: '#dc2626',
    border: '#fecaca',
  },
};

const isOnline = (clinicName: string) =>
  clinicName?.toLowerCase().includes('online');

/* ---- HELPERS ---- */
function formatDate(dateStr: string) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}
function formatTime(timeStr: string) {
  return timeStr ? timeStr.slice(0, 5) : '';
}

export default function PatientAppointmentsPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [appointments, setAppointments] = useState<AppointmentListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);

  // Modals
  const [selectedDetail, setSelectedDetail] =
    useState<AppointmentDetail | null>(null);
  const [cancelTarget, setCancelTarget] = useState<AppointmentListItem | null>(
    null,
  );
  const [reviewTarget, setReviewTarget] = useState<AppointmentListItem | null>(
    null,
  );
  // const [reviewDetail, setReviewDetail] = useState<AppointmentDetail | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const [paymentFilter, setPaymentFilter] = useState<
    'all' | 'pending' | 'paid' | 'cancel'
  >('all');
  const [page, setPage] = useState(1);
  const pageSize = 6; // bạn chỉnh tùy thích

  useEffect(() => {
    const handleScroll = () => {
      if (!headerRef.current) return;
      if (window.scrollY > 10) {
        headerRef.current.classList.add('scrolled');
      } else {
        headerRef.current.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [aptRes, userRes] = await Promise.all([
        appointmentService.getHistoryAppointment(),
        userService.getUserInfo(),
      ]);
      // Assume aptRes.data is the array of appointments as defined in the API
      if (aptRes?.data) setAppointments(aptRes.data);
      if (userRes?.data) setUserInfo(userRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const upcoming = appointments.filter(
    (a) => a.status === 'PENDING' || a.status === 'CONFIRMED',
  );
  const past = appointments.filter(
    (a) => a.status === 'COMPLETED' || a.status === 'CANCELLED',
  );
  const list = activeTab === 'upcoming' ? upcoming : past;

  const openDetail = async (apt: AppointmentListItem) => {
    setDetailLoading(true);
    setSelectedDetail(null);
    try {
      const res = await appointmentService.getDetailAppointment(apt.id);
      if (res?.data) setSelectedDetail(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setDetailLoading(false);
    }
  };

  // const openReview = async (apt: AppointmentListItem) => {
  //     setReviewTarget(apt);
  //     setReviewRating(5);
  //     setReviewComment('');
  //     try {
  //         const res = await appointmentService.getDetailAppointment(apt.id);
  //         if (res?.data) setReviewDetail(res.data);
  //     } catch (e) { }
  // };

  const openReview = (apt: AppointmentListItem) => {
    setReviewTarget(apt);
    setReviewRating(5);
    setReviewComment('');
  };

  // const handleSubmitReview = async () => {
  //     if (!reviewTarget || !reviewDetail) return;
  //     setSubmitting(true);
  //     try {
  //         await reviewService.createReviews({
  //             appointment_id: reviewTarget.id,
  //             doctor_id: reviewDetail.doctor.id,
  //             rating: reviewRating,
  //             comment: reviewComment,
  //         });
  //         setReviewTarget(null);
  //         setReviewDetail(null);
  //     } catch (e) {
  //         console.error(e);
  //     } finally {
  //         setSubmitting(false);
  //     }
  // };

  const handleSubmitReview = async () => {
    if (!reviewTarget) return;
    setSubmitting(true);
    try {
      console.log('Payload gửi lên:', {
        appointment_id: reviewTarget.id,
        doctor_id: reviewTarget.doctor.id,
        rating: reviewRating,
        comment: reviewComment,
      });
      await reviewService.createReviews({
        appointment_id: reviewTarget.id,
        doctor_id: reviewTarget.doctor.id, // 👈 lấy từ reviewTarget
        rating: reviewRating,
        comment: reviewComment,
      });
      // Thành công
      setReviewTarget(null);
      alert('Cảm ơn bạn đã đánh giá!');
      // Nên refresh lại danh sách để cập nhật trạng thái (tuỳ chọn)
      // await fetchAll();
    } catch (e: any) {
      console.error('Full error object:', e);
      console.error('Response data:', e.response?.data);
      console.error('Response status:', e.response?.status);
      const message =
        e.response?.data?.message || e.response?.data?.error || e.message;
      alert(`Lỗi: ${message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const displayName =
    userInfo?.full_name || currentUser?.full_name || 'Người dùng';
  console.log('Tên hiển thị:', displayName);

  const handleCancelAppointment = async () => {
    if (!cancelTarget) return;

    try {
      setSubmitting(true);
      console.log('Đang hủy lịch hẹn với ID:', cancelTarget);
      await appointmentService.cancelAppointment(cancelTarget.id, '');

      alert('Hủy lịch hẹn thành công');

      setCancelTarget(null);

      // reload lại danh sách
      await fetchAll();
    } catch (e: any) {
      console.error(e);

      alert(e?.response?.data?.message || 'Có lỗi xảy ra khi hủy lịch hẹn');
    } finally {
      setSubmitting(false);
    }
  };

  /* ---- STYLES (unchanged) ---- */
  const s = {
    page: {
      fontFamily: "'Segoe UI', sans-serif",
      minHeight: '100vh',
      backgroundColor: '#f8f9fb',
    } as React.CSSProperties,
    header: {
      backgroundColor: '#fff',
      borderBottom: '1px solid #e5e7eb',
      padding: '0 40px',
      height: 60,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    } as React.CSSProperties,
    logoBox: {
      width: 36,
      height: 36,
      borderRadius: 8,
      backgroundColor: '#1a4f6e',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      fontWeight: 700,
      fontSize: 16,
    } as React.CSSProperties,
    card: {
      backgroundColor: '#fff',
      border: '1px solid #e5e7eb',
      borderRadius: 12,
      padding: 24,
      marginBottom: 16,
    } as React.CSSProperties,
    badge: (status: string): React.CSSProperties => {
      const c = statusConfig[status] || statusConfig['PENDING'];
      return {
        padding: '5px 14px',
        borderRadius: 20,
        fontSize: 13,
        fontWeight: 500,
        backgroundColor: c.bg,
        color: c.color,
        border: `1px solid ${c.border}`,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        whiteSpace: 'nowrap' as const,
      };
    },
    btnOutline: {
      padding: '8px 18px',
      borderRadius: 8,
      border: '1px solid #e5e7eb',
      backgroundColor: '#fff',
      color: '#374151',
      fontSize: 14,
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontWeight: 500,
    } as React.CSSProperties,
    btnDanger: {
      padding: '8px 18px',
      borderRadius: 8,
      border: '1px solid #fca5a5',
      backgroundColor: '#fff',
      color: '#dc2626',
      fontSize: 14,
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontWeight: 500,
    } as React.CSSProperties,
    btnPrimary: {
      padding: '9px 22px',
      borderRadius: 8,
      border: 'none',
      background:
        'linear-gradient(135deg, var(--primary), var(--primary-dark))',
      color: '#fff',
      fontWeight: 600,
      fontSize: 14,
      cursor: 'pointer',
    } as React.CSSProperties,
    btnSecondary: {
      padding: '9px 18px',
      borderRadius: 8,
      border: '1px solid #e5e7eb',
      backgroundColor: '#fff',
      color: '#555',
      fontWeight: 500,
      fontSize: 14,
      cursor: 'pointer',
    } as React.CSSProperties,
  };

  // /* ---- MODAL (unchanged) ---- */
  // const Modal = ({ show, onClose, title, children, footer }: any) => !show ? null : (
  //     <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
  //         <div style={{ backgroundColor: '#fff', borderRadius: 12, width: 500, maxWidth: '90vw', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
  //             <div style={{ padding: '20px 24px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
  //                 <span style={{ fontWeight: 700, fontSize: 16 }}>{title}</span>
  //                 <button onClick={onClose} style={{ border: 'none', background: 'none', fontSize: 20, cursor: 'pointer', color: '#9ca3af' }}>✕</button>
  //             </div>
  //             <div style={{ padding: 24 }}>{children}</div>
  //             {footer && <div style={{ padding: '16px 24px', borderTop: '1px solid #f3f4f6', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>{footer}</div>}
  //         </div>
  //     </div>
  // );

  /* ---- APPOINTMENT CARD (UPDATED to show real data) ---- */
  const AppointmentCard = ({ apt }: { apt: AppointmentListItem }) => {
    const sc = statusConfig[apt.status] || statusConfig['PENDING'];
    const statusIcon =
      apt.status === 'CONFIRMED'
        ? '✅'
        : apt.status === 'PENDING'
          ? '⚠️'
          : apt.status === 'COMPLETED'
            ? '✔'
            : '✖';

    return (
      <div style={s.card}>
        <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
          {/* Avatar placeholder */}
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              backgroundColor: '#e5e7eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
              flexShrink: 0,
            }}
          >
            👨‍⚕️
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
              }}
            >
              <div>
                {/* Doctor full name */}
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 16,
                    color: '#111',
                    marginBottom: 2,
                  }}
                >
                  BS. {apt.doctor.full_name}
                </div>
                {/* Specialty name */}
                <div style={{ fontSize: 14, color: '#6b7280' }}>
                  {apt.specialty.name}
                </div>
              </div>
              <span style={s.badge(apt.status)}>
                {statusIcon} {sc.label}
              </span>
            </div>
            {/* Schedule date & time */}
            <div style={{ marginTop: 8, fontSize: 14, color: '#374151' }}>
              📅 {formatDate(apt.schedule.date)} &nbsp;|&nbsp; 🕐{' '}
              {formatTime(apt.schedule.start_time)} -{' '}
              {formatTime(apt.schedule.end_time)}
            </div>
            {/* Clinic name */}
            <div style={{ fontSize: 14, color: '#374151', marginTop: 4 }}>
              🏥 {apt.clinic.name}
            </div>
            {/* Reason */}
            <div style={{ marginTop: 8, fontSize: 14, color: '#374151' }}>
              <span style={{ color: '#6b7280' }}>Lý do: </span>
              <strong>{apt.reason}</strong>
            </div>
          </div>
        </div>
        <div
          style={{
            borderTop: '1px solid #f3f4f6',
            paddingTop: 14,
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 10,
          }}
        >
          <button onClick={() => openDetail(apt)} style={s.btnOutline}>
            👁 Chi tiết
          </button>
          {(apt.status === 'CONFIRMED' || apt.status === 'PENDING') && (
            <button onClick={() => setCancelTarget(apt)} style={s.btnDanger}>
              ✖ Hủy hẹn
            </button>
          )}
          {apt.status === 'COMPLETED' &&
            (apt.has_reviewed ? (
              <span
                style={{
                  ...s.btnPrimary,
                  background: '#9ca3af',
                  cursor: 'default',
                  opacity: 0.8,
                }}
              >
                ✅ Đã đánh giá
              </span>
            ) : (
              <button onClick={() => openReview(apt)} style={s.btnPrimary}>
                ⭐ Đánh giá
              </button>
            ))}
        </div>
      </div>
    );
  };

  const paymentFilteredList = list.filter((a) => {
    if (paymentFilter === 'all') return true;
    if (paymentFilter === 'pending') return a.status === 'PENDING';
    if (paymentFilter === 'paid') return a.status === 'CONFIRMED';
    if (paymentFilter === 'cancel') return a.status === 'CANCELLED';
    return true;
  });

  const totalPages = Math.ceil(paymentFilteredList.length / pageSize);

  const paginatedList = paymentFilteredList.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  useEffect(() => {
    setPage(1);
  }, [paymentFilter, activeTab]);

  return (
    <div style={s.page}>
      {/* Header (unchanged) */}

      {/* Main content */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>
        <h1
          style={{
            fontSize: 26,
            fontWeight: 700,
            marginBottom: 24,
            color: '#111',
          }}
        >
          Lịch hẹn của tôi
        </h1>

        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value as any)}
            style={{
              padding: 8,
              borderRadius: 8,
              border: '1px solid #e5e7eb',
              fontSize: 14,
            }}
          >
            <option value="all">Tất cả</option>
            <option value="pending">Chờ thanh toán</option>
            <option value="paid">Đã thanh toán</option>
            <option value="cancel">Đã hủy</option>
          </select>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            backgroundColor: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: 10,
            marginBottom: 24,
            overflow: 'hidden',
          }}
        >
          {[
            { id: 'upcoming' as const, label: `Sắp tới (${upcoming.length})` },
            { id: 'past' as const, label: `Quá khứ (${past.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: 14,
                border: 'none',
                cursor: 'pointer',
                fontSize: 15,
                fontWeight: 500,
                background:
                  activeTab === tab.id
                    ? 'linear-gradient(135deg, var(--primary), var(--primary-dark))'
                    : '#fff',
                color: activeTab === tab.id ? '#fff' : '#6b7280',
                transition: 'all 0.2s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Appointment list */}
        {loading ? (
          <ScreenLoading message="Đang tải lịch hẹn..." />
        ) : list.length === 0 ? (
          <div
            style={{ textAlign: 'center', padding: '60px 0', color: '#9ca3af' }}
          >
            <div style={{ fontSize: 48, marginBottom: 12 }}>📅</div>
            <h4 style={{ color: '#374151' }}>Chưa có lịch hẹn</h4>
            <p>Bạn chưa có lịch hẹn nào trong mục này</p>
            {activeTab === 'upcoming' && (
              <button onClick={() => navigate('/')} style={s.btnPrimary}>
                Tìm bác sĩ
              </button>
            )}
          </div>
        ) : (
          paginatedList.map((apt) => <AppointmentCard key={apt.id} apt={apt} />)
        )}
      </div>
      {totalPages > 1 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: 20,
            gap: 8,
          }}
        >
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            style={s.btnOutline}
          >
            Prev
          </button>

          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              style={{
                ...s.btnOutline,
                background: page === i + 1 ? '#1a4f6e' : '#fff',
                color: page === i + 1 ? '#fff' : '#374151',
              }}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            style={s.btnOutline}
          >
            Next
          </button>
        </div>
      )}

      {/* Floating chat (unchanged) */}
      <div
        style={{
          position: 'fixed',
          bottom: 28,
          right: 28,
          width: 52,
          height: 52,
          borderRadius: '50%',
          backgroundColor: '#1a4f6e',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(26,79,110,0.35)',
          fontSize: 22,
        }}
      >
        💬
      </div>

      {/* Detail Modal */}
      <Modal
        show={!!selectedDetail || detailLoading}
        onClose={() => setSelectedDetail(null)}
        title="Chi tiết lịch hẹn"
        footer={
          <button
            onClick={() => setSelectedDetail(null)}
            style={s.btnSecondary}
          >
            Đóng
          </button>
        }
      >
        {detailLoading ? (
          <div style={{ textAlign: 'center', padding: 20, color: '#6b7280' }}>
            Đang tải...
          </div>
        ) : selectedDetail ? (
          <div>
            <div
              style={{
                display: 'flex',
                gap: 14,
                alignItems: 'center',
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: '50%',
                  backgroundColor: '#e5e7eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 22,
                  overflow: 'hidden',
                  flexShrink: 0,
                }}
              >
                {selectedDetail.doctor.avatar ? (
                  <img
                    src={selectedDetail.doctor.avatar}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  '👨‍⚕️'
                )}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>
                  {selectedDetail.doctor.full_name}
                </div>
                <div style={{ color: '#6b7280', fontSize: 13 }}>
                  {selectedDetail.specialty.name}
                </div>
              </div>
            </div>
            {[
              ['Ngày khám', formatDate(selectedDetail.date)],
              [
                'Giờ khám',
                `${formatTime(selectedDetail.start_time)} - ${formatTime(selectedDetail.end_time)}`,
              ],
              [
                'Hình thức',
                isOnline(selectedDetail.clinic.name)
                  ? 'Online'
                  : 'Tại bệnh viện',
              ],
              [
                'Địa điểm',
                `${selectedDetail.clinic.name} - ${selectedDetail.clinic.address}`,
              ],
              ['Chuyên khoa', selectedDetail.specialty.name],
              [
                'Phí khám',
                `${Number(selectedDetail.specialty.fee).toLocaleString('vi-VN')} đ`,
              ],
            ].map(([k, v]) => (
              <div
                key={k}
                style={{
                  display: 'flex',
                  gap: 10,
                  marginBottom: 10,
                  fontSize: 14,
                }}
              >
                <span style={{ color: '#6b7280', minWidth: 110 }}>{k}:</span>
                <span style={{ color: '#111', fontWeight: 500 }}>{v}</span>
              </div>
            ))}
            <hr
              style={{
                margin: '14px 0',
                borderColor: '#f3f4f6',
                border: 'none',
                borderTop: '1px solid #f3f4f6',
              }}
            />
            <div style={{ fontSize: 14, marginBottom: 8 }}>
              <strong>Lý do khám:</strong> {selectedDetail.reason}
            </div>
            {selectedDetail.symptom && (
              <div style={{ fontSize: 14 }}>
                <strong>Triệu chứng:</strong> {selectedDetail.symptom}
              </div>
            )}
          </div>
        ) : null}
      </Modal>

      {/* Cancel Modal (placeholder – no actual API call yet) */}
      <Modal
        show={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        title="Xác nhận hủy lịch hẹn"
        footer={
          <>
            <button
              onClick={() => setCancelTarget(null)}
              style={s.btnSecondary}
            >
              Không, giữ lại
            </button>
            <button
              onClick={handleCancelAppointment}
              disabled={submitting}
              style={{ ...s.btnPrimary, backgroundColor: '#dc2626' }}
            >
              {submitting ? 'Đang hủy...' : 'Xác nhận hủy'}
            </button>
          </>
        }
      >
        <p style={{ color: '#374151', fontSize: 14 }}>
          Bạn có chắc chắn muốn hủy lịch hẹn này? Hành động này không thể hoàn
          tác.
        </p>
      </Modal>

      {/* Review Modal */}
      {/* <Modal
                show={!!reviewTarget}
                onClose={() => { setReviewTarget(null); setReviewDetail(null); }}
                title="Đánh giá bác sĩ"
                footer={
                    <>
                        <button onClick={() => { setReviewTarget(null); setReviewDetail(null); }} style={s.btnSecondary}>Hủy</button>
                        <button onClick={handleSubmitReview} disabled={submitting} style={s.btnPrimary}>
                            {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
                        </button>
                    </>
                }
            >
                <div>
                    <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 16 }}>
                        <div style={{ width: 52, height: 52, borderRadius: '50%', backgroundColor: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, overflow: 'hidden', flexShrink: 0 }}>
                            {reviewDetail?.doctor.avatar ? <img src={reviewDetail.doctor.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '👨‍⚕️'}
                        </div>
                        <div>
                            <div style={{ fontWeight: 700, fontSize: 15 }}>{reviewDetail?.doctor.full_name || 'Bác sĩ'}</div>
                            <div style={{ color: '#6b7280', fontSize: 13 }}>{reviewDetail?.specialty.name || ''}</div>
                        </div>
                    </div>
                    <div style={{ textAlign: 'center', marginBottom: 16 }}>
                        {[1, 2, 3, 4, 5].map(star => (
                            <span key={star} onClick={() => setReviewRating(star)}
                                style={{ fontSize: 30, cursor: 'pointer', color: star <= reviewRating ? '#f59e0b' : '#e5e7eb' }}>★</span>
                        ))}
                    </div>
                    <textarea
                        value={reviewComment}
                        onChange={e => setReviewComment(e.target.value)}
                        rows={4}
                        placeholder="Chia sẻ trải nghiệm của bạn..."
                        style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 14, resize: 'vertical', boxSizing: 'border-box', outline: 'none' }}
                    />
                </div>
            </Modal> */}
      <Modal
        show={!!reviewTarget}
        onClose={() => {
          setReviewTarget(null);
        }}
        title="Đánh giá bác sĩ"
        footer={
          <>
            <button
              onClick={() => setReviewTarget(null)}
              style={s.btnSecondary}
            >
              Hủy
            </button>
            <button
              onClick={handleSubmitReview}
              disabled={submitting}
              style={s.btnPrimary}
            >
              {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
            </button>
          </>
        }
      >
        {reviewTarget && (
          <div>
            <div
              style={{
                display: 'flex',
                gap: 14,
                alignItems: 'center',
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: '50%',
                  backgroundColor: '#e5e7eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 22,
                }}
              >
                👨‍⚕️
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>
                  BS. {reviewTarget.doctor.full_name}
                </div>
                <div style={{ color: '#6b7280', fontSize: 13 }}>
                  {reviewTarget.specialty.name}
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setReviewRating(star)}
                  style={{
                    fontSize: 30,
                    cursor: 'pointer',
                    color: star <= reviewRating ? '#f59e0b' : '#e5e7eb',
                  }}
                >
                  ★
                </span>
              ))}
            </div>
            <textarea
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              rows={4}
              placeholder="Chia sẻ trải nghiệm của bạn..."
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 8,
                border: '1px solid #e5e7eb',
                fontSize: 14,
                resize: 'vertical',
                boxSizing: 'border-box',
                outline: 'none',
              }}
            />
          </div>
        )}
      </Modal>
    </div>
  );
}
