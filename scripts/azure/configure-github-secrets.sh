#!/bin/bash

# Script to display GitHub secrets that need to be configured

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}GitHub Secrets Configuration${NC}"
echo "=================================="
echo ""
echo "Add these secrets to your GitHub repository:"
echo "https://github.com/james-s-usec/usasset-api-portal/settings/secrets/actions"
echo ""

# Get deployment token from Key Vault
DEPLOYMENT_TOKEN=$(az keyvault secret show \
  --vault-name usasset-api \
  --name swa-deployment-token \
  --query value -o tsv)

echo -e "${YELLOW}1. AZURE_STATIC_WEB_APPS_API_TOKEN${NC}"
echo "$DEPLOYMENT_TOKEN"
echo ""

echo -e "${YELLOW}2. VITE_API_URL${NC}"
echo "https://ca-usasset-api.yellowforest-928e9b23.eastus.azurecontainerapps.io"
echo ""

echo -e "${YELLOW}3. VITE_AZURE_AD_CLIENT_ID${NC} (optional - only if using Azure AD)"
echo "Get from your Azure AD app registration"
echo ""

echo -e "${YELLOW}4. VITE_AZURE_AD_TENANT_ID${NC} (optional - only if using Azure AD)"
echo "Get from your Azure AD directory"
echo ""

echo "=================================="
echo -e "${GREEN}Deployment Information${NC}"
echo ""

# Get portal URL
PORTAL_URL=$(az keyvault secret show \
  --vault-name usasset-api \
  --name portal-url \
  --query value -o tsv)

echo "Portal URL: $PORTAL_URL"
echo "API URL: https://ca-usasset-api.yellowforest-928e9b23.eastus.azurecontainerapps.io"
echo ""

echo -e "${GREEN}Next Steps:${NC}"
echo "1. Add the secrets above to GitHub"
echo "2. Push any change to trigger deployment"
echo "3. Monitor deployment at: https://github.com/james-s-usec/usasset-api-portal/actions"
echo "4. Visit your portal at: $PORTAL_URL"