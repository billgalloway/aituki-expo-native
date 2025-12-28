# Publishing to App Store and TestFlight

This guide will walk you through publishing your Expo app to the iOS App Store and TestFlight.

## Prerequisites

1. **Apple Developer Account** ($99/year)
   - Sign up at https://developer.apple.com
   - Enroll in the Apple Developer Program

2. **Install EAS CLI**
   ```bash
   npm install -g eas-cli
   ```

3. **Login to Expo**
   ```bash
   eas login
   ```

## Step 1: Configure EAS Build

1. **Initialize EAS in your project:**
   ```bash
   cd aituki-native
   eas build:configure
   ```

2. **This creates `eas.json`** - you can customize build profiles

## Step 2: Update app.json

Make sure your `app.json` has:
- ✅ App name
- ✅ Bundle identifier (iOS)
- ✅ Version number
- ✅ Icon and splash screen configured

## Step 3: Build for TestFlight

### First Time Setup

1. **Create an iOS build for TestFlight:**
   ```bash
   eas build --platform ios --profile preview
   ```

2. **This will:**
   - Ask you to create an Apple App Store Connect API key (or use existing)
   - Build your app in the cloud
   - Take 10-20 minutes

### Using Existing Credentials

If you already have:
- Apple Developer account credentials
- App Store Connect API key

You can configure them in `eas.json` or let EAS manage them automatically.

## Step 4: Submit to TestFlight

Once the build completes:

1. **Submit automatically to TestFlight:**
   ```bash
   eas submit --platform ios --latest
   ```

   OR manually:
   - Go to https://appstoreconnect.apple.com
   - Navigate to your app → TestFlight
   - Upload the `.ipa` file from the build

2. **Add Testers:**
   - Internal Testers: Up to 100 (immediate access)
   - External Testers: Up to 10,000 (requires App Review)

## Step 5: Submit to App Store

### Automatic Submission

```bash
eas build --platform ios --profile production --auto-submit
```

### Manual Submission

1. **Build for production:**
   ```bash
   eas build --platform ios --profile production
   ```

2. **Submit to App Store:**
   ```bash
   eas submit --platform ios --latest
   ```

3. **Complete App Store Connect:**
   - Go to https://appstoreconnect.apple.com
   - Fill in app information:
     - Screenshots (required)
     - Description
     - Keywords
     - Privacy policy URL
     - Support URL
     - Category
   - Submit for review

## Build Profiles Explained

### Preview (TestFlight)
- For internal/external testing
- Faster builds
- Can use development credentials

### Production (App Store)
- For App Store release
- Requires production credentials
- Longer build time
- Full App Store review process

## Common Commands

```bash
# Check build status
eas build:list

# View build details
eas build:view [BUILD_ID]

# Cancel a build
eas build:cancel [BUILD_ID]

# Download build
eas build:download [BUILD_ID]

# Check submission status
eas submit:list
```

## Troubleshooting

### Missing App Store Connect API Key
1. Go to https://appstoreconnect.apple.com/access/api
2. Create a new key with "App Manager" role
3. Download the `.p8` file (you can only download once!)
4. Use it when prompted by EAS

### Build Fails
- Check build logs: `eas build:view [BUILD_ID]`
- Ensure all dependencies are compatible
- Check for missing assets or configuration

### Submission Fails
- Verify app.json configuration
- Check bundle identifier matches App Store Connect
- Ensure version number is incremented

## Next Steps After First Build

1. **Set up automatic builds** with GitHub Actions or similar
2. **Configure app.json** with proper metadata
3. **Prepare App Store assets** (screenshots, descriptions)
4. **Set up versioning strategy** (semantic versioning recommended)

## Resources

- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [EAS Submit Documentation](https://docs.expo.dev/submit/introduction/)
- [App Store Connect Guide](https://developer.apple.com/app-store-connect/)
- [TestFlight Guide](https://developer.apple.com/testflight/)

