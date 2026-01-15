# Authentication Quick Reference

## 🔐 Login Methods

### OTP Login
```typescript
const { sendOTP, verifyOTP } = useAuth();

// Step 1: Send OTP
await sendOTP('+1234567890');

// Step 2: Verify OTP
const result = await verifyOTP('+1234567890', '123456');
```

### OAuth Login (Google/Apple/Facebook)
```typescript
const { signInWithGoogle, signInWithApple, signInWithFacebook } = useClerkOAuth();

await signInWithGoogle();
```

## 🛡️ Protect Routes

```typescript
import { useProtectedRoute } from '@/hooks/useProtectedRoute';

export default function MyProtectedScreen() {
  useProtectedRoute(); // Redirects to login if not authenticated
  
  return <View>...</View>;
}
```

## 🔒 Protect Actions

```typescript
import { useActionGuard } from '@/hooks/useProtectedRoute';

function MyComponent() {
  const guardAction = useActionGuard();
  
  const handleClick = guardAction(() => {
    // This only runs if authenticated
    doProtectedAction();
  });
  
  return <Button onPress={handleClick}>Click Me</Button>;
}
```

## 🔍 Check Auth Status

```typescript
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { isAuthenticated, user, isLoading } = useAuth();
  
  if (isLoading) return <Loading />;
  if (!isAuthenticated) return <LoginPrompt />;
  
  return <UserContent user={user} />;
}
```

## 📡 Make API Calls

```typescript
import { api } from '@/utils/api';

// Authenticated request (automatic token attachment)
const data = await api.get('/api/cars');
const result = await api.post('/api/cars', carData);

// Public request (no authentication)
const publicData = await api.get('/api/public/cars', { skipAuth: true });
```

## 🚪 Logout

```typescript
const { logout } = useAuth();

await logout();
router.replace('/auth/login');
```

## 🗂️ Auth State

```typescript
const { 
  isAuthenticated,  // Boolean - logged in?
  user,            // User object or null
  accessToken,     // JWT access token
  refreshToken,    // JWT refresh token
  isLoading,       // Boolean - checking auth?
} = useAuth();
```

## 📋 Backend Endpoints

```
POST /api/auth/send-otp       → Send OTP to phone
POST /api/auth/verify-otp     → Verify OTP and login
POST /api/auth/clerk          → Exchange Clerk token
POST /api/auth/refresh        → Refresh access token
```

## 🔑 Token Storage

Stored securely in `expo-secure-store`:
- `backend_access_token`
- `backend_refresh_token`
- `user_data`

## ⚡ Token Refresh

Automatic! The API client:
1. Detects 401 responses
2. Refreshes token automatically
3. Retries failed request
4. Redirects to login if refresh fails

## 🎯 Public vs Protected Routes

### Public (No Login Required)
- Home screen
- Browse ads/listings
- View car details
- Login/Signup screens

### Protected (Login Required)
- Create/Edit ads
- Chat
- Profile
- Wishlist
- Payments
- My Ads

## 💡 Common Patterns

### Conditional Rendering
```typescript
const canAccess = useCanAccess();

return canAccess ? <AdminPanel /> : <LoginButton />;
```

### Async Action Guard
```typescript
const withAuth = useRequireAuth();

const handleSubmit = withAuth(async () => {
  await api.post('/api/ads', adData);
});
```

### Custom Redirect
```typescript
useProtectedRoute('/auth/otp-login');
```

## 🐛 Debugging

```typescript
// Check current auth state
console.log('Auth:', { isAuthenticated, user });

// Check stored tokens
import * as SecureStore from 'expo-secure-store';
const token = await SecureStore.getItemAsync('backend_access_token');

// Test API call
const result = await api.get('/api/test');
```

## ⚠️ Important Notes

1. Always call hooks at component top level
2. Handle loading states properly
3. Never log tokens in production
4. Use `skipAuth: true` for public endpoints
5. Tokens refresh automatically on 401
