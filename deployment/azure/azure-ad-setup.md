# Azure AD Authentication Setup - Portal Integration

## Overview
The USAsset Portal integrates with Azure AD for Single Sign-On (SSO) authentication, which connects to the backend API's Azure AD authentication.

## Portal-Specific Azure AD Configuration

### Required App Registration Settings

1. **Create/Update App Registration**:
   - Name: `USAsset Portal`
   - Supported account types: Single tenant or multi-tenant based on needs
   - Platform: Single-page application (SPA)

2. **Redirect URIs**:
   ```
   Development:
   - http://localhost:5173/auth/callback
   - http://localhost:3001/auth/callback
   
   Production:
   - https://ca-usasset-portal.yellowforest-928e9b23.eastus.azurecontainerapps.io/auth/callback
   - https://your-custom-domain.com/auth/callback (if using custom domain)
   ```

3. **API Permissions**:
   - Microsoft Graph: `User.Read` (delegated)
   - USAsset API: `api://<API_CLIENT_ID>/.default` (delegated)

### Environment Variables

```bash
# Portal-specific Azure AD configuration
VITE_AZURE_AD_CLIENT_ID=<PORTAL_CLIENT_ID>
VITE_AZURE_AD_TENANT_ID=<YOUR_TENANT_ID>
VITE_AZURE_AD_REDIRECT_URI=http://localhost:5173/auth/callback
VITE_API_SCOPE=api://<API_CLIENT_ID>/.default
```

### Key Vault Secrets (Production)
- `portal-azure-ad-client-id`: Portal's Azure AD Client ID
- `azure-ad-tenant-id`: Shared tenant ID (same as API)

## Frontend Implementation with MSAL.js

### 1. Install Dependencies
```bash
npm install @azure/msal-browser @azure/msal-react
```

### 2. MSAL Configuration
```typescript
// src/config/authConfig.ts
export const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_AZURE_AD_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_AZURE_AD_TENANT_ID}`,
    redirectUri: import.meta.env.VITE_AZURE_AD_REDIRECT_URI || window.location.origin,
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
};

export const loginRequest = {
  scopes: [import.meta.env.VITE_API_SCOPE || "User.Read"],
};
```

### 3. Auth Provider Setup
```typescript
// src/main.tsx or App.tsx
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./config/authConfig";

const msalInstance = new PublicClientApplication(msalConfig);

// Wrap your app
<MsalProvider instance={msalInstance}>
  <App />
</MsalProvider>
```

### 4. API Integration with Token
```typescript
// src/services/api-client.ts
import { msalInstance } from './auth/msalInstance';

const getAccessToken = async () => {
  const accounts = msalInstance.getAllAccounts();
  if (accounts.length > 0) {
    const response = await msalInstance.acquireTokenSilent({
      scopes: [import.meta.env.VITE_API_SCOPE],
      account: accounts[0],
    });
    return response.accessToken;
  }
  return null;
};

// Update API configuration
const config = new Configuration({
  basePath: import.meta.env.VITE_API_URL,
  accessToken: async () => {
    // Try Azure AD token first
    const azureToken = await getAccessToken();
    if (azureToken) return azureToken;
    
    // Fall back to stored API key or other auth
    return localStorage.getItem('authToken') || '';
  },
});
```

## Authentication Flow

### 1. User Login Flow
```
User clicks "Login with Azure AD"
  ↓
Portal redirects to Azure AD login
  ↓
User authenticates with corporate credentials
  ↓
Azure AD redirects back with authorization code
  ↓
Portal exchanges code for access token
  ↓
Portal uses token for API calls
```

### 2. Token Refresh Flow
- MSAL automatically handles token refresh
- Tokens are cached in sessionStorage
- Silent refresh happens before expiration

## Testing Azure AD Integration

### Local Development
1. Update `.env.local`:
   ```
   VITE_AZURE_AD_CLIENT_ID=your-portal-client-id
   VITE_AZURE_AD_TENANT_ID=your-tenant-id
   VITE_API_SCOPE=api://your-api-client-id/.default
   ```

2. Ensure redirect URI is registered in Azure AD

3. Test login flow:
   ```bash
   npm run dev
   # Navigate to http://localhost:5173
   # Click login button
   ```

### Production Testing
1. Verify environment variables in Container App
2. Check redirect URIs match production URL
3. Test from incognito/private browser window

## Troubleshooting

### Common Issues

#### 1. Redirect URI Mismatch
**Error**: `AADSTS50011: The reply URL specified in the request does not match`

**Fix**: 
- Add exact URL to Azure AD app registration
- Include protocol, domain, port, and path
- For SPAs, use "Single-page application" platform

#### 2. CORS Errors
**Error**: `Access to XMLHttpRequest blocked by CORS policy`

**Fix**:
- Ensure API allows portal origin
- Check Azure AD app registration allows implicit flow
- Verify token audience matches API expectations

#### 3. Token Validation Failures
**Error**: API returns 401 with valid token

**Fix**:
- Verify API and Portal use same tenant ID
- Check token audience (aud claim) matches API client ID
- Ensure API is configured to validate tokens from portal

### Debug Commands

```bash
# Decode JWT token (use jwt.io or similar)
echo $TOKEN | cut -d. -f2 | base64 -d | jq

# Check token claims
# Important claims:
# - aud: Should match API client ID
# - iss: Should contain tenant ID
# - exp: Token expiration time
```

## Security Best Practices

### 1. Token Storage
- Use sessionStorage (not localStorage) for tokens
- Clear tokens on logout
- Never store tokens in cookies for SPAs

### 2. Scope Management
- Request minimal scopes needed
- Use incremental consent for additional permissions
- Document required scopes clearly

### 3. Production Configuration
- Disable implicit flow if not needed
- Use authorization code flow with PKCE
- Regularly rotate client secrets (if using confidential client)

## User Management for Portal

### Granting Portal Access
Users need to be in Azure AD and have appropriate permissions:

1. **Add to Azure AD** (if not already present):
   ```bash
   az ad user invite \
     --invited-user-email-address "user@company.com" \
     --invited-user-display-name "User Name" \
     --invite-redirect-url "https://portal.your-domain.com"
   ```

2. **Assign Application Access** (optional):
   - In Azure AD, go to Enterprise Applications
   - Find "USAsset Portal"
   - Add users/groups who should have access

3. **API Permissions**:
   - Users automatically get permissions based on API RBAC
   - No additional portal-specific permissions needed

## Deployment Configuration

### Container App Environment Variables
```bash
# Set via Azure CLI
az containerapp update \
  --name "usasset-portal-app" \
  --resource-group "usasset-demo" \
  --set-env-vars \
    "VITE_AZURE_AD_CLIENT_ID=secretref:portal-azure-ad-client-id" \
    "VITE_AZURE_AD_TENANT_ID=secretref:azure-ad-tenant-id"
```

### Key Vault Integration
Portal retrieves Azure AD configuration from Key Vault at runtime, ensuring secrets are never hardcoded.

## Related Documentation
- [API Azure AD Setup](../../usasset-api-service/deployment/azure/azure-ad-setup.md)
- [Enterprise Deployment Guide](./enterprise-deployment-guide.md)
- [MSAL.js Documentation](https://github.com/AzureAD/microsoft-authentication-library-for-js)