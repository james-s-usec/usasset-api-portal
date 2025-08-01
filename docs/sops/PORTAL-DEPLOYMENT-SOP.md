# Portal Deployment SOP

## Standard Operating Procedure: USAsset Portal Deployment

**Version**: 1.0  
**Date**: August 1, 2025  
**Environment**: U.S. Engineering Azure

---

## 🎯 **Overview**

This SOP covers the complete deployment, configuration, and management of the USAsset Portal on Azure Static Web Apps.

## 📋 **Prerequisites**

- [ ] Azure CLI installed and authenticated (`az login`)
- [ ] Node.js 20+ installed
- [ ] Portal repository cloned locally
- [ ] API service deployed and operational
- [ ] Access to Azure Key Vault for secrets

## 🚀 **Initial Deployment**

### Step 1: Create Azure Static Web App

```bash
# Create the Static Web App resource
az staticwebapp create \
  --name "useng-usasset-portal" \
  --resource-group "useng-usasset-api-rg" \
  --location "eastus2" \
  --sku Free

# Get the default hostname
PORTAL_URL=$(az staticwebapp show \
  --name "useng-usasset-portal" \
  --resource-group "useng-usasset-api-rg" \
  --query "defaultHostname" -o tsv)

echo "Portal URL: https://$PORTAL_URL"
```

### Step 2: Get Deployment Token

```bash
# Get deployment token for manual deployments
DEPLOYMENT_TOKEN=$(az staticwebapp secrets list \
  --name "useng-usasset-portal" \
  --resource-group "useng-usasset-api-rg" \
  --query "properties.apiKey" -o tsv)

echo "Deployment Token: $DEPLOYMENT_TOKEN"
```

**⚠️ IMPORTANT**: Store this token securely - needed for all deployments.

### Step 3: Configure Environment Variables

```bash
# Set API URL for the portal
az staticwebapp appsettings set \
  --name "useng-usasset-portal" \
  --resource-group "useng-usasset-api-rg" \
  --setting-names \
    "VITE_API_URL=https://useng-usasset-api.lemonforest-4e4757f3.eastus.azurecontainerapps.io" \
    "VITE_AZURE_AD_REDIRECT_URI=https://$PORTAL_URL/auth/callback"
```

### Step 4: Build and Deploy Portal

```bash
# Build with production environment variables
VITE_API_URL=https://useng-usasset-api.lemonforest-4e4757f3.eastus.azurecontainerapps.io \
VITE_AZURE_AD_REDIRECT_URI=https://$PORTAL_URL/auth/callback \
npm run build

# Deploy using SWA CLI
npx @azure/static-web-apps-cli deploy ./dist \
  --deployment-token "$DEPLOYMENT_TOKEN" \
  --env production
```

### Step 5: Update API CORS

```bash
# Allow portal domain in API CORS settings
az containerapp update \
  --name "useng-usasset-api" \
  --resource-group "useng-usasset-api-rg" \
  --set-env-vars "ALLOWED_ORIGINS=https://$PORTAL_URL"
```

---

## 🔄 **Ongoing Operations**

### Update Portal Code

```bash
# 1. Make code changes
# 2. Build with environment variables
VITE_API_URL=https://useng-usasset-api.lemonforest-4e4757f3.eastus.azurecontainerapps.io \
VITE_AZURE_AD_REDIRECT_URI=https://salmon-field-08d82e40f.2.azurestaticapps.net/auth/callback \
npm run build

# 3. Deploy
npx @azure/static-web-apps-cli deploy ./dist \
  --deployment-token "3fbb3d5c96a67ab9a2dd0b5c577ff71cf7e8a0e0365240c8f2bd8f044cedb03002-185458a5-803d-48a2-91ba-fe9a4808edaf00f111408d82e40f" \
  --env production
```

### Change Environment Variables

```bash
# Update Static Web App settings
az staticwebapp appsettings set \
  --name "useng-usasset-portal" \
  --resource-group "useng-usasset-api-rg" \
  --setting-names \
    "VARIABLE_NAME=new_value"

# Rebuild and redeploy (environment variables are build-time)
npm run build
npx @azure/static-web-apps-cli deploy ./dist \
  --deployment-token "<token>" \
  --env production
```

### View Current Settings

```bash
# List all environment variables
az staticwebapp appsettings list \
  --name "useng-usasset-portal" \
  --resource-group "useng-usasset-api-rg"

# Check deployment status
az staticwebapp show \
  --name "useng-usasset-portal" \
  --resource-group "useng-usasset-api-rg"
```

---

## 🔧 **Troubleshooting**

### Portal Not Loading
1. Check build succeeded: `npm run build`
2. Verify deployment: `az staticwebapp show --name useng-usasset-portal --resource-group useng-usasset-api-rg`
3. Check browser console for errors

### API Connection Issues
1. Verify CORS settings in API
2. Check `VITE_API_URL` environment variable
3. Test API directly: `curl https://useng-usasset-api.lemonforest-4e4757f3.eastus.azurecontainerapps.io/v1/health`

### Azure AD Login Issues
1. Verify `VITE_AZURE_AD_REDIRECT_URI` matches portal URL
2. Check Azure AD app registration redirect URIs
3. Ensure tenant ID is correct

### Deployment Token Issues
```bash
# Get fresh deployment token
az staticwebapp secrets list \
  --name "useng-usasset-portal" \
  --resource-group "useng-usasset-api-rg" \
  --query "properties.apiKey" -o tsv
```

---

## 📊 **Current Configuration**

### U.S. Engineering Production

| Resource | Value |
|----------|-------|
| **Portal URL** | https://salmon-field-08d82e40f.2.azurestaticapps.net |
| **API URL** | https://useng-usasset-api.lemonforest-4e4757f3.eastus.azurecontainerapps.io |
| **Resource Group** | useng-usasset-api-rg |
| **Static Web App** | useng-usasset-portal |
| **Region** | East US 2 |
| **SKU** | Free |

### Environment Variables
- `VITE_API_URL`: API service endpoint
- `VITE_AZURE_AD_REDIRECT_URI`: Portal callback URL
- `VITE_AZURE_AD_CLIENT_ID`: Azure AD app registration ID (when configured)
- `VITE_AZURE_AD_TENANT_ID`: U.S. Engineering tenant ID

### Build Output
- **Size**: ~296 kB bundle
- **Output**: `dist/` directory
- **Assets**: index.html, CSS, JS chunks

---

## 🚨 **Emergency Procedures**

### Rollback Deployment
1. Keep previous working build in `dist-backup/`
2. Deploy previous version:
```bash
npx @azure/static-web-apps-cli deploy ./dist-backup \
  --deployment-token "<token>" \
  --env production
```

### Complete Rebuild
```bash
# Clean and rebuild everything
rm -rf node_modules dist
npm install
npm run build
npx @azure/static-web-apps-cli deploy ./dist \
  --deployment-token "<token>" \
  --env production
```

---

## 📝 **Maintenance Schedule**

- **Weekly**: Check portal accessibility and login flow
- **Monthly**: Review environment variables and update if needed
- **Quarterly**: Review deployment token security
- **As Needed**: Update when API changes or new features added

---

## 📞 **Support Contacts**

- **Azure Portal**: https://portal.azure.com
- **Resource Group**: useng-usasset-api-rg
- **Static Web Apps Documentation**: https://docs.microsoft.com/en-us/azure/static-web-apps/

---

**Last Updated**: August 1, 2025  
**Next Review**: November 1, 2025