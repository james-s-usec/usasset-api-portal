import { authApi, clearAuth } from './api-client';
import type { AuthControllerGetProfile200ResponseData } from '../api-sdk';

export type User = AuthControllerGetProfile200ResponseData;

export class AuthService {
  private static instance: AuthService;
  private currentUser: User | null = null;
  private token: string | null = null;

  private constructor() {
    // Check if user is already logged in on initialization
    this.token = localStorage.getItem('authToken');
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public isAuthenticated(): boolean {
    return !!this.token && this.token !== '';
  }

  public getToken(): string | null {
    return this.token;
  }

  public getCurrentUser(): User | null {
    return this.currentUser;
  }

  public async setToken(token: string): Promise<void> {
    console.log('📝 Setting token:', token.substring(0, 20) + '...');
    
    // Decode and log token payload
    try {
      const parts = token.split('.');
      const payload = JSON.parse(atob(parts[1]));
      console.log('🔍 Token payload:', {
        sub: payload.sub,
        email: payload.email,
        projectId: payload.projectId,
        permissions: payload.permissions,
        exp: new Date(payload.exp * 1000).toISOString(),
        iat: new Date(payload.iat * 1000).toISOString()
      });
    } catch (e) {
      console.error('Failed to decode token:', e);
    }
    
    this.token = token;
    // Store token in localStorage so API client can use it
    localStorage.setItem('authToken', token);
    console.log('💾 Token saved to localStorage');
    
    try {
      console.log('📞 Calling /auth/profile...');
      // Get user profile from API
      const response = await authApi.authControllerGetProfile();
      console.log('✅ Profile response:', response.data);
      this.currentUser = response.data.data || null;
    } catch (error: any) {
      console.error('❌ Failed to get user profile:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers
      });
      // Clear invalid token
      this.logout();
      throw error;
    }
  }

  public logout(): void {
    this.token = null;
    this.currentUser = null;
    clearAuth();
  }

  public async getUserProfile(): Promise<User | null> {
    if (!this.isAuthenticated()) {
      return null;
    }

    try {
      const response = await authApi.authControllerGetProfile();
      this.currentUser = response.data.data || null;
      return this.currentUser;
    } catch (error) {
      console.error('Failed to get user profile:', error);
      // If token is invalid, logout
      this.logout();
      return null;
    }
  }
}

// Export singleton instance
export const authService = AuthService.getInstance();