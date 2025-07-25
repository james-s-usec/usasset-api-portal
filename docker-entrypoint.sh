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