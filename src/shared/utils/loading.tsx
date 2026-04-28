/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/shared/utils/loading.tsx
import React, { useState, useEffect } from 'react';
import './styles/loading.css';
import logo from '@/images/logo.png';

interface FullScreenLoadingProps {
  message?: string;
  show?: boolean;
  minDisplayTime?: number; // Thời gian tối thiểu hiển thị (ms)
}

const ScreenLoading: React.FC<FullScreenLoadingProps> = ({ 
  message = 'Đang tải dữ liệu...', 
  show = true,
  minDisplayTime = 2000 // Mặc định 2 giây
}) => {
  const [shouldRender, setShouldRender] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    let timer: any;
    
    if (show) {
      // Hiển thị loading ngay lập tức
      setShouldRender(true);
      setIsExiting(false);
    } else {
      // Khi show = false, thêm delay trước khi ẩn
      setIsExiting(true);
      timer = setTimeout(() => {
        setShouldRender(false);
      }, minDisplayTime);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [show, minDisplayTime]);

  if (!shouldRender) return null;

  return (
    <div className={`fullscreen-overlay ${isExiting ? 'fade-out' : 'fade-in'}`}>
      <div className={`loading-container ${isExiting ? 'scale-out' : 'scale-in'}`}>
        {/* Logo với hiệu ứng */}
        <div className="logo-wrapper">
          <img src={logo} alt="Loading" className="loading-logo" />
          
          {/* Vòng tròn bao quanh logo */}
          <div className="loading-ring"></div>
          <div className="loading-ring-delayed"></div>
          
          {/* Các chấm tròn xoay quanh */}
          <div className="orbiting-dots">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        </div>

        {/* Text loading với hiệu ứng */}
        <div className="loading-text-wrapper">
          <p className="loading-message">{message}</p>
          <div className="loading-dots">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </div>
        </div>

        {/* Thanh progress bar nhỏ */}
        <div className="progress-bar-container">
          <div className="progress-bar"></div>
        </div>
      </div>
    </div>
  );
};

export default ScreenLoading;