// Simple localStorage wrapper for auth tokens
// Keep it boring - just get, set, clear

const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  API_KEY: 'apiKey'
} as const;

export const authStorage = {
  // JWT token methods
  getToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  },

  setToken(token: string): void {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    localStorage.removeItem(STORAGE_KEYS.API_KEY);
  },

  clearToken(): void {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  },

  // API key methods
  getApiKey(): string | null {
    return localStorage.getItem(STORAGE_KEYS.API_KEY);
  },

  setApiKey(key: string): void {
    localStorage.setItem(STORAGE_KEYS.API_KEY, key);
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  },

  clearApiKey(): void {
    localStorage.removeItem(STORAGE_KEYS.API_KEY);
  },

  // Clear all auth
  clearAll(): void {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.API_KEY);
  },

  // Check what auth type we have
  getAuthType(): 'jwt' | 'apikey' | 'none' {
    if (this.getToken()) return 'jwt';
    if (this.getApiKey()) return 'apikey';
    return 'none';
  }
};