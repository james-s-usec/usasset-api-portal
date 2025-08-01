#!/bin/bash

# USAsset Portal Deployment Script with Azure AD Configuration
# This script builds and deploys the portal with production Azure AD settings

set -e  # Exit on any error

echo "🚀 USAsset Portal Deployment with Azure AD Configuration"
echo "========================================================"

# Configuration
RESOURCE_GROUP="useng-usasset-api-rg"
STATIC_WEB_APP="useng-usasset-portal"
KEY_VAULT="useng-usasset-kv3"

echo "📋 Step 1: Retrieving Azure AD configuration from Key Vault..."

# Get Azure AD configuration from Key Vault
CLIENT_ID=$(az keyvault secret show --vault-name "$KEY_VAULT" --name "portal-azure-ad-client-id" --query value -o tsv)
TENANT_ID=$(az keyvault secret show --vault-name "$KEY_VAULT" --name "portal-azure-ad-tenant-id" --query value -o tsv)
REDIRECT_URI=$(az keyvault secret show --vault-name "$KEY_VAULT" --name "portal-azure-ad-redirect-uri" --query value -o tsv)

echo "✅ Retrieved Azure AD configuration:"
echo "   Client ID: ${CLIENT_ID:0:8}..."
echo "   Tenant ID: ${TENANT_ID:0:8}..."
echo "   Redirect URI: $REDIRECT_URI"

echo ""
echo "🔧 Step 2: Creating production environment configuration..."

# Create production environment file
cat << EOF > .env.production
VITE_API_URL=https://useng-usasset-api.lemonforest-4e4757f3.eastus.azurecontainerapps.io/v1
VITE_AZURE_AD_CLIENT_ID=$CLIENT_ID
VITE_AZURE_AD_TENANT_ID=$TENANT_ID
VITE_AZURE_AD_REDIRECT_URI=$REDIRECT_URI
EOF

echo "✅ Created .env.production with Azure AD configuration"

echo ""
echo "🏗️  Step 3: Building portal with production configuration..."

# Build the portal
npm run build

echo "✅ Build completed successfully"

echo ""
echo "📤 Step 4: Deploying to Azure Static Web App..."

# Get deployment token
DEPLOYMENT_TOKEN=$(az staticwebapp secrets list --name "$STATIC_WEB_APP" --resource-group "$RESOURCE_GROUP" --query "properties.apiKey" -o tsv)

# Deploy to Static Web App
npx @azure/static-web-apps-cli deploy ./dist \
  --deployment-token "$DEPLOYMENT_TOKEN" \
  --env production

echo "✅ Deployment completed successfully"

echo ""
echo "🔐 Step 5: Updating Static Web App environment variables..."

# Update Static Web App environment variables
az staticwebapp appsettings set \
  --name "$STATIC_WEB_APP" \
  --resource-group "$RESOURCE_GROUP" \
  --setting-names \
    "VITE_API_URL=https://useng-usasset-api.lemonforest-4e4757f3.eastus.azurecontainerapps.io/v1" \
    "VITE_AZURE_AD_CLIENT_ID=$CLIENT_ID" \
    "VITE_AZURE_AD_TENANT_ID=$TENANT_ID" \
    "VITE_AZURE_AD_REDIRECT_URI=$REDIRECT_URI"

echo "✅ Environment variables updated"

echo ""
echo "🧪 Step 6: Verifying deployment..."

# Test portal accessibility
PORTAL_URL="https://salmon-field-08d82e40f.2.azurestaticapps.net"
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$PORTAL_URL")

if [ "$HTTP_STATUS" -eq 200 ]; then
    echo "✅ Portal is accessible at: $PORTAL_URL"
else
    echo "❌ Portal health check failed (HTTP $HTTP_STATUS)"
    exit 1
fi

echo ""
echo "🎉 Deployment Complete!"
echo "======================================"
echo "Portal URL: $PORTAL_URL"
echo "Azure AD Client ID: ${CLIENT_ID:0:8}..."
echo "Tenant: U.S. Engineering"
echo ""
echo "To test Azure AD authentication:"
echo "1. Navigate to: $PORTAL_URL"
echo "2. Click 'Azure AD' → 'Sign in with Microsoft'"
echo "3. Enter U.S. Engineering credentials"
echo "4. Complete authentication flow"
echo ""
echo "Configuration stored in Key Vault: $KEY_VAULT"
echo "Static Web App: $STATIC_WEB_APP"
echo "Resource Group: $RESOURCE_GROUP"

# Clean up
rm -f .env.production
echo "🧹 Cleaned up temporary files"