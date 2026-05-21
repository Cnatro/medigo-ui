/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useRef, useState } from 'react';

import { useAI } from './hooks/useAI';
import './styles/ai-chat-assistant.css';

import { useAuth } from '../../shared/components/AuthContext';
import InfoAppointment from './InfoAppointment';
import type { Doctor } from './service/doctorService';

interface AIChatAssistantProps {
  onClose: () => void;
}

const AIChatAssistant: React.FC<AIChatAssistantProps> = ({ onClose }) => {
  const [message, setMessage] = useState('');
  const [showSidebar, setShowSidebar] = useState(true);

  const {
    sendMessage,
    loading,
    history,
    data,

    sessions,
    sessionId,

    getSessions,
    changeSession,
    createNewChat,
  } = useAI();

  const { currentUser } = useAuth();

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [infoData, setInfoData] = useState<any | null>(null);
  const [step, setStep] = useState<'chat' | 'info'>('chat');

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [history, loading]);

  useEffect(() => {
    const patientId = currentUser?.profile?.id;

    if (patientId) {
      getSessions(patientId);
    }
  }, [currentUser]);

  const slotsByDoctor: Record<string, any[]> = useMemo(() => {
    return (
      data?.suggested_slots?.reduce((acc: any, slot: any) => {
        if (!acc[slot.doctor_id]) {
          acc[slot.doctor_id] = [];
        }

        acc[slot.doctor_id].push(slot);

        return acc;
      }, {}) || {}
    );
  }, [data]);

  const handleSendMessage = async () => {
    if (!message.trim() || loading) return;

    const patientId = currentUser?.profile?.id || '';

    await sendMessage(patientId, message);

    setMessage('');

    // reload sessions
    await getSessions(patientId);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
    });
  };

  const getSessionTitle = (session: any) => {
    if (session.first_message) {
      return session.first_message;
    }

    return 'Tư vấn sức khỏe';
  };

  const renderBotMessage = (msg: any) => {
    const content = msg.message;

    if (typeof content === 'string') {
      return <div className="chat-bubble bot">{content}</div>;
    }

    return (
      <div className="bot-response-card">
        {/* SUMMARY */}
        {content.summary && (
          <div className="bot-section">
            <div className="bot-section-title">
              <i className="fas fa-notes-medical"></i>
              Tóm tắt
            </div>

            <div className="bot-summary">{content.summary}</div>
          </div>
        )}

        {/* SYMPTOMS */}
        {content.symptoms?.length > 0 && (
          <div className="bot-section">
            <div className="bot-section-title">
              <i className="fas fa-heartbeat"></i>
              Triệu chứng nhận diện
            </div>

            <div className="symptom-list">
              {content.symptoms.map((s: any) => (
                <div key={s.id} className="symptom-item">
                  <div className="symptom-name">{s.name}</div>

                  <div className="symptom-percent">
                    {Math.round(s.similarity * 100)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SPECIALTIES */}
        {content.specialties?.length > 0 && (
          <div className="bot-section">
            <div className="bot-section-title">
              <i className="fas fa-stethoscope"></i>
              Chuyên khoa phù hợp
            </div>

            <div className="specialty-badges">
              {content.specialties.map((s: any, i: number) => (
                <div key={i} className="specialty-badge">
                  {s.name}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DOCTORS */}
        {content.doctors?.length > 0 && (
          <div className="bot-section">
            <div className="bot-section-title">
              <i className="fas fa-user-md"></i>
              Bác sĩ gợi ý
            </div>

            <div className="doctor-list">
              {content.doctors.map((doctor: any) => (
                <div key={doctor.id} className="doctor-card">
                  <div className="doctor-top">
                    <div className="doctor-avatar">
                      <i className="fas fa-user-md"></i>
                    </div>

                    <div>
                      <div className="doctor-name">{doctor.full_name}</div>

                      <div className="doctor-clinic">{doctor.clinic_name}</div>
                    </div>
                  </div>

                  <div className="doctor-bottom">
                    <div className="rating">
                      ⭐ {doctor.rating_avg || 'N/A'}
                    </div>

                    <div className="exp">{doctor.experience_years} năm KN</div>
                  </div>

                  <div className="slot-list">
                    {slotsByDoctor[doctor.id]?.length > 0 ? (
                      slotsByDoctor[doctor.id].map((slot: any) => (
                        // <div key={slot.id} className="slot-chip">
                        //   <i className="fas fa-clock"></i>
                        //   {slot.date} | {slot.start_time} - {slot.end_time}
                        // </div>

                        <button
                          key={slot.id}
                          type="button"
                          className="slot-chip"
                          onClick={() => handleSelectSlot(slot, doctor)}
                        >
                          <i className="fas fa-clock"></i>
                          {slot.date} | {slot.start_time} - {slot.end_time}
                        </button>
                      ))
                    ) : (
                      <div className="no-slot">Không có lịch</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ADVICE */}
        {content.advice && (
          <div className="advice-box">
            <div className="advice-title">
              <i className="fas fa-lightbulb"></i>
              Lời khuyên
            </div>

            <div className="advice-content">{content.advice}</div>
          </div>
        )}
      </div>
    );
  };

  const handleSelectSlot = (slot: any, doctor: any) => {
    const mappedDoctor: Doctor = {
      id: doctor.id,
      name: doctor.full_name,
      clinic: doctor.clinic_name,
      experience: doctor.experience_years,
      rating: doctor.rating_avg,
      reviewCount: doctor.review_count || 0,
      languages: doctor.languages || [],
      acceptsInsurance: doctor.accepts_insurance || false,
      isOnline: doctor.is_online || false,
      avatar: doctor.avatar,
      clinicId: doctor.clinic_id,

      specialties: doctor.specialties || [],
    };

    setInfoData({
      slot: {
        ...slot,
        time: `${slot.start_time} - ${slot.end_time}`,
      },
      doctor: mappedDoctor,

      time: `${slot.start_time} - ${slot.end_time}`,
      date: slot.date,

      time_slot_id: slot.id,
      doctor_specialty_id: doctor.doctor_specialty_id,

      amount: doctor.price || doctor.amount,

      patientName: currentUser?.full_name,
      phone: currentUser?.phone,
      email: currentUser?.email,

      reason: message,
    });

    setStep('info');
  };

  return (
    <div className="ai-chat-wrapper">
      {/* SIDEBAR */}
      <>
        {/* OVERLAY */}
        {showSidebar && (
          <div
            className="ai-chat-overlay show"
            onClick={() => setShowSidebar(false)}
          />
        )}

        {/* SIDEBAR */}
        <div className={`ai-chat-sidebar ${showSidebar ? 'show' : 'hide'}`}>
          <div className="sidebar-top">
            <button className="new-chat-btn" onClick={createNewChat}>
              <i className="fas fa-plus"></i>
              Chat mới
            </button>
          </div>

          <div className="conversation-list">
            {sessions.map((session: any) => (
              <div
                key={session.id}
                className={`conversation-item ${
                  sessionId === session.id ? 'active' : ''
                }`}
                onClick={async () => {
                  await changeSession(session.id);

                  setShowSidebar(false);
                }}
              >
                <div className="conversation-icon">
                  <i className="fas fa-comment-medical"></i>
                </div>

                <div className="conversation-info">
                  <div className="conversation-title">
                    {getSessionTitle(session)}
                  </div>

                  <div className="conversation-time">
                    {formatDate(session.created_at)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>

      {/* MAIN */}
      <div className="ai-chat-main">
        {/* HEADER */}
        <div className="medigo-chat-header">
          <div className="medigo-chat-header-left">
            <button
              className="sidebar-toggle-btn"
              onClick={() => setShowSidebar(!showSidebar)}
            >
              <i className="fas fa-bars"></i>
            </button>

            <div className="medigo-chat-bot-avatar">
              <i className="fas fa-robot"></i>
            </div>

            <div className="medigo-chat-info">
              <span className="medigo-chat-bot-name">Medigo AI</span>

              <span className="medigo-chat-status">Online • Tư vấn 24/7</span>
            </div>
          </div>

          <button className="medigo-chat-close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* BODY */}
        <div className="ai-chat-body">
          {history.length === 0 && !loading && (
            <div className="welcome-box">
              <div className="welcome-icon">🤖</div>

              <h4>Xin chào 👋</h4>

              <p>Hãy mô tả triệu chứng để AI hỗ trợ bạn.</p>
            </div>
          )}

          {history.map((msg) => (
            <div
              key={msg.id}
              className={`message-row ${
                msg.sender === 'user' ? 'user-row' : 'bot-row'
              }`}
            >
              {msg.sender === 'bot' && (
                <div className="message-avatar">
                  <i className="fas fa-robot"></i>
                </div>
              )}

              <div
                className={`message-content ${
                  msg.sender === 'user' ? 'user-content' : 'bot-content'
                }`}
              >
                {msg.sender === 'user' ? (
                  <div className="chat-bubble user">
                    {typeof msg.message === 'string'
                      ? msg.message
                      : msg.message.summary}
                  </div>
                ) : (
                  renderBotMessage(msg)
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="message-row bot-row">
              <div className="message-avatar">
                <i className="fas fa-robot"></i>
              </div>

              <div className="typing-box">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}

          <div ref={bottomRef}></div>
        </div>

        {/* FOOTER */}
        <div className="ai-chat-footer">
          <div className="chat-input-box">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Nhập triệu chứng..."
            />

            <button onClick={handleSendMessage} disabled={loading}>
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>

          <div className="chat-disclaimer">
            AI chỉ mang tính hỗ trợ tham khảo
          </div>
        </div>
      </div>
      {step === 'info' && infoData && (
        <div className="confirm-overlay">
          <div className="confirm-modal">
            <InfoAppointment
              doctor={infoData.doctor}
              selectedSlot={infoData.slot}
              selectedDate={infoData.date}
              doctorSpecialtyId={infoData.doctor_specialty_id}
              amount={infoData.amount}
              onClose={() => {
                setStep('chat');
                setInfoData(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChatAssistant;
