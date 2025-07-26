// Re-export useAuth from AuthContext for backward compatibility
export { useAuth } from '../contexts/AuthContext';

// Also export the hook return type for components that need it
export interface UseAuthReturn {
  isAuthenticated: boolean;
  user: any | null;
  loading: boolean;
  authMethod: 'jwt' | 'apikey' | 'none';
  loginMode: 'jwt' | 'apikey' | 'azuread';
  setLoginMode: (mode: 'jwt' | 'apikey' | 'azuread') => void;
  handleLoginSuccess: (token: string) => Promise<boolean>;
  handleApiKeySuccess: (apiKey: string) => void;
  handleLogout: () => void;
}