/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { useAI } from './hooks/useAI';
import './styles/ai-chat-assistant.css';

interface AIChatAssistantProps {
  onClose: () => void;
}

const AIChatAssistant: React.FC<AIChatAssistantProps> = ({ onClose }) => {
  const [message, setMessage] = useState('');
  const { sendMessage, loading, data } = useAI();

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    await sendMessage(message);
    setMessage('');
  };

  return (
    <div className="ai-assistant-card">
      {/* HEADER */}
      <div className="ai-header">
        <div className="d-flex align-items-center gap-2">
          <div className="ai-icon">
            <i className="fas fa-robot"></i>
          </div>
          <div>
            <h6 className="mb-0 fw-semibold">Trợ lý Y tế AI</h6>
            <small>Hỗ trợ chẩn đoán sơ bộ 24/7</small>
          </div>
        </div>
        <button onClick={onClose} className="btn-close btn-close-white" />
      </div>

      {/* BODY */}
      <div className="ai-body">
        {data ? (
          <div className="ai-content">
            {/* Summary */}
            <div className="info-card">
              <div className="info-title">
                <i className="fas fa-clipboard-list text-primary"></i>
                <span>Tóm tắt</span>
              </div>
              <div className="info-text">{data.summary}</div>
            </div>

            {/* Conditions
            <div className="info-card">
              <div className="info-title text-danger">
                <i className="fas fa-search"></i>
                <span>Khả năng mắc bệnh</span>
              </div>
              <ul className="condition-list">
                {data.possible_conditions.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div> */}

            {/* Specialties */}
            <div className="info-card">
              <div className="info-title">
                <i className="fas fa-stethoscope"></i>
                <span>Chuyên khoa tư vấn</span>
              </div>
              <div className="specialty-badges">
                {data.specialties.map((s: any, i: number) => (
                  <span key={i} className="specialty-badge">
                    <i className="fas fa-hospital-user"></i>
                    {s.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Doctors */}
            <div className="info-card">
              <div className="info-title">
                <i className="fas fa-user-md"></i>
                <span>Bác sĩ gợi ý</span>
              </div>
              <div className="doctors-list">
                {data.doctors.map((d: any) => (
                  <div key={d.id} className="doctor-item">
                    <div className="doctor-name">
                      <i className="fas fa-user-circle"></i>
                      {d.full_name}
                    </div>
                    <div className="doctor-clinic">
                      <i className="fas fa-building"></i>
                      {d.clinic_name}
                    </div>
                    <div className="doctor-rating">
                      <span className="rating-badge">
                        <i className="fas fa-star"></i>
                        {d.rating_avg || 'Chưa có đánh giá'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Advice */}
            <div className="advice-alert">
              <i className="fas fa-exclamation-triangle"></i>
              <div>
                <strong>Lời khuyên:</strong>
                <div>{data.advice}</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <i className="fas fa-robot"></i>
            <div>Nhập triệu chứng của bạn để bắt đầu</div>
            <small>AI sẽ phân tích và đưa ra gợi ý sơ bộ</small>
          </div>
        )}

        {loading && (
          <div className="loading-state">
            <div className="spinner-border text-primary" />
            <div>AI đang phân tích...</div>
          </div>
        )}
      </div>

      {/* INPUT */}
      <div className="ai-footer">
        <div className="input-group">
          <span className="input-group-icon">
            <i className="fas fa-comment-medical"></i>
          </span>
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Mô tả triệu chứng của bạn..."
          />
          <button onClick={handleSendMessage} disabled={loading}>
            <i className="fas fa-paper-plane"></i>
            Gửi
          </button>
        </div>
        <div className="disclaimer">
          <i className="fas fa-info-circle"></i>
          *Chẩn đoán chỉ mang tính tham khảo, không thay thế khám bác sĩ
        </div>
      </div>
    </div>
  );
};

export default AIChatAssistant;