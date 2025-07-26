import { Configuration, AuthenticationApi, UsersApi, ProjectsApi } from '../api-sdk';

// Create configuration with API key support
const config = new Configuration({
  basePath: import.meta.env.VITE_API_URL || 'http://localhost:3009/v1',
  accessToken: (): string => {
    // Get JWT token from localStorage
    return localStorage.getItem('authToken') || '';
  },
  baseOptions: {
    headers: {
      // Add API key if available
      'x-api-key': localStorage.getItem('apiKey') || '',
    }
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
  localStorage.setItem('apiKey', apiKey);
  localStorage.removeItem('authToken'); // Clear JWT when using API key
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