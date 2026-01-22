# Supabase User Profile Integration

This document explains how user profile data (personal details) is integrated with Supabase in the AiTuki mobile app.

## Overview

The user profile system allows users to view and update their personal information (name, email, mobile number, and address) which is stored in a `user_profiles` table in Supabase and automatically linked to the authenticated user.

## Database Schema

### Table: `user_profiles`

The `user_profiles` table stores personal details linked to `auth.users` via a foreign key:

| Field | Type | Description |
|-------|------|-------------|
| `user_id` | UUID (PK, FK) | References `auth.users(id)` |
| `first_name` | TEXT | User's first name |
| `last_name` | TEXT | User's last name |
| `email` | TEXT (UNIQUE) | User's email address |
| `mobile_number` | TEXT | User's mobile phone number |
| `address_first_line` | TEXT | First line of address |
| `address_second_line` | TEXT | Second line of address (optional) |
| `address_city` | TEXT | City |
| `address_county` | TEXT | County/State |
| `address_country` | TEXT | Country (default: "United Kingdom") |
| `address_postcode` | TEXT | Postal/ZIP code |
| `created_at` | TIMESTAMPTZ | Auto-set on creation |
| `updated_at` | TIMESTAMPTZ | Auto-updated on row changes |

### Setup Script

Run the SQL script to create the table:

```bash
# Location: scripts/setup-user-profiles-table.sql
# Run this in Supabase SQL Editor
```

The script includes:
- ✅ Table creation with all fields
- ✅ Primary key and foreign key constraints
- ✅ Unique constraint on email
- ✅ Row Level Security (RLS) policies
- ✅ Automatic `updated_at` trigger
- ✅ Indexes for performance

## Architecture

### Data Flow

```
Supabase user_profiles table
    ↓
useUserProfile() hook (auto-fetches on mount)
    ↓
profile state (UserProfile | null)
    ↓
personalDetails array (computed with useMemo)
    ↓
UI Display
```

### Service Layer (`services/userProfile.ts`)

Service functions for user profile operations:

- **`fetchUserProfile(userId?)`** - Fetch user profile from Supabase
- **`createUserProfile(profile)`** - Create new user profile
- **`updateUserProfile(updates, userId?)`** - Update any profile fields
- **`updateUserName(firstName, lastName, userId?)`** - Update first/last name
- **`updateUserEmail(email, userId?)`** - Update email
- **`updateUserMobile(mobileNumber, userId?)`** - Update mobile number
- **`updateUserAddress(address, userId?)`** - Update all address fields

**Features:**
- ✅ Automatic user ID detection (uses current session if not provided)
- ✅ Auto-create profile if it doesn't exist when updating
- ✅ Error handling with try/catch and null checks
- ✅ TypeScript types for type safety

### React Hook (`hooks/useUserProfile.ts`)

Hook for managing profile state in React components:

```typescript
const {
  profile,        // Current profile data (null if not loaded)
  loading,        // Loading state
  error,          // Error state
  refresh,        // Manually refresh profile
  updateProfile,  // Update any fields
  updateName,     // Update name fields
  updateEmail,    // Update email
  updateMobile,   // Update mobile number
  updateAddress,  // Update address fields
} = useUserProfile();
```

**Features:**
- ✅ Automatic profile fetching on mount (can be disabled)
- ✅ Loading and error states
- ✅ Type-safe operations
- ✅ Follows existing patterns (similar to `useChartData`)

## Integration in UI

### Personal Details Screen (`app/personal-details.tsx`)

The Personal Details screen automatically displays data from Supabase:

**Implementation:**
```typescript
import { useUserProfile } from '@/hooks/useUserProfile';

const { profile, loading } = useUserProfile();

// Display name from profile or fallback to email username
const displayName = profile?.first_name || user?.email?.split('@')[0] || 'User';

// Full name (first + last)
const fullName = profile?.first_name && profile?.last_name
  ? `${profile.first_name} ${profile.last_name}`
  : profile?.first_name || user?.email?.split('@')[0] || '';

// Email (from profile or auth user)
const email = profile?.email || user?.email || 'Not set';
```

**Field Mapping:**

| Screen Field | Database Field | Fallback |
|-------------|---------------|----------|
| Name | `first_name + last_name` | Email username |
| Email | `profile.email` | `auth.users.email` |
| Mobile | `mobile_number` | "Not set" |
| Address | `address_first_line, city, postcode` | "Not set" |

**Fallback Behavior:**
- If profile doesn't exist: Shows email from `auth.users`, "Not set" for other fields
- Missing fields show "Not set" (displayed in gray/italic)
- Greeting shows first name or email username

## How It Works

1. **On Mount**: `useUserProfile` hook automatically fetches the profile for the currently logged-in user
2. **If Profile Exists**: All fields display data from `user_profiles` table
3. **If Profile Doesn't Exist**: Falls back to `auth.users` email, shows "Not set" for missing fields
4. **On Update**: Update screens save data to Supabase, profile automatically refreshes

## Current User

The app identifies the current user through:
- **AuthContext** (`contexts/AuthContext.tsx`) - Provides `user` object from Supabase auth
- **useAuth()** hook - Returns `{ user, session, loading }`
- **User ID**: Retrieved from `auth.users.id` or `user.id`

Example:
```typescript
const { user } = useAuth();
// user.id - UUID of authenticated user
// user.email - Email from auth.users (e.g., "bill@billgalloway.com")
```

## Row Level Security (RLS)

The `user_profiles` table has RLS enabled with the following policies:

- **Users can view their own profile** - `SELECT` only where `user_id = auth.uid()`
- **Users can insert their own profile** - `INSERT` only where `user_id = auth.uid()`
- **Users can update their own profile** - `UPDATE` only where `user_id = auth.uid()`
- **Users can delete their own profile** - `DELETE` only where `user_id = auth.uid()`

This ensures users can only access and modify their own profile data.

## Usage Example

### Fetching and Displaying Profile

```typescript
import { useUserProfile } from '@/hooks/useUserProfile';
import { useAuth } from '@/contexts/AuthContext';

export default function MyScreen() {
  const { user } = useAuth();
  const { profile, loading } = useUserProfile();

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <View>
      <Text>Name: {profile?.first_name} {profile?.last_name}</Text>
      <Text>Email: {profile?.email || user?.email}</Text>
    </View>
  );
}
```

### Updating Profile

```typescript
import { useUserProfile } from '@/hooks/useUserProfile';

export default function UpdateNameScreen() {
  const { updateName } = useUserProfile();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleSubmit = async () => {
    const success = await updateName(firstName, lastName);
    if (success) {
      Alert.alert('Success', 'Name updated');
      router.back();
    } else {
      Alert.alert('Error', 'Failed to update name');
    }
  };

  // ... rest of component
}
```

## Next Steps

1. ✅ Run SQL script in Supabase (create `user_profiles` table)
2. ✅ Personal Details screen connected (reads from Supabase)
3. 🔄 Update screens (update-name, update-email, update-mobile, update-address) - Save to Supabase
4. 🔄 Account Settings screen - Load profile data
5. 🔄 Profile avatar - Store/retrieve profile image

## Related Files

- **SQL Script**: `scripts/setup-user-profiles-table.sql`
- **Service**: `services/userProfile.ts`
- **Hook**: `hooks/useUserProfile.ts`
- **Screen**: `app/personal-details.tsx`
- **Update Screens**: 
  - `app/update-name.tsx`
  - `app/update-email.tsx`
  - `app/update-mobile.tsx`
  - `app/update-address.tsx`

## Troubleshooting

### Profile Not Loading

- ✅ Check user is authenticated (`useAuth()` returns valid `user`)
- ✅ Verify RLS policies are enabled in Supabase
- ✅ Check network tab for API errors
- ✅ Verify `user_profiles` table exists and has correct schema

### Data Not Saving

- ✅ Check RLS policies allow INSERT/UPDATE for authenticated user
- ✅ Verify user ID matches in `auth.users` and `user_profiles.user_id`
- ✅ Check console for Supabase errors
- ✅ Ensure email field is provided (required field)

### "Not set" Showing

- Profile doesn't exist yet - Update any field to create profile
- Field is null in database - Update through app or Supabase dashboard
- Fallback behavior - This is expected if profile data is missing

