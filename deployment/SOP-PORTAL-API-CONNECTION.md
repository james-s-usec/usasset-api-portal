# SOP: USAsset Portal-API Connection Setup

## Standard Operating Procedure
**Purpose**: Establish and troubleshoot connection between React Portal and NestJS API  
**Scope**: Azure Static Web Apps (Portal) ↔ Azure Container Apps (API)  
**Owner**: Development Team  
**Last Updated**: July 25, 2025

---

## Prerequisites

### Required Information
- Portal URL: `https://thankful-mud-0d3112f0f.2.azurestaticapps.net`
- API URL: `https://ca-usasset-api.yellowforest-928e9b23.eastus.azurecontainerapps.io`
- GitHub Repository: `james-s-usec/usasset-api-portal`
- Azure Resource Group: `usasset-demo`

### Required Access
- [ ] Azure CLI authenticated (`az login`)
- [ ] GitHub CLI authenticated (`gh auth status`)
- [ ] Write access to GitHub repository
- [ ] Contributor access to Azure Resource Group

---

## Procedure

### Step 1: Verify Portal Deployment

```bash
# Check GitHub Actions status
gh run list --repo james-s-usec/usasset-api-portal --limit 1

# Verify portal loads
curl -s https://thankful-mud-0d3112f0f.2.azurestaticapps.net/ | grep "<title>"
```

**Expected Result**: Title should show "Vite + React + TS"

### Step 2: Verify API Health

```bash
# Test API endpoint
curl https://ca-usasset-api.yellowforest-928e9b23.eastus.azurecontainerapps.io/v1/health
```

**Expected Result**: 
```json
{"status":"ok","timestamp":"2025-07-25T23:00:04.689Z"}
```

### Step 3: Check CORS Configuration

```bash
# Test CORS headers
curl -i -H "Origin: https://thankful-mud-0d3112f0f.2.azurestaticapps.net" \
  https://ca-usasset-api.yellowforest-928e9b23.eastus.azurecontainerapps.io/v1/health | grep -i access-control
```

**Expected Result**:
```
access-control-allow-origin: https://thankful-mud-0d3112f0f.2.azurestaticapps.net
access-control-allow-credentials: true
```

### Step 4: Verify Environment Variables

```bash
# Check GitHub secrets exist
gh secret list --repo james-s-usec/usasset-api-portal

# Check API environment variables
az containerapp show --name ca-usasset-api --resource-group usasset-demo \
  --query "properties.template.containers[0].env" -o table
```

**Required Secrets**:
- `AZURE_STATIC_WEB_APPS_API_TOKEN` ✅
- `VITE_API_URL` ✅

**Required API Env Vars**:
- `ALLOWED_ORIGINS` ✅

### Step 5: Test End-to-End Connection

```bash
# Open portal in browser and check connection status
# Should show: ● Connected (green)
```

---

## Troubleshooting Matrix

| Symptom | Root Cause | Solution |
|---------|------------|----------|
| Portal shows white screen | Build failed or wrong files deployed | Check GitHub Actions, redeploy |
| Connection status shows "localhost:3000" | Missing VITE_API_URL secret | Add GitHub secret, rebuild |
| Connection status shows "Checking..." | CORS headers missing | Implement CORS middleware in API |
| Connection status shows "Error" | API down or wrong URL | Verify API health, check URL |

---

## Emergency Fixes

### Fix 1: Missing GitHub Secret
```bash
gh secret set VITE_API_URL \
  --repo james-s-usec/usasset-api-portal \
  --body "https://ca-usasset-api.yellowforest-928e9b23.eastus.azurecontainerapps.io"

# Trigger rebuild
git commit --allow-empty -m "Trigger rebuild for env vars" && git push
```

### Fix 2: CORS Not Working
```bash
# Ensure API has CORS middleware (check main.ts)
# Update environment variable
az containerapp update \
  --name ca-usasset-api \
  --resource-group usasset-demo \
  --set-env-vars "ALLOWED_ORIGINS=https://thankful-mud-0d3112f0f.2.azurestaticapps.net"
```

### Fix 3: Force Complete Redeploy
```bash
# Delete and recreate GitHub deployment token
az staticwebapp secrets list --name swa-usasset-portal

# Trigger new deployment
git commit --allow-empty -m "Force redeploy" && git push
```

---

## Validation Checklist

After following this SOP, verify all items:

- [ ] Portal loads at correct URL
- [ ] API responds to health check
- [ ] CORS headers present in API response
- [ ] GitHub secrets configured correctly
- [ ] Connection status shows "● Connected" in green
- [ ] No console errors in browser DevTools
- [ ] API calls work from portal

---

## Success Criteria

**Portal Status**: ✅ Connected  
**API Status**: ✅ Healthy  
**CORS Status**: ✅ Configured  
**Deployment**: ✅ Automated via GitHub Actions

---

## Escalation

If this SOP doesn't resolve the issue:

1. **Level 1**: Check [Troubleshooting Guide](./TROUBLESHOOTING.md)
2. **Level 2**: Review GitHub Actions logs: `gh run view --log-failed`
3. **Level 3**: Check Azure Container App logs via Azure Portal
4. **Level 4**: Escalate to senior developer

---

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2025-07-25 | Initial SOP creation | System |
| 2025-07-25 | Added CORS middleware solution | System |

---

**Document Classification**: Internal Use  
**Review Frequency**: Monthly  
**Next Review**: August 25, 2025