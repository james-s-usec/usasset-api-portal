import { useState } from 'react';
import { authApi } from '../services/api-client';

interface LoginFormProps {
  onLoginSuccess: (token: string) => Promise<void>;
}

const inputStyle = {
  width: '100%',
  padding: '8px',
  borderRadius: '4px',
  border: '1px solid #ccc'
};

const formGroupStyle = { marginBottom: '15px' };
const labelStyle = { display: 'block', marginBottom: '5px' };

const getErrorMessage = (err: unknown): string => {
  return err instanceof Error && 'response' in err 
    ? (err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Login failed'
    : 'Login failed';
};

const renderEmailField = (email: string, setEmail: (value: string) => void): React.JSX.Element => (
  <div style={formGroupStyle}>
    <label htmlFor="email" style={labelStyle}>Email:</label>
    <input
      type="email"
      id="email"
      value={email}
      onChange={(e): void => setEmail(e.target.value)}
      required
      style={inputStyle}
    />
  </div>
);

const renderPasswordField = (password: string, setPassword: (value: string) => void): React.JSX.Element => (
  <div style={formGroupStyle}>
    <label htmlFor="password" style={labelStyle}>Password:</label>
    <input
      type="password"
      id="password"
      value={password}
      onChange={(e): void => setPassword(e.target.value)}
      required
      style={inputStyle}
    />
  </div>
);

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
      backgroundColor: loading ? '#ccc' : '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: loading ? 'not-allowed' : 'pointer'
    }}
  >
    {loading ? 'Logging in...' : 'Login'}
  </button>
);

export const LoginForm = ({ onLoginSuccess }: LoginFormProps): React.JSX.Element => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authApi.authControllerLogin({ email, password });
      const token = response.data.data?.accessToken;
      
      if (token) {
        await onLoginSuccess(token);
      } else {
        setError('No token received from server');
      }
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      maxWidth: '400px', 
      margin: '100px auto', 
      padding: '20px', 
      border: '1px solid #ccc', 
      borderRadius: '8px' 
    }}>
      <h2>USAsset Portal Login</h2>
      <form onSubmit={handleSubmit}>
        {renderEmailField(email, setEmail)}
        {renderPasswordField(password, setPassword)}
        {renderErrorMessage(error)}
        {renderSubmitButton(loading)}
      </form>
    </div>
  );
};