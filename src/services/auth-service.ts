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
    this.token = token;
    try {
      // Get user profile from API
      const response = await authApi.authControllerGetProfile();
      this.currentUser = response.data.data || null;
    } catch (error) {
      console.error('Failed to get user profile:', error);
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