# Store Credentials Setup Guide

## Current Status

### ✅ Configured
- **EAS Project**: `aituki-native` (Project ID: `cafdb2fb-73c0-4197-b9b0-479366a3a175`)
- **Google Play Service Account Key**: `./google-play-api-key.json` ✅ Found
- **App Configuration**: Both iOS and Android app IDs configured in `eas.json`

### 🔧 Need Setup

#### Apple App Store (iOS)
Your `eas.json` shows:
- **Bundle Identifier**: `com.aituki.mobile`
- **Apple Team ID**: `J2HMNHZVM9`
- **Apple ID**: `bill_galloway@icloud.com`
- **ASC App ID**: `6756360703`

**To set up iOS credentials:**
```bash
eas credentials --platform ios
```
Then select `production` when prompted for the build profile.

This will:
1. Prompt for your Apple Developer Portal login
2. Set up distribution certificate (or use existing)
3. Set up provisioning profile for `com.aituki.mobile`
4. Store credentials securely in EAS

**Requirements:**
- Valid Apple Developer account (paid $99/year)
- Access to App Store Connect with the app `6756360703`
- Team ID `J2HMNHZVM9` must be accessible

#### Google Play Store (Android)
Your `eas.json` shows:
- **Package Name**: `com.aituki.mobile`
- **Version Code**: `12`
- **Service Account Key**: `./google-play-api-key.json` ✅ Already present

**To set up Android credentials:**
```bash
eas credentials --platform android
```
Then select `production` when prompted for the build profile.

This will:
1. Set up or use existing keystore for signing
2. Verify the service account key is accessible
3. Store credentials securely in EAS

**Requirements:**
- Google Play Console account with the app created
- Service account with Play Console API access (already configured)
- Keystore for app signing (EAS can generate one)

## Quick Setup

Run the interactive setup script:
```bash
./setup-credentials.sh
```

Or set up individually:

**iOS:**
```bash
eas credentials --platform ios
```
(Select `production` when prompted)

**Android:**
```bash
eas credentials --platform android
```
(Select `production` when prompted)

## Verify Setup

After setting up, verify credentials:
```bash
# Check iOS credentials
eas credentials --platform ios

# Check Android credentials  
eas credentials --platform android
```

## Next Steps

Once credentials are set up:
```bash
# Build and submit both platforms
./build-and-submit-stores.sh both

# Or build individually
./build-and-submit-stores.sh ios
./build-and-submit-stores.sh android
```

## Troubleshooting

### iOS Issues
- **"No Apple Team found"**: Make sure you're logged in with the correct Apple ID
- **"App not found"**: Verify the ASC App ID `6756360703` exists in App Store Connect
- **"Invalid Team ID"**: Check that Team ID `J2HMNHZVM9` is correct in Apple Developer Portal

### Android Issues
- **"Service account key not found"**: Ensure `google-play-api-key.json` is in the project root
- **"Package name mismatch"**: Verify `com.aituki.mobile` matches your Play Console app
- **"Keystore not found"**: EAS will generate one automatically if none exists

## Support

For more help:
- EAS Documentation: https://docs.expo.dev/submit/introduction/
- EAS CLI Help: `eas credentials --help`
- Check build status: `eas build:list`

