import { useState } from 'react';

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
      // For server-side (Web App) flow, we don't use MSAL - just redirect to Azure AD
      const tenantId = import.meta.env.VITE_AZURE_AD_TENANT_ID;
      const clientId = import.meta.env.VITE_AZURE_AD_CLIENT_ID;
      const redirectUri = import.meta.env.VITE_AZURE_AD_REDIRECT_URI || `${window.location.origin}/auth/callback`;
      
      // Build the Azure AD authorization URL
      const authUrl = new URL(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize`);
      
      // Add required parameters for authorization code flow (without PKCE)
      authUrl.searchParams.append('client_id', clientId);
      authUrl.searchParams.append('response_type', 'code');
      authUrl.searchParams.append('redirect_uri', redirectUri);
      authUrl.searchParams.append('response_mode', 'fragment'); // Return code in URL fragment
      authUrl.searchParams.append('scope', 'openid profile email User.Read');
      authUrl.searchParams.append('state', crypto.randomUUID()); // For CSRF protection
      
      // Redirect to Azure AD login
      window.location.href = authUrl.toString();
    } catch (error: any) {
      console.error('Azure AD login error:', error);
      setError('Failed to initiate Azure AD login. Please try again.');
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