// Simple API client for auth operations
// Keep it boring - just API calls, no state management

import { authApi } from '../services/api-client';
import type { User } from '../types/api-types';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

interface AzureTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

// Get user profile
export const getUserProfile = async (_token: string): Promise<ApiResponse<User>> => {
  try {
    const response = await authApi.authControllerGetProfile();
    return {
      success: true,
      data: response.data.data || undefined
    };
  } catch (error: any) {
    console.error('Failed to get user profile:', error);
    return {
      success: false,
      error: error.message || 'Failed to get user profile'
    };
  }
};

// Exchange Azure AD code for token
export const exchangeAzureCode = async (code: string): Promise<ApiResponse<AzureTokenResponse>> => {
  try {
    const response = await authApi.authControllerAzureCallback({ code });
    return {
      success: true,
      data: response.data.data as AzureTokenResponse
    };
  } catch (error: any) {
    console.error('Failed to exchange Azure code:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Azure authentication failed'
    };
  }
};

// Export all API functions in one object
export const ApiClient = {
  getUserProfile,
  exchangeAzureCode
};