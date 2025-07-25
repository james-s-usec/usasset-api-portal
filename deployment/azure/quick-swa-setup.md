# Quick Azure Static Web App Setup

Since GitHub authentication is required, here are two options:

## Option 1: Azure Portal (Recommended)

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to Resource Group: `usasset-demo`
3. Click "+ Create" → Search for "Static Web App"
4. Configure:
   - **Name**: `swa-usasset-portal`
   - **Region**: `East US 2`
   - **SKU**: `Free`
   - **Source**: GitHub
   - **Organization**: `james-s-usec`
   - **Repository**: `usasset-api-portal`
   - **Branch**: `main`
   - **Build Presets**: Custom
   - **App location**: `/`
   - **API location**: (leave empty)
   - **Output location**: `dist`

5. Click "Review + Create" → "Create"

## Option 2: Manual Deployment with Token

1. Get your GitHub Personal Access Token:
   - Go to GitHub → Settings → Developer settings → Personal access tokens
   - Generate new token with `repo` and `workflow` permissions

2. Create Static Web App without GitHub integration:
```bash
# Create without GitHub integration first
az staticwebapp create \
  --name swa-usasset-portal \
  --resource-group usasset-demo \
  --location eastus2 \
  --sku Free

# Get the deployment token
DEPLOYMENT_TOKEN=$(az staticwebapp secrets list \
  --name swa-usasset-portal \
  --resource-group usasset-demo \
  --query "properties.apiKey" -o tsv)

echo "Add this token to GitHub Secrets as AZURE_STATIC_WEB_APPS_API_TOKEN:"
echo "$DEPLOYMENT_TOKEN"
```

## After Creating Static Web App

### 1. Get the deployment token and URL:
```bash
# Get deployment token
az staticwebapp secrets list \
  --name swa-usasset-portal \
  --resource-group usasset-demo \
  --query "properties.apiKey" -o tsv

# Get the URL
az staticwebapp show \
  --name swa-usasset-portal \
  --resource-group usasset-demo \
  --query "defaultHostname" -o tsv
```

### 2. Add GitHub Secrets:
Go to https://github.com/james-s-usec/usasset-api-portal/settings/secrets/actions

Add these secrets:
- `AZURE_STATIC_WEB_APPS_API_TOKEN`: (deployment token from step 1)
- `VITE_API_URL`: `https://ca-usasset-api.yellowforest-928e9b23.eastus.azurecontainerapps.io`
- `VITE_AZURE_AD_CLIENT_ID`: (your Azure AD client ID if using SSO)
- `VITE_AZURE_AD_TENANT_ID`: (your Azure AD tenant ID if using SSO)

### 3. Update API CORS:
```bash
# Get SWA hostname
SWA_HOSTNAME=$(az staticwebapp show \
  --name swa-usasset-portal \
  --resource-group usasset-demo \
  --query "defaultHostname" -o tsv)

# Update API CORS
az containerapp update \
  --name ca-usasset-api \
  --resource-group usasset-demo \
  --set-env-vars "ALLOWED_ORIGINS=https://$SWA_HOSTNAME"
```

### 4. Trigger Deployment:
Push any change to trigger the GitHub Action:
```bash
git add .
git commit -m "Trigger deployment"
git push
```

Or manually trigger from GitHub Actions tab.

## Verify Deployment

1. Check GitHub Actions: https://github.com/james-s-usec/usasset-api-portal/actions
2. Visit your app: `https://<your-swa-name>.azurestaticapps.net`
3. Check browser console for any errors
4. Verify API connectivity

## Next Steps

1. Configure custom domain (optional)
2. Set up Azure AD authentication (if needed)
3. Monitor with Application Insights
4. Create staging environments