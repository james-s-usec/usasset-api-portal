# Production Deployment Checklist

This checklist ensures all Azure AD authentication components are properly configured for production deployment.

## Pre-Deployment

- [ ] Verify all authentication methods work locally
  - [ ] API Key authentication
  - [ ] Username/Password (JWT)
  - [ ] Azure AD authentication

- [ ] Environment variables configured
  - [ ] `VITE_API_URL` points to production API
  - [ ] `VITE_AZURE_AD_CLIENT_ID` set to production app ID
  - [ ] `VITE_AZURE_AD_TENANT_ID` set correctly

## Azure AD Configuration

- [ ] Production redirect URIs added to Azure AD app
  ```bash
  az ad app update --id <client-id> --web-redirect-uris \
    "https://swa-usasset-portal.azurestaticapps.net" \
    "https://<custom-domain>"
  ```

- [ ] Verify Azure AD app permissions
  - [ ] User.Read (for basic profile)
  - [ ] openid, profile, email scopes

- [ ] Test with organizational accounts
  - [ ] Personal Microsoft accounts (if supported)
  - [ ] Work/School accounts

## Static Web Apps Deployment

- [ ] Build production bundle
  ```bash
  npm run build
  ```

- [ ] Set production environment variables
  ```bash
  az staticwebapp appsettings set \
    --name swa-usasset-portal \
    --resource-group usasset-demo \
    --setting-names \
      VITE_API_URL=https://ca-usasset-api.yellowforest-928e9b23.eastus.azurecontainerapps.io \
      VITE_AZURE_AD_CLIENT_ID=<client-id> \
      VITE_AZURE_AD_TENANT_ID=<tenant-id>
  ```

- [ ] Deploy to Static Web Apps
  - [ ] Via GitHub Actions (automatic on push)
  - [ ] Or manual: `az staticwebapp deploy`

## API Integration

- [ ] CORS configuration updated
  ```bash
  az containerapp update \
    --name ca-usasset-api \
    --resource-group usasset-demo \
    --set-env-vars ALLOWED_ORIGINS="https://swa-usasset-portal.azurestaticapps.net"
  ```

- [ ] Backend `/v1/auth/azure` endpoint deployed
- [ ] API Key Vault secrets verified
  - [ ] azure-ad-client-id
  - [ ] azure-ad-client-secret
  - [ ] azure-ad-tenant-id

## Post-Deployment Testing

- [ ] Test each authentication method
  - [ ] API Key login
  - [ ] Username/Password login
  - [ ] Azure AD login

- [ ] Verify token exchange
  - [ ] Azure AD token accepted by API
  - [ ] Internal JWT returned correctly
  - [ ] Subsequent API calls authenticated

- [ ] Test logout functionality
  - [ ] Clears local session
  - [ ] Redirects to login

- [ ] Cross-browser testing
  - [ ] Chrome
  - [ ] Firefox
  - [ ] Safari
  - [ ] Edge

- [ ] Mobile responsiveness
  - [ ] Authentication forms scale properly
  - [ ] Azure AD popup works on mobile

## Monitoring

- [ ] Application Insights configured
- [ ] Authentication errors logged
- [ ] Failed login attempts tracked
- [ ] Performance metrics baselined

## Security Review

- [ ] No secrets in frontend code
- [ ] HTTPS enforced
- [ ] Redirect URIs limited to production URLs
- [ ] Content Security Policy configured
- [ ] Rate limiting on authentication endpoints

## Documentation

- [ ] Update README with production URL
- [ ] Document authentication methods for users
- [ ] Create troubleshooting guide
- [ ] Update API documentation

## Rollback Plan

- [ ] Previous version tagged in Git
- [ ] Deployment slots configured (if using)
- [ ] Database migration rollback tested
- [ ] Communication plan for issues

## Sign-off

- [ ] Frontend team approval
- [ ] Backend team approval
- [ ] Security team review
- [ ] Product owner acceptance