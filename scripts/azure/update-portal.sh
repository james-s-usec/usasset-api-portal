#!/bin/bash

# USAsset Portal Update Script
# Quick script to update the portal after code changes

set -e

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

print_error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1"
}

# Default values
RESOURCE_GROUP="usasset-demo"
PORTAL_APP_NAME="usasset-portal"

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --resource-group)
            RESOURCE_GROUP="$2"
            shift 2
            ;;
        --portal-name)
            PORTAL_APP_NAME="$2"
            shift 2
            ;;
        *)
            shift
            ;;
    esac
done

# Check Azure login
if ! az account show &> /dev/null; then
    print_error "Not logged in to Azure. Please run 'az login' first."
    exit 1
fi

# Get registry name
REGISTRY_NAME=$(az acr list --resource-group "$RESOURCE_GROUP" --query "[0].name" -o tsv)
if [[ -z "$REGISTRY_NAME" ]]; then
    print_error "Container registry not found in resource group $RESOURCE_GROUP"
    exit 1
fi

# Build and push new image
print_status "Building and pushing new container image..."
IMAGE_TAG="v$(date +%Y%m%d-%H%M%S)"
az acr build \
    --registry "$REGISTRY_NAME" \
    --image "$PORTAL_APP_NAME:$IMAGE_TAG" \
    --image "$PORTAL_APP_NAME:latest" \
    --file Dockerfile.production \
    .

# Update Container App
CONTAINER_APP_NAME="${PORTAL_APP_NAME}-app"
ACR_SERVER=$(az acr show --name "$REGISTRY_NAME" --query loginServer -o tsv)
FULL_IMAGE_NAME="$ACR_SERVER/$PORTAL_APP_NAME:latest"

print_status "Updating Container App with new image..."
az containerapp update \
    --name "$CONTAINER_APP_NAME" \
    --resource-group "$RESOURCE_GROUP" \
    --image "$FULL_IMAGE_NAME" \
    --output none

# Get portal URL
PORTAL_URL=$(az containerapp show --name "$CONTAINER_APP_NAME" --resource-group "$RESOURCE_GROUP" --query properties.configuration.ingress.fqdn -o tsv)

print_status "Update complete!"
print_status "Portal URL: https://$PORTAL_URL"
print_status ""
print_status "To view logs:"
print_status "az containerapp logs show --name $CONTAINER_APP_NAME --resource-group $RESOURCE_GROUP --follow"