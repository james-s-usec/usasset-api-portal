interface AuthSelectorProps {
  loginMode: 'jwt' | 'apikey';
  onModeChange: (mode: 'jwt' | 'apikey') => void;
}

const buttonStyle = (isActive: boolean) => ({
  padding: '8px 16px',
  marginRight: '10px',
  backgroundColor: isActive ? '#007bff' : '#6c757d',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
});

export const AuthSelector = ({ loginMode, onModeChange }: AuthSelectorProps): React.JSX.Element => (
  <div style={{ textAlign: 'center', marginBottom: '20px' }}>
    <div style={{ marginBottom: '20px' }}>
      <button
        onClick={(): void => onModeChange('apikey')}
        style={buttonStyle(loginMode === 'apikey')}
      >
        API Key
      </button>
      <button
        onClick={(): void => onModeChange('jwt')}
        style={buttonStyle(loginMode === 'jwt')}
      >
        Username/Password
      </button>
    </div>
  </div>
);