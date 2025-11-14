'use client';

import { useEffect } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes, FaExclamationTriangle } from 'react-icons/fa';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type, onClose, duration = 5000 }: ToastProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FaCheckCircle className="text-2xl" />;
      case 'error':
        return <FaExclamationCircle className="text-2xl" />;
      case 'warning':
        return <FaExclamationTriangle className="text-2xl" />;
      case 'info':
        return <FaInfoCircle className="text-2xl" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-success/20 border-success text-success';
      case 'error':
        return 'bg-danger/20 border-danger text-danger';
      case 'warning':
        return 'bg-warning/20 border-warning text-warning';
      case 'info':
        return 'bg-brand/20 border-brand text-brand';
    }
  };

  return (
    <div
      className={`flex items-center gap-4 min-w-[320px] max-w-md p-4 rounded-xl border-2 backdrop-blur-md shadow-xl animate-slide-in ${getStyles()}`}
      role="alert"
    >
      <div className="flex-shrink-0">{getIcon()}</div>
      <div className="flex-1">
        <p className="text-sm font-medium text-white">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="flex-shrink-0 hover:scale-110 transition-transform duration-300"
        aria-label="Cerrar notificación"
      >
        <FaTimes />
      </button>
    </div>
  );
}

