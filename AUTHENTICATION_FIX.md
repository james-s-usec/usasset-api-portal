# Azure AD Authentication Fix Documentation

## Problem Summary
Users were unable to log in via Azure AD OAuth. The authentication flow would complete successfully, but when trying to access the `/auth/profile` endpoint, it would return 401 Unauthorized despite having a valid JWT token.

## Root Cause Analysis

### Issue 1: Missing Project Context
- The backend required a project ID to generate JWT tokens with permissions
- Without a project ID, the default UUID `00000000-0000-0000-0000-000000000000` was used
- This default project didn't exist in the database, causing no permissions to be loaded

### Issue 2: Hardcoded Empty Permissions
- In `auth.service.ts`, there was a hardcoded check that returned empty permissions for the default project:
```typescript
// For default project, return empty permissions (user needs to select a real project)
if (projectId === '00000000-0000-0000-0000-000000000000') {
  return { user, permissions: [] };
}
```
- This caused the JWT token to have no permissions, making all API calls fail with 401

## Solution Implemented

### 1. Created Default Project in Database
Created a SQL script to add the default project:
```sql
-- Create default project with specific UUID
INSERT INTO "Project" (id, name, "userId", "createdAt") 
VALUES (
  '00000000-0000-0000-0000-000000000000', 
  'Default Project', 
  '8631f44f-7751-4af1-b1b7-94ded39a8b6c',  -- jswans33@gmail.com user ID
  NOW()
) 
ON CONFLICT (id) DO NOTHING;

-- Assign the user as viewer for the default project
INSERT INTO "user_project_roles" ("userId", "projectId", "roleId", "assignedBy", "assignedAt")
SELECT 
  '8631f44f-7751-4af1-b1b7-94ded39a8b6c',  -- jswans33@gmail.com
  '00000000-0000-0000-0000-000000000000',  -- default project
  r.id,
  'c2bcf338-5453-4e3a-aa30-16637a9baa0d',  -- CLI System User
  NOW()
FROM "roles" r 
WHERE r.name = 'viewer'
ON CONFLICT ("userId", "projectId", "roleId") DO NOTHING;
```

### 2. Fixed Backend Permission Loading
Removed the hardcoded empty permissions check in `auth.service.ts`:
```typescript
// For default project, still load permissions like any other project
// if (projectId === '00000000-0000-0000-0000-000000000000') {
//   return { user, permissions: [] };
// }
```

### 3. Updated Frontend Flow
- Removed hardcoded project ID from `AzureADCallback.tsx`
- Let the backend use the default project ID
- Added redirect to dashboard after successful login

## Key Learnings

1. **Database Table Names**: PostgreSQL uses different naming conventions:
   - `"User"`, `"Project"` - PascalCase with quotes
   - `"roles"`, `"user_project_roles"` - lowercase
   - Always check the actual migration files to see the correct table names

2. **Project Context**: The system requires users to be associated with at least one project to have any permissions

3. **Permission Loading**: Even "default" or "temporary" projects need proper permission loading to allow API access

## Files Modified

### Backend
- `/src/auth/auth.service.ts` - Removed hardcoded empty permissions for default project
- `/scripts/create-default-project.sql` - Created to seed default project

### Frontend  
- `/src/components/AzureADCallback.tsx` - Removed hardcoded project ID
- `/src/services/auth-service.ts` - Added detailed JWT payload logging
- `/src/components/ConnectionStatus.tsx` - Added CORS credentials
- `/src/pages/Dashboard.tsx` - Created dashboard page
- `/src/App.tsx` - Added dashboard route and redirect

## Testing the Fix

1. **Verify Default Project Exists**:
```bash
npm run console -- projects:list | grep 00000000
```

2. **Check User Has Access**:
```bash
npm run console -- rbac:check --user-email jswans33@gmail.com --project-id 00000000-0000-0000-0000-000000000000 --permission view:project
```

3. **Login Flow**:
   - User logs in with Azure AD
   - Backend uses default project ID
   - Permissions are loaded from database
   - JWT token includes permissions
   - User is redirected to dashboard

## Future Improvements

1. **Project Selection**: Implement proper project selection after login instead of using a default project
2. **Session Tokens**: Use temporary session tokens that don't require project context initially
3. **Auto-Project Creation**: Automatically create a personal project for new users
4. **Project Switcher**: Add UI to switch between projects without re-authentication