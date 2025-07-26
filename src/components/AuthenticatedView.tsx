import type { User } from '../types/api-types';

interface AuthenticatedViewProps {
  user: User | null;
  authMethod: 'jwt' | 'apikey' | 'none';
  onLogout: () => void;
}

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '20px'
};

const logoutButtonStyle = {
  marginLeft: '10px',
  padding: '5px 10px',
  backgroundColor: '#dc3545',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
};

export const AuthenticatedView = ({ user, authMethod, onLogout }: AuthenticatedViewProps): React.JSX.Element => (
  <div style={{ padding: '20px' }}>
    <div style={headerStyle}>
      <h1>USAsset Portal</h1>
      <div>
        <span>Welcome, {user?.email || 'User'}</span>
        <button onClick={onLogout} style={logoutButtonStyle}>
          Logout
        </button>
      </div>
    </div>
    
    <div className="card">
      <p>Welcome to the USAsset Portal - You are now logged in!</p>
      <p>User: {user?.email}</p>
      <p>Auth Method: {authMethod === 'apikey' ? 'API Key (Full Access)' : 'JWT Token'}</p>
      {authMethod === 'jwt' && user?.permissions && (
        <p>Permissions: {user.permissions.join(', ')}</p>
      )}
      {authMethod === 'apikey' && (
        <p style={{ color: '#28a745' }}>✓ API Key provides full access to all endpoints</p>
      )}
    </div>
  </div>
);