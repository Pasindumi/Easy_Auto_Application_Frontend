# Backend Implementation Checklist

This document outlines the required backend endpoints and their specifications for the authentication system.

## 📝 Required Endpoints

### 1. Send OTP
**Endpoint:** `POST /api/auth/send-otp`

**Request Body:**
```json
{
  "phone": "+1234567890"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "OTP sent successfully"
}
```

**Error Response (400/500):**
```json
{
  "success": false,
  "error": "Invalid phone number" // or other error message
}
```

**Implementation Notes:**
- Validate phone number format
- Generate 6-digit OTP
- Store OTP with expiry (5-10 minutes)
- Send OTP via SMS service
- Rate limit: Max 3 requests per phone per hour
- Consider implementing cooldown period (60 seconds)

---

### 2. Verify OTP
**Endpoint:** `POST /api/auth/verify-otp`

**Request Body:**
```json
{
  "phone": "+1234567890",
  "otp": "123456"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user123",
    "name": "John Doe",
    "phone": "+1234567890",
    "email": "john@example.com", // optional
    "avatar": "https://example.com/avatar.jpg" // optional
  }
}
```

**Error Response (400/401):**
```json
{
  "success": false,
  "error": "Invalid or expired OTP"
}
```

**Implementation Notes:**
- Verify OTP matches and hasn't expired
- Create or retrieve user account
- Generate JWT access token (short-lived: 15-60 minutes)
- Generate JWT refresh token (long-lived: 7-30 days)
- Store refresh token in database
- Clear used OTP
- Limit attempts: Max 5 wrong attempts before lockout

---

### 3. Clerk OAuth Exchange
**Endpoint:** `POST /api/auth/clerk`

**Request Headers:**
```
Authorization: Bearer <clerk_session_token>
Content-Type: application/json
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Authentication successful",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user123",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890", // optional
    "avatar": "https://example.com/avatar.jpg" // optional
  }
}
```

**Error Response (401/500):**
```json
{
  "success": false,
  "error": "Invalid Clerk token"
}
```

**Implementation Notes:**
- Verify Clerk token with Clerk API
- Extract user info from Clerk token
- Create or retrieve user account
- Generate JWT access token (short-lived: 15-60 minutes)
- Generate JWT refresh token (long-lived: 7-30 days)
- Store refresh token in database
- Map Clerk user ID to internal user ID

**Clerk Token Verification:**
```javascript
// Example using Clerk Node SDK
const clerk = require('@clerk/clerk-sdk-node');

const token = req.headers.authorization.replace('Bearer ', '');
const session = await clerk.sessions.verifySession(token);
const user = await clerk.users.getUser(session.userId);
```

---

### 4. Refresh Token
**Endpoint:** `POST /api/auth/refresh`

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Success Response (200):**
```json
{
  "success": true,
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." // optional: new refresh token (token rotation)
}
```

**Error Response (401):**
```json
{
  "success": false,
  "error": "Invalid or expired refresh token"
}
```

**Implementation Notes:**
- Verify refresh token is valid and not revoked
- Check refresh token hasn't expired
- Generate new access token
- Optionally rotate refresh token (recommended for security)
- Update refresh token in database if rotated
- Return both tokens

---

## 🔐 JWT Token Specifications

### Access Token
```javascript
{
  "userId": "user123",
  "email": "john@example.com",
  "phone": "+1234567890",
  "exp": 1234567890, // Expiry: 15-60 minutes from now
  "iat": 1234567890  // Issued at
}
```

### Refresh Token
```javascript
{
  "userId": "user123",
  "tokenId": "refresh_abc123", // Unique token ID for revocation
  "exp": 1234567890, // Expiry: 7-30 days from now
  "iat": 1234567890  // Issued at
}
```

---

## 🛡️ Security Best Practices

### 1. Token Storage
- Store refresh tokens in database with user association
- Include token ID for easy revocation
- Hash tokens before storing (optional but recommended)

### 2. Token Validation
```javascript
// Validate access token on protected routes
function validateAccessToken(token) {
  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    return { valid: true, userId: decoded.userId };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}
```

### 3. Rate Limiting
```javascript
// Example rate limits
const rateLimits = {
  sendOTP: '3 requests per phone per hour',
  verifyOTP: '5 attempts per OTP',
  refresh: '10 requests per token per minute',
  clerk: '20 requests per IP per minute'
};
```

### 4. Token Rotation
- Implement refresh token rotation
- Revoke old refresh token when issuing new one
- Detect and prevent token reuse attacks

---

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(20) UNIQUE,
  avatar VARCHAR(500),
  clerk_id VARCHAR(255) UNIQUE, -- For OAuth users
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### OTP Table
```sql
CREATE TABLE otps (
  id INT AUTO_INCREMENT PRIMARY KEY,
  phone VARCHAR(20) NOT NULL,
  otp VARCHAR(6) NOT NULL,
  attempts INT DEFAULT 0,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_phone (phone),
  INDEX idx_expires (expires_at)
);
```

### Refresh Tokens Table
```sql
CREATE TABLE refresh_tokens (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  token_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  revoked_at TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_expires (expires_at)
);
```

---

## 🧪 Testing Checklist

### OTP Flow
- [ ] Send OTP to valid phone number
- [ ] Reject invalid phone number format
- [ ] Enforce rate limiting (3 per hour)
- [ ] Verify correct OTP
- [ ] Reject incorrect OTP
- [ ] Reject expired OTP
- [ ] Lock after 5 failed attempts
- [ ] Return valid JWT tokens
- [ ] Create new user if doesn't exist
- [ ] Return existing user if exists

### Clerk OAuth Flow
- [ ] Verify valid Clerk token
- [ ] Reject invalid Clerk token
- [ ] Extract user info from Clerk
- [ ] Create new user from Clerk data
- [ ] Link existing user with Clerk ID
- [ ] Return valid JWT tokens
- [ ] Handle email already exists
- [ ] Handle Clerk API errors

### Token Refresh
- [ ] Accept valid refresh token
- [ ] Reject invalid refresh token
- [ ] Reject expired refresh token
- [ ] Reject revoked refresh token
- [ ] Return new access token
- [ ] Optionally rotate refresh token
- [ ] Update database with new token

### Protected Endpoints
- [ ] Accept valid access token
- [ ] Reject missing token
- [ ] Reject invalid token
- [ ] Reject expired token
- [ ] Return 401 for auth failures
- [ ] Include proper error messages

---

## 🔧 Environment Variables

```env
# JWT Secrets
JWT_ACCESS_SECRET=your_access_token_secret_min_32_chars
JWT_REFRESH_SECRET=your_refresh_token_secret_min_32_chars

# Token Expiry
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Clerk Configuration
CLERK_SECRET_KEY=sk_test_xxxxx

# SMS Service (choose one)
TWILIO_ACCOUNT_SID=xxxxx
TWILIO_AUTH_TOKEN=xxxxx
TWILIO_PHONE_NUMBER=+1234567890

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/dbname
```

---

## 📝 Example Implementation (Node.js/Express)

```javascript
const express = require('express');
const jwt = require('jsonwebtoken');
const { Clerk } = require('@clerk/clerk-sdk-node');

const router = express.Router();
const clerk = Clerk({ secretKey: process.env.CLERK_SECRET_KEY });

// POST /api/auth/verify-otp
router.post('/verify-otp', async (req, res) => {
  try {
    const { phone, otp } = req.body;
    
    // Verify OTP
    const isValid = await verifyOTP(phone, otp);
    if (!isValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired OTP'
      });
    }
    
    // Get or create user
    let user = await getUserByPhone(phone);
    if (!user) {
      user = await createUser({ phone });
    }
    
    // Generate tokens
    const accessToken = jwt.sign(
      { userId: user.id, phone: user.phone },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: process.env.JWT_ACCESS_EXPIRY }
    );
    
    const refreshToken = jwt.sign(
      { userId: user.id, tokenId: generateTokenId() },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRY }
    );
    
    // Store refresh token
    await storeRefreshToken(user.id, refreshToken);
    
    res.json({
      success: true,
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// POST /api/auth/clerk
router.post('/clerk', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    // Verify Clerk token
    const session = await clerk.sessions.verifySession(token);
    const clerkUser = await clerk.users.getUser(session.userId);
    
    // Get or create user
    let user = await getUserByClerkId(clerkUser.id);
    if (!user) {
      user = await createUser({
        clerkId: clerkUser.id,
        email: clerkUser.emailAddresses[0]?.emailAddress,
        name: `${clerkUser.firstName} ${clerkUser.lastName}`,
        avatar: clerkUser.imageUrl
      });
    }
    
    // Generate tokens (same as above)
    // ...
    
  } catch (error) {
    console.error('Clerk auth error:', error);
    res.status(401).json({
      success: false,
      error: 'Invalid Clerk token'
    });
  }
});

module.exports = router;
```

---

## 🚀 Deployment Notes

1. **Environment Variables**: Set all required env vars
2. **HTTPS Required**: Use HTTPS in production
3. **CORS Configuration**: Allow frontend domain
4. **Rate Limiting**: Implement at API gateway level
5. **Monitoring**: Log auth attempts and failures
6. **Secrets Rotation**: Rotate JWT secrets periodically
7. **Token Cleanup**: Periodically delete expired tokens

---

## 📞 Support

For questions or issues with the auth integration, contact the frontend team or refer to:
- `AUTH_INTEGRATION_GUIDE.md` - Complete integration guide
- `AUTH_QUICK_REFERENCE.md` - Quick reference for developers
