# OAuth Profile Sync - Automated Test Script

This test script validates the OAuth profile sync implementation for Apple and Google Sign-In.

## Usage

```bash
cd "/Users/billgalloway/Local Sites/Figma/expo-dev/my-expo-app/aituki-mobile"
node scripts/test-oauth-profile-sync.js
```

## What It Tests

### 1. OAuth Data Extraction Logic (10 tests)

Tests how user data is extracted from OAuth provider metadata:

- ✅ **Apple Sign-In**: Extracts `full_name` into `first_name`/`last_name`
- ✅ **Single name**: Handles names with only one word
- ✅ **Multiple-word last name**: Preserves compound surnames (e.g., "de la Cruz")
- ✅ **Google Sign-In**: Extracts `given_name`/`family_name`
- ✅ **Fallback formats**: Tests fallback to `full_name` or `name` field
- ✅ **Hidden email**: Handles Apple's hidden email (uses proxy email)
- ✅ **Missing data**: Handles missing name or email gracefully
- ✅ **Priority order**: Google fields take priority over Apple format

### 2. OAuth User Detection (5 tests)

Tests `isOAuthUser()` function:

- ✅ **Apple user**: Returns `true`
- ✅ **Google user**: Returns `true`
- ✅ **Email/password user**: Returns `false`
- ✅ **Null user**: Returns `false`
- ✅ **Missing provider**: Defaults to email (returns `false`)

### 3. Profile Sync Scenarios (6 tests)

Tests real-world sync scenarios:

- ✅ **First-time OAuth user**: Profile should be created with OAuth data
- ✅ **Existing user with null fields**: Only updates null fields, preserves existing data
- ✅ **Existing user with filled fields**: Preserves all user-edited data
- ✅ **Hidden email (Apple)**: Uses Supabase proxy email when Apple hides email
- ✅ **Email-only OAuth**: Creates profile with email only (no name)
- ✅ **Email change**: Updates profile email if it changed in auth

### 4. Edge Cases (6 tests)

Tests edge cases and error handling:

- ✅ **Missing user ID**: Fails gracefully
- ✅ **Empty string names**: Handles empty `full_name` strings
- ✅ **Whitespace-only names**: Handles whitespace-only strings
- ✅ **Very long names**: Handles names with many words
- ✅ **Special characters**: Preserves apostrophes, hyphens (e.g., "O'Brian-Smith")
- ✅ **Unicode characters**: Handles international characters (e.g., "José María")

## Test Coverage

**Total Tests**: 27  
**Edge Cases Covered**: 6  
**OAuth Providers Tested**: Apple, Google  
**Data Scenarios**: First-time, Existing, Partial data, Hidden email  

## Test Categories

1. **Unit Tests**: Test individual functions (`extractOAuthUserData`, `isOAuthUser`)
2. **Integration Tests**: Test profile sync scenarios (logic flow)
3. **Edge Case Tests**: Test error handling and unusual inputs

## What's NOT Tested (Requires Integration)

These require actual Supabase connection:

- ❌ Actual Supabase database calls (createUserProfile, updateUserProfile)
- ❌ Network errors and retries
- ❌ Database RLS policy enforcement
- ❌ Concurrent sync requests
- ❌ Session expiration handling

## Running Tests

```bash
# Run all tests
node scripts/test-oauth-profile-sync.js

# Make executable (optional)
chmod +x scripts/test-oauth-profile-sync.js
./scripts/test-oauth-profile-sync.js
```

## Expected Output

```
🧪 OAuth Profile Sync - Automated Test Suite
============================================================

📋 Testing extractOAuthUserData Logic
✓ Apple Sign-In: Extract full_name into first/last name
✓ Apple Sign-In: Handle single name in full_name
...

📊 Test Summary
============================================================
Total Tests: 27
Passed: 27
Failed: 0

✅ All tests passed!
```

## Adding New Tests

To add a new test:

1. Open `scripts/test-oauth-profile-sync.js`
2. Find the appropriate test category function
3. Add a new `test()` call:

```javascript
test('Your test name', () => {
  // Setup
  const user = createMockUser({ ... });
  
  // Execute
  const result = extractOAuthUserData(user);
  
  // Assert
  assertEqual(result.email, 'expected@example.com', 'Error message');
});
```

## Troubleshooting

### Tests Fail

Check:
- ✅ Syntax errors in test file
- ✅ Mock user data structure matches expected format
- ✅ Assertions match actual function behavior

### Need More Coverage

Consider adding tests for:
- Additional OAuth providers (GitHub, Facebook, Azure)
- More edge cases (malformed data, null values)
- Performance tests (large datasets)

## Related Files

- **Service**: `services/oauthProfileSync.ts`
- **Integration**: `contexts/AuthContext.tsx`
- **Documentation**: `help/Integrations/OAUTH_PROFILE_SYNC.md`

