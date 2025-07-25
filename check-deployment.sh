#!/bin/bash

# Check deployment status (DO NOT COMMIT THIS FILE)

echo "Checking deployment status..."
echo "============================"

# 1. Check GitHub Actions
echo ""
echo "1. GitHub Actions Status:"
echo "   Check: https://github.com/james-s-usec/usasset-api-portal/actions"
echo "   Look for a workflow run triggered by your latest commit"

# 2. Check Static Web App
echo ""
echo "2. Static Web App Status:"
SWA_URL="https://thankful-mud-0d3112f0f.2.azurestaticapps.net"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" $SWA_URL)
echo "   URL: $SWA_URL"
echo "   HTTP Status: $HTTP_CODE"

# 3. Check if React app is deployed
echo ""
echo "3. React App Check:"
if curl -s $SWA_URL | grep -q "script type=\"module\""; then
    echo "   ❌ Still showing development HTML (not built yet)"
else
    echo "   ✅ Production build detected"
fi

# 4. Check API connectivity
echo ""
echo "4. API Connectivity (from browser console):"
echo "   Run this in browser console:"
echo "   fetch('https://ca-usasset-api.yellowforest-928e9b23.eastus.azurecontainerapps.io/v1/health').then(r => r.json()).then(console.log)"

echo ""
echo "============================"
echo "To complete deployment:"
echo "1. Add GitHub secrets at: https://github.com/james-s-usec/usasset-api-portal/settings/secrets/actions"
echo "2. Required secrets:"
echo "   - AZURE_STATIC_WEB_APPS_API_TOKEN (from Key Vault: swa-deployment-token)"
echo "   - VITE_API_URL: https://ca-usasset-api.yellowforest-928e9b23.eastus.azurecontainerapps.io"
echo "3. Push any small change to trigger deployment"