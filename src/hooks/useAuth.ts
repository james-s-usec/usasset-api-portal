import { useState, useEffect } from 'react';
import { authService, type User } from '../services/auth-service';
import { setApiKey, getAuthMethod, clearAuth } from '../services/api-client';

interface UseAuthReturn {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  authMethod: 'jwt' | 'apikey' | 'none';
  loginMode: 'jwt' | 'apikey';
  setLoginMode: (mode: 'jwt' | 'apikey') => void;
  handleLoginSuccess: (token: string) => Promise<void>;
  handleApiKeySuccess: (apiKey: string) => void;
  handleLogout: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authMethod, setAuthMethod] = useState<'jwt' | 'apikey' | 'none'>('none');
  const [loginMode, setLoginMode] = useState<'jwt' | 'apikey'>('apikey');

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
    setUser({ email: 'API Key User' } as User);
    setLoading(false);
  };

  const handleLoginSuccess = async (token: string): Promise<void> => {
    try {
      await authService.setToken(token);
      const profile = authService.getCurrentUser();
      setUser(profile);
      setIsAuthenticated(true);
      setAuthMethod('jwt');
    } catch (error) {
      console.error('Failed to set authentication:', error);
    }
  };

  const handleApiKeySuccess = (apiKey: string): void => {
    setApiKey(apiKey);
    setUser({ email: 'API Key User' } as User);
    setIsAuthenticated(true);
    setAuthMethod('apikey');
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