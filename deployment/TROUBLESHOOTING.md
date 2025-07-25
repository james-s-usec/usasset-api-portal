# USAsset Portal Deployment Troubleshooting Guide

## Overview

This guide documents the issues encountered during deployment and their solutions.

## Architecture

Two separate Azure services that need to communicate:

1. **Frontend Portal (React)**: 
   - URL: `https://thankful-mud-0d3112f0f.2.azurestaticapps.net`
   - Service: Azure Static Web Apps
   - Location: East US 2

2. **Backend API (NestJS)**:
   - URL: `https://ca-usasset-api.yellowforest-928e9b23.eastus.azurecontainerapps.io`
   - Service: Azure Container Apps
   - Location: East US

## Common Issues and Solutions

### Issue 1: "Loading..." or White Screen

**Symptoms**: Portal shows blank/white screen or stays on "Loading..."

**Causes**:
1. React app JavaScript not loading
2. Build artifacts not deployed correctly
3. Development files deployed instead of production build

**Solution**:
```bash
# Check what's deployed
curl -s https://thankful-mud-0d3112f0f.2.azurestaticapps.net/ | head -20

# Should see production HTML with script tags like:
# <script type="module" crossorigin src="/assets/index-XXXXX.js"></script>

# If you see:
# <script type="module" src="/src/main.tsx"></script>
# Then development files are deployed - rebuild needed
```

### Issue 2: API Connection Errors - "localhost:3000"

**Symptoms**: 
- Console error: `Refused to connect to 'http://localhost:3000/v1/health'`
- Connection status shows "Error" or tries localhost

**Cause**: Environment variable `VITE_API_URL` not set during build

**Solution**:
1. Add GitHub Secret:
```bash
gh secret set VITE_API_URL \
  --repo james-s-usec/usasset-api-portal \
  --body "https://ca-usasset-api.yellowforest-928e9b23.eastus.azurecontainerapps.io"
```

2. Ensure workflow uses it:
```yaml
env:
  VITE_API_URL: ${{ secrets.VITE_API_URL }}
```

### Issue 3: CORS Errors

**Symptoms**: 
- Console error: `Access to fetch at 'api-url' from origin 'portal-url' has been blocked by CORS policy`
- API returns 200 but no Access-Control headers in response
- Connection status shows "Error" or "Checking..." indefinitely

**Root Cause**: API code missing CORS middleware implementation

**CRITICAL**: Setting `ALLOWED_ORIGINS` environment variable alone is NOT sufficient. The NestJS code must implement CORS middleware.

**Complete Solution**:

1. **Add CORS middleware to API main.ts**:
```typescript
// In /projects/usasset-api-service/src/main.ts
app.enableCors({
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void): void => {
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') ?? ['*'];
    
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) {
      callback(null, true);
      return;
    }
    
    // Allow all origins if '*' is set
    if (allowedOrigins.includes('*')) {
      callback(null, true);
      return;
    }
    
    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    
    callback(new Error('Not allowed by CORS'), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'],
});
```

2. **Deploy API changes**:
```bash
cd /home/swansonj/projects/usasset-api-service
git add src/main.ts
git commit -m "Add CORS middleware for portal integration"
git push
```

3. **Set environment variable**:
```bash
# Production fix - allow specific origin
az containerapp update \
  --name ca-usasset-api \
  --resource-group usasset-demo \
  --set-env-vars "ALLOWED_ORIGINS=https://thankful-mud-0d3112f0f.2.azurestaticapps.net"
```

4. **Verify fix works**:
```bash
# Test CORS headers are present
curl -i -H "Origin: https://thankful-mud-0d3112f0f.2.azurestaticapps.net" \
  https://ca-usasset-api.yellowforest-928e9b23.eastus.azurecontainerapps.io/v1/health | grep -i access-control

# Should see:
# access-control-allow-origin: https://thankful-mud-0d3112f0f.2.azurestaticapps.net
# access-control-allow-credentials: true
```

### Issue 4: GitHub Actions Build Failures

**Symptoms**: Deployment fails with TypeScript or build errors

**Common Fixes**:

1. **TypeScript errors**: 
   - Remove strict compiler options like `erasableSyntaxOnly`
   - Fix unused variables

2. **Vite asset errors**:
   - Remove problematic imports like `/vite.svg`
   - Use relative paths for assets

3. **Module not found**:
   - Ensure all dependencies are in package.json
   - Copy SDK files directly if npm link doesn't work in CI

## Correct Deployment Process

### 1. Prerequisites
- GitHub repository created
- Azure resources created (Resource Group, etc.)
- Azure CLI authenticated

### 2. Create Static Web App
```bash
az staticwebapp create \
  --name swa-usasset-portal \
  --resource-group usasset-demo \
  --location eastus2 \
  --source https://github.com/USERNAME/REPO \
  --branch main \
  --app-location "/" \
  --output-location "dist" \
  --sku Free \
  --login-with-github
```

### 3. Configure GitHub Secrets
Required secrets:
- `AZURE_STATIC_WEB_APPS_API_TOKEN`: From Azure (auto-added)
- `VITE_API_URL`: Your API URL (MUST ADD MANUALLY)

### 4. Update API CORS
```bash
# Get portal URL
PORTAL_URL=$(az staticwebapp show \
  --name swa-usasset-portal \
  --resource-group usasset-demo \
  --query defaultHostname -o tsv)

# Update API
az containerapp update \
  --name ca-usasset-api \
  --resource-group usasset-demo \
  --set-env-vars "ALLOWED_ORIGINS=https://$PORTAL_URL"
```

### 5. GitHub Actions Workflow
Correct workflow structure:
```yaml
- name: Build And Deploy
  uses: Azure/static-web-apps-deploy@v1
  with:
    azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
    repo_token: ${{ secrets.GITHUB_TOKEN }}
    action: "upload"
    app_location: "/"
    output_location: "dist"
  env:
    VITE_API_URL: ${{ secrets.VITE_API_URL }}
```

## Verification Steps

### 1. Check Deployment
```bash
# Check GitHub Actions
gh run list --repo USERNAME/REPO --limit 1

# Check deployed content
curl -s https://your-swa-url/ | grep -o "<title>.*</title>"
```

### 2. Test API Connection
```bash
# Test API directly
curl https://your-api-url/v1/health

# Test CORS
curl -H "Origin: https://your-swa-url" \
  -I https://your-api-url/v1/health | grep -i access-control
```

### 3. Browser Testing
1. Open portal URL
2. Open DevTools (F12)
3. Check Console for errors
4. Check Network tab for API calls
5. Look for connection status indicator

## Key Learnings

1. **Environment Variables**: Vite env vars MUST be set during build, not runtime
2. **CORS**: Even in same Azure environment, different services need CORS
3. **GitHub Secrets**: Some are auto-added, others need manual configuration
4. **Static Web Apps**: Use `dist` folder, not development files
5. **Debugging**: Always check what's actually deployed with curl

## Quick Debug Commands

```bash
# What's deployed?
curl -s https://your-portal-url/ | head -20

# Is API working?
curl https://your-api-url/v1/health

# Check CORS
curl -H "Origin: https://your-portal-url" \
  -I https://your-api-url/v1/health | grep -i access-control

# GitHub Actions status
gh run list --repo USERNAME/REPO --limit 1

# View logs
gh run view RUN_ID --repo USERNAME/REPO --log-failed
```

## Emergency Fixes

### Portal not loading:
1. Check GitHub Actions succeeded
2. Verify correct files deployed
3. Force rebuild with dummy commit

### API not connecting:
1. Verify VITE_API_URL secret exists
2. Check CORS configuration
3. Test API directly with curl

### Complete reset:
1. Delete and recreate Static Web App
2. Re-add all GitHub secrets
3. Update API CORS settings
4. Push code to trigger deployment

---

*Document created: July 25, 2025*
*Last issue resolved: CORS middleware implementation in NestJS API - July 25, 2025*
*Final Status: ✅ Portal and API successfully connected and operational*