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
2. Navigate to **Certificates, Identifiers & Profiles** (or click **Identifiers** in the left sidebar)
3. You should see a list of identifiers. Click the **"+"** button in the top right (or click **Register a new identifier**)
4. Select **Services IDs** and click **Continue**
5. Fill in:
   - **Description**: AiTuki Sign In Service
   - **Identifier**: `com.aituki.mobile.service` (this is your **Client ID**)
6. Click **Continue**, review, then click **Register**

**Note**: If you're on the identifiers list page (https://developer.apple.com/account/resources/identifiers/list), you should see:
- A list of existing identifiers
- A **"+"** button or **"Register a new identifier"** button at the top
- Filter options on the left sidebar

#### Step 2: Configure Service ID for Sign In with Apple

**IMPORTANT**: There are TWO places to configure Sign In with Apple:
1. **App ID Configuration** (what you're seeing now) - for the app itself
2. **Service ID Configuration** (where domains go) - for web authentication

**For the App ID (what you're currently configuring):**
1. Select **"Enable as a primary App ID"** (should already be selected)
2. In the **Server-to-Server Notification Endpoint** field, enter:
   - `https://hhdntbgtedclqqufpzfj.supabase.co/auth/v1/callback`
   - (This appears to already be filled in correctly)
3. Click **Continue** or **Save**

**For the Service ID (where domains are configured):**
1. Go back to the identifiers list
2. Find and click on your **Service ID** (`com.aituki.mobile.service`) - NOT the App ID
3. In the **Capabilities** section, find **Sign In with Apple** and check the box
4. Click **Configure** next to Sign In with Apple
5. In the Service ID configuration, you should see:
   - **Primary App ID**: Select `com.aituki.mobile` from the dropdown
   - **Website URLs** section with:
     - **Domains and Subdomains**: Enter `hhdntbgtedclqqufpzfj.supabase.co` (domain only, no `https://`)
     - **Return URLs**: Enter `https://hhdntbgtedclqqufpzfj.supabase.co/auth/v1/callback`
6. Click **Save** or **Continue**, then **Done**, then **Save** (at the bottom of the page)

**Note**: The Domain field is in the **Service ID** configuration, not the App ID configuration. Make sure you're configuring both:
- App ID: For the app itself (what you're seeing now)
- Service ID: For web/domain authentication (where the domain field is)

#### Step 3: Generate Sign In with Apple Key

1. In Apple Developer Console, go to **Keys** section (in the left sidebar, or from the main dashboard)
2. Click the **"+"** button (top right) or **"Create a key"** button
3. Fill in:
   - **Key Name**: AiTuki Sign In Key
   - Under **Services**, check **Sign In with Apple**
4. Click **Configure** next to Sign In with Apple
5. Select your App ID (`com.aituki.mobile`) from the dropdown, click **Save**
6. Click **Continue** (or **Register**)
7. **IMPORTANT**: 
   - Download the `.p8` key file immediately (you can only download it once!)
   - Note the **Key ID** shown on the page (you'll need this for the JWT)
   - Click **Done** after downloading

#### Step 4: Get Your Team ID

1. In Apple Developer Console, go to **Membership** section (in the left sidebar, or click your name/account icon)
2. Your **Team ID** is displayed there (e.g., `ABC123DEF4`)
   - It's usually shown near the top of the membership page
   - Format: 10 characters (letters and numbers)

#### Step 5: Generate Client Secret (JWT)

**IMPORTANT**: Supabase requires a JWT (JSON Web Token), NOT the raw `.p8` file!

1. Go to Supabase's Client Secret Generator:
   - **Option A**: Use Supabase's online tool: [Generate Client Secret](https://supabase.com/docs/guides/auth/social-login/auth-apple#generate-a-client_secret)
   - **Option B**: Use the form in Supabase Dashboard (see Step 6)

2. You'll need the following information:
   - **Key ID**: From the key you generated in Step 3
   - **Team ID**: From your Apple Developer Membership section
   - **Client ID (Service ID)**: `com.aituki.mobile.service`
   - **Private Key**: The contents of your `.p8` file (open it in a text editor and copy the entire contents, including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`)

3. Generate the JWT/Client Secret using one of the methods above

#### Step 6: Configure Apple in Supabase

1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Click on **Apple** to open the configuration
3. Enter the following:
   - **Client IDs**: `com.aituki.mobile.service` (your Service ID) - **Required**
   - **Secret Key (for OAuth)**: Paste the **JWT** you generated in Step 5 (NOT the `.p8` file) - **Required**
     - The JWT is a long string that looks like: `eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9...`
     - You can click the eye icon to toggle visibility when pasting
   
   **Note**: The current Supabase interface does NOT require separate Team ID and Key ID fields. These are automatically extracted from the JWT itself, which contains all the necessary information.
   
4. **Optional Settings**:
   - **Allow users without an email**: Toggle ON if you want to allow users who hide their email from Apple
   
5. **Callback URL**: 
   - The Callback URL is shown: `https://hhdntbgtedclqqufpzfj.supabase.co/auth/v1/callback`
   - This should already be configured in your Apple Developer Console Service ID
   - You can copy this URL if needed
   
6. Click **Save** at the bottom right

**Important Notes**:
- The **Secret Key** field expects a **JWT string**, not a file upload
- The JWT contains Team ID, Key ID, and Client ID information, so you don't need to enter them separately
- Make sure the JWT is valid and not expired (they expire every 6 months)

**Troubleshooting "Secret key should be a JWT" Error:**
- ❌ **Wrong**: Uploading the `.p8` file directly
- ✅ **Correct**: Generating a JWT from the `.p8` file and pasting the JWT string
- If Supabase has a "Generate Client Secret" button, use that instead
- The JWT must be a string, not a file

**Troubleshooting URL Issues:**
- If Apple Developer Console doesn't accept the Supabase URL, try:
  - Domain field: `hhdntbgtedclqqufpzfj.supabase.co` (no `https://`)
  - Return URL field: `https://hhdntbgtedclqqufpzfj.supabase.co/auth/v1/callback` (full URL)
- Make sure there are no trailing slashes
- The domain should match your Supabase project URL exactly

### Google Sign-In Setup

#### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Click **"Select a project"** → **"New Project"**
4. Fill in:
   - **Project name**: AiTuki (or your preferred name)
   - **Organization**: (optional)
   - **Location**: (optional)
5. Click **"Create"**

#### Step 2: Configure OAuth Consent Screen

1. In Google Cloud Console, go to **APIs & Services** → **OAuth consent screen**
2. Select **External** (unless you have a Google Workspace account)
3. Click **"Create"**
4. Fill in the required information:
   - **App name**: AiTuki
   - **User support email**: Your email address
   - **Developer contact information**: Your email address
5. Click **"Save and Continue"**
6. On **Scopes** page, click **"Save and Continue"** (default scopes are fine)
7. On **Test users** page, click **"Save and Continue"** (optional for testing)
8. Review and click **"Back to Dashboard"**

#### Step 3: Create OAuth 2.0 Credentials

1. In Google Cloud Console, go to **APIs & Services** → **Credentials**
2. Click **"Create Credentials"** → **"OAuth client ID"**
3. If prompted, configure the OAuth consent screen (you may have already done this)
4. Select **Application type**: **Web application**
5. Fill in:
   - **Name**: AiTuki Mobile App
   - **Authorized redirect URIs**: 
     - Add: `https://hhdntbgtedclqqufpzfj.supabase.co/auth/v1/callback`
     - This is your Supabase project callback URL
6. Click **"Create"**
7. **IMPORTANT**: Copy both:
   - **Client ID** (looks like: `123456789-abcdefghijklmnop.apps.googleusercontent.com`)
   - **Client Secret** (looks like: `GOCSPX-abcdefghijklmnopqrstuvwxyz`)
   
   ⚠️ **Save these immediately** - you can't view the Client Secret again!

#### Step 4: Enable Google in Supabase

1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Find **Google** and click to expand
3. Toggle **Enable Sign in with Google** to ON
4. Enter the following:
   - **Client ID (for OAuth)**: Paste your Google Client ID
   - **Client Secret (for OAuth)**: Paste your Google Client Secret
5. Click **"Save"**

#### Step 5: Verify Redirect URLs

1. In Supabase dashboard, go to **Authentication** → **URL Configuration**
2. Verify that `aitukinative://auth/callback` is in the **Redirect URLs** list
3. If not, add it and save

**That's it!** Google Sign-In should now work in your app.

**Troubleshooting:**
- **"Invalid client" error**: Verify Client ID and Client Secret are correct
- **"Redirect URI mismatch"**: Ensure the redirect URI in Google Cloud Console matches exactly: `https://hhdntbgtedclqqufpzfj.supabase.co/auth/v1/callback`
- **OAuth not working**: Check that OAuth consent screen is published (or add test users if in testing mode)

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

