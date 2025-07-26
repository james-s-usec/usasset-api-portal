import { useEffect } from 'react';
import type { ToastMessage } from '../hooks/useToast';

interface ToastProps {
  message: ToastMessage;
  onDismiss: (id: string) => void;
}

const Toast = ({ message, onDismiss }: ToastProps): React.JSX.Element => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(message.id);
    }, 5000); // Auto dismiss after 5 seconds

    return () => clearTimeout(timer);
  }, [message.id, onDismiss]);

  const getBackgroundColor = (): string => {
    switch (message.type) {
      case 'success': return '#28a745';
      case 'error': return '#dc3545';
      case 'info': return '#17a2b8';
      default: return '#6c757d';
    }
  };

  const toastStyle: React.CSSProperties = {
    backgroundColor: getBackgroundColor(),
    color: 'white',
    padding: '12px 20px',
    marginBottom: '10px',
    borderRadius: '4px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    minWidth: '300px',
    animation: 'slideIn 0.3s ease-out'
  };

  const buttonStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    color: 'white',
    fontSize: '20px',
    cursor: 'pointer',
    marginLeft: '10px'
  };

  return (
    <div style={toastStyle}>
      <span>{message.message}</span>
      <button style={buttonStyle} onClick={() => onDismiss(message.id)}>
        ×
      </button>
    </div>
  );
};

interface ToastContainerProps {
  messages: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer = ({ messages, onDismiss }: ToastContainerProps): React.JSX.Element | null => {
  if (messages.length === 0) return null;

  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    top: '20px',
    right: '20px',
    zIndex: 1000
  };

  return (
    <div style={containerStyle}>
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
      {messages.map(msg => (
        <Toast key={msg.id} message={msg} onDismiss={onDismiss} />
      ))}
    </div>
  );
};