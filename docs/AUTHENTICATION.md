# Authentication System

This document describes the authentication system implemented in the BudgetR frontend application.

## Overview

The authentication system uses a token-based approach with automatic refresh capabilities:

- **Access Token**: Stored in context and sessionStorage for immediate access
- **Refresh Token**: Stored in HTTP-only cookies for security
- **Automatic Refresh**: Handles token expiration transparently
- **Protected Routes**: Guards routes that require authentication

## Architecture

### Components

1. **AuthProvider** (`src/providers/AuthProvider.tsx`)
   - Manages authentication state
   - Handles login/logout operations
   - Initializes auth status on app load
   - Provides auth context to the entire app

2. **ApiClient** (`src/utils/api.ts`)
   - Singleton HTTP client with automatic token refresh
   - Intercepts 401 responses and attempts token refresh
   - Retries failed requests with new tokens
   - Handles authentication errors gracefully

3. **ProtectedRoute** (`src/components/auth/ProtectedRoute.tsx`)
   - Guards routes that require authentication
   - Redirects to login if not authenticated
   - Shows loading state during auth checks

4. **TokenUtils** (`src/utils/tokenUtils.ts`)
   - Manages token storage and retrieval
   - Provides token validation utilities
   - Handles token expiration checks

### Authentication Flow

1. **App Initialization**
   ```
   App loads → AuthProvider initializes → Check refresh token → Set auth state
   ```

2. **Login Process**
   ```
   User submits credentials → API call to /auth/login → Store tokens → Update context
   ```

3. **Token Refresh**
   ```
   API call fails with 401 → Automatic refresh attempt → Retry original request
   ```

4. **Logout Process**
   ```
   User logs out → Clear tokens → Update context → Redirect to login
   ```

## API Endpoints

The system expects the following backend endpoints:

- `POST /auth/login` - User login
- `POST /auth/logout` - User logout  
- `POST /auth/refresh` - Token refresh

### Expected Response Format

```typescript
interface AuthResponse {
  accessToken: string;
  userId: string;
}
```

## Security Features

1. **HTTP-Only Cookies**: Refresh tokens are stored in secure HTTP-only cookies
2. **Session Storage**: Access tokens are stored in sessionStorage (cleared on tab close)
3. **Automatic Refresh**: Transparent token refresh without user intervention
4. **Secure Logout**: Proper cleanup of all stored tokens
5. **Route Protection**: Unauthorized users are redirected to login

## Usage

### Protecting Routes

```tsx
import { ProtectedRoute } from './components/auth/ProtectedRoute';

<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } 
/>
```

### Using Authentication in Components

```tsx
import { useAuth } from './hooks/auth';

const MyComponent = () => {
  const { isLoggedIn, userId, logout } = useAuth();
  
  if (!isLoggedIn) {
    return <div>Please log in</div>;
  }
  
  return (
    <div>
      <p>Welcome, {userId}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};
```

### Making Authenticated API Calls

```tsx
import { apiClient } from './utils/api';

// The API client automatically handles authentication
const response = await apiClient.get('/user/profile');
```

## Error Handling

The system handles various authentication errors:

1. **401 Unauthorized**: Automatic token refresh attempt
2. **Refresh Failed**: Redirect to login page
3. **Network Errors**: Graceful degradation with user feedback
4. **Token Expired**: Transparent refresh without user intervention

## Configuration

Environment variables required:

```env
VITE_BACKEND_BASE_URL=http://localhost:3000/api
```

## Best Practices

1. **Always use the ApiClient**: Don't make direct fetch calls for authenticated requests
2. **Handle loading states**: Use the `isLoading` state from auth context
3. **Protect sensitive routes**: Wrap components that require auth with `ProtectedRoute`
4. **Clear sensitive data**: Always clear tokens on logout
5. **Error boundaries**: Implement error boundaries for auth-related errors

## Troubleshooting

### Common Issues

1. **Infinite redirects**: Check that login route is not protected
2. **Token not refreshing**: Verify backend refresh endpoint is working
3. **CORS issues**: Ensure backend allows credentials
4. **Session persistence**: Check cookie settings on backend

### Debug Mode

Enable debug logging by setting:

```typescript
localStorage.setItem('debug-auth', 'true');
```

This will log authentication events to the console. 