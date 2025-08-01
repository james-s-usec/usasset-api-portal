# Authentication Troubleshooting Guide

## 🚨 **CRITICAL: Project-Scoped Authentication**

**The USAsset portal requires PROJECT SELECTION for login - this is unique!**

Unlike typical authentication systems, USAsset requires **THREE fields** for login:
- `email`
- `password` 
- `projectId` (REQUIRED!)

## Common Issues & Solutions

### 🔴 **400 Bad Request on Login**

**Symptom**: Login fails with 400 error immediately after clicking Login

**Cause**: Missing `projectId` in the login request

**Solution**:
1. ✅ **Verify project dropdown is visible** on login form
2. ✅ **Select a project** before entering credentials
3. ✅ **Expected projects**: Construction Site Alpha, Renovation Project Beta, Infrastructure Project Gamma

**API Request should look like**:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "projectId": "86b3ee96-4c01-448a-a34d-53b63e03acba"
}
```

### 🔴 **401 "No access to this project"**

**Symptom**: Login fails with 401 after selecting project and entering credentials

**Cause**: User doesn't have a role assigned in the selected project

**Solutions**:
1. ✅ **Try different project** - User might have access to other projects
2. ✅ **Use super user** - `super@test.com` has access to all projects
3. ✅ **Verify user assignment** - Check if user has been assigned a role in that project

### 🔴 **Projects Not Loading in Dropdown**

**Symptom**: Project dropdown shows "Select a project" but no options

**Cause**: API call to load projects failed or returned empty

**Solutions**:
1. ✅ **Check browser console** for API errors
2. ✅ **Verify API connection** - Status should show "Connected"
3. ✅ **Known projects should load as fallback** - If API fails, hardcoded projects should appear
4. ✅ **Refresh page** - Sometimes helps if API was temporarily unavailable

### 🔴 **Login Form Missing Project Field**

**Symptom**: Only see Email and Password fields, no Project dropdown

**Cause**: Old version of portal deployed without project selector

**Solution**:
1. ✅ **Clear browser cache** and refresh
2. ✅ **Check deployment** - Ensure latest portal build is deployed
3. ✅ **Expected form fields**: Email, Password, **Project** (dropdown)

### 🔴 **API Connection Issues**

**Symptom**: Status shows "Checking..." or "Disconnected"

**Cause**: Portal can't reach API service

**Solutions**:
1. ✅ **Check API health directly**: 
   ```bash
   curl https://useng-usasset-api.lemonforest-4e4757f3.eastus.azurecontainerapps.io/v1/health
   ```
2. ✅ **Verify CORS configuration** - API must allow portal domain
3. ✅ **Check environment variables** - `VITE_API_URL` must include `/v1`

## Working Login Process ✅

### Step-by-Step Verification

1. **Navigate to portal**: https://salmon-field-08d82e40f.2.azurestaticapps.net

2. **Verify form elements**:
   - Email field ✅
   - Password field ✅  
   - Project dropdown ✅ (should show 3 projects)
   - Login button ✅

3. **Test login**:
   - Select: "Construction Site Alpha"
   - Email: `super@test.com`
   - Password: `ChangeMe123!`
   - Click Login

4. **Expected result**:
   - Redirect to `/dashboard` ✅
   - Shows "Successfully logged in!" message ✅
   - Displays "Welcome back, super@test.com!" ✅
   - Shows user role ✅
   - Lists 27 permissions ✅

## Test Users & Project Access

### Super User (All Access)
- **Email**: `super@test.com`
- **Password**: `ChangeMe123!`
- **Projects**: All 3 projects
- **Roles**: All roles in all projects

### Regular Users
- **Admin**: `admin@usasset.com` / `ChangeMe123`
- **Manager**: `manager@usasset.com` / `ChangeMe123`
- **Engineer**: `engineer@usasset.com` / `ChangeMe123`
- **Viewer**: `viewer@usasset.com` / `ChangeMe123`

### Available Projects
- **Construction Site Alpha**: `86b3ee96-4c01-448a-a34d-53b63e03acba`
- **Renovation Project Beta**: `bf97c79f-1158-4666-b5cf-bdfeacc9a7b0`
- **Infrastructure Project Gamma**: `dc7b058a-c797-4ea2-a536-24fd36194f1b`

## API Testing Commands

### Test API Directly
```bash
# Health check (should return {"status":"ok"})
curl https://useng-usasset-api.lemonforest-4e4757f3.eastus.azurecontainerapps.io/v1/health

# API Key test (should return user list)
API_KEY="4b5cdb899a699f7cf529e2f7cf3e7b6b1c2c558c4785ff40a79fe8392515156e"
curl -H "x-api-key: $API_KEY" \
  https://useng-usasset-api.lemonforest-4e4757f3.eastus.azurecontainerapps.io/v1/users

# JWT login test (should return access token)
curl -X POST https://useng-usasset-api.lemonforest-4e4757f3.eastus.azurecontainerapps.io/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "super@test.com",
    "password": "ChangeMe123!",
    "projectId": "86b3ee96-4c01-448a-a34d-53b63e03acba"
  }'
```

## Browser Developer Tools

### Check Network Tab
1. Open Developer Tools (F12)
2. Go to Network tab
3. Attempt login
4. Look for API calls to `/v1/auth/login`
5. Check request payload includes all 3 fields
6. Check response status and error messages

### Check Console Tab  
1. Look for JavaScript errors
2. Check for API connection status logs
3. Look for authentication flow debug messages

## Architecture Context

### Why Project-Scoped Authentication?

This is a **multi-tenant system** where:
- Users can belong to multiple projects
- Each project has separate role assignments
- Permissions are scoped to specific projects
- JWT tokens contain project context

This requires selecting the project **before** authentication to:
- Validate user has access to that project
- Issue a project-scoped JWT token
- Load project-specific permissions

### Security Implications

- ✅ **Prevents cross-project access** - Users can't accidentally access wrong project data
- ✅ **Enforces project-based RBAC** - Roles are project-specific
- ✅ **Audit trail clarity** - All actions are clearly project-scoped

## Quick Fixes

### Clear Everything and Start Fresh
1. Clear browser cache and cookies
2. Refresh portal page
3. Verify project dropdown appears
4. Use super@test.com for testing
5. Select "Construction Site Alpha" project

### Portal Not Working At All
1. Check API is running: `curl https://useng-usasset-api.lemonforest-4e4757f3.eastus.azurecontainerapps.io/v1/health`
2. Check CORS is configured for portal domain
3. Redeploy portal if needed
4. Check Azure Static Web App status

## Support Information

- **Portal URL**: https://salmon-field-08d82e40f.2.azurestaticapps.net
- **API URL**: https://useng-usasset-api.lemonforest-4e4757f3.eastus.azurecontainerapps.io/v1
- **Status**: ✅ Deployed and tested (August 1, 2025)
- **Last Verified**: Login process working end-to-end

---

**Remember**: The project selection requirement is by design, not a bug! This enables the multi-tenant architecture with proper security boundaries.