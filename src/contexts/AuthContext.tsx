import React, { createContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { ApiClient } from '../api/api-client';
import type { User } from '../types/api-types';
import { authStorage } from '../utils/auth-storage';

// Types
export type AuthMethod = 'jwt' | 'apikey' | 'none';
export type LoginMode = 'jwt' | 'apikey' | 'azuread';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  apiKey: string | null;
  authMethod: AuthMethod;
  loginMode: LoginMode;
  loading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  login: (token: string) => Promise<boolean>;
  logout: () => void;
  setApiKey: (key: string) => void;
  clearApiKey: () => void;
  initializeAzureAuth: (code: string) => Promise<boolean>;
  setLoginMode: (mode: LoginMode) => void;
  clearError: () => void;
  checkExistingAuth: () => Promise<void>;
  
  // Backward compatibility aliases
  handleLoginSuccess: (token: string) => Promise<boolean>;
  handleApiKeySuccess: (apiKey: string) => void;
  handleLogout: () => void;
}

// Default state
const defaultState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  apiKey: null,
  authMethod: 'none',
  loginMode: 'jwt',
  loading: true,
  error: null
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Export for use in hook file
export { AuthContext };

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>(defaultState);

  // Simple state updater
  const updateState = (updates: Partial<AuthState>): void => {
    setState(prev => ({ ...prev, ...updates }));
  };

  // Load user profile
  const loadUserProfile = async (token: string): Promise<User | null> => {
    try {
      const response = await ApiClient.getUserProfile(token);
      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Failed to load user profile:', error);
      return null;
    }
  };

  // Check existing authentication
  const checkExistingAuth = useCallback(async () => {
    updateState({ loading: true, error: null });
    
    // Check JWT first
    const token = authStorage.getToken();
    if (token) {
      // Check if token is expired
      if (authStorage.isTokenExpired()) {
        authStorage.clearToken();
        authStorage.dispatchAuthExpired();
        updateState({ isAuthenticated: false, loading: false });
        return;
      }

      const user = await loadUserProfile(token);
      if (user) {
        updateState({
          isAuthenticated: true,
          user,
          token,
          authMethod: 'jwt',
          loading: false
        });
        return;
      }
      authStorage.clearToken();
    }

    // Then check API key
    const apiKey = authStorage.getApiKey();
    if (apiKey) {
      updateState({
        isAuthenticated: true,
        apiKey,
        authMethod: 'apikey',
        loading: false
      });
      return;
    }

    // No auth found
    updateState({ isAuthenticated: false, loading: false });
  }, []);

  // JWT login
  const login = useCallback(async (token: string): Promise<boolean> => {
    updateState({ loading: true, error: null });
    
    authStorage.setToken(token);
    const user = await loadUserProfile(token);
    
    if (user) {
      updateState({
        isAuthenticated: true,
        user,
        token,
        apiKey: null,
        authMethod: 'jwt',
        loading: false
      });
      return true;
    }

    authStorage.clearToken();
    updateState({
      isAuthenticated: false,
      loading: false,
      error: 'Failed to load user profile'
    });
    return false;
  }, []);

  // Logout
  const logout = useCallback(() => {
    authStorage.clearAll();
    setState({ ...defaultState, loading: false });
  }, []);

  // Set API key
  const setApiKey = useCallback((key: string) => {
    authStorage.setApiKey(key);
    updateState({
      isAuthenticated: true,
      user: null,
      token: null,
      apiKey: key,
      authMethod: 'apikey',
      loading: false,
      error: null
    });
  }, []);

  // Clear API key
  const clearApiKey = useCallback(() => {
    authStorage.clearApiKey();
    updateState({
      isAuthenticated: false,
      apiKey: null,
      authMethod: 'none'
    });
  }, []);

  // Azure AD initialization
  const initializeAzureAuth = useCallback(async (code: string): Promise<boolean> => {
    updateState({ loading: true, error: null });
    
    try {
      const response = await ApiClient.exchangeAzureCode(code);
      
      if (response.success && response.data?.access_token) {
        return await login(response.data.access_token);
      }

      updateState({
        loading: false,
        error: response.error || 'Azure authentication failed'
      });
      return false;
    } catch {
      updateState({
        loading: false,
        error: 'Azure authentication failed'
      });
      return false;
    }
  }, [login]);

  // Set login mode
  const setLoginMode = useCallback((mode: LoginMode) => {
    updateState({ loginMode: mode });
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    updateState({ error: null });
  }, []);

  // Check auth on mount
  useEffect(() => {
    checkExistingAuth();
  }, [checkExistingAuth]);

  // Auto-logout on token expiration
  useEffect(() => {
    if (!state.isAuthenticated || state.authMethod !== 'jwt') return;

    const token = authStorage.getToken();
    if (!token) return;

    const timeUntilExpiration = authStorage.getTimeUntilExpiration();
    if (timeUntilExpiration <= 0) {
      logout();
      return;
    }

    // Set timeout to logout when token expires
    const timeoutId = setTimeout(() => {
      logout();
      authStorage.dispatchAuthExpired();
    }, timeUntilExpiration);

    return () => clearTimeout(timeoutId);
  }, [state.isAuthenticated, state.authMethod, logout]);

  // Listen for cross-tab auth expiration events
  useEffect(() => {
    const cleanup = authStorage.onAuthExpired(() => {
      if (state.isAuthenticated) {
        logout();
      }
    });

    return cleanup;
  }, [state.isAuthenticated, logout]);

  // Context value
  const contextValue: AuthContextType = {
    ...state,
    login,
    logout,
    setApiKey,
    clearApiKey,
    initializeAzureAuth,
    setLoginMode,
    clearError,
    checkExistingAuth,
    // Backward compatibility
    handleLoginSuccess: login,
    handleApiKeySuccess: setApiKey,
    handleLogout: logout
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;