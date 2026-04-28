import React, { useState } from 'react';

interface AIChatAssistantProps {
  onClose: () => void;
}

const AIChatAssistant: React.FC<AIChatAssistantProps> = ({ onClose }) => {
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (message.trim()) {
      // Handle AI chat logic
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  return (
    <div className="ai-assistant-card card shadow-lg border-0">
      {/* Header */}
      <div className="ai-header p-3 text-white rounded-top-3 d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-2">
          <i className="fas fa-robot"></i>
          <div>
            <h6 className="mb-0 fw-semibold">Trợ lý Y tế AI</h6>
            <small className="opacity-75">Luôn sẵn sàng hỗ trợ bạn</small>
          </div>
        </div>
        <button
          onClick={onClose}
          className="btn-close btn-close-white"
        ></button>
      </div>

      {/* Chat Body */}
      <div className="ai-body p-3">
        <div className="ai-message mb-3">
          <div className="bg-light rounded-3 p-3">
            <p className="mb-0 small">
              Xin chào! Tôi là trợ lý y tế ảo. Hãy mô tả triệu chứng của bạn để
              tôi gợi ý chuyên khoa và bác sĩ phù hợp nhé!
            </p>
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="ai-footer p-3 border-top">
        <div className="input-group">
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="Mô tả triệu chứng của bạn..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button
            onClick={handleSendMessage}
            className="btn btn-primary btn-sm"
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChatAssistant;
