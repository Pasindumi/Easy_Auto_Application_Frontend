# Authentication Integration Guide

## ✅ What Has Been Implemented

### Core Infrastructure
1. **Token Cache** (`utils/tokenCache.ts`) - Secure storage for Clerk tokens
2. **AuthContext** (`contexts/AuthContext.tsx`) - Central authentication state management
3. **API Client** (`utils/api.ts`) - HTTP client with automatic JWT attachment
4. **Route Guards** (`hooks/useProtectedRoute.ts`) - Protection hooks for routes and actions
5. **Root Layout** (`app/_layout.tsx`) - Wrapped with Clerk and Auth providers

---

## 🔧 How to Integrate Into Your Existing Screens

### 1. Environment Setup

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Add your Clerk publishable key from https://dashboard.clerk.com

### 2. Protect Entire Screens

For screens that require authentication (Profile, Chat, Create Ad, etc.):

```tsx
import { useProtectedRoute } from '@/hooks/useProtectedRoute';

export default function ProfileScreen() {
  // This will auto-redirect to login if not authenticated
  useProtectedRoute();

  return (
    // Your existing UI code - NO CHANGES NEEDED
  );
}
```

### 3. Protect Individual Actions

For buttons/actions that require auth (Favorite, Chat, Create Ad buttons):

```tsx
import { useActionGuard } from '@/hooks/useProtectedRoute';

export default function AdDetailsScreen() {
  const guardAction = useActionGuard();

  const handleFavorite = guardAction(async () => {
    // This only executes if user is authenticated
    // Otherwise redirects to login
    await api.post('/ads/favorite', { adId });
  });

  return (
    <Button onPress={handleFavorite}>
      {/* Your existing button UI */}
    </Button>
  );
}
```

### 4. Conditional UI Based on Auth

Show/hide UI elements based on authentication:

```tsx
import { useAuth } from '@/contexts/AuthContext';

export default function HomeScreen() {
  const { isAuthenticated, user } = useAuth();

  return (
    <>
      {isAuthenticated ? (
        <Text>Welcome {user?.name}!</Text>
      ) : (
        <Button title="Login" onPress={() => router.push('/(auth)/login')} />
      )}
      
      {/* Your existing UI */}
    </>
  );
}
```

### 5. Integrate OTP Login in Your Login Screen

```tsx
// In your EXISTING app/auth/login.tsx (or wherever your login screen is)
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const [phone, setPhone] = useState('');
  const [otp, setOTP] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const { sendOTP, verifyOTP } = useAuth();
  const router = useRouter();

  const handleSendOTP = async () => {
    const result = await sendOTP(phone);
    if (result.success) {
      setStep('otp');
    } else {
      alert(result.error);
    }
  };

  const handleVerifyOTP = async () => {
    const result = await verifyOTP(phone, otp);
    if (result.success) {
      router.replace('/(tabs)'); // Redirect to home
    } else {
      alert(result.error);
    }
  };

  return (
    // Keep your EXISTING UI design
    // Just connect the buttons to these handlers
    <View>
      {step === 'phone' ? (
        <>
          <TextInput 
            value={phone}
            onChangeText={setPhone}
            placeholder="Phone number"
          />
          <Button title="Send OTP" onPress={handleSendOTP} />
        </>
      ) : (
        <>
          <TextInput 
            value={otp}
            onChangeText={setOTP}
            placeholder="Enter OTP"
          />
          <Button title="Verify" onPress={handleVerifyOTP} />
        </>
      )}
    </View>
  );
}
```

### 6. Integrate Clerk Social Login

```tsx
// In your EXISTING login screen
import { useSignIn, useSignUp } from '@clerk/clerk-expo';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginScreen() {
  const { signIn } = useSignIn();
  const { handleClerkAuth } = useAuth();
  const router = useRouter();

  const handleGoogleLogin = async () => {
    try {
      // Sign in with Clerk
      await signIn?.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/',
        redirectUrlComplete: '/',
      });

      // Exchange Clerk token for backend JWT
      const result = await handleClerkAuth();
      if (result.success) {
        router.replace('/(tabs)');
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error('Google login error:', error);
    }
  };

  return (
    // Add Google button to your existing UI
    <Button title="Continue with Google" onPress={handleGoogleLogin} />
  );
}
```

### 7. Use API Client for Backend Calls

Replace all `fetch` calls with the API client:

```tsx
import api from '@/utils/api';

// Old way
const response = await fetch(`${API_URL}/ads`, {
  headers: { Authorization: `Bearer ${token}` }
});

// New way - JWT is attached automatically
const ads = await api.get('/api/ads');

// POST request
const newAd = await api.post('/api/ads', { title, price });

// For public endpoints (no JWT needed)
const publicAds = await api.get('/api/ads/public', { skipAuth: true });
```

### 8. Logout

```tsx
import { useAuth } from '@/contexts/AuthContext';
import { useSignOut } from '@clerk/clerk-expo';

export default function ProfileScreen() {
  const { logout } = useAuth();
  const { signOut } = useSignOut();
  const router = useRouter();

  const handleLogout = async () => {
    await logout(); // Clear backend tokens
    await signOut(); // Sign out from Clerk
    router.replace('/(tabs)'); // Redirect to home
  };

  return (
    <Button title="Logout" onPress={handleLogout} />
  );
}
```

---

## 📋 Integration Checklist

### Required Actions

- [ ] Copy `.env.example` to `.env` and add Clerk publishable key
- [ ] Add `useProtectedRoute()` to protected screens:
  - [ ] Create Ad screen
  - [ ] Profile screen
  - [ ] Chat screen
  - [ ] Favorites screen
  - [ ] Payment screens
- [ ] Replace `fetch` calls with `api` client
- [ ] Integrate OTP logic into existing login screen UI
- [ ] Add Clerk social login buttons to login screen
- [ ] Add logout functionality to profile/settings
- [ ] Test authentication flow end-to-end

### Optional Enhancements

- [ ] Add loading states during authentication
- [ ] Show error messages in UI instead of alerts
- [ ] Add "Continue without login" option on home screen
- [ ] Add auth state indicators in header/navbar
- [ ] Implement token refresh logic

---

## 🔐 Backend Requirements

Your backend must support these endpoints:

### OTP Authentication
```
POST /api/auth/send-otp
Body: { "phone": "+1234567890" }
Response: { "message": "OTP sent successfully" }

POST /api/auth/verify-otp
Body: { "phone": "+1234567890", "otp": "123456" }
Response: {
  "accessToken": "jwt_token_here",
  "user": { "id": "1", "name": "John", "phone": "+1234567890" }
}
```

### Clerk Authentication
```
POST /api/auth/clerk
Headers: { "Authorization": "Bearer clerk_session_token" }
Response: {
  "accessToken": "jwt_token_here",
  "user": { "id": "1", "name": "John", "email": "john@example.com" }
}
```

All protected endpoints should:
- Accept `Authorization: Bearer <backend_jwt>`
- Return 401 if token is invalid/expired

---

## 🚀 Testing

1. **Start your backend** (must be running on port 5000)
2. **Start ngrok**: `ngrok http 5000`
3. **Update API URL** in `constants/API.ts` with ngrok URL
4. **Run Expo**: `npm run dev` or `npx expo start --tunnel`
5. **Test flows**:
   - OTP login
   - Social login
   - Protected route access
   - Logout

---

## 🎯 Key Features

✅ **Dual Authentication**: OTP + Social (Clerk)  
✅ **Secure Storage**: expo-secure-store for tokens  
✅ **Auto JWT Attachment**: API client handles authorization  
✅ **Route Guards**: Automatic redirection for protected routes  
✅ **Action Guards**: Protect individual buttons/actions  
✅ **401 Handling**: Auto-redirect to login on token expiry  
✅ **No UI Changes**: Integrates into existing components  

---

## 📚 Additional Resources

- [Clerk Expo Documentation](https://clerk.com/docs/quickstarts/expo)
- [Expo Router Authentication](https://docs.expo.dev/router/reference/authentication/)
- [Expo Secure Store](https://docs.expo.dev/versions/latest/sdk/securestore/)

---

## 💡 Example Usage Patterns

### Pattern 1: Protected Screen
```tsx
export default function CreateAdScreen() {
  useProtectedRoute(); // That's it!
  // Rest of your existing code...
}
```

### Pattern 2: Protected Action
```tsx
const guardAction = useActionGuard();
<Button onPress={guardAction(handleCreateAd)}>Post Ad</Button>
```

### Pattern 3: Conditional Rendering
```tsx
const { isAuthenticated } = useAuth();
{isAuthenticated ? <CreateAdButton /> : <LoginPrompt />}
```

### Pattern 4: API Call
```tsx
const ads = await api.get('/api/ads');
const newAd = await api.post('/api/ads', adData);
```

---

**Ready to integrate! Start with the checklist above and integrate step by step into your existing screens.** 🚀
