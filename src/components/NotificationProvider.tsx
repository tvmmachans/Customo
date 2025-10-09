import React, { createContext, useContext, useCallback, useState, ReactNode } from 'react';
import { toast } from 'sonner';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationContextType {
  showNotification: (notification: Omit<Notification, 'id'>) => string;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification = { ...notification, id };

    setNotifications(prev => [...prev, newNotification]);

    // Auto remove after duration
    const duration = notification.duration || 5000;
    setTimeout(() => {
      removeNotification(id);
    }, duration);

    // Show toast notification
    const toastOptions = {
      duration: duration,
      action: notification.action ? {
        label: notification.action.label,
        onClick: notification.action.onClick,
      } : undefined,
    };

    switch (notification.type) {
      case 'success':
        toast.success(notification.title, {
          description: notification.message,
          ...toastOptions,
        });
        break;
      case 'error':
        toast.error(notification.title, {
          description: notification.message,
          ...toastOptions,
        });
        break;
      case 'warning':
        toast.warning(notification.title, {
          description: notification.message,
          ...toastOptions,
        });
        break;
      case 'info':
        toast.info(notification.title, {
          description: notification.message,
          ...toastOptions,
        });
        break;
    }

    return id;
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        showNotification,
        removeNotification,
        clearAllNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// Helper functions for common notifications
export const useNotificationHelpers = () => {
  const { showNotification } = useNotification();

  const showSuccess = useCallback((title: string, message?: string) => {
    return showNotification({
      type: 'success',
      title,
      message,
    });
  }, [showNotification]);

  const showError = useCallback((title: string, message?: string) => {
    return showNotification({
      type: 'error',
      title,
      message,
    });
  }, [showNotification]);

  const showWarning = useCallback((title: string, message?: string) => {
    return showNotification({
      type: 'warning',
      title,
      message,
    });
  }, [showNotification]);

  const showInfo = useCallback((title: string, message?: string) => {
    return showNotification({
      type: 'info',
      title,
      message,
    });
  }, [showNotification]);

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};

export default NotificationProvider;
