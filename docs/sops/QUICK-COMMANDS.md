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
  --deployment-token "$DEPLOYMENT_TOKEN" \
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

### 🧪 **Test Login** (✅ VERIFIED WORKING)
- **URL**: https://salmon-field-08d82e40f.2.azurestaticapps.net

**🚨 CRITICAL: Must select PROJECT before login!**

**Login Process:**
1. Select **Project**: "Construction Site Alpha" (or other available projects)
2. Enter **Email**: `super@test.com`
3. Enter **Password**: `ChangeMe123!`
4. Click **Login**

**Test Users:**
- **Super User**: `super@test.com` / `ChangeMe123!` (All roles, all projects)
- **Admin**: `admin@usasset.com` / `ChangeMe123`
- **Manager**: `manager@usasset.com` / `ChangeMe123`
- **Engineer**: `engineer@usasset.com` / `ChangeMe123`
- **Viewer**: `viewer@usasset.com` / `ChangeMe123`

**Available Projects:**
- Construction Site Alpha (`86b3ee96-4c01-448a-a34d-53b63e03acba`)
- Renovation Project Beta (`bf97c79f-1158-4666-b5cf-bdfeacc9a7b0`)
- Infrastructure Project Gamma (`dc7b058a-c797-4ea2-a536-24fd36194f1b`)

**Expected Result**: Dashboard with user info, role, and 27 permissions

---

## Key Identifiers
- **Portal**: useng-usasset-portal  
- **API**: useng-usasset-api
- **Resource Group**: useng-usasset-api-rg
- **Portal URL**: https://salmon-field-08d82e40f.2.azurestaticapps.net
- **API URL**: https://useng-usasset-api.lemonforest-4e4757f3.eastus.azurecontainerapps.io