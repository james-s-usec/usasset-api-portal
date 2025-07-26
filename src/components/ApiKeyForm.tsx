import { useState } from 'react';

interface ApiKeyFormProps {
  onApiKeySuccess: (apiKey: string) => void;
}

const inputStyle = {
  width: '100%',
  padding: '8px',
  borderRadius: '4px',
  border: '1px solid #ccc'
};

const formGroupStyle = { marginBottom: '15px' };
const labelStyle = { display: 'block', marginBottom: '5px' };

const containerStyle = {
  maxWidth: '400px',
  margin: '100px auto',
  padding: '20px',
  border: '1px solid #ccc',
  borderRadius: '8px'
};

const testApiKey = async (key: string): Promise<boolean> => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3009/v1';
    const response = await fetch(`${apiUrl}/users`, {
      headers: { 'x-api-key': key }
    });
    return response.ok;
  } catch {
    return false;
  }
};

const renderErrorMessage = (error: string): React.JSX.Element | null => {
  if (!error) return null;
  return (
    <div style={{
      color: 'red',
      marginBottom: '15px',
      padding: '8px',
      backgroundColor: '#ffe6e6',
      borderRadius: '4px'
    }}>
      {error}
    </div>
  );
};

const renderSubmitButton = (loading: boolean): React.JSX.Element => (
  <button
    type="submit"
    disabled={loading}
    style={{
      width: '100%',
      padding: '10px',
      backgroundColor: loading ? '#ccc' : '#28a745',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: loading ? 'not-allowed' : 'pointer'
    }}
  >
    {loading ? 'Validating...' : 'Connect with API Key'}
  </button>
);

export const ApiKeyForm = ({ onApiKeySuccess }: ApiKeyFormProps): React.JSX.Element => {
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!apiKey.trim()) {
      setError('API key is required');
      return;
    }

    setLoading(true);
    setError('');

    const isValid = await testApiKey(apiKey.trim());
    
    if (isValid) {
      onApiKeySuccess(apiKey.trim());
    } else {
      setError('Invalid API key or server not available');
    }
    
    setLoading(false);
  };

  return (
    <div style={containerStyle}>
      <h2>USAsset Portal - API Key</h2>
      <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
        Enter your API key to access the portal
      </p>
      
      <form onSubmit={handleSubmit}>
        <div style={formGroupStyle}>
          <label htmlFor="apiKey" style={labelStyle}>API Key:</label>
          <input
            type="text"
            id="apiKey"
            value={apiKey}
            onChange={(e): void => setApiKey(e.target.value)}
            placeholder="e.g., test-key-123"
            required
            style={inputStyle}
          />
        </div>
        {renderErrorMessage(error)}
        {renderSubmitButton(loading)}
      </form>
    </div>
  );
};