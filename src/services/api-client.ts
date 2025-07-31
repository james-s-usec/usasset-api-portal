import { Configuration } from '../api-sdk/configuration.js';
import { AuthenticationApi, UsersApi, ProjectsApi } from '../api-sdk/api.js';
import { authStorage } from '../utils/auth-storage';

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

// Export API instances
export const authApi = new AuthenticationApi(config);
export const usersApi = new UsersApi(config);
export const projectsApi = new ProjectsApi(config);