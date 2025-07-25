# Enterprise Azure Deployment Guide - USAsset API Portal

**Document Version**: 1.0  
**Date**: July 25, 2025  
**Target Audience**: DevOps Engineers / Cloud Infrastructure Teams  
**Deployment Type**: Production-Ready Azure Container Apps + Vite React Portal  

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)  
3. [Configuration Variables](#configuration-variables)
4. [Step-by-Step Deployment](#step-by-step-deployment)
5. [Security Configuration](#security-configuration)
6. [Monitoring & Logging](#monitoring--logging)
7. [Cost Management](#cost-management)
8. [Troubleshooting](#troubleshooting)
9. [Maintenance & Updates](#maintenance--updates)

## Overview

This guide provides complete instructions for deploying the USAsset Portal (Vite + React frontend) to Azure using Container Apps, alongside the existing API service deployment.

### Architecture Components
- **Azure Container Apps**: Serverless container hosting for the React portal
- **Azure Container Registry**: Shared with API service for container images
- **Azure Key Vault**: Shared secrets and configuration management
- **Azure Monitor**: Comprehensive logging and monitoring
- **Integration**: Connects to existing USAsset API service

### Key Features
- **Auto-scaling**: Scale to zero when idle, scale up under load
- **Static Asset Optimization**: Nginx serving optimized React build
- **Security**: Azure AD integration, API key management
- **Cost Optimization**: Pay-per-use model with scale-to-zero capabilities

## Prerequisites

### Required Azure Resources (from API deployment)
These should already exist from the API service deployment:
- Resource Group: `usasset-demo`
- Container Registry: `usassetapiregistry*`
- Key Vault: `usasset-api-kv-*`
- Container Apps Environment: `usasset-api-env`

### Required Tools
- **Azure CLI** (v2.50.0+)
- **Node.js** (v20+) for building the portal
- **Docker** (optional, for local testing)
- **Git**: For source code management

## Configuration Variables

### Portal-Specific Configuration
```bash
# Basic Configuration (reuse from API deployment)
SUBSCRIPTION_ID="your-subscription-id"
RESOURCE_GROUP="usasset-demo"              # Same as API
LOCATION="eastus"                          # Same as API
ENVIRONMENT="prod"                         # Same as API

# Portal Application Configuration  
PORTAL_APP_NAME="usasset-portal"
PORTAL_DOMAIN="portal.your-domain.com"     # Optional: custom domain

# Container Configuration
CONTAINER_CPU="0.25"                       # Lower than API (static serving)
CONTAINER_MEMORY="0.5Gi"                   # Lower than API
MIN_REPLICAS="0"                           # Scale to zero
MAX_REPLICAS="5"                           # Lower max (static content)

# API Integration
API_URL="https://ca-usasset-api.yellowforest-928e9b23.eastus.azurecontainerapps.io"

# Azure AD Configuration (if using SSO)
AZURE_AD_CLIENT_ID="your-client-id"
AZURE_AD_TENANT_ID="your-tenant-id"
AZURE_AD_REDIRECT_URI="https://your-portal-url/auth/callback"
```

## Step-by-Step Deployment

### Step 1: Verify Existing Resources

```bash
# 1.1 Login to Azure
az login

# 1.2 Set subscription  
az account set --subscription "$SUBSCRIPTION_ID"

# 1.3 Verify resource group exists
az group show --name "$RESOURCE_GROUP"

# 1.4 Get existing resource names
REGISTRY_NAME=$(az acr list --resource-group "$RESOURCE_GROUP" --query "[0].name" -o tsv)
KEYVAULT_NAME=$(az keyvault list --resource-group "$RESOURCE_GROUP" --query "[0].name" -o tsv)
ENVIRONMENT_NAME=$(az containerapp env list --resource-group "$RESOURCE_GROUP" --query "[0].name" -o tsv)

echo "Registry: $REGISTRY_NAME"
echo "Key Vault: $KEYVAULT_NAME"
echo "Environment: $ENVIRONMENT_NAME"
```

### Step 2: Store Portal Secrets in Key Vault

```bash
# 2.1 Store Azure AD configuration (if using SSO)
az keyvault secret set \
  --vault-name "$KEYVAULT_NAME" \
  --name "azure-ad-client-id" \
  --value "$AZURE_AD_CLIENT_ID"

az keyvault secret set \
  --vault-name "$KEYVAULT_NAME" \
  --name "azure-ad-tenant-id" \
  --value "$AZURE_AD_TENANT_ID"

# 2.2 Store API URL
az keyvault secret set \
  --vault-name "$KEYVAULT_NAME" \
  --name "api-url" \
  --value "$API_URL"
```

### Step 3: Create Dockerfile for Production

```bash
# Create Dockerfile.production in portal root
cat > Dockerfile.production << 'EOF'
# Build stage
FROM node:20-alpine as builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the app with production environment variables
# These will be replaced at runtime by nginx
ENV VITE_API_URL=__VITE_API_URL__
ENV VITE_AZURE_AD_CLIENT_ID=__VITE_AZURE_AD_CLIENT_ID__
ENV VITE_AZURE_AD_TENANT_ID=__VITE_AZURE_AD_TENANT_ID__

RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Add script to replace environment variables at runtime
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
EOF
```

### Step 4: Create Nginx Configuration

```bash
# Create nginx.conf
cat > nginx.conf << 'EOF'
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Compression
    gzip on;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json;
    gzip_min_length 1000;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Don't cache index.html
    location = /index.html {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        add_header Pragma "no-cache";
        expires 0;
    }

    # SPA routing - serve index.html for all routes
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
}
EOF
```

### Step 5: Create Docker Entrypoint Script

```bash
# Create docker-entrypoint.sh
cat > docker-entrypoint.sh << 'EOF'
#!/bin/sh

# Replace environment variables in the built files
# This allows runtime configuration without rebuilding
for file in /usr/share/nginx/html/assets/*.js; do
  if [ -f "$file" ]; then
    sed -i "s|__VITE_API_URL__|${VITE_API_URL}|g" "$file"
    sed -i "s|__VITE_AZURE_AD_CLIENT_ID__|${VITE_AZURE_AD_CLIENT_ID}|g" "$file"
    sed -i "s|__VITE_AZURE_AD_TENANT_ID__|${VITE_AZURE_AD_TENANT_ID}|g" "$file"
  fi
done

# Execute the CMD
exec "$@"
EOF
```

### Step 6: Build and Push Container Image

```bash
# 6.1 Get ACR credentials
ACR_SERVER=$(az acr show --name "$REGISTRY_NAME" --query loginServer -o tsv)
ACR_USERNAME=$(az acr credential show --name "$REGISTRY_NAME" --query username -o tsv)
ACR_PASSWORD=$(az acr credential show --name "$REGISTRY_NAME" --query "passwords[0].value" -o tsv)

# 6.2 Build and push image
IMAGE_TAG="v$(date +%Y%m%d-%H%M%S)"
az acr build \
  --registry "$REGISTRY_NAME" \
  --image "$PORTAL_APP_NAME:$IMAGE_TAG" \
  --image "$PORTAL_APP_NAME:latest" \
  --file Dockerfile.production \
  .

FULL_IMAGE_NAME="$ACR_SERVER/$PORTAL_APP_NAME:latest"
echo "Container Image: $FULL_IMAGE_NAME"
```

### Step 7: Create/Update Managed Identity

```bash
# 7.1 Use existing managed identity or create new one
IDENTITY_NAME="${PORTAL_APP_NAME}-identity"
az identity create \
  --name "$IDENTITY_NAME" \
  --resource-group "$RESOURCE_GROUP" || echo "Identity may already exist"

# 7.2 Get identity details
IDENTITY_ID=$(az identity show --name "$IDENTITY_NAME" --resource-group "$RESOURCE_GROUP" --query id -o tsv)
IDENTITY_CLIENT_ID=$(az identity show --name "$IDENTITY_NAME" --resource-group "$RESOURCE_GROUP" --query clientId -o tsv)
IDENTITY_PRINCIPAL_ID=$(az identity show --name "$IDENTITY_NAME" --resource-group "$RESOURCE_GROUP" --query principalId -o tsv)

# 7.3 Grant Key Vault access
az role assignment create \
  --assignee "$IDENTITY_PRINCIPAL_ID" \
  --role "Key Vault Secrets User" \
  --scope "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.KeyVault/vaults/$KEYVAULT_NAME"
```

### Step 8: Deploy Portal Container App

```bash
# 8.1 Create Container App
CONTAINER_APP_NAME="${PORTAL_APP_NAME}-app"
az containerapp create \
  --name "$CONTAINER_APP_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --environment "$ENVIRONMENT_NAME" \
  --image "$FULL_IMAGE_NAME" \
  --registry-server "$ACR_SERVER" \
  --registry-username "$ACR_USERNAME" \
  --registry-password "$ACR_PASSWORD" \
  --target-port 80 \
  --ingress external \
  --min-replicas "$MIN_REPLICAS" \
  --max-replicas "$MAX_REPLICAS" \
  --cpu "$CONTAINER_CPU" \
  --memory "$CONTAINER_MEMORY"

# 8.2 Assign managed identity
az containerapp identity assign \
  --name "$CONTAINER_APP_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --user-assigned "$IDENTITY_ID"

# 8.3 Add Key Vault secrets
az containerapp secret set \
  --name "$CONTAINER_APP_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --secrets \
    api-url="keyvaultref:https://$KEYVAULT_NAME.vault.azure.net/secrets/api-url,identityref:$IDENTITY_ID" \
    azure-ad-client-id="keyvaultref:https://$KEYVAULT_NAME.vault.azure.net/secrets/azure-ad-client-id,identityref:$IDENTITY_ID" \
    azure-ad-tenant-id="keyvaultref:https://$KEYVAULT_NAME.vault.azure.net/secrets/azure-ad-tenant-id,identityref:$IDENTITY_ID"

# 8.4 Update environment variables
az containerapp update \
  --name "$CONTAINER_APP_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --set-env-vars \
    "VITE_API_URL=secretref:api-url" \
    "VITE_AZURE_AD_CLIENT_ID=secretref:azure-ad-client-id" \
    "VITE_AZURE_AD_TENANT_ID=secretref:azure-ad-tenant-id"

# 8.5 Get portal URL
PORTAL_URL=$(az containerapp show --name "$CONTAINER_APP_NAME" --resource-group "$RESOURCE_GROUP" --query properties.configuration.ingress.fqdn -o tsv)
echo "Portal URL: https://$PORTAL_URL"
```

### Step 9: Configure CORS on API Service

```bash
# Update API Container App to allow portal origin
API_CONTAINER_APP_NAME="usasset-api-app"
az containerapp update \
  --name "$API_CONTAINER_APP_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --set-env-vars \
    "ALLOWED_ORIGINS=https://$PORTAL_URL"
```

### Step 10: Verify Deployment

```bash
# 10.1 Test portal health
curl "https://$PORTAL_URL/"
# Should return HTML content

# 10.2 Check container status
az containerapp show --name "$CONTAINER_APP_NAME" --resource-group "$RESOURCE_GROUP" --query "properties.runningStatus"

# 10.3 View logs
az containerapp logs show --name "$CONTAINER_APP_NAME" --resource-group "$RESOURCE_GROUP" --tail 50
```

## Security Configuration

### Content Security Policy
Add CSP headers to nginx.conf for additional security:

```nginx
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' $API_URL;" always;
```

### Azure AD Configuration
If using Azure AD authentication:

1. Register app in Azure AD
2. Configure redirect URIs
3. Update portal code with MSAL.js
4. Store secrets in Key Vault

## Monitoring & Logging

### Application Insights Integration
```bash
# Reuse existing Application Insights from API
APPINSIGHTS_KEY=$(az monitor app-insights component show \
  --app "usasset-api-insights" \
  --resource-group "$RESOURCE_GROUP" \
  --query instrumentationKey -o tsv)

# Update portal with App Insights
az containerapp update \
  --name "$CONTAINER_APP_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --set-env-vars "VITE_APPINSIGHTS_KEY=$APPINSIGHTS_KEY"
```

### Portal-Specific Alerts
```bash
# Create availability test
az monitor app-insights web-test create \
  --name "$PORTAL_APP_NAME-availability" \
  --resource-group "$RESOURCE_GROUP" \
  --app-insights "usasset-api-insights" \
  --location "$LOCATION" \
  --url "https://$PORTAL_URL" \
  --frequency 300 \
  --timeout 30
```

## Cost Management

### Portal Cost Estimation
| Component | Configuration | Estimated Monthly Cost |
|-----------|--------------|----------------------|
| Container Apps | 0.25 CPU, 0.5GB RAM, scale-to-zero | $0-10 |
| Additional storage | Included in existing registry | $0 |
| **Additional Total** | | **$0-10/month** |

## Troubleshooting

### Common Portal Issues

#### 1. Environment Variables Not Replaced
**Symptoms**: Portal shows placeholder values like `__VITE_API_URL__`

**Fix**: Check docker-entrypoint.sh execution:
```bash
az containerapp exec \
  --name "$CONTAINER_APP_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --command "cat /usr/share/nginx/html/assets/*.js | grep VITE_"
```

#### 2. CORS Errors
**Symptoms**: Browser console shows CORS errors

**Fix**: Update API allowed origins:
```bash
az containerapp update \
  --name "usasset-api-app" \
  --resource-group "$RESOURCE_GROUP" \
  --set-env-vars "ALLOWED_ORIGINS=https://$PORTAL_URL"
```

#### 3. Azure AD Login Failures
**Symptoms**: Redirect URI mismatch errors

**Fix**: Update Azure AD app registration with correct portal URL

## Maintenance & Updates

### Portal Updates
```bash
# Build and deploy new version
npm run build
az acr build \
  --registry "$REGISTRY_NAME" \
  --image "$PORTAL_APP_NAME:$(date +%Y%m%d-%H%M%S)" \
  --file Dockerfile.production \
  .

# Update container app
az containerapp update \
  --name "$CONTAINER_APP_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --image "$ACR_SERVER/$PORTAL_APP_NAME:latest"
```

### Sync with API Updates
When API endpoints change:
1. Update SDK in api-service
2. Rebuild portal with new SDK
3. Deploy both services

## Deployment Checklist

### Pre-Deployment
- [ ] API service deployed and accessible
- [ ] Portal builds locally without errors
- [ ] Environment variables configured
- [ ] Docker files created
- [ ] Azure AD app registered (if using SSO)

### Deployment
- [ ] Secrets stored in Key Vault
- [ ] Container image built and pushed
- [ ] Container App created with proper configuration
- [ ] Managed identity configured
- [ ] Environment variables using secret references
- [ ] CORS configured on API

### Post-Deployment
- [ ] Portal loads in browser
- [ ] API calls working (check network tab)
- [ ] Authentication flow working
- [ ] Monitoring configured
- [ ] Custom domain configured (if applicable)

## Support Information

### Resource URLs
```bash
echo "=== PORTAL DEPLOYMENT SUMMARY ==="
echo "Portal URL: https://$PORTAL_URL"
echo "API URL: $API_URL"
echo "Container Registry: $ACR_SERVER"
echo "Key Vault: https://$KEYVAULT_NAME.vault.azure.net/"
echo "Resource Group: $RESOURCE_GROUP"
```

---

**Document Status**: Ready for Portal Deployment  
**Dependencies**: Requires deployed API service  
**Version Control**: Store in portal repository under `/deployment/azure/`