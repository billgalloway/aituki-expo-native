# Email Configuration Guide

## Problem
Email confirmation and password reset emails are not being sent from Supabase.

## Solution

### Step 1: Enable Email Confirmations in Supabase

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project
3. Navigate to **Authentication** → **Settings**
4. Under **Email Auth**, ensure:
   - ✅ **Enable email confirmations** is checked
   - ✅ **Enable email signup** is checked

### Step 2: Configure SMTP (Required for Production)

**Current Status**: Supabase default email service is limited to **3 emails per hour**. This is why emails may not be sending.

**To fix this, configure custom SMTP:**

1. In Supabase dashboard, go to **Settings** → **Auth** → **SMTP Settings**
2. Click **Enable Custom SMTP**
3. Enter your SMTP provider credentials

**Recommended SMTP Providers:**

#### Option 1: SendGrid (Easiest, Free Tier: 100 emails/day)
1. Sign up at https://sendgrid.com
2. Create an API key
3. In Supabase SMTP settings:
   - **Host**: `smtp.sendgrid.net`
   - **Port**: `587`
   - **Username**: `apikey`
   - **Password**: Your SendGrid API key
   - **Sender email**: Your verified sender email
   - **Sender name**: `AiTuki`

#### Option 2: Mailgun (Free Tier: 5,000 emails/month)
1. Sign up at https://mailgun.com
2. Get SMTP credentials from dashboard
3. Enter credentials in Supabase

#### Option 3: AWS SES (Most Scalable)
1. Set up AWS SES
2. Verify your domain/email
3. Get SMTP credentials
4. Enter in Supabase

### Step 3: Add Password Reset Redirect URL

1. In Supabase dashboard, go to **Authentication** → **URL Configuration**
2. Add to **Redirect URLs**:
   - `aitukinative://auth/reset-password`

### Step 4: Test Email Sending

1. Try registering a new user - you should receive a confirmation email
2. Try "Forgot Password" on the login screen - you should receive a reset email

## What's Been Implemented

✅ **Forgot Password Functionality**
- Added `resetPassword` function to `AuthContext`
- Connected "Forgot password?" button in login screen
- Shows email input form when clicked
- Sends password reset email via Supabase

✅ **Email Confirmation**
- Registration now includes email redirect URL
- Users will receive confirmation emails (once SMTP is configured)

## Troubleshooting

### "Error sending recovery email" (password reset)

This means Supabase could not send the reset email. **Fix:** Configure custom SMTP (Step 2 above). The default Supabase mail often fails with this error. Go to **Settings** → **Auth** → **SMTP Settings**, enable Custom SMTP, and enter your provider credentials (e.g. SendGrid, Mailgun).

### Emails Still Not Sending?

1. **Check Supabase Email Logs**:
   - Go to **Authentication** → **Users**
   - Click on a user
   - Check "Email Logs" tab to see if emails were attempted

2. **Verify SMTP Settings**:
   - Test SMTP connection in Supabase dashboard
   - Check for error messages

3. **Check Spam Folder**:
   - Emails might be going to spam initially

4. **Verify Redirect URLs**:
   - Make sure `aitukinative://auth/callback` and `aitukinative://auth/reset-password` are added

### Using Default Supabase Email Service

If you're using the default service (not recommended for production):
- Limited to 3 emails per hour
- Emails may be delayed
- Not suitable for production apps

**Recommendation**: Set up custom SMTP for reliable email delivery.

