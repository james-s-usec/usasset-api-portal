import { useState } from 'react';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig, loginRequest } from '../config/azuread-config';
import { authApi } from '../services/api-client';

interface AzureADFormProps {
  onLoginSuccess: (token: string) => Promise<void>;
}

export const AzureADForm = ({ onLoginSuccess }: AzureADFormProps): React.JSX.Element => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAzureLogin = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      // Initialize MSAL instance
      const msalInstance = new PublicClientApplication(msalConfig);
      await msalInstance.initialize();

      // Check if there's an interaction in progress
      const activeAccount = msalInstance.getActiveAccount();
      const accounts = msalInstance.getAllAccounts();
      
      if (!activeAccount && accounts.length === 0) {
        // No active session, proceed with login
        await msalInstance.loginRedirect(loginRequest);
      } else {
        // Clear any existing sessions first
        await msalInstance.clearCache();
        await msalInstance.loginRedirect(loginRequest);
      }
    } catch (msalError: any) {
      console.error('Azure AD login error:', msalError);
      
      // Handle specific MSAL errors
      if (msalError.errorCode === 'user_cancelled') {
        setError('Login was cancelled.');
      } else {
        setError('Azure AD login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const containerStyle: React.CSSProperties = {
    backgroundColor: '#f8f9fa',
    padding: '30px',
    borderRadius: '8px',
    border: '1px solid #dee2e6',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    maxWidth: '400px',
    width: '100%'
  };

  const buttonStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px',
    backgroundColor: '#0078d4',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: loading ? 'not-allowed' : 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    opacity: loading ? 0.7 : 1
  };

  const errorStyle: React.CSSProperties = {
    color: '#dc3545',
    marginTop: '10px',
    fontSize: '14px',
    textAlign: 'center'
  };

  const microsoftLogoStyle: React.CSSProperties = {
    width: '20px',
    height: '20px'
  };

  return (
    <div style={containerStyle}>
      <h3 style={{ marginBottom: '20px', textAlign: 'center', color: '#212529' }}>Azure AD Login</h3>
      
      <button
        onClick={handleAzureLogin}
        disabled={loading}
        style={buttonStyle}
      >
        <svg
          viewBox="0 0 21 21"
          style={microsoftLogoStyle}
          fill="currentColor"
        >
          <rect x="0" y="0" width="10" height="10" fill="#f25022"/>
          <rect x="11" y="0" width="10" height="10" fill="#7fba00"/>
          <rect x="0" y="11" width="10" height="10" fill="#00a4ef"/>
          <rect x="11" y="11" width="10" height="10" fill="#ffb900"/>
        </svg>
        {loading ? 'Signing in...' : 'Sign in with Microsoft'}
      </button>

      {error && <div style={errorStyle}>{error}</div>}

      <div style={{ marginTop: '20px', fontSize: '12px', color: '#6c757d', textAlign: 'center' }}>
        Use your organizational account to sign in
      </div>
    </div>
  );
};