import { useState, useEffect } from 'react';

type ConnectionStatusType = 'checking' | 'connected' | 'error';

const checkApiConnection = async (): Promise<{ status: ConnectionStatusType; details: string }> => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3009/v1';
    const response = await fetch(`${apiUrl}/health`, {
      credentials: 'include', // Include cookies for CORS
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      await response.json(); // Verify response is valid JSON
      return { status: 'connected', details: `API: ${apiUrl}` };
    } else {
      return { status: 'error', details: `API returned ${response.status}` };
    }
  } catch (error) {
    const details = error instanceof Error ? error.message : 'Connection failed';
    return { status: 'error', details };
  }
};

const getStatusColor = (status: ConnectionStatusType): string => {
  switch (status) {
    case 'connected': return '#4CAF50';
    case 'error': return '#f44336';
    default: return '#FFC107';
  }
};

const getStatusText = (status: ConnectionStatusType): string => {
  switch (status) {
    case 'connected': return '● Connected';
    case 'error': return '● Disconnected';
    default: return '● Checking...';
  }
};

export function ConnectionStatus(): React.JSX.Element {
  const [status, setStatus] = useState<ConnectionStatusType>('checking');
  const [details, setDetails] = useState<string>('');

  const checkConnection = async (): Promise<void> => {
    const result = await checkApiConnection();
    setStatus(result.status);
    setDetails(result.details);
  };

  useEffect((): void => {
    checkConnection();
    // No automatic interval - only manual refresh
  }, []);
  
  // Don't show connection status if we're getting rate limited
  if (status === 'error' && details.includes('429')) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: 20,
      right: 20,
      padding: '10px 15px',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      borderRadius: 8,
      fontSize: '14px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
      zIndex: 1000
    }}>
      <div style={{ color: getStatusColor(status), fontWeight: 'bold' }}>
        {getStatusText(status)}
      </div>
      {details && (
        <div style={{ fontSize: '12px', marginTop: '4px', opacity: 0.8 }}>
          {details}
        </div>
      )}
      <button
        onClick={checkConnection}
        style={{
          marginTop: '8px',
          padding: '4px 8px',
          fontSize: '12px',
          backgroundColor: 'transparent',
          border: '1px solid rgba(255,255,255,0.3)',
          color: 'white',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Refresh
      </button>
    </div>
  );
}