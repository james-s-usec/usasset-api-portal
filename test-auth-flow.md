# Auth Flow Testing Steps

## Current Issues Fixed:
1. ✅ Dashboard redirect after Azure AD login
2. ✅ API key not being sent in headers (made dynamic)
3. ✅ React StrictMode double-render prevented
4. ✅ Added delay between dashboard API calls
5. ✅ Added permissions to API key user

## To Test API Key Authentication:

1. **Clear browser storage** (F12 → Application → Clear Storage)

2. **Start the API with increased rate limits:**
   ```bash
   RATE_LIMIT_MAX=100 API_KEYS="test-key-123" npm run start:dev
   ```

3. **Navigate to portal:** http://localhost:5173/

4. **Select "API Key"** authentication mode

5. **Enter API key:** `test-key-123`

6. **Click "Connect with API Key"**

You should:
- Be redirected to /dashboard
- See the dashboard load without 429 errors
- See "API Key User" in the welcome message

## To Test Azure AD:

1. Clear browser storage
2. Select "Azure AD" mode
3. Click "Sign in with Microsoft"
4. Complete login
5. Should redirect to dashboard

## To Test JWT:

1. Clear browser storage
2. Select "JWT" mode
3. Enter valid credentials
4. Should redirect to dashboard

## Debugging:
- Check console for "🔐 API Client using API key" logs
- Verify localStorage has 'apiKey' set
- Check Network tab to see x-api-key header