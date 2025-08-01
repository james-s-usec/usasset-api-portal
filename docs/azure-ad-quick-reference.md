# Azure AD Quick Reference - USAsset Portal

## 🎯 Quick Access Information

**Portal URL**: https://salmon-field-08d82e40f.2.azurestaticapps.net  
**Status**: ✅ Production Ready  
**Last Updated**: August 1, 2025

## 🔑 Key Vault Secrets (useng-usasset-kv3)

```bash
# Retrieve all Azure AD configuration
az keyvault secret show --vault-name "useng-usasset-kv3" --name "portal-azure-ad-client-id" --query value -o tsv
az keyvault secret show --vault-name "useng-usasset-kv3" --name "portal-azure-ad-tenant-id" --query value -o tsv  
az keyvault secret show --vault-name "useng-usasset-kv3" --name "portal-azure-ad-redirect-uri" --query value -o tsv
```

## 🚀 Quick Deployment

```bash
# Run automated deployment script
./scripts/deploy-with-azure-ad.sh

# Or manual deployment
npm run build
DEPLOYMENT_TOKEN=$(az staticwebapp secrets list --name "useng-usasset-portal" --resource-group "useng-usasset-api-rg" --query "properties.apiKey" -o tsv)
npx @azure/static-web-apps-cli deploy ./dist --deployment-token "$DEPLOYMENT_TOKEN" --env production
```

## 🧪 Test Authentication

1. **Navigate**: https://salmon-field-08d82e40f.2.azurestaticapps.net
2. **Click**: "Azure AD" → "Sign in with Microsoft"  
3. **Login**: james.swanson@usengineering.com
4. **Verify**: Dashboard loads with Microsoft identity

## 📋 Configuration Summary

| Setting | Value |
|---------|--------|
| **Client ID** | `a6d15feb-fe60-444a-a240-0d18b9979abe` |
| **Tenant ID** | `8c54d37e-75b4-4799-9cda-db77000f1944` |
| **Redirect URI** | `https://salmon-field-08d82e40f.2.azurestaticapps.net/auth/callback` |
| **Resource Group** | `useng-usasset-api-rg` |
| **Key Vault** | `useng-usasset-kv3` |
| **Static Web App** | `useng-usasset-portal` |

## 🔧 Troubleshooting Commands

```bash
# Check Azure AD app
az ad app show --id a6d15feb-fe60-444a-a240-0d18b9979abe --query "{displayName:displayName, appId:appId}"

# Test portal
curl -I https://salmon-field-08d82e40f.2.azurestaticapps.net

# View Static Web App settings  
az staticwebapp appsettings list --name "useng-usasset-portal" --resource-group "useng-usasset-api-rg"

# Check Key Vault access
az keyvault secret list --vault-name "useng-usasset-kv3" --query "[?contains(name,'portal-azure-ad')]"
```

## 📚 Documentation Links

- **Complete Setup Guide**: [azure-ad-production-setup.md](./azure-ad-production-setup.md)
- **Portal Configuration**: [../CLAUDE.md](../CLAUDE.md#azure-ad-authentication)
- **API Integration**: [../../usasset-api-service/docs/guides/authentication/README.md](../../usasset-api-service/docs/guides/authentication/README.md)