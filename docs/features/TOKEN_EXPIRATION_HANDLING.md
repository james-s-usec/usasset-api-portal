# Token Expiration Handling

## Overview

Automatic JWT token expiration handling system that provides seamless user experience when tokens expire, prevents stale token usage, and maintains consistent authentication state across browser tabs.

## Implementation

### Core Components

#### 1. Token Utilities (`src/utils/auth-storage.ts`)

```typescript
export const tokenUtils = {
  isTokenExpired(token: string): boolean
  getTokenExpirationTime(token: string): Date | null
  getTimeUntilExpiration(token: string): number
}
```

**Features:**
- JWT payload parsing with error handling
- 30-second expiration buffer to prevent edge cases
- Time calculation utilities for expiration management

#### 2. Authentication Context (`src/contexts/AuthContext.tsx`)

**Auto-Expiration Logic:**
- `useEffect` monitors authenticated JWT users
- Sets timeout based on token expiration time
- Automatically triggers logout when token expires
- Dispatches cross-tab expiration events

**Enhanced Auth Checking:**
- `checkExistingAuth()` validates token expiration on app load
- Clears expired tokens before attempting authentication
- Prevents invalid auth states

#### 3. API Response Interceptor (`src/services/api-client.ts`)

```typescript
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      authStorage.clearAll();
      authStorage.dispatchAuthExpired();
    }
    return Promise.reject(error);
  }
);
```

**Benefits:**
- Automatic cleanup on server-side token invalidation
- Handles 401 responses from any API endpoint
- Triggers cross-tab logout synchronization

#### 4. Cross-Tab Synchronization

**Event System:**
```typescript
// Dispatch expiration event
authStorage.dispatchAuthExpired();

// Listen for expiration events
const cleanup = authStorage.onAuthExpired(() => logout());
```

**Features:**
- Browser-wide logout synchronization
- Custom event system with proper cleanup
- Scoped to authenticated users only

## User Experience

### Scenarios Handled

1. **Token Expires During Session**
   - User automatically logged out
   - Redirected to login page
   - No error messages or broken states

2. **User Returns with Expired Token**
   - Expired token detected on app load
   - Token cleared automatically
   - User sees fresh login page

3. **API Returns 401 (Server-Side Invalidation)**
   - Token cleared immediately
   - User logged out across all tabs
   - Clean error state

4. **Multi-Tab Usage**
   - Token expires in one tab
   - All other tabs automatically logout
   - Consistent authentication state

## Security Benefits

- **Prevents stale token usage** - No expired tokens remain in storage
- **Eliminates race conditions** - 30-second buffer prevents edge cases
- **Server-side validation** - Handles token invalidation from API
- **Cross-tab consistency** - No mixed authentication states
- **Graceful degradation** - Clean logout flow without errors

## Technical Details

### Token Expiration Buffer

30-second buffer added to prevent timing edge cases:
```typescript
return Date.now() >= (payload.exp * 1000) - 30000;
```

### Memory Management

- Event listeners properly cleaned up
- Timeouts cleared on component unmount
- No memory leaks in long-running sessions

### Error Handling

- JWT parsing failures handled gracefully
- Missing expiration claims treated as non-expiring
- Network errors don't affect token validation

## Testing

Comprehensive testing performed with Playwright:

- ✅ Expired token detection and cleanup
- ✅ Automatic logout on expiration
- ✅ Cross-tab event synchronization
- ✅ API 401 response handling
- ✅ Auth state consistency

## Compatibility

- **JWT Standard**: Compatible with standard JWT exp claims
- **API Types**: Works with both JWT and API key authentication
- **Browser Support**: Modern browsers with sessionStorage support
- **Framework**: React 19 with hooks and context

## Configuration

No configuration required. The system automatically:
- Detects JWT tokens in sessionStorage
- Parses expiration times from token payload
- Sets up appropriate timeouts and event handlers
- Cleans up resources on logout

## Future Enhancements

Potential improvements for future releases:
- Token refresh functionality
- Configurable expiration buffer
- Custom expiration warning notifications
- Offline token validation