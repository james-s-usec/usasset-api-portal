# Azure Static Web App Deployment Guide - USAsset Portal

## Overview

This guide covers deploying the USAsset Portal to Azure Static Web Apps (SWA), which provides:
- Global CDN distribution
- Automatic SSL/TLS certificates
- GitHub Actions integration
- Preview environments for PRs
- Custom domain support
- Integrated API proxy

## Prerequisites

- Azure subscription with contributor access
- GitHub repository for the portal code
- Azure CLI installed locally
- Node.js 20+ for building

## Minimum Deployment Steps

### 1. Create Static Web App

```bash
# Set variables
RESOURCE_GROUP="usasset-demo"
SWA_NAME="swa-usasset-portal"
LOCATION="eastus"
GITHUB_REPO="your-github-username/usasset-api-portal"
BRANCH="main"

# Create Static Web App
az staticwebapp create \
  --name $SWA_NAME \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION \
  --source $GITHUB_REPO \
  --branch $BRANCH \
  --app-location "/" \
  --api-location "" \
  --output-location "dist" \
  --sku Free
```

### 2. Configure Environment Variables

```bash
# Get the deployment token
DEPLOYMENT_TOKEN=$(az staticwebapp secrets list \
  --name $SWA_NAME \
  --resource-group $RESOURCE_GROUP \
  --query "properties.apiKey" -o tsv)

# Set environment variables in Static Web App
az staticwebapp appsettings set \
  --name $SWA_NAME \
  --resource-group $RESOURCE_GROUP \
  --setting-names \
    VITE_API_URL="https://ca-usasset-api.yellowforest-928e9b23.eastus.azurecontainerapps.io" \
    VITE_AZURE_AD_CLIENT_ID="your-client-id" \
    VITE_AZURE_AD_TENANT_ID="your-tenant-id"
```

### 3. Update GitHub Repository

Add the deployment token as a GitHub secret:
1. Go to your GitHub repo → Settings → Secrets
2. Add new secret: `AZURE_STATIC_WEB_APPS_API_TOKEN`
3. Value: The deployment token from step 2

### 4. Create GitHub Actions Workflow

The Azure Static Web Apps will automatically create a workflow file. If not, create:

`.github/workflows/azure-static-web-apps.yml`:
```yaml
name: Azure Static Web Apps CI/CD

on:
  push:
    branches:
      - main
  pull_request:
    types: [opened, synchronize, reopened, closed]
    branches:
      - main

jobs:
  build_and_deploy_job:
    if: github.event_name == 'push' || (github.event_name == 'pull_request' && github.event.action != 'closed')
    runs-on: ubuntu-latest
    name: Build and Deploy Job
    steps:
      - uses: actions/checkout@v3
        with:
          submodules: true
          
      - name: Build And Deploy
        id: builddeploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: "upload"
          app_location: "/"
          api_location: ""
          output_location: "dist"
          app_build_command: "npm run build"
          
  close_pull_request_job:
    if: github.event_name == 'pull_request' && github.event.action == 'closed'
    runs-on: ubuntu-latest
    name: Close Pull Request Job
    steps:
      - name: Close Pull Request
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          action: "close"
```

### 5. Update API CORS Settings

```bash
# Allow the SWA default domain
SWA_HOSTNAME=$(az staticwebapp show \
  --name $SWA_NAME \
  --resource-group $RESOURCE_GROUP \
  --query "defaultHostname" -o tsv)

# Update API Container App CORS
az containerapp update \
  --name "ca-usasset-api" \
  --resource-group $RESOURCE_GROUP \
  --set-env-vars "ALLOWED_ORIGINS=https://$SWA_HOSTNAME"
```

### 6. Test Deployment

```bash
# Get the URL
echo "Portal URL: https://$SWA_HOSTNAME"

# Test the deployment
curl https://$SWA_HOSTNAME
```

## Local Development with Docker

### Run Development Server
```bash
# Start the portal in development mode
docker-compose up portal-dev

# Portal available at http://localhost:5173
```

### Test Production Build Locally
```bash
# Build and run production version
docker-compose --profile production up portal-prod

# Portal available at http://localhost:3001
```

### Connect to Local API
Make sure the API service is running:
```bash
cd ../usasset-api-service
docker-compose up
```

## Custom Domain Setup (Optional)

### 1. Add Custom Domain
```bash
az staticwebapp hostname set \
  --name $SWA_NAME \
  --resource-group $RESOURCE_GROUP \
  --hostname "app.usasset.com"
```

### 2. Configure DNS
Add CNAME record:
- Name: `app`
- Value: `$SWA_HOSTNAME`

### 3. Update CORS
```bash
az containerapp update \
  --name "ca-usasset-api" \
  --resource-group $RESOURCE_GROUP \
  --set-env-vars "ALLOWED_ORIGINS=https://$SWA_HOSTNAME,https://app.usasset.com"
```

## Environment Variables in Production

Static Web Apps handles environment variables differently:
- Build-time variables: Set in GitHub Actions
- Runtime variables: Use `staticwebapp.config.json` for API proxy

Update `staticwebapp.config.json` for production API:
```json
{
  "routes": [
    {
      "route": "/api/*",
      "rewrite": "https://api.usasset.com/v1/*"
    }
  ]
}
```

## Monitoring and Debugging

### View Deployment Logs
```bash
# In GitHub Actions tab of your repository
```

### Application Insights Integration
```bash
# Get existing App Insights from API deployment
APPINSIGHTS_KEY=$(az monitor app-insights component show \
  --app "usasset-api-insights" \
  --resource-group $RESOURCE_GROUP \
  --query instrumentationKey -o tsv)

# Add to your React app's environment
```

## Cost Optimization

Static Web Apps Free tier includes:
- 100 GB bandwidth/month
- 2 custom domains
- SSL certificates
- GitHub Actions minutes

This is sufficient for most applications. The Standard tier adds:
- 1 TB bandwidth/month
- 5 custom domains
- SLA guarantee

## Troubleshooting

### Build Failures
1. Check GitHub Actions logs
2. Ensure `npm run build` works locally
3. Verify Node.js version matches

### API Connection Issues
1. Check CORS settings on API
2. Verify API URL in environment variables
3. Test API directly from browser console

### Custom Domain Issues
1. Verify DNS propagation (can take 24-48 hours)
2. Check SSL certificate status in Azure Portal
3. Ensure CNAME record is correct

## Summary

Minimum deployment requires:
1. Create Static Web App resource
2. Configure GitHub integration
3. Set environment variables
4. Update API CORS settings
5. Push code to trigger deployment

Total deployment time: ~10 minutes
Monthly cost: $0 (Free tier)