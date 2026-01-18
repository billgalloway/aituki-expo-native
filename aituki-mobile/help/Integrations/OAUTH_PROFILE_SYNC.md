# OAuth Profile Sync (Apple & Google)

This document explains how user data from OAuth providers (Apple Sign-In, Google Sign-In) is automatically synced to the `user_profiles` table.

## Overview

When users sign in with **Apple** or **Google**, their profile information is automatically extracted from the OAuth provider and synced to our `user_profiles` table. This happens automatically on successful OAuth login.

## How It Works

### 1. Automatic Sync on OAuth Login

When a user signs in via OAuth:
1. Supabase creates/updates the user in `auth.users`
2. OAuth provider metadata is stored in `user.user_metadata`
3. **`syncOAuthUserToProfile()`** is automatically called
4. Profile data is extracted and saved to `user_profiles` table

### 2. Integration Points

The sync happens in two places:
- **Initial session load**: When app starts with existing OAuth session
- **Auth state change**: When user signs in via OAuth (new or existing session)

Both are handled in `contexts/AuthContext.tsx` via the `onAuthStateChange` listener.

## Data Mapping

### Apple Sign-In

**Provider Data Structure:**
```json
{
  "user": {
    "email": "user@example.com" | null,  // May be hidden
    "user_metadata": {
      "full_name": "John Doe"  // Full name (if shared)
    }
  }
}
```

**Mapping to Profile:**
- `email` → `user_profiles.email` (required, uses proxy email if hidden)
- `full_name` → Split into `first_name` and `last_name`

**Notes:**
- ⚠️ **Email may be hidden**: Apple allows users to hide their email. If hidden, Supabase provides a proxy email like `apple_<user_id>@users.auth.supabase.co`
- ✅ **Name is optional**: Apple may or may not share the user's name

### Google Sign-In

**Provider Data Structure:**
```json
{
  "user": {
    "email": "user@gmail.com",
    "user_metadata": {
      "full_name": "John Doe",
      "given_name": "John",
      "family_name": "Doe",
      "name": "John Doe",
      "picture": "https://..."
    }
  }
}
```

**Mapping to Profile:**
- `email` → `user_profiles.email` (always provided)
- `given_name` → `user_profiles.first_name`
- `family_name` → `user_profiles.last_name`

**Notes:**
- ✅ **Email always provided**: Google always shares the user's email
- ✅ **Name fields available**: Google provides both full name and separated first/last name

## Sync Behavior

### First-Time OAuth User (No Profile)

When a user signs in with OAuth for the first time:
1. ✅ **Profile is created** with available data from OAuth provider
2. ✅ **Email is set** (required field - uses proxy if hidden)
3. ✅ **Name is set** (if provided by OAuth provider)
4. ❌ **Other fields** remain `null` (can be filled later in Personal Details)

### Existing OAuth User (Profile Exists)

When an existing OAuth user signs in again:
1. ✅ **Email is updated** if it changed in auth.users
2. ✅ **Name is updated** only if current profile has `null` names and OAuth provides names
3. ✅ **Existing data is preserved** - doesn't overwrite user-edited fields

**Logic:**
- Only fills **empty fields** (`null` values)
- Doesn't overwrite user-edited data
- Updates email if it changed in auth

### Email Password User (Non-OAuth)

Users who sign in with email/password:
- ❌ **No automatic sync** (they fill profile manually)
- ✅ **Sync only happens for OAuth providers** (`isOAuthUser()` check)

## Code Architecture

### Service: `services/oauthProfileSync.ts`

**Key Functions:**
- `syncOAuthUserToProfile(user)` - Main sync function
- `extractOAuthUserData(user)` - Extracts data from OAuth metadata
- `isOAuthUser(user)` - Checks if user signed in via OAuth
- `getOAuthProvider(user)` - Returns provider name ('apple', 'google', etc.)

**Data Extraction Logic:**
```typescript
// Handles different OAuth provider formats
function extractOAuthUserData(user: User): {
  email: string;
  firstName: string | null;
  lastName: string | null;
} {
  // Apple: full_name → split into first/last
  // Google: given_name + family_name → first/last
  // Fallback: name → split into first/last
}
```

### Integration: `contexts/AuthContext.tsx`

**Auto-sync on Auth State Change:**
```typescript
supabase.auth.onAuthStateChange(async (_event, session) => {
  if (session?.user && isOAuthUser(session.user)) {
    // Sync in background (non-blocking)
    syncOAuthUserToProfile(session.user).catch(error => {
      console.error('Sync failed (non-blocking):', error);
    });
  }
});
```

## User Experience

### For Users

1. **Sign in with Apple/Google** → Profile is automatically populated
2. **View Personal Details** → See pre-filled name and email from OAuth
3. **Update fields** → Can edit any field, including OAuth-synced data
4. **Next login** → Sync only updates empty fields, preserves user edits

### Edge Cases Handled

✅ **Apple hides email**: Uses Supabase proxy email  
✅ **Apple doesn't share name**: Profile created without name, can be filled later  
✅ **User edits OAuth-synced data**: User changes are preserved  
✅ **Email changes in auth**: Profile email is updated  
✅ **Multiple OAuth logins**: Only fills empty fields, doesn't overwrite

## Database Schema

The `user_profiles` table structure is compatible with OAuth data:

```sql
CREATE TABLE user_profiles (
  user_id UUID PRIMARY KEY,  -- Links to auth.users (same for all providers)
  email TEXT NOT NULL,       -- From OAuth (or proxy email if hidden)
  first_name TEXT,           -- From OAuth (if provided)
  last_name TEXT,            -- From OAuth (if provided)
  -- ... other fields remain null until user fills them
);
```

**Key Points:**
- ✅ `user_id` is the same UUID regardless of login method (email/OAuth)
- ✅ `email` is required but can be a proxy email from Apple
- ✅ Name fields are optional - can be `null` initially

## Testing

### Test Apple Sign-In

1. Sign in with Apple
2. Check `user_profiles` table - profile should be created
3. Verify email (might be proxy email if hidden)
4. Verify name (if shared by Apple)

### Test Google Sign-In

1. Sign in with Google
2. Check `user_profiles` table - profile should be created
3. Verify email (should always be real email)
4. Verify first_name and last_name (should be populated)

### Test Data Preservation

1. Sign in with OAuth (profile auto-created)
2. Edit name in Personal Details
3. Sign out and sign in again with same OAuth
4. Verify edited name is **not overwritten** (only null fields filled)

## Troubleshooting

### Profile Not Created on OAuth Login

**Check:**
- ✅ Is `syncOAuthUserToProfile()` being called? (check console logs)
- ✅ Does user have email? (required field)
- ✅ Check RLS policies allow INSERT for authenticated users

### Email is Proxy Email (Apple)

**Expected behavior:**
- Apple can hide email → Supabase provides proxy email
- Profile is still created with proxy email
- User can add real email later in Personal Details

### Name Not Synced

**Possible reasons:**
- ✅ OAuth provider didn't share name (Apple allows this)
- ✅ Profile already had name (sync only fills empty fields)
- ✅ Check `user.user_metadata` for name data

### Sync Runs on Email/Password Login

**Should NOT happen:**
- Sync only runs for OAuth users (`isOAuthUser()` check)
- Email/password users should fill profile manually

## Future Enhancements

Potential improvements:
- 🔄 **Avatar/Photo sync**: Store OAuth provider avatar URL
- 🔄 **Profile picture**: Sync `picture` field from Google/Apple
- 🔄 **Additional metadata**: Store provider name, login method
- 🔄 **Email update flow**: Handle email changes from OAuth providers

## Related Files

- **Service**: `services/oauthProfileSync.ts`
- **Integration**: `contexts/AuthContext.tsx`
- **Profile Service**: `services/userProfile.ts`
- **Profile Hook**: `hooks/useUserProfile.ts`
- **SQL Schema**: `scripts/setup-user-profiles-table.sql`

