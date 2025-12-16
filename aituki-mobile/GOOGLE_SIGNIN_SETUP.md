# Google Sign-In Setup Guide

## Quick Setup Checklist

- [ ] Create Google Cloud Project
- [ ] Configure OAuth Consent Screen
- [ ] Create OAuth 2.0 Credentials (Client ID & Secret)
- [ ] Enable Google in Supabase Dashboard
- [ ] Add credentials to Supabase
- [ ] Test Google Sign-In

---

## Step-by-Step Instructions

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Click **"Select a project"** dropdown → **"New Project"**
4. Enter:
   - **Project name**: `AiTuki` (or your preferred name)
5. Click **"Create"**
6. Wait for project creation (takes a few seconds)
7. Select your new project from the project dropdown

---

### Step 2: Configure OAuth Consent Screen

1. In Google Cloud Console, go to **APIs & Services** → **OAuth consent screen**
2. Select **External** (unless you have a Google Workspace account)
3. Click **"Create"**

4. **App Information**:
   - **App name**: `AiTuki`
   - **User support email**: Your email address
   - **App logo**: (optional)
   - **Application home page**: (optional, can use your website)
   - **Application privacy policy link**: (optional)
   - **Application terms of service link**: (optional)
   - **Authorized domains**: (optional for now)
   - **Developer contact information**: Your email address

5. Click **"Save and Continue"**

6. **Scopes**:
   - Default scopes are fine for basic sign-in
   - Click **"Save and Continue"**

7. **Test users** (if in testing mode):
   - Add your email address as a test user
   - Click **"Save and Continue"**

8. **Summary**:
   - Review your settings
   - Click **"Back to Dashboard"**

**Note**: If your app is in "Testing" mode, only test users can sign in. To make it public, you'll need to submit for verification (not required for basic sign-in).

---

### Step 3: Create OAuth 2.0 Credentials

1. In Google Cloud Console, go to **APIs & Services** → **Credentials**

2. Click **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**

3. If prompted to configure OAuth consent screen:
   - Click **"Configure Consent Screen"** and complete Step 2 above
   - Or click **"Back"** if you've already configured it

4. **Application type**: Select **"Web application"**

5. **Name**: `AiTuki Mobile App` (or any name you prefer)

6. **Authorized redirect URIs**: 
   - Click **"+ ADD URI"**
   - Enter: `https://hhdntbgtedclqqufpzfj.supabase.co/auth/v1/callback`
   - This is your Supabase project callback URL
   - **Important**: Must match exactly, including `https://`

7. Click **"CREATE"**

8. **IMPORTANT - Copy Your Credentials**:
   - A popup will show your credentials
   - **Client ID**: Copy this (looks like: `123456789-abcdefghijklmnop.apps.googleusercontent.com`)
   - **Client Secret**: Copy this (looks like: `GOCSPX-abcdefghijklmnopqrstuvwxyz`)
   
   ⚠️ **You can only see the Client Secret once!** Save it immediately.
   
   - Click **"OK"**

---

### Step 4: Enable Google in Supabase

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Authentication** → **Providers**
4. Find **Google** in the list
5. Click on **Google** to expand the settings
6. Toggle **"Enable Sign in with Google"** to **ON**

7. Enter your credentials:
   - **Client ID (for OAuth)**: Paste your Google Client ID
   - **Client Secret (for OAuth)**: Paste your Google Client Secret

8. Click **"Save"**

---

### Step 5: Verify Redirect URLs

1. In Supabase Dashboard, go to **Authentication** → **URL Configuration**
2. Check that **Redirect URLs** includes:
   - `aitukinative://auth/callback`
3. If not present, add it and click **"Save"**

---

## Testing Google Sign-In

1. **Open your app**
2. **Go to Login screen**
3. **Click "Continue with Google"**
4. **Select your Google account**
5. **Grant permissions**
6. **You should be logged in!**

---

## Troubleshooting

### Error: "Invalid client"
**Solution**: 
- Verify Client ID and Client Secret are correct in Supabase
- Check for typos or extra spaces
- Make sure you copied the entire Client Secret

### Error: "Redirect URI mismatch"
**Solution**:
- In Google Cloud Console, verify the redirect URI is exactly:
  - `https://hhdntbgtedclqqufpzfj.supabase.co/auth/v1/callback`
- Check for typos, missing `https://`, or trailing slashes
- Make sure it's added in Google Cloud Console → Credentials → OAuth 2.0 Client ID

### Error: "Access blocked: This app's request is invalid"
**Solution**:
- Your OAuth consent screen might be in "Testing" mode
- Add your email as a test user in OAuth consent screen
- Or publish your app (submit for verification if needed)

### OAuth flow opens but doesn't complete
**Solution**:
- Check console logs for errors
- Verify redirect URLs are configured correctly
- Make sure your app scheme is `aitukinative` in `app.json`

### "OAuth cancelled or failed"
**Solution**:
- User may have cancelled the flow
- Check if browser/auth sheet opened
- Verify deep link is working: `aitukinative://auth/callback`

---

## Important Notes

1. **Client Secret Security**: 
   - Never commit your Client Secret to Git
   - Keep it secure
   - If compromised, revoke and create new credentials

2. **Redirect URI**:
   - Must match exactly in both Google Cloud Console and Supabase
   - Format: `https://<project-id>.supabase.co/auth/v1/callback`

3. **OAuth Consent Screen**:
   - In "Testing" mode, only test users can sign in
   - For production, you may need to submit for verification
   - Basic email/profile scopes usually don't require verification

4. **Multiple Platforms**:
   - For iOS and Android, you can use the same OAuth credentials
   - The redirect URI handles both platforms

---

## Quick Reference

**Your Supabase Project URL**: `https://hhdntbgtedclqqufpzfj.supabase.co`

**Required Redirect URI in Google Cloud Console**:
```
https://hhdntbgtedclqqufpzfj.supabase.co/auth/v1/callback
```

**Required Redirect URI in Supabase**:
```
aitukinative://auth/callback
```

---

## Need Help?

If you're still having issues:
1. Check Supabase logs: Dashboard → Logs → Auth Logs
2. Check Google Cloud Console → APIs & Services → Credentials
3. Verify all URLs match exactly (no typos, correct protocol)
4. Test with a different Google account
5. Check console logs in your app for detailed error messages

