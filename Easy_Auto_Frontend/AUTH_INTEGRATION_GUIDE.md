# Authentication Integration Guide

## Overview

This project implements a complete authentication system for an Expo SDK 54 + Expo Router app with:
- **OTP Login**: Phone-based authentication via backend
- **OAuth Login**: Google, Apple, and Facebook via Clerk
- **Token Management**: JWT with automatic refresh
- **Route Guards**: Protection for authenticated routes
- **Action Guards**: Protection for authenticated actions

## Architecture

### Token Flow

1. **OTP Authentication**:
   - User enters phone number → POST `/api/auth/send-otp`
   - User enters OTP code → POST `/api/auth/verify-otp`
   - Backend returns `accessToken` and `refreshToken`
   - Tokens stored in `expo-secure-store`

2. **OAuth Authentication (via Clerk)**:
   - User initiates OAuth flow (Google/Apple/Facebook)
   - Clerk handles OAuth and returns session token
   - Exchange Clerk token → POST `/api/auth/clerk`
   - Backend returns `accessToken` and `refreshToken`
   - Tokens stored in `expo-secure-store`

3. **Token Refresh**:
   - API client automatically detects 401 responses
   - Attempts refresh → POST `/api/auth/refresh`
   - Updates access token if successful
   - Redirects to login if refresh fails

### File Structure

```
contexts/
  AuthContext.tsx          # Main auth state management
hooks/
  useProtectedRoute.ts     # Route protection hooks
  useClerkOAuth.ts         # Clerk OAuth integration
components/
  auth/
    ProtectedRoute.tsx     # Route guard component
utils/
  api.ts                   # API client with token refresh
app/
  auth/
    login.tsx              # Email/password login
    otp-login.tsx          # Phone OTP login
```

## Authentication Context

Located: `contexts/AuthContext.tsx`

### State
- `isAuthenticated`: Boolean - user login status
- `user`: User object or null
- `accessToken`: JWT access token
- `refreshToken`: JWT refresh token
- `isLoading`: Boolean - loading state

### Methods

#### `sendOTP(phone: string)`
Sends OTP to phone number.
```typescript
const { sendOTP } = useAuth();
const result = await sendOTP('+1234567890');
if (result.success) {
  // OTP sent
}
```

#### `verifyOTP(phone: string, otp: string)`
Verifies OTP and logs in user.
```typescript
const { verifyOTP } = useAuth();
const result = await verifyOTP('+1234567890', '123456');
if (result.success) {
  // User logged in
}
```

#### `handleClerkAuth()`
Exchanges Clerk token for backend JWT. Called automatically by OAuth flow.

#### `refreshAccessToken()`
Manually refreshes access token. Usually handled automatically by API client.

#### `getValidToken()`
Returns current valid access token.

#### `logout()`
Clears all auth state and tokens.
```typescript
const { logout } = useAuth();
await logout();
```

## Route Protection

### Using Hook

Simplest method - add to any protected screen:

```typescript
import { useProtectedRoute } from '@/hooks/useProtectedRoute';

export default function ProtectedScreen() {
  useProtectedRoute(); // Redirects to login if not authenticated
  
  return (
    // Your screen content
  );
}
```

### Using Component Wrapper

Alternative method for component-based protection:

```typescript
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function ProtectedScreen() {
  return (
    <ProtectedRoute>
      {/* Your screen content */}
    </ProtectedRoute>
  );
}
```

## Action Protection

### useActionGuard Hook

For protecting individual actions/buttons:

```typescript
import { useActionGuard } from '@/hooks/useProtectedRoute';

function MyComponent() {
  const guardAction = useActionGuard();
  
  const handleFavorite = guardAction(() => {
    // This only runs if authenticated
    addToFavorites(itemId);
  });
  
  return (
    <Button onPress={handleFavorite}>Add to Favorites</Button>
  );
}
```

### useCanAccess Hook

For conditional rendering based on auth status:

```typescript
import { useCanAccess } from '@/hooks/useProtectedRoute';

function MyComponent() {
  const canAccess = useCanAccess();
  
  return (
    <View>
      {canAccess ? (
        <Button onPress={handleAction}>Create Ad</Button>
      ) : (
        <Button onPress={() => router.push('/auth/login')}>
          Login to Create Ad
        </Button>
      )}
    </View>
  );
}
```

## API Client

Located: `utils/api.ts`

### Automatic Token Handling

The API client automatically:
- Attaches `Authorization: Bearer <token>` to requests
- Detects 401 responses
- Attempts token refresh
- Retries failed request with new token
- Redirects to login if refresh fails

### Usage

```typescript
import { api } from '@/utils/api';

// Authenticated request (default)
const data = await api.get('/api/cars');

// Public request (skip auth)
const publicData = await api.get('/api/cars/public', { skipAuth: true });

// POST request
const result = await api.post('/api/cars', { 
  make: 'Toyota',
  model: 'Camry'
});
```

## Protected Routes

The following routes are protected and require authentication:

### Tab Screens
- `/chat` - Chat messages
- `/profile` - User profile

### Ad Management
- `/ads/my-ads` - User's advertisements
- `/ads/posted-ad` - Posted ad details
- `/ads/edit-car` - Edit advertisement
- `/ads/delete-car` - Delete advertisement

### Car Actions
- `/cars/sell-car` - Create new listing

### Profile Management
- `/profile/wishlist` - Saved items
- `/profile/edit-profile` - Edit profile
- `/profile/ratings` - User ratings
- `/profile/address` - Manage addresses

### Payments
- `/payments/payment` - Make payment
- `/payments/payment-methods` - Manage payment methods
- `/payments/payment-history` - Payment history
- `/payments/add-card` - Add payment card

## Public Routes

The following routes are accessible without authentication:

### Main Screens
- `/(tabs)` - Home screen
- `/listings` - Browse listings
- `/cars/view-car` - View car details
- `/cars/buy-car` - Buy car flow (until checkout)
- `/cars/rent-car` - Rent car flow (until checkout)

### Auth Screens
- `/auth/login` - Email login
- `/auth/otp-login` - Phone OTP login
- `/auth/signup` - Registration
- `/auth/reset-password` - Password reset

## Backend API Endpoints Required

### Authentication
```
POST /api/auth/send-otp
Body: { phone: string }
Response: { success: boolean, message: string }

POST /api/auth/verify-otp
Body: { phone: string, otp: string }
Response: { 
  success: boolean, 
  accessToken: string, 
  refreshToken: string,
  user: { id, name, email?, phone?, avatar? }
}

POST /api/auth/clerk
Headers: { Authorization: Bearer <clerkToken> }
Response: { 
  success: boolean, 
  accessToken: string, 
  refreshToken: string,
  user: { id, name, email?, phone?, avatar? }
}

POST /api/auth/refresh
Body: { refreshToken: string }
Response: { 
  success: boolean, 
  accessToken: string, 
  refreshToken?: string 
}
```

## Secure Storage

All sensitive data is stored using `expo-secure-store`:

- `backend_access_token` - JWT access token
- `backend_refresh_token` - JWT refresh token
- `user_data` - User profile JSON

## Testing Authentication

### Test OTP Login
1. Run app: `npm start`
2. Navigate to Login screen
3. Click "Login with OTP"
4. Enter phone number
5. Enter OTP received
6. Should redirect to home screen

### Test OAuth Login
1. Run app: `npm start`
2. Navigate to Login screen
3. Click "Sign in with Google/Apple/Facebook"
4. Complete OAuth flow
5. Should redirect to home screen

### Test Route Protection
1. Without logging in, try to access `/profile`
2. Should redirect to `/auth/login`
3. Login and try again
4. Should access profile screen

### Test Token Refresh
1. Login successfully
2. Expire access token (manually or wait)
3. Make an authenticated API call
4. Should automatically refresh and retry

## Environment Setup

### Required Environment Variables

```env
# .env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
```

### Clerk Dashboard Configuration
1. Enable OAuth providers (Google, Apple, Facebook)
2. Configure redirect URLs
3. Add development/production domains

## Troubleshooting

### "Not authenticated" errors
- Check if tokens are stored: Use React Native Debugger
- Verify backend JWT validation
- Check token expiry times

### OAuth not working
- Verify Clerk configuration
- Check redirect URLs in Clerk dashboard
- Ensure OAuth providers are enabled

### Token refresh failing
- Verify `/api/auth/refresh` endpoint
- Check refresh token format
- Ensure refresh token hasn't expired

### Route guards not working
- Ensure `AuthProvider` wraps entire app
- Check hook is called at component level (not conditionally)
- Verify `isAuthenticated` state updates

## Best Practices

1. **Always use hooks at top level**: Don't call `useProtectedRoute()` conditionally
2. **Handle loading states**: Show loading indicators while `isLoading` is true
3. **Graceful fallbacks**: Provide clear messaging when auth fails
4. **Token security**: Never log or expose tokens in production
5. **Error handling**: Always handle auth errors gracefully

## Migration Notes

If migrating from old auth system:
1. Old `context/AuthContext.tsx` is deprecated - use `contexts/AuthContext.tsx`
2. Token storage keys changed - users will need to re-login
3. API client now handles refresh automatically - remove manual refresh calls

## Future Enhancements

Potential improvements:
- Biometric authentication
- Remember device functionality
- Multi-factor authentication
- Session management dashboard
- Auth analytics
