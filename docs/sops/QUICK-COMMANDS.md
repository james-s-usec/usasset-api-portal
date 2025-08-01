# Quick Commands Reference

## Portal Management Quick Reference

### 🚀 **Deploy Portal (Full Process)**
```bash
# 1. Build with correct environment
VITE_API_URL=https://useng-usasset-api.lemonforest-4e4757f3.eastus.azurecontainerapps.io \
VITE_AZURE_AD_REDIRECT_URI=https://salmon-field-08d82e40f.2.azurestaticapps.net/auth/callback \
npm run build

# 2. Deploy to Azure
npx @azure/static-web-apps-cli deploy ./dist \
  --deployment-token "3fbb3d5c96a67ab9a2dd0b5c577ff71cf7e8a0e0365240c8f2bd8f044cedb03002-185458a5-803d-48a2-91ba-fe9a4808edaf00f111408d82e40f" \
  --env production
```

### 🔧 **Get Deployment Token**
```bash
az staticwebapp secrets list \
  --name "useng-usasset-portal" \
  --resource-group "useng-usasset-api-rg" \
  --query "properties.apiKey" -o tsv
```

### ⚙️ **Update Environment Variables**
```bash
az staticwebapp appsettings set \
  --name "useng-usasset-portal" \
  --resource-group "useng-usasset-api-rg" \
  --setting-names \
    "VITE_API_URL=https://useng-usasset-api.lemonforest-4e4757f3.eastus.azurecontainerapps.io"
```

### 🌐 **Update API CORS**
```bash
az containerapp update \
  --name "useng-usasset-api" \
  --resource-group "useng-usasset-api-rg" \
  --set-env-vars "ALLOWED_ORIGINS=https://salmon-field-08d82e40f.2.azurestaticapps.net"
```

### 📊 **Check Status**
```bash
# Portal status
az staticwebapp show \
  --name "useng-usasset-portal" \
  --resource-group "useng-usasset-api-rg"

# API status  
curl https://useng-usasset-api.lemonforest-4e4757f3.eastus.azurecontainerapps.io/v1/health
```

### 🧪 **Test Login**
- **URL**: https://salmon-field-08d82e40f.2.azurestaticapps.net
- **Super User**: `super@test.com` / `ChangeMe123!`
- **Regular Users**: `admin@usasset.com` / `ChangeMe123`

---

## Key Identifiers
- **Portal**: useng-usasset-portal  
- **API**: useng-usasset-api
- **Resource Group**: useng-usasset-api-rg
- **Portal URL**: https://salmon-field-08d82e40f.2.azurestaticapps.net
- **API URL**: https://useng-usasset-api.lemonforest-4e4757f3.eastus.azurecontainerapps.io