import type { Configuration } from '@azure/msal-browser';

// MSAL configuration
export const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_AZURE_AD_CLIENT_ID || '',
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_AZURE_AD_TENANT_ID || 'common'}`,
    redirectUri: import.meta.env.VITE_AZURE_AD_REDIRECT_URI || `${window.location.origin}/auth/callback`,
    navigateToLoginRequestUrl: false, // Important: set to false for manual handling
    postLogoutRedirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
  system: {
    windowHashTimeout: 9000,
    iframeHashTimeout: 9000,
    loadFrameTimeout: 9000,
  }
};

// Add scopes for the ID token to be used at Microsoft identity platform endpoints.
export const loginRequest = {
  scopes: ['openid', 'profile', 'email', 'User.Read']
};

// Add scopes for the access token to be used at Microsoft Graph API endpoints.
export const graphConfig = {
  graphMeEndpoint: 'https://graph.microsoft.com/v1.0/me'
};