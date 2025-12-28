# Apple Sign-In Troubleshooting Guide

## Common Issues and Solutions

### Issue 1: "Apple Sign-In Failed" Error

**Possible Causes:**
1. Apple provider not configured in Supabase
2. Missing or incorrect credentials
3. Redirect URL mismatch
4. Service ID not properly configured

**Checklist:**
- [ ] Apple provider is enabled in Supabase Dashboard → Authentication → Providers
- [ ] Client ID (Service ID) is correct: `com.aituki.mobile.service`
- [ ] `.p8` key file is uploaded in Supabase
- [ ] Redirect URL in Supabase: `aitukinative://auth/callback`
- [ ] Service ID is configured in Apple Developer Console with correct redirect URL

### Issue 2: OAuth Flow Opens but Doesn't Complete

**Possible Causes:**
1. Callback URL not handling the response correctly
2. Code exchange failing
3. Session not being set properly

**Debug Steps:**
1. Check console logs when clicking "Continue with Apple"
2. Verify the OAuth URL opens in browser
3. Check if callback is triggered after Apple authentication
4. Verify code parameter is present in callback URL

### Issue 3: "Invalid redirect_uri" Error

**Solution:**
- Verify in Supabase Dashboard → Authentication → URL Configuration:
  - Redirect URL: `aitukinative://auth/callback` is added
- Verify in Apple Developer Console:
  - Service ID has Return URL: `https://hhdntbgtedclqqufpzfj.supabase.co/auth/v1/callback`
  - Domain: `hhdntbgtedclqqufpzfj.supabase.co`

### Issue 4: App Doesn't Open After Apple Authentication

**Possible Causes:**
1. Deep link not configured properly
2. App scheme mismatch

**Solution:**
- Verify `app.json` has: `"scheme": "aitukinative"`
- Test deep link manually: Try opening `aitukinative://auth/callback` in browser
- Rebuild app after changing scheme

## Diagnostic Steps

### Step 1: Verify Supabase Configuration

1. Go to Supabase Dashboard → Authentication → Providers
2. Check Apple provider:
   - ✅ Enabled
   - ✅ Client ID: `com.aituki.mobile.service`
   - ✅ Secret Key uploaded (`.p8` file)

### Step 2: Verify Redirect URLs

1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Check Redirect URLs include:
   - `aitukinative://auth/callback`

### Step 3: Verify Apple Developer Console

1. Go to Apple Developer Console → Identifiers → Services IDs
2. Select `com.aituki.mobile.service`
3. Verify:
   - ✅ Sign In with Apple is enabled
   - ✅ Primary App ID: `com.aituki.mobile`
   - ✅ Return URL: `https://hhdntbgtedclqqufpzfj.supabase.co/auth/v1/callback`
   - ✅ Domain: `hhdntbgtedclqqufpzfj.supabase.co`

### Step 4: Test the Flow

1. Open app and click "Continue with Apple"
2. Watch for:
   - Does browser/Apple sign-in sheet open?
   - Do you see any error messages?
   - Does it redirect back to app?
   - Check console logs for errors

### Step 5: Check Error Messages

Look for specific error messages:
- "Invalid client_id" → Service ID mismatch
- "Invalid redirect_uri" → URL configuration issue
- "OAuth cancelled or failed" → User cancelled or flow error
- "exchangeCodeForSession failed" → Code exchange issue

## Testing Checklist

- [ ] Apple provider enabled in Supabase
- [ ] Service ID created and configured
- [ ] `.p8` key uploaded to Supabase
- [ ] Redirect URLs configured correctly
- [ ] App scheme matches (`aitukinative`)
- [ ] App rebuilt after configuration changes
- [ ] Testing on actual device (not simulator for best results)

## Quick Fixes

### Fix 1: Re-verify Supabase Apple Configuration
1. Disable Apple provider in Supabase
2. Re-enable it
3. Re-enter credentials
4. Save

### Fix 2: Rebuild App
After any configuration changes, rebuild the app:
```bash
eas build --platform ios --profile production
```

### Fix 3: Check Console Logs
Add more logging to see where it fails:
- Check `signInWithApple` function
- Check callback handler
- Check Supabase logs


