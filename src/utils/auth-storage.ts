// Simple localStorage wrapper for auth tokens
// Keep it boring - just get, set, clear

const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  API_KEY: 'apiKey'
} as const;

// JWT token parsing utility
function parseJWT(token: string): { exp?: number } | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

// Token expiration utilities
export const tokenUtils = {
  isTokenExpired(token: string): boolean {
    const payload = parseJWT(token);
    if (!payload?.exp) return false;
    
    // Add 30 second buffer to prevent edge cases
    return Date.now() >= (payload.exp * 1000) - 30000;
  },

  getTokenExpirationTime(token: string): Date | null {
    const payload = parseJWT(token);
    if (!payload?.exp) return null;
    
    return new Date(payload.exp * 1000);
  },

  getTimeUntilExpiration(token: string): number {
    const payload = parseJWT(token);
    if (!payload?.exp) return 0;
    
    return Math.max(0, (payload.exp * 1000) - Date.now());
  }
};

export const authStorage = {
  // JWT token methods
  getToken(): string | null {
    return sessionStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  },

  setToken(token: string): void {
    sessionStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    sessionStorage.removeItem(STORAGE_KEYS.API_KEY);
  },

  clearToken(): void {
    sessionStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  },

  // API key methods
  getApiKey(): string | null {
    return sessionStorage.getItem(STORAGE_KEYS.API_KEY);
  },

  setApiKey(key: string): void {
    sessionStorage.setItem(STORAGE_KEYS.API_KEY, key);
    sessionStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  },

  clearApiKey(): void {
    sessionStorage.removeItem(STORAGE_KEYS.API_KEY);
  },

  // Clear all auth
  clearAll(): void {
    sessionStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    sessionStorage.removeItem(STORAGE_KEYS.API_KEY);
  },

  // Check what auth type we have
  getAuthType(): 'jwt' | 'apikey' | 'none' {
    if (this.getToken()) return 'jwt';
    if (this.getApiKey()) return 'apikey';
    return 'none';
  },

  // Token expiration utilities
  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    return tokenUtils.isTokenExpired(token);
  },

  getTokenExpirationTime(): Date | null {
    const token = this.getToken();
    if (!token) return null;
    
    return tokenUtils.getTokenExpirationTime(token);
  },

  getTimeUntilExpiration(): number {
    const token = this.getToken();
    if (!token) return 0;
    
    return tokenUtils.getTimeUntilExpiration(token);
  },

  // Cross-tab event handling
  dispatchAuthExpired(): void {
    window.dispatchEvent(new CustomEvent('auth-expired', {
      detail: { timestamp: Date.now() }
    }));
  },

  onAuthExpired(callback: () => void): (() => void) {
    const handler = (): void => callback();
    window.addEventListener('auth-expired', handler);
    
    // Return cleanup function
    return (): void => window.removeEventListener('auth-expired', handler);
  }
};