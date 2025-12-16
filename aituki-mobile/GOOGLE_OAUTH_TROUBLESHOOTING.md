# Google OAuth "Unable to exchange external code" - Troubleshooting Guide

## Error: "Unable to exchange external code"

This error occurs when:
- ✅ Google successfully authenticates the user
- ✅ Google redirects back to Supabase with an authorization code
- ❌ Supabase cannot exchange that code for tokens with Google

This means there's a configuration mismatch between Google Cloud Console and Supabase.

---

## Step-by-Step Fix

### Step 1: Verify Google Cloud Console OAuth Client

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to **APIs & Services** → **Credentials**
4. Find your OAuth 2.0 Client ID (the one you're using for Supabase)
5. Click on it to edit

**Verify these settings:**

#### ✅ Application Type
- Must be: **"Web application"** (NOT Android, iOS, or Desktop)
- If it's not "Web application", you need to create a new OAuth client

#### ✅ Authorized Redirect URIs
Must contain EXACTLY this (no trailing slash, no typos):
```
https://hhdntbgtedclqqufpzfj.supabase.co/auth/v1/callback
```

**Check:**
- ✅ Starts with `https://` (not `http://`)
- ✅ No trailing slash at the end
- ✅ Matches exactly: `hhdntbgtedclqqufpzfj.supabase.co/auth/v1/callback`
- ✅ No extra spaces or characters

#### ✅ Authorized JavaScript Origins
Should contain:
```
https://hhdntbgtedclqqufpzfj.supabase.co
```

**If anything is wrong:**
1. Edit the OAuth client
2. Fix the redirect URI
3. Click **"Save"**
4. Wait 1-2 minutes for changes to propagate

---

### Step 2: Verify Supabase Configuration

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Authentication** → **Providers**
4. Find **Google** and click to expand

**Verify these settings:**

#### ✅ Enable Sign in with Google
- Must be: **ON** (toggled)

#### ✅ Client ID (for OAuth)
- Must match EXACTLY your Google Cloud Console Client ID
- Format: `123456789-abcdefghijklmnop.apps.googleusercontent.com`
- **Check for:**
  - No extra spaces before/after
  - No typos
  - Complete ID (not truncated)

#### ✅ Client Secret (for OAuth)
- Must match EXACTLY your Google Cloud Console Client Secret
- Format: `GOCSPX-abcdefghijklmnopqrstuvwxyz`
- **Check for:**
  - No extra spaces before/after
  - No typos
  - Complete secret (not truncated)
  - If you lost it, you'll need to create new credentials

**If credentials don't match:**
1. Go back to Google Cloud Console
2. Copy the Client ID and Client Secret again
3. In Supabase, clear both fields
4. Paste the Client ID
5. Paste the Client Secret
6. Click **"Save"**

---

### Step 3: Verify Supabase Redirect URLs

1. In Supabase Dashboard, go to **Authentication** → **URL Configuration**
2. Check **Redirect URLs** list

**Must contain:**
```
aitukinative://auth/callback
```

**If missing:**
1. Click **"+ Add URL"**
2. Enter: `aitukinative://auth/callback`
3. Click **"Save"**

---

### Step 4: Common Issues & Solutions

#### Issue: Wrong OAuth Client Type
**Symptom**: Error persists after verifying credentials
**Solution**: 
- Create a NEW OAuth client in Google Cloud Console
- Application type: **"Web application"**
- Add redirect URI: `https://hhdntbgtedclqqufpzfj.supabase.co/auth/v1/callback`
- Copy new Client ID and Secret to Supabase

#### Issue: Client Secret Lost/Incorrect
**Symptom**: Can't verify if secret is correct
**Solution**:
- Google only shows Client Secret once
- If lost, create new OAuth credentials
- Update Supabase with new credentials

#### Issue: Redirect URI Typo
**Symptom**: Error persists
**Solution**:
- Double-check the redirect URI in Google Cloud Console
- Must be EXACTLY: `https://hhdntbgtedclqqufpzfj.supabase.co/auth/v1/callback`
- Common mistakes:
  - Missing `https://`
  - Trailing slash: `/callback/` (should be `/callback`)
  - Wrong domain: `supabase.com` instead of `supabase.co`
  - Missing `/auth/v1/` path

#### Issue: Changes Not Propagated
**Symptom**: Fixed but still getting error
**Solution**:
- Wait 2-5 minutes after making changes
- Google and Supabase need time to sync
- Try again after waiting

---

### Step 5: Create New OAuth Credentials (If Needed)

If you can't verify your existing credentials, create new ones:

1. **Google Cloud Console** → **APIs & Services** → **Credentials**
2. Click **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**
3. **Application type**: **"Web application"**
4. **Name**: `AiTuki Mobile App (New)`
5. **Authorized redirect URIs**: 
   - `https://hhdntbgtedclqqufpzfj.supabase.co/auth/v1/callback`
6. Click **"CREATE"**
7. **Copy Client ID and Client Secret immediately**
8. **Update Supabase**:
   - Go to Authentication → Providers → Google
   - Clear old Client ID
   - Paste new Client ID
   - Clear old Client Secret
   - Paste new Client Secret
   - Click **"Save"**

---

## Verification Checklist

Before testing again, verify:

- [ ] Google Cloud Console OAuth client is **"Web application"** type
- [ ] Redirect URI in Google Cloud Console is exactly: `https://hhdntbgtedclqqufpzfj.supabase.co/auth/v1/callback`
- [ ] Client ID in Supabase matches Google Cloud Console exactly
- [ ] Client Secret in Supabase matches Google Cloud Console exactly
- [ ] No extra spaces in Client ID or Secret in Supabase
- [ ] `aitukinative://auth/callback` is in Supabase Redirect URLs
- [ ] Waited 2-5 minutes after making changes

---

## Still Not Working?

1. **Check Supabase Logs**:
   - Dashboard → Logs → Auth Logs
   - Look for detailed error messages

2. **Check Google Cloud Console**:
   - APIs & Services → Credentials
   - Verify OAuth client is active

3. **Test with New Credentials**:
   - Create completely new OAuth client
   - Use fresh Client ID and Secret

4. **Verify OAuth Consent Screen**:
   - Must be published OR your email must be a test user
   - APIs & Services → OAuth consent screen

---

## Quick Reference

**Your Supabase Project**: `https://hhdntbgtedclqqufpzfj.supabase.co`

**Google Cloud Console Redirect URI**:
```
https://hhdntbgtedclqqufpzfj.supabase.co/auth/v1/callback
```

**Supabase Redirect URI**:
```
aitukinative://auth/callback
```

**OAuth Client Type**: Web application (NOT Android/iOS)

