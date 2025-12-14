# Apple Sign-In Diagnostic Checklist

## Quick Check - What Error Are You Seeing?

1. **"Apple Sign-In Failed" alert?**
   - Check console logs for detailed error
   - See troubleshooting steps below

2. **Nothing happens when clicking "Continue with Apple"?**
   - Check if browser/auth sheet opens
   - Check console for errors

3. **Opens but doesn't redirect back?**
   - Check deep link configuration
   - Verify redirect URLs

4. **"Invalid redirect_uri" error?**
   - Check Supabase and Apple Developer Console URLs

---

## Step-by-Step Verification

### ✅ Step 1: Supabase Configuration

Go to: **Supabase Dashboard → Authentication → Providers → Apple**

Check:
- [ ] **Enabled**: Apple provider is toggled ON
- [ ] **Client ID**: `com.aituki.mobile.service`
- [ ] **Secret Key**: `.p8` file is uploaded
- [ ] **Team ID**: Your Apple Developer Team ID (if required)
- [ ] **Key ID**: The Key ID from your `.p8` file (if required)

**If any are missing or incorrect:**
1. Disable Apple provider
2. Re-enable it
3. Re-enter all credentials
4. Save

---

### ✅ Step 2: Redirect URLs in Supabase

Go to: **Supabase Dashboard → Authentication → URL Configuration**

Check:
- [ ] **Redirect URLs** includes: `aitukinative://auth/callback`
- [ ] **Site URL** is set (can be your Supabase URL or `aitukinative://`)

**If missing:**
- Add `aitukinative://auth/callback` to Redirect URLs
- Save

---

### ✅ Step 3: Apple Developer Console

Go to: **Apple Developer Console → Certificates, Identifiers & Profiles → Identifiers → Services IDs**

Select: `com.aituki.mobile.service`

Check:
- [ ] **Sign In with Apple** is enabled
- [ ] **Primary App ID**: `com.aituki.mobile`
- [ ] **Return URLs**: `https://hhdntbgtedclqqufpzfj.supabase.co/auth/v1/callback`
- [ ] **Domains**: `hhdntbgtedclqqufpzfj.supabase.co`

**If incorrect:**
1. Click "Configure" next to Sign In with Apple
2. Update Return URL and Domain
3. Save

---

### ✅ Step 4: App Configuration

Check `app.json`:
- [ ] **scheme**: `"aitukinative"`
- [ ] **bundleIdentifier**: `"com.aituki.mobile"`

**If changed:**
- Rebuild the app: `eas build --platform ios --profile production`

---

### ✅ Step 5: Test with Logging

1. Open your app
2. Open developer console/logs
3. Click "Continue with Apple"
4. Watch for console messages:
   - `🍎 Starting Apple Sign-In...`
   - `🌐 Opening OAuth URL...`
   - `📱 OAuth result...`
   - `✅ Received OAuth code...`
   - `✅ Apple Sign-In successful!`

**If you see errors:**
- Note the exact error message
- Check which step failed
- See troubleshooting guide

---

## Common Error Messages & Fixes

### Error: "Invalid client_id"
**Fix**: Verify Service ID in Supabase matches Apple Developer Console

### Error: "Invalid redirect_uri"
**Fix**: 
- Check Supabase Redirect URLs: `aitukinative://auth/callback`
- Check Apple Return URL: `https://hhdntbgtedclqqufpzfj.supabase.co/auth/v1/callback`

### Error: "OAuth cancelled or failed"
**Fix**: 
- User may have cancelled
- Check if browser/auth sheet opened
- Verify deep link is working

### Error: "Failed to initiate Apple Sign-In"
**Fix**: 
- Check Supabase Apple provider is enabled
- Verify credentials are correct
- Check Supabase status page

### Error: "No code in callback URL"
**Fix**: 
- Verify redirect URL configuration
- Check if callback handler is receiving the URL
- Rebuild app after configuration changes

---

## Testing Steps

1. **Clear app data** (to start fresh)
2. **Open app** and go to login screen
3. **Open console/logs** to see debug messages
4. **Click "Continue with Apple"**
5. **Watch console** for error messages
6. **Complete Apple authentication** if prompted
7. **Check if app redirects back** and logs in

---

## Still Not Working?

1. **Check Supabase Logs**:
   - Go to Supabase Dashboard → Logs → Auth Logs
   - Look for errors related to Apple OAuth

2. **Verify Service Account**:
   - Make sure `.p8` key is valid and not expired
   - Check Key ID matches

3. **Test Deep Link Manually**:
   - Try opening: `aitukinative://auth/callback?code=test`
   - See if app opens (this tests deep link configuration)

4. **Rebuild App**:
   - After any configuration changes, rebuild:
   ```bash
   eas build --platform ios --profile production
   ```

5. **Check Apple Developer Status**:
   - Verify your Apple Developer account is active
   - Check if Sign In with Apple is enabled for your account

---

## Need More Help?

Share the following information:
1. Exact error message from alert
2. Console log output
3. Which step in the checklist failed
4. Screenshot of Supabase Apple provider settings (hide sensitive data)


