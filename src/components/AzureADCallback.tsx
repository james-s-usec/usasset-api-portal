import { useEffect, useState } from 'react';
import { authApi } from '../services/api-client';
import { useNavigate } from 'react-router-dom';

interface AzureADCallbackProps {
  onLoginSuccess: (token: string) => Promise<void>;
}

export const AzureADCallback = ({ onLoginSuccess }: AzureADCallbackProps): React.JSX.Element => {
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async (): Promise<void> => {
      try {
        // Debug: Log the full URL to see what we're actually getting
        console.log('Full callback URL:', window.location.href);
        console.log('Search params:', window.location.search);
        
        // Check if we have an auth code in the URL first
        // Azure AD can return the code in either query params (?code=) or hash fragment (#code=)
        const urlParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.substring(1)); // Remove the # and parse
        
        const authCode = urlParams.get('code') || hashParams.get('code');
        const error = urlParams.get('error') || hashParams.get('error');
        const errorDescription = urlParams.get('error_description') || hashParams.get('error_description');

        console.log('URL Parameters:', { authCode: !!authCode, error, errorDescription });
        console.log('Actual auth code value:', authCode);

        if (error) {
          throw new Error(`Azure AD Error: ${error} - ${errorDescription || 'Authentication failed'}`);
        }

        if (!authCode) {
          throw new Error('No authorization code found in callback URL');
        }

        // Server-side (Web App) flow - just send the auth code to our backend
        // The backend will use client_secret to exchange it for tokens
        console.log('Exchanging auth code with backend...');
        
        const apiResponse = await authApi.authControllerAzureCallback({
          code: authCode,
          redirectUri: import.meta.env.VITE_AZURE_AD_REDIRECT_URI || `${window.location.origin}/auth/callback`
          // No projectId - backend will use default project 00000000-0000-0000-0000-000000000000
          // No codeVerifier - backend uses client_secret instead
        });

        console.log('Backend response:', apiResponse.data);
        console.log('🎯 Access token received:', apiResponse.data.data?.accessToken?.substring(0, 20) + '...');

        if (apiResponse.data.data?.accessToken) {
          await onLoginSuccess(apiResponse.data.data.accessToken);
          navigate('/dashboard'); // Redirect to dashboard after successful login
        } else {
          throw new Error('No access token received from server');
        }

      } catch (error: any) {
        console.error('Azure AD callback error:', error);
        if (error.response) {
          console.error('Error response:', error.response.data);
          console.error('Error status:', error.response.status);
        }
        setError(error.response?.data?.message || error.message || 'Authentication failed. Please try again.');
      } finally {
        setProcessing(false);
      }
    };

    handleCallback();
  }, [onLoginSuccess, navigate]);

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '20px'
  };

  const messageStyle: React.CSSProperties = {
    fontSize: '18px',
    marginBottom: '20px',
    textAlign: 'center'
  };

  const errorStyle: React.CSSProperties = {
    color: '#dc3545',
    fontSize: '16px',
    marginBottom: '20px',
    textAlign: 'center'
  };

  const buttonStyle: React.CSSProperties = {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer'
  };

  return (
    <div style={containerStyle}>
      {processing && !error && (
        <>
          <div style={messageStyle}>Processing authentication...</div>
          <div>Please wait while we complete your sign-in.</div>
        </>
      )}
      
      {error && (
        <>
          <div style={errorStyle}>{error}</div>
          <button 
            style={buttonStyle}
            onClick={() => navigate('/')}
          >
            Return to Login
          </button>
        </>
      )}
      
      {!processing && !error && (
        <div style={messageStyle}>Authentication successful! Redirecting...</div>
      )}
    </div>
  );
};