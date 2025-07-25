import { Configuration, AuthenticationApi, UsersApi, ProjectsApi } from '@usasset/api-client';

// Create configuration
const config = new Configuration({
  basePath: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  accessToken: () => {
    // Get token from localStorage or state management
    return localStorage.getItem('authToken') || '';
  },
});

// Export API instances
export const authApi = new AuthenticationApi(config);
export const usersApi = new UsersApi(config);
export const projectsApi = new ProjectsApi(config);

// Helper function to set auth token
export const setAuthToken = (token: string) => {
  localStorage.setItem('authToken', token);
};

// Helper function to clear auth
export const clearAuth = () => {
  localStorage.removeItem('authToken');
};