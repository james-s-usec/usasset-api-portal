import { Configuration } from '../api-sdk/dist/configuration.js';
import { AuthenticationApi, UsersApi, ProjectsApi } from '../api-sdk/dist/api.js';
import type { AxiosInstance } from 'axios';

// Create configuration with API key support
const config = new Configuration({
  basePath: import.meta.env.VITE_API_URL || 'http://localhost:3009/v1',
  accessToken: (): string => {
    // Get JWT token from localStorage
    const token = localStorage.getItem('authToken') || '';
    console.log('🔑 API Client getting token:', token ? `${token.substring(0, 20)}...` : 'NO TOKEN');
    console.log('🔍 Token check - localStorage has:', localStorage.getItem('authToken') ? 'TOKEN EXISTS' : 'NO TOKEN');
    return token;
  },
  baseOptions: {
    headers: {
      // Dynamic header function to always get current API key
      get 'x-api-key'() {
        const apiKey = localStorage.getItem('apiKey') || '';
        if (apiKey) {
          console.log('🔐 API Client using API key:', apiKey.substring(0, 10) + '...');
        }
        return apiKey;
      }
    },
    withCredentials: true, // Enable CORS credentials
  }
});

// Export API instances
export const authApi = new AuthenticationApi(config);
export const usersApi = new UsersApi(config);
export const projectsApi = new ProjectsApi(config);

// Helper function to set auth token (JWT)
export const setAuthToken = (token: string): void => {
  localStorage.setItem('authToken', token);
  localStorage.removeItem('apiKey'); // Clear API key when using JWT
};

// Helper function to set API key
export const setApiKey = (apiKey: string): void => {
  console.log('🔑 setApiKey called with:', apiKey);
  localStorage.setItem('apiKey', apiKey);
  localStorage.removeItem('authToken'); // Clear JWT when using API key
  console.log('🔑 localStorage after save:', {
    apiKey: localStorage.getItem('apiKey'),
    authToken: localStorage.getItem('authToken')
  });
  // Update the config headers
  if (config.baseOptions?.headers) {
    config.baseOptions.headers['x-api-key'] = apiKey;
  }
};

// Helper function to clear auth (both JWT and API key)
export const clearAuth = (): void => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('apiKey');
  // Clear API key from headers
  if (config.baseOptions?.headers) {
    config.baseOptions.headers['x-api-key'] = '';
  }
};

// Helper function to check what auth method is active
export const getAuthMethod = (): 'jwt' | 'apikey' | 'none' => {
  if (localStorage.getItem('authToken')) return 'jwt';
  if (localStorage.getItem('apiKey')) return 'apikey';
  return 'none';
};