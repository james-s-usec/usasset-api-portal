#!/bin/bash

# Portal convenience script - delegates to service dev manager
# This allows running dev commands from the portal directory

SERVICE_DIR="/home/swansonj/projects/usasset-api-service"
DEV_MANAGER="$SERVICE_DIR/scripts/dev-manager.sh"

# Check if service directory exists
if [[ ! -d "$SERVICE_DIR" ]]; then
    echo "❌ Service directory not found: $SERVICE_DIR"
    exit 1
fi

# Check if dev manager exists
if [[ ! -f "$DEV_MANAGER" ]]; then
    echo "❌ Dev manager script not found: $DEV_MANAGER"
    exit 1
fi

# Pass all arguments to the service dev manager
exec "$DEV_MANAGER" "$@"