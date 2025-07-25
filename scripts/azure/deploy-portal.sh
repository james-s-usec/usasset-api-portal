#!/bin/bash

# USAsset Portal Azure Deployment Script
# This script deploys the portal to Azure Container Apps

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

print_error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1"
}

# Default values
RESOURCE_GROUP="usasset-demo"
LOCATION="eastus"
PORTAL_APP_NAME="usasset-portal"
CONTAINER_CPU="0.25"
CONTAINER_MEMORY="0.5Gi"
MIN_REPLICAS="0"
MAX_REPLICAS="5"

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --resource-group)
            RESOURCE_GROUP="$2"
            shift 2
            ;;
        --location)
            LOCATION="$2"
            shift 2
            ;;
        --portal-name)
            PORTAL_APP_NAME="$2"
            shift 2
            ;;
        --api-url)
            API_URL="$2"
            shift 2
            ;;
        --help)
            echo "Usage: $0 [options]"
            echo "Options:"
            echo "  --resource-group    Azure resource group (default: usasset-demo)"
            echo "  --location         Azure location (default: eastus)"
            echo "  --portal-name      Portal app name (default: usasset-portal)"
            echo "  --api-url          API URL (will be detected if not provided)"
            echo "  --help             Show this help message"
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Check prerequisites
print_status "Checking prerequisites..."

if ! command -v az &> /dev/null; then
    print_error "Azure CLI is not installed. Please install it first."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install Node.js first."
    exit 1
fi

# Login check
print_status "Checking Azure login status..."
if ! az account show &> /dev/null; then
    print_error "Not logged in to Azure. Please run 'az login' first."
    exit 1
fi

# Get subscription ID
SUBSCRIPTION_ID=$(az account show --query id -o tsv)
print_status "Using subscription: $SUBSCRIPTION_ID"

# Verify resource group exists
print_status "Verifying resource group..."
if ! az group show --name "$RESOURCE_GROUP" &> /dev/null; then
    print_error "Resource group '$RESOURCE_GROUP' not found. Please deploy the API service first."
    exit 1
fi

# Get existing resources
print_status "Getting existing Azure resources..."
REGISTRY_NAME=$(az acr list --resource-group "$RESOURCE_GROUP" --query "[0].name" -o tsv)
KEYVAULT_NAME=$(az keyvault list --resource-group "$RESOURCE_GROUP" --query "[0].name" -o tsv)
ENVIRONMENT_NAME=$(az containerapp env list --resource-group "$RESOURCE_GROUP" --query "[0].name" -o tsv)

if [[ -z "$REGISTRY_NAME" ]] || [[ -z "$KEYVAULT_NAME" ]] || [[ -z "$ENVIRONMENT_NAME" ]]; then
    print_error "Required Azure resources not found. Please deploy the API service first."
    exit 1
fi

print_status "Found resources:"
print_status "  Registry: $REGISTRY_NAME"
print_status "  Key Vault: $KEYVAULT_NAME"
print_status "  Environment: $ENVIRONMENT_NAME"

# Get API URL if not provided
if [[ -z "$API_URL" ]]; then
    print_status "Detecting API URL..."
    API_CONTAINER_APP=$(az containerapp list --resource-group "$RESOURCE_GROUP" --query "[?contains(name, 'api')].name" -o tsv | head -1)
    if [[ -n "$API_CONTAINER_APP" ]]; then
        API_URL="https://$(az containerapp show --name "$API_CONTAINER_APP" --resource-group "$RESOURCE_GROUP" --query properties.configuration.ingress.fqdn -o tsv)"
        print_status "Detected API URL: $API_URL"
    else
        print_error "Could not detect API URL. Please provide it with --api-url"
        exit 1
    fi
fi

# Store API URL in Key Vault
print_status "Storing configuration in Key Vault..."
az keyvault secret set \
    --vault-name "$KEYVAULT_NAME" \
    --name "api-url" \
    --value "$API_URL" \
    --output none

# Get Azure AD configuration from environment or prompt
if [[ -z "$VITE_AZURE_AD_CLIENT_ID" ]]; then
    read -p "Enter Azure AD Client ID for Portal (or press Enter to skip): " VITE_AZURE_AD_CLIENT_ID
fi

if [[ -z "$VITE_AZURE_AD_TENANT_ID" ]]; then
    read -p "Enter Azure AD Tenant ID (or press Enter to skip): " VITE_AZURE_AD_TENANT_ID
fi

# Store Azure AD config if provided
if [[ -n "$VITE_AZURE_AD_CLIENT_ID" ]]; then
    az keyvault secret set \
        --vault-name "$KEYVAULT_NAME" \
        --name "portal-azure-ad-client-id" \
        --value "$VITE_AZURE_AD_CLIENT_ID" \
        --output none
fi

if [[ -n "$VITE_AZURE_AD_TENANT_ID" ]]; then
    az keyvault secret set \
        --vault-name "$KEYVAULT_NAME" \
        --name "azure-ad-tenant-id" \
        --value "$VITE_AZURE_AD_TENANT_ID" \
        --output none
fi

# Build the portal
print_status "Building portal application..."
npm install
npm run build

# Create production Docker files if they don't exist
if [[ ! -f "Dockerfile.production" ]]; then
    print_status "Creating Dockerfile.production..."
    cat > Dockerfile.production << 'EOF'
# Build stage
FROM node:20-alpine as builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build with placeholder env vars
ENV VITE_API_URL=__VITE_API_URL__
ENV VITE_AZURE_AD_CLIENT_ID=__VITE_AZURE_AD_CLIENT_ID__
ENV VITE_AZURE_AD_TENANT_ID=__VITE_AZURE_AD_TENANT_ID__

RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
EOF
fi

# Get ACR credentials
print_status "Getting container registry credentials..."
ACR_SERVER=$(az acr show --name "$REGISTRY_NAME" --query loginServer -o tsv)
ACR_USERNAME=$(az acr credential show --name "$REGISTRY_NAME" --query username -o tsv)
ACR_PASSWORD=$(az acr credential show --name "$REGISTRY_NAME" --query "passwords[0].value" -o tsv)

# Build and push image
print_status "Building and pushing container image..."
IMAGE_TAG="v$(date +%Y%m%d-%H%M%S)"
az acr build \
    --registry "$REGISTRY_NAME" \
    --image "$PORTAL_APP_NAME:$IMAGE_TAG" \
    --image "$PORTAL_APP_NAME:latest" \
    --file Dockerfile.production \
    .

FULL_IMAGE_NAME="$ACR_SERVER/$PORTAL_APP_NAME:latest"
print_status "Container image: $FULL_IMAGE_NAME"

# Create or update managed identity
print_status "Setting up managed identity..."
IDENTITY_NAME="${PORTAL_APP_NAME}-identity"
if ! az identity show --name "$IDENTITY_NAME" --resource-group "$RESOURCE_GROUP" &> /dev/null; then
    az identity create \
        --name "$IDENTITY_NAME" \
        --resource-group "$RESOURCE_GROUP" \
        --output none
fi

IDENTITY_ID=$(az identity show --name "$IDENTITY_NAME" --resource-group "$RESOURCE_GROUP" --query id -o tsv)
IDENTITY_PRINCIPAL_ID=$(az identity show --name "$IDENTITY_NAME" --resource-group "$RESOURCE_GROUP" --query principalId -o tsv)

# Grant Key Vault access
print_status "Granting Key Vault access to managed identity..."
az role assignment create \
    --assignee "$IDENTITY_PRINCIPAL_ID" \
    --role "Key Vault Secrets User" \
    --scope "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.KeyVault/vaults/$KEYVAULT_NAME" \
    --output none

# Create or update Container App
CONTAINER_APP_NAME="${PORTAL_APP_NAME}-app"
print_status "Deploying Container App..."

if az containerapp show --name "$CONTAINER_APP_NAME" --resource-group "$RESOURCE_GROUP" &> /dev/null; then
    print_status "Updating existing Container App..."
    az containerapp update \
        --name "$CONTAINER_APP_NAME" \
        --resource-group "$RESOURCE_GROUP" \
        --image "$FULL_IMAGE_NAME" \
        --output none
else
    print_status "Creating new Container App..."
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
        --memory "$CONTAINER_MEMORY" \
        --output none
fi

# Assign managed identity
print_status "Assigning managed identity to Container App..."
az containerapp identity assign \
    --name "$CONTAINER_APP_NAME" \
    --resource-group "$RESOURCE_GROUP" \
    --user-assigned "$IDENTITY_ID" \
    --output none

# Add Key Vault secrets
print_status "Configuring Key Vault secrets..."
az containerapp secret set \
    --name "$CONTAINER_APP_NAME" \
    --resource-group "$RESOURCE_GROUP" \
    --secrets \
        api-url="keyvaultref:https://$KEYVAULT_NAME.vault.azure.net/secrets/api-url,identityref:$IDENTITY_ID" \
        azure-ad-client-id="keyvaultref:https://$KEYVAULT_NAME.vault.azure.net/secrets/portal-azure-ad-client-id,identityref:$IDENTITY_ID" \
        azure-ad-tenant-id="keyvaultref:https://$KEYVAULT_NAME.vault.azure.net/secrets/azure-ad-tenant-id,identityref:$IDENTITY_ID" \
    --output none

# Update environment variables
print_status "Updating environment variables..."
az containerapp update \
    --name "$CONTAINER_APP_NAME" \
    --resource-group "$RESOURCE_GROUP" \
    --set-env-vars \
        "VITE_API_URL=secretref:api-url" \
        "VITE_AZURE_AD_CLIENT_ID=secretref:azure-ad-client-id" \
        "VITE_AZURE_AD_TENANT_ID=secretref:azure-ad-tenant-id" \
    --output none

# Get portal URL
PORTAL_URL=$(az containerapp show --name "$CONTAINER_APP_NAME" --resource-group "$RESOURCE_GROUP" --query properties.configuration.ingress.fqdn -o tsv)

# Update API CORS settings
print_status "Updating API CORS settings..."
API_CONTAINER_APP=$(az containerapp list --resource-group "$RESOURCE_GROUP" --query "[?contains(name, 'api')].name" -o tsv | head -1)
if [[ -n "$API_CONTAINER_APP" ]]; then
    # Get current CORS settings
    CURRENT_CORS=$(az containerapp show --name "$API_CONTAINER_APP" --resource-group "$RESOURCE_GROUP" --query "properties.template.containers[0].env[?name=='ALLOWED_ORIGINS'].value" -o tsv)
    
    # Add portal URL to CORS
    if [[ -n "$CURRENT_CORS" ]]; then
        NEW_CORS="$CURRENT_CORS,https://$PORTAL_URL"
    else
        NEW_CORS="https://$PORTAL_URL"
    fi
    
    az containerapp update \
        --name "$API_CONTAINER_APP" \
        --resource-group "$RESOURCE_GROUP" \
        --set-env-vars "ALLOWED_ORIGINS=$NEW_CORS" \
        --output none
fi

# Deployment summary
print_status "========================================="
print_status "Portal Deployment Complete!"
print_status "========================================="
print_status "Portal URL: https://$PORTAL_URL"
print_status "API URL: $API_URL"
print_status "Container App: $CONTAINER_APP_NAME"
print_status "Resource Group: $RESOURCE_GROUP"
print_status ""
print_status "Next steps:"
print_status "1. Visit https://$PORTAL_URL to access the portal"
print_status "2. Configure Azure AD app registration if using SSO"
print_status "3. Set up custom domain if needed"
print_status ""
print_status "To view logs:"
print_status "az containerapp logs show --name $CONTAINER_APP_NAME --resource-group $RESOURCE_GROUP --follow"