import { useState } from 'react';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

// Hook for managing toasts
export const useToast = (): {
  toasts: ToastMessage[];
  showToast: (message: string, type: ToastMessage['type']) => void;
  dismissToast: (id: string) => void;
} => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: ToastMessage['type'] = 'info'): void => {
    const newToast: ToastMessage = {
      id: Date.now().toString(),
      message,
      type
    };
    setToasts(prev => [...prev, newToast]);
  };

  const dismissToast = (id: string): void => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return { toasts, showToast, dismissToast };
};