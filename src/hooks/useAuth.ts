import { useState, useEffect } from 'react';
import { authService, type User } from '../services/auth-service';
import { setApiKey, getAuthMethod, clearAuth } from '../services/api-client';

interface UseAuthReturn {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  authMethod: 'jwt' | 'apikey' | 'none';
  loginMode: 'jwt' | 'apikey' | 'azuread';
  setLoginMode: (mode: 'jwt' | 'apikey' | 'azuread') => void;
  handleLoginSuccess: (token: string) => Promise<boolean>;
  handleApiKeySuccess: (apiKey: string) => void;
  handleLogout: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authMethod, setAuthMethod] = useState<'jwt' | 'apikey' | 'none'>('none');
  const [loginMode, setLoginMode] = useState<'jwt' | 'apikey' | 'azuread'>('apikey');

  useEffect((): void => {
    const currentAuthMethod = getAuthMethod();
    setAuthMethod(currentAuthMethod);

    if (currentAuthMethod === 'jwt') {
      handleJwtAuth();
    } else if (currentAuthMethod === 'apikey') {
      handleApiKeyAuth();
    } else {
      setLoading(false);
    }
  }, []);

  const handleJwtAuth = (): void => {
    if (authService.isAuthenticated()) {
      authService.getUserProfile()
        .then((profile) => {
          if (profile) {
            setUser(profile);
            setIsAuthenticated(true);
          }
        })
        .catch(() => {
          authService.logout();
          clearAuth();
          setAuthMethod('none');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  };

  const handleApiKeyAuth = (): void => {
    setIsAuthenticated(true);
    setUser({ 
      email: 'API Key User',
      permissions: [
        'view:project',
        'view:user',
        'view:location',
        'view:asset',
        'view:equipment',
        'view:role',
        'view:report',
        'view:work_order'
      ]
    } as User);
    setLoading(false);
  };

  const handleLoginSuccess = async (token: string): Promise<boolean> => {
    try {
      await authService.setToken(token);
      const profile = authService.getCurrentUser();
      setUser(profile);
      setIsAuthenticated(true);
      setAuthMethod('jwt');
      return true;
    } catch (error) {
      console.error('Failed to set authentication:', error);
      return false;
    }
  };

  const handleApiKeySuccess = (apiKey: string): void => {
    console.log('🔐 handleApiKeySuccess called with:', apiKey);
    
    // Don't use setApiKey as it clears localStorage - just set directly
    localStorage.setItem('apiKey', apiKey);
    localStorage.removeItem('authToken');
    
    console.log('🔐 API key saved to localStorage:', localStorage.getItem('apiKey'));
    
    // Update state
    setUser({ 
      email: 'API Key User',
      permissions: [
        'view:project',
        'view:user',
        'view:location',
        'view:asset',
        'view:equipment',
        'view:role',
        'view:report',
        'view:work_order'
      ]
    } as User);
    setIsAuthenticated(true);
    setAuthMethod('apikey');
    setLoading(false);
    
    console.log('🔐 Auth state updated - isAuthenticated:', true);
  };

  const handleLogout = (): void => {
    authService.logout();
    clearAuth();
    setUser(null);
    setIsAuthenticated(false);
    setAuthMethod('none');
  };

  return {
    isAuthenticated,
    user,
    loading,
    authMethod,
    loginMode,
    setLoginMode,
    handleLoginSuccess,
    handleApiKeySuccess,
    handleLogout,
  };
};