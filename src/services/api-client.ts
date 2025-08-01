import axios, { type AxiosInstance } from 'axios';
import { Configuration } from '../api-sdk/configuration.js';
import { AuthenticationApi, UsersApi, ProjectsApi } from '../api-sdk/api.js';
import { authStorage } from '../utils/auth-storage';

// Create custom axios instance with 401 interceptor
const createAxiosWithInterceptors = (): AxiosInstance => {
  const axiosInstance = axios.create();

  // Response interceptor for handling 401 errors
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Clear auth and dispatch expiration event
        authStorage.clearAll();
        authStorage.dispatchAuthExpired();
      }
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

// Create axios instance with interceptors
const axiosWithInterceptors = createAxiosWithInterceptors();

// Create configuration with auth support
const config = new Configuration({
  basePath: import.meta.env.VITE_API_URL || 'http://localhost:3009/v1',
  accessToken: (): string => {
    // Get JWT token from storage
    return authStorage.getToken() || '';
  },
  baseOptions: {
    headers: {
      // Dynamic header getter for API key
      get 'x-api-key'() {
        return authStorage.getApiKey() || '';
      }
    },
    withCredentials: true, // Enable CORS credentials
  }
});

// Export API instances with custom axios
export const authApi = new AuthenticationApi(config, undefined, axiosWithInterceptors);
export const usersApi = new UsersApi(config, undefined, axiosWithInterceptors);
export const projectsApi = new ProjectsApi(config, undefined, axiosWithInterceptors);