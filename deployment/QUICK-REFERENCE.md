# USAsset Portal - Quick Reference

## URLs
- **Portal**: https://thankful-mud-0d3112f0f.2.azurestaticapps.net
- **API**: https://ca-usasset-api.yellowforest-928e9b23.eastus.azurecontainerapps.io
- **GitHub**: https://github.com/james-s-usec/usasset-api-portal

## Essential Commands

### Check Deployment Status
```bash
# Latest build status
gh run list --repo james-s-usec/usasset-api-portal --limit 1

# What's actually deployed
curl -s https://thankful-mud-0d3112f0f.2.azurestaticapps.net/ | grep "<title>"
```

### Fix Connection Issues
```bash
# 1. Ensure API URL secret exists
gh secret set VITE_API_URL \
  --repo james-s-usec/usasset-api-portal \
  --body "https://ca-usasset-api.yellowforest-928e9b23.eastus.azurecontainerapps.io"

# 2. Enable CORS on API
az containerapp update \
  --name ca-usasset-api \
  --resource-group usasset-demo \
  --set-env-vars "ALLOWED_ORIGINS=https://thankful-mud-0d3112f0f.2.azurestaticapps.net"

# 3. Trigger rebuild
git commit --allow-empty -m "Trigger rebuild" && git push
```

### Test Everything
```bash
# API Health
curl https://ca-usasset-api.yellowforest-928e9b23.eastus.azurecontainerapps.io/v1/health

# Portal Loading
curl -s https://thankful-mud-0d3112f0f.2.azurestaticapps.net/ | head -10
```

## GitHub Secrets Required
1. `AZURE_STATIC_WEB_APPS_API_TOKEN` - Auto-added by Azure
2. `VITE_API_URL` - **MUST ADD MANUALLY!**

## Common Errors & Quick Fixes

| Error | Fix |
|-------|-----|
| "localhost:3000" in console | Add VITE_API_URL secret |
| CORS blocked | Update API ALLOWED_ORIGINS |
| White screen | Check GitHub Actions logs |
| 404 on API calls | Verify API is running |

## Architecture
```
[Browser] --> [Static Web App] --> [Container App API]
   |              (React)              (NestJS)
   |                 |                     |
   +---------- Azure CDN ----------- Azure Container ---+
                     |                     |
                  East US 2             East US
```

## Remember
- Frontend and Backend are SEPARATE services
- CORS is required even in same Azure environment
- Environment variables must be set during BUILD, not runtime
- Always check GitHub Actions succeeded before debugging