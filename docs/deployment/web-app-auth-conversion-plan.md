# Web Application Authentication Flow Conversion Plan

## Overview

This plan outlines the steps to convert from the current SPA authentication approach (which is failing) to a proper Web Application authentication flow that works with your existing Azure AD app registration.

## Current Issue

- Azure AD app is registered as "Web" application type
- Frontend is trying to use SPA authentication flow (direct token exchange)
- Azure AD blocks cross-origin token requests for Web apps
- Error: "Cross-origin token redemption is permitted only for the 'Single-Page Application' client-type"

## Solution: Server-Side Token Exchange

Instead of the browser directly exchanging tokens with Azure AD, we'll implement a server-side flow:

1. **Frontend** → Redirects user to Azure AD login
2. **Azure AD** → User authenticates
3. **Azure AD** → Redirects back to frontend with auth code
4. **Frontend** → Sends auth code to backend
5. **Backend** → Exchanges auth code for tokens using client secret
6. **Backend** → Returns internal JWT to frontend
7. **Frontend** → Uses JWT for API calls

## Implementation Steps

### Step 1: Update Frontend Authentication Flow

**Current (SPA with popup):**
```typescript
// Uses loginPopup - won't work with Web app
const loginResponse = await msalInstance.loginPopup(loginRequest);
```

**New (Web app with redirect):**
```typescript
// Use loginRedirect instead
await msalInstance.loginRedirect(loginRequest);
```

### Step 2: Create Callback Handler

Create a new component to handle the redirect callback:

```typescript
// src/components/AzureADCallback.tsx
import { useEffect } from 'react';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from '../config/azuread-config';

export const AzureADCallback = ({ onLoginSuccess }) => {
  useEffect(() => {
    const handleCallback = async () => {
      const msalInstance = new PublicClientApplication(msalConfig);
      await msalInstance.initialize();
      
      try {
        // Handle the redirect response
        const response = await msalInstance.handleRedirectPromise();
        if (response && response.code) {
          // Send auth code to backend
          const result = await authApi.authControllerAzureCallback({
            code: response.code,
            redirectUri: window.location.origin
          });
          
          if (result.data.data?.access_token) {
            await onLoginSuccess(result.data.data.access_token);
          }
        }
      } catch (error) {
        console.error('Callback error:', error);
      }
    };
    
    handleCallback();
  }, []);
  
  return <div>Processing login...</div>;
};
```

### Step 3: Update Backend Endpoints

The backend needs two endpoints:

1. **Existing**: `/v1/auth/azure` - Accepts ID token (keep for backwards compatibility)
2. **New**: `/v1/auth/azure/callback` - Accepts auth code and exchanges it

```typescript
// Backend implementation needed
@Post('azure/callback')
async azureCallback(@Body() dto: AzureCallbackDto) {
  const { code, redirectUri } = dto;
  
  // Exchange auth code for tokens using client secret
  const tokens = await exchangeCodeForTokens(code, redirectUri);
  
  // Validate tokens and create user
  const user = await this.authService.validateAzureToken(tokens.id_token);
  
  // Return internal JWT
  return this.authService.generateJWT(user);
}
```

### Step 4: Update Router

Add route for callback handling:

```typescript
// In your main App or Router
<Route path="/auth/callback" element={<AzureADCallback onLoginSuccess={handleLoginSuccess} />} />
```

### Step 5: Update Azure AD App Registration

Ensure redirect URIs are properly configured:

```bash
# Already configured correctly for Web app
az ad app show --id f3bb35ba-a1f1-41f7-be39-ff871cfe3d3c --query "web.redirectUris"
# Should include: http://localhost:5173, http://localhost:5174
```

## Benefits of Web App Flow

1. **More Secure**: Client secret never exposed to browser
2. **Token Refresh**: Backend can refresh tokens without user interaction
3. **Better Control**: Backend validates and manages tokens
4. **Audit Trail**: Server-side logging of authentication events

## Migration Timeline

1. **Immediate Fix Options**:
   - Option A: Convert Azure AD app to SPA type (quick fix)
   - Option B: Implement server-side flow (recommended)

2. **Implementation Steps**:
   - [ ] Update AzureADForm to use redirect flow
   - [ ] Create callback handler component
   - [ ] Add routing for callback
   - [ ] Coordinate with backend team for new endpoint
   - [ ] Test complete flow
   - [ ] Update documentation

## Quick Fix (If Needed Immediately)

To quickly convert to SPA while you implement the proper Web flow:

```bash
# Get the object ID (not application ID)
OBJECT_ID=$(az ad app show --id f3bb35ba-a1f1-41f7-be39-ff871cfe3d3c --query "id" -o tsv)

# Convert to SPA
az rest --method PATCH --uri "https://graph.microsoft.com/v1.0/applications/$OBJECT_ID" \
  --body '{"spa":{"redirectUris":["http://localhost:5173","http://localhost:5174","https://swa-usasset-portal.azurestaticapps.net"]}}'
```

Then revert back when Web flow is implemented:

```bash
# Convert back to Web
az rest --method PATCH --uri "https://graph.microsoft.com/v1.0/applications/$OBJECT_ID" \
  --body '{"web":{"redirectUris":["http://localhost:5173","http://localhost:5174","https://swa-usasset-portal.azurestaticapps.net"]},"spa":{"redirectUris":[]}}'
```

## Decision Required

1. **Quick Fix**: Convert to SPA now, implement proper Web flow later
2. **Proper Fix**: Keep as Web app, implement server-side flow now

Recommendation: If you need it working immediately, do the quick fix. But plan to implement the proper Web application flow for better security and control.