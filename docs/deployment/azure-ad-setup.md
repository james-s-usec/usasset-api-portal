# Azure AD Authentication Setup Guide

This guide covers the setup and configuration of Azure AD authentication for the USAsset API Portal.

## Overview

The portal supports three authentication methods:
1. API Key
2. Username/Password (JWT)
3. Azure AD (Microsoft Identity Platform)

## Prerequisites

- Azure AD tenant and application registration
- Azure CLI installed and authenticated
- Access to Azure Key Vault for secrets

## Local Development Setup

### 1. Install Dependencies

```bash
npm install @azure/msal-browser @azure/msal-react
```

### 2. Environment Variables

Create or update `.env.local`:

```env
VITE_API_URL=http://localhost:3009
VITE_AZURE_AD_CLIENT_ID=<your-client-id>
VITE_AZURE_AD_TENANT_ID=<your-tenant-id>
VITE_AZURE_AD_REDIRECT_URI=http://localhost:5173
```

### 3. Get Credentials from Key Vault

```bash
# Get Azure AD credentials
TENANT_ID=$(az keyvault secret show --vault-name usasset-api --name azure-ad-tenant-id --query value -o tsv)
CLIENT_ID=$(az keyvault secret show --vault-name usasset-api --name azure-ad-client-id --query value -o tsv)

echo "VITE_AZURE_AD_TENANT_ID=$TENANT_ID"
echo "VITE_AZURE_AD_CLIENT_ID=$CLIENT_ID"
```

### 4. Configure Redirect URIs

Add local development URLs to Azure AD app registration:

```bash
# View current redirect URIs
az ad app show --id <client-id> --query "web.redirectUris" -o json

# Add localhost URLs for development
az ad app update --id <client-id> --web-redirect-uris \
  "https://oauth.pstmn.io/v1/callback" \
  "http://localhost:3009/auth/callback" \
  "http://localhost:5173" \
  "http://localhost:5174"
```

## Production Setup

### 1. Azure Static Web Apps Configuration

Set environment variables in Azure Static Web Apps:

```bash
# Using Azure CLI
az staticwebapp appsettings set \
  --name swa-usasset-portal \
  --resource-group usasset-demo \
  --setting-names \
    VITE_API_URL=https://ca-usasset-api.yellowforest-928e9b23.eastus.azurecontainerapps.io \
    VITE_AZURE_AD_CLIENT_ID=<production-client-id> \
    VITE_AZURE_AD_TENANT_ID=<production-tenant-id> \
    VITE_AZURE_AD_REDIRECT_URI=https://swa-usasset-portal.azurestaticapps.net/auth/callback \
    VITE_DEFAULT_PROJECT_ID=demo-project-id
```

Or through Azure Portal:
1. Navigate to your Static Web App
2. Go to Configuration → Application settings
3. Add the environment variables

### 2. Production Redirect URIs

Add production URLs to Azure AD app registration:

```bash
# Get your Static Web App URL
SWA_URL=$(az staticwebapp show --name swa-usasset-portal --query "defaultHostname" -o tsv)

# Update redirect URIs for production
az ad app update --id <client-id> --web-redirect-uris \
  "https://$SWA_URL/auth/callback" \
  "https://<custom-domain>/auth/callback" \
  "http://localhost:5173/auth/callback" \
  "http://localhost:5174/auth/callback" \
  "http://localhost:3009/auth/callback" \
  "https://oauth.pstmn.io/v1/callback"
```

### 3. Update CORS Settings

Ensure the API allows requests from the portal:

```bash
# Update API's ALLOWED_ORIGINS environment variable
az containerapp update \
  --name ca-usasset-api \
  --resource-group usasset-demo \
  --set-env-vars ALLOWED_ORIGINS="https://$SWA_URL,https://<custom-domain>"
```

## Authentication Flow

1. User selects "Azure AD" authentication method
2. Clicks "Sign in with Microsoft"
3. MSAL opens Microsoft login popup
4. User authenticates with organizational account
5. Portal receives Azure AD ID token
6. Portal exchanges token with backend `/v1/auth/azure` endpoint
7. Backend validates token and returns internal JWT
8. Portal uses JWT for subsequent API calls

## Configuration Details

### MSAL Configuration (azuread-config.ts)

```typescript
export const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_AZURE_AD_CLIENT_ID || '',
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_AZURE_AD_TENANT_ID || 'common'}`,
    redirectUri: import.meta.env.VITE_AZURE_AD_REDIRECT_URI || window.location.origin,
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  }
};
```

### Required Scopes

```typescript
export const loginRequest = {
  scopes: ['openid', 'profile', 'email', 'User.Read']
};
```

## Troubleshooting

### Common Issues

1. **Redirect URI Mismatch (AADSTS50011)**
   - Ensure the redirect URI in your app matches Azure AD configuration
   - Check both protocol (http/https) and port number
   - Use `az ad app show --id <client-id> --query "web.redirectUris"` to verify

2. **Popup Blocked**
   - The portal handles this gracefully with error message
   - Users need to allow popups for the site

3. **Invalid Tenant ID (AADSTS900023)**
   - Verify tenant ID is correct GUID format
   - Check Key Vault secret or environment variable

4. **Token Exchange Fails**
   - Ensure backend `/v1/auth/azure` endpoint is deployed
   - Check API logs for validation errors
   - Verify CORS settings allow portal origin

### Debug Commands

```bash
# Check Azure AD app configuration
az ad app show --id <client-id> --query "{clientId:appId, tenantId:publisherDomain, redirectUris:web.redirectUris}"

# Test backend Azure endpoint
curl -X POST https://ca-usasset-api.yellowforest-928e9b23.eastus.azurecontainerapps.io/v1/auth/azure \
  -H "Content-Type: application/json" \
  -d '{"token": "<azure-ad-token>"}'

# Check Static Web App environment variables
az staticwebapp appsettings list --name swa-usasset-portal --resource-group usasset-demo
```

## Security Considerations

1. **Client ID and Tenant ID**: These are public values (visible in login URLs) but should still be managed per environment
2. **Client Secret**: Never expose in frontend code - only used by backend
3. **Token Storage**: Uses sessionStorage by default, cleared on browser close
4. **CORS**: Strictly configure allowed origins in production
5. **Redirect URIs**: Only add trusted URLs to prevent redirect attacks

## Environment-Specific Configuration

### Development
- Multiple localhost ports supported (5173, 5174)
- HTTP allowed for local development
- Session storage for tokens

### Staging
- Use separate Azure AD app registration
- HTTPS required
- Add staging URL to redirect URIs

### Production
- Production Azure AD app registration
- HTTPS only
- Custom domain support
- Consider using `localStorage` if persistent login needed

## Next Steps

1. Test authentication flow in all three modes
2. Implement role-based UI components
3. Add automatic token refresh
4. Configure logout to clear both Azure AD and internal sessions
5. Add telemetry for authentication events