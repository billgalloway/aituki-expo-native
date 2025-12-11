# Supabase Authentication Setup Guide

## Overview

This app uses Supabase for authentication with support for:
- Email/Password authentication
- Apple Sign-In (OAuth)
- Google Sign-In (OAuth)

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - **Name**: AiTuki (or your preferred name)
   - **Database Password**: (save this securely)
   - **Region**: Choose closest to your users
5. Click "Create new project" (takes 1-2 minutes)

## Step 2: Get Your Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

## Step 3: Configure OAuth Providers

### Apple Sign-In Setup

#### Step 1: Create Service ID in Apple Developer Console

1. Go to [Apple Developer Console](https://developer.apple.com/account)
2. Navigate to **Certificates, Identifiers & Profiles** → **Identifiers**
3. Click the **"+"** button to create a new identifier
4. Select **Services IDs** and click **Continue**
5. Fill in:
   - **Description**: AiTuki Sign In Service
   - **Identifier**: `com.aituki.mobile.service` (this is your **Client ID**)
6. Click **Continue** and **Register**

#### Step 2: Configure Service ID for Sign In with Apple

1. Select your newly created Service ID
2. Check **Sign In with Apple** and click **Configure**
3. In the **Domains and Subdomains** section:
   - **Primary App ID**: Select your app's Bundle ID (`com.aituki.mobile`)
   - **Website URLs** section:
     - **Domains**: Enter `hhdntbgtedclqqufpzfj.supabase.co` (domain only, no `https://`)
     - **Return URLs**: Enter `https://hhdntbgtedclqqufpzfj.supabase.co/auth/v1/callback`
   
   **Note**: If the domain field doesn't accept the URL:
   - Try entering just: `hhdntbgtedclqqufpzfj.supabase.co` (no protocol)
   - The Return URL field should accept the full callback URL
4. Click **Next**, then **Done**, then **Save**

#### Step 3: Generate Sign In with Apple Key

1. In Apple Developer Console, go to **Keys** section
2. Click the **"+"** button
3. Fill in:
   - **Key Name**: AiTuki Sign In Key
   - Enable **Sign In with Apple**
4. Click **Configure**, select your App ID (`com.aituki.mobile`), click **Save**
5. Click **Continue** and **Register**
6. **IMPORTANT**: Download the `.p8` key file immediately (you can only download it once!)
7. Note the **Key ID** shown on the page

#### Step 4: Get Your Team ID

1. In Apple Developer Console, go to **Membership** section
2. Your **Team ID** is displayed there (e.g., `ABC123DEF4`)

#### Step 5: Configure Apple in Supabase

1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Enable **Apple**
3. Enter the following (Supabase may only ask for some of these fields):
   - **Client ID**: Your Service ID (e.g., `com.aituki.mobile.service`) - **Required**
   - **Secret Key**: Upload the `.p8` file you downloaded - **Required**
   - **Team ID**: Your Apple Developer Team ID (from Membership section) - May be optional or auto-detected
   - **Key ID**: The Key ID from the key you generated - May be optional or auto-detected
   
   **Note**: Supabase may have simplified the interface. If you only see:
   - **Client ID** field → Enter your Service ID (`com.aituki.mobile.service`)
   - **Secret Key** field → Upload your `.p8` file
   
   The Team ID and Key ID might be extracted automatically from the `.p8` file, or Supabase may generate the client secret for you.
4. Click **Save**

**Troubleshooting URL Issues:**
- If Apple Developer Console doesn't accept the Supabase URL, try:
  - Domain field: `hhdntbgtedclqqufpzfj.supabase.co` (no `https://`)
  - Return URL field: `https://hhdntbgtedclqqufpzfj.supabase.co/auth/v1/callback` (full URL)
- Make sure there are no trailing slashes
- The domain should match your Supabase project URL exactly

### Google Sign-In Setup

1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Enable **Google**
3. You'll need:
   - Google Cloud Console project
   - OAuth 2.0 Client ID
   - Client Secret
   
   Follow Supabase's Google setup guide: [Google OAuth Setup](https://supabase.com/docs/guides/auth/social-login/auth-google)

## Step 4: Add Credentials to app.json

Open `app.json` and add your Supabase credentials to the `extra` section:

```json
{
  "expo": {
    "extra": {
      "EXPO_PUBLIC_SUPABASE_URL": "https://your-project.supabase.co",
      "EXPO_PUBLIC_SUPABASE_ANON_KEY": "your-anon-key-here"
    }
  }
}
```

**Important**: Replace the placeholder values with your actual Supabase credentials.

## Step 5: Configure Email Settings (IMPORTANT for Email Confirmation & Password Reset)

### Enable Email Authentication

1. In Supabase dashboard, go to **Authentication** → **Settings**
2. Under **Email Auth**, ensure:
   - ✅ **Enable email confirmations** is checked (for new user registrations)
   - ✅ **Enable email signup** is checked
3. Under **Email Templates**, you can customize:
   - **Confirm signup** - Email sent when users register
   - **Reset password** - Email sent for password resets
   - **Magic link** - Email sent for passwordless login (if enabled)

### Configure SMTP (Required for Production)

By default, Supabase uses their email service (limited to 3 emails/hour). For production, you should configure custom SMTP:

1. In Supabase dashboard, go to **Settings** → **Auth** → **SMTP Settings**
2. Enable **Custom SMTP**
3. Enter your SMTP credentials:
   - **Host**: Your SMTP server (e.g., `smtp.gmail.com`, `smtp.sendgrid.net`)
   - **Port**: Usually `587` (TLS) or `465` (SSL)
   - **Username**: Your SMTP username
   - **Password**: Your SMTP password
   - **Sender email**: The email address that will send the emails
   - **Sender name**: Display name for emails (e.g., "AiTuki")

**Popular SMTP Providers:**
- **SendGrid**: Free tier: 100 emails/day
- **Mailgun**: Free tier: 5,000 emails/month
- **AWS SES**: Pay-as-you-go, very affordable
- **Gmail**: Requires app password (not recommended for production)

### Configure Email Redirect URLs

1. In Supabase dashboard, go to **Authentication** → **URL Configuration**
2. Set the **Site URL**:
   - For mobile apps, you can use your Supabase project URL: `https://hhdntbgtedclqqufpzfj.supabase.co`
   - Or use a placeholder like `aitukinative://` (your app scheme)
3. Add your **Redirect URLs**:
   - Add: `aitukinative://auth/callback` (for email confirmations)
   - Add: `aitukinative://auth/reset-password` (for password reset)
   - These are the deep link URLs that your app uses for email callbacks

**Note**: 
- **Site URL** is the base URL Supabase uses for validation (less critical for mobile apps)
- **Redirect URLs** are the specific callback URLs that Supabase will redirect to after email actions
- For mobile apps, the redirect URLs (deep links) are important for email confirmations and password resets

## Step 6: Test Authentication

1. Start your Expo app:
   ```bash
   npm start
   ```

2. Navigate to the login screen
3. Test:
   - Email/password registration
   - Email/password login
   - Apple Sign-In (if configured)
   - Google Sign-In (if configured)

## Troubleshooting

### OAuth Not Working

- **Check redirect URL**: Must match exactly in Supabase settings
- **Check app scheme**: Ensure `scheme: "aitukinative"` in `app.json`
- **Check provider settings**: Verify OAuth credentials in Supabase dashboard

### Environment Variables Not Loading

- **Production builds**: Use `Constants.expoConfig?.extra` (already implemented)
- **Development**: Check that values are in `app.json` under `extra`
- **Rebuild**: After changing `app.json`, rebuild the app

### Session Not Persisting

- **AsyncStorage**: Already configured in `services/supabase.ts`
- **Check storage permissions**: Ensure app has storage permissions

## File Structure

```
app/
  (auth)/
    _layout.tsx          # Auth layout
    login.tsx            # Login screen
    register.tsx         # Registration screen
    callback.tsx         # OAuth callback handler
contexts/
  AuthContext.tsx        # Auth state management
services/
  supabase.ts           # Supabase client
```

## Next Steps

1. **Customize UI**: Update login/register screens to match your Figma design
2. **Add User Profile**: Create user profile screen
3. **Add Password Reset**: Implement forgot password flow
4. **Add Email Verification**: Configure email verification in Supabase

## Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Expo AuthSession](https://docs.expo.dev/guides/authentication/)
- [Supabase React Native Guide](https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native)

