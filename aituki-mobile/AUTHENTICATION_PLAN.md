# Authentication Implementation Plan

## Overview

Add login and registration screens before users can access the main app content.

## Recommended Approach

### Option 1: Expo AuthSession (OAuth) - Recommended
- **Pros:** Secure, supports Google/Apple/Facebook sign-in, no backend needed initially
- **Best for:** Quick implementation, social login

### Option 2: Custom Auth with Backend
- **Pros:** Full control, custom user management
- **Best for:** Custom requirements, existing backend

### Option 3: Supabase/Firebase Auth
- **Pros:** Complete auth solution, user management, easy setup
- **Best for:** Production apps needing user database

## Implementation Steps

### Step 1: Create Auth Screens

Based on your Figma design, create:
- `app/(auth)/login.tsx` - Login screen
- `app/(auth)/register.tsx` - Registration screen
- `app/(auth)/_layout.tsx` - Auth layout wrapper

### Step 2: Add Auth Context

Create `contexts/AuthContext.tsx` to manage:
- User authentication state
- Login/logout functions
- User session persistence

### Step 3: Update Root Layout

Modify `app/_layout.tsx` to:
- Check if user is authenticated
- Show auth screens if not logged in
- Show main app if authenticated

### Step 4: Add Secure Storage

Use `expo-secure-store` to persist auth tokens securely.

## File Structure

```
app/
  (auth)/
    _layout.tsx
    login.tsx
    register.tsx
  (tabs)/
    ...existing tabs
  _layout.tsx
contexts/
  AuthContext.tsx
services/
  auth.ts
```

## Next Steps

1. **Share Figma URL** - I'll extract the design and create matching screens
2. **Choose auth method** - OAuth, custom, or Supabase/Firebase
3. **Implement screens** - Based on your Figma design
4. **Add routing logic** - Protect routes, show auth first

Please share the Figma URL or node ID for the login/registration screens!

