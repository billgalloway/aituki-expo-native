# iOS App Store Setup Guide

## Prerequisites

✅ You have a paid Apple Developer account ($99/year)

## Step 1: Set Up iOS Credentials

EAS can automatically manage your iOS credentials. Run this command interactively:

```bash
cd "/Users/billgalloway/Local Sites/Figma/expo-dev/my-expo-app/aituki-mobile"
eas credentials
```

When prompted:
1. Select **iOS**
2. Select **production** profile
3. Choose **"Set up credentials automatically"** (recommended)
4. EAS will:
   - Generate a distribution certificate
   - Create a provisioning profile
   - Store them securely

## Step 2: Create App in App Store Connect

1. Go to: https://appstoreconnect.apple.com
2. Sign in with your Apple Developer account
3. Click **"My Apps"** → **"+"** → **"New App"**
4. Fill in:
   - **Platform:** iOS
   - **Name:** AiTuki
   - **Primary Language:** English (U.S.)
   - **Bundle ID:** `com.aituki.mobile` (must match app.json)
   - **SKU:** `aituki-ios` (any unique identifier)
5. Click **"Create"**

## Step 3: Configure eas.json for Submission

Update the `submit.production.ios` section in `eas.json` with your App Store Connect details:

```json
"submit": {
  "production": {
    "ios": {
      "appleId": "your-email@example.com",
      "ascAppId": "1234567890",
      "appleTeamId": "ABCD123456"
    }
  }
}
```

**To find these values:**
- **appleId:** Your Apple ID email
- **ascAppId:** Found in App Store Connect → Your App → App Information → Apple ID
- **appleTeamId:** Found in App Store Connect → Users and Access → Your name → Team ID

## Step 4: Build iOS Production App

Once credentials are set up:

```bash
eas build --platform ios --profile production
```

This will:
- Build your iOS app
- Create an `.ipa` file
- Take 15-30 minutes

## Step 5: Submit to App Store

### Option A: Automated Submission (Recommended)

If you've configured App Store Connect API key:

```bash
eas submit --platform ios --latest
```

### Option B: Manual Submission

1. Download the `.ipa` from the build page
2. Use **Transporter** app (Mac App Store) or **Xcode**
3. Upload the `.ipa` file
4. Complete submission in App Store Connect

## Current Configuration

- **Bundle ID:** `com.aituki.mobile`
- **Version:** 2
- **Build Number:** 2
- **App Name:** AiTuki

## Next Steps

1. Run `eas credentials` interactively to set up iOS certificates
2. Create app in App Store Connect
3. Update `eas.json` with your App Store Connect details
4. Build and submit!

