import { useState, useEffect } from 'react';

interface HealthResponse {
  status: string;
  timestamp: string;
}

export function ConnectionStatus() {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [details, setDetails] = useState<string>('');

  useEffect(() => {
    checkConnection();
    // Check every 30 seconds
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkConnection = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/v1/health`);
      
      if (response.ok) {
        const data: HealthResponse = await response.json();
        setStatus('connected');
        setDetails(`API: ${apiUrl}`);
      } else {
        setStatus('error');
        setDetails(`API returned ${response.status}`);
      }
    } catch (error) {
      setStatus('error');
      setDetails(error instanceof Error ? error.message : 'Connection failed');
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'connected': return '#4CAF50';
      case 'error': return '#f44336';
      default: return '#FFC107';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'connected': return '● Connected';
      case 'error': return '● Disconnected';
      default: return '● Checking...';
    }
  };

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
      <div style={{ color: getStatusColor(), fontWeight: 'bold' }}>
        {getStatusText()}
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