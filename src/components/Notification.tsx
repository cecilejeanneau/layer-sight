import React, { useState, useEffect } from 'react';
import { X, Wifi, AlertTriangle, CheckCircle } from 'lucide-react';

interface NotificationProps {
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  autoClose?: boolean;
  duration?: number;
  onClose?: () => void;
}

export const Notification: React.FC<NotificationProps> = ({
  type,
  title,
  message,
  autoClose = false,
  duration = 5000,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  if (!isVisible) return null;

  const icons = {
    success: CheckCircle,
    warning: AlertTriangle,
    error: X,
    info: Wifi
  };

  const styles = {
    success: 'bg-green-500 border-green-400',
    warning: 'bg-orange-500 border-orange-400',
    error: 'bg-red-500 border-red-400',
    info: 'bg-blue-500 border-blue-400'
  };

  const Icon = icons[type];

  return (
    <div className={`fixed top-4 right-4 z-50 ${styles[type]} text-white rounded-lg shadow-lg border p-4 max-w-sm animate-slide-in`}>
      <div className="flex items-start">
        <Icon className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h4 className="font-medium text-sm">{title}</h4>
          <p className="text-sm opacity-90 mt-1">{message}</p>
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            onClose?.();
          }}
          className="ml-3 p-1 hover:bg-black hover:bg-opacity-20 rounded transition-colors"
          title="Fermer la notification"
          aria-label="Fermer la notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

interface NotificationSystemProps {
  notifications: Array<{
    id: string;
    type: 'success' | 'warning' | 'error' | 'info';
    title: string;
    message: string;
    autoClose?: boolean;
    duration?: number;
  }>;
  onRemove: (id: string) => void;
}

export const NotificationSystem: React.FC<NotificationSystemProps> = ({
  notifications,
  onRemove
}) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          type={notification.type}
          title={notification.title}
          message={notification.message}
          autoClose={notification.autoClose}
          duration={notification.duration}
          onClose={() => onRemove(notification.id)}
        />
      ))}
    </div>
  );
};