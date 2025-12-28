# Publishing to Google Play Store

This guide will walk you through publishing your Expo app to the Google Play Store.

## Prerequisites

1. **Google Play Developer Account** ($25 one-time fee)
   - Sign up at https://play.google.com/console
   - Pay the one-time registration fee

2. **Install EAS CLI** (if not already installed)
   ```bash
   npm install -g eas-cli
   ```

3. **Login to Expo**
   ```bash
   eas login
   ```

## Step 1: Configure Google Play Console

1. **Create a Google Play Developer account:**
   - Go to https://play.google.com/console
   - Pay the $25 one-time registration fee
   - Complete your developer profile

2. **Create a new app:**
   - Click "Create app"
   - Fill in app details:
     - App name
     - Default language
     - App or game
     - Free or paid

3. **Set up app content:**
   - App access
   - Ads
   - Content rating
   - Target audience
   - Data safety

## Step 2: Create Service Account (for automated submission)

1. **Go to Google Cloud Console:**
   - https://console.cloud.google.com
   - Create a new project (or use existing)

2. **Enable Google Play Android Developer API:**
   - Navigate to "APIs & Services" → "Library"
   - Search for "Google Play Android Developer API"
   - Click "Enable"

3. **Create Service Account:**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "Service Account"
   - Name it (e.g., "play-store-submitter")
   - Click "Create and Continue"
   - Skip optional steps, click "Done"

4. **Create and Download Key:**
   - Click on the service account you created
   - Go to "Keys" tab
   - Click "Add Key" → "Create new key"
   - Choose "JSON" format
   - Download the key file (save as `google-play-api-key.json`)

5. **Grant Access in Play Console:**
   - Go to https://play.google.com/console
   - Select your app
   - Go to "Setup" → "API access"
   - Find your service account
   - Click "Grant access"
   - Select role: "Admin" (or "Release manager")
   - Accept

## Step 3: Update app.json

Make sure your `app.json` has:
- ✅ App name
- ✅ Package name (Android) - currently: `com.aituki.native`
- ✅ Version number
- ✅ Version code (increment for each build)
- ✅ Icon and splash screen configured

## Step 4: Build for Internal Testing

### First Time Setup

1. **Create an Android build:**
   ```bash
   eas build --platform android --profile preview
   ```

2. **This will:**
   - Build your app as an APK (for testing)
   - Take 10-20 minutes
   - Provide download link when done

### Build Types

- **APK** (`preview` profile): For testing, can install directly
- **AAB (App Bundle)** (`production` profile): Required for Play Store

## Step 5: Upload to Internal Testing

### Option A: Automatic Upload (Recommended)

1. **Place your service account key:**
   ```bash
   # Save the JSON key file in your project root or a secure location
   # Update eas.json with the path:
   # "serviceAccountKeyPath": "./google-play-api-key.json"
   ```

2. **Submit automatically:**
   ```bash
   eas submit --platform android --latest
   ```

### Option B: Manual Upload

1. **Download the APK/AAB:**
   - From the EAS build page
   - Or use: `eas build:download [BUILD_ID]`

2. **Upload to Play Console:**
   - Go to https://play.google.com/console
   - Select your app
   - Go to "Testing" → "Internal testing"
   - Click "Create new release"
   - Upload the APK/AAB file
   - Add release notes
   - Click "Save" → "Review release" → "Start rollout to Internal testing"

## Step 6: Build for Production (App Bundle)

For Play Store release, you need an AAB (Android App Bundle):

```bash
eas build --platform android --profile production
```

This creates an `.aab` file required by Google Play.

## Step 7: Submit to Production

### Automatic Submission

```bash
eas submit --platform android --latest
```

### Manual Submission

1. **Download the AAB:**
   ```bash
   eas build:download [BUILD_ID]
   ```

2. **Create Production Release:**
   - Go to Play Console → Your App
   - Go to "Production" → "Create new release"
   - Upload the AAB file
   - Fill in release notes
   - Review and publish

## Step 8: Complete Store Listing

Before publishing, complete:

- [ ] App icon (512x512px)
- [ ] Feature graphic (1024x500px)
- [ ] Screenshots (at least 2, up to 8)
- [ ] Short description (80 characters)
- [ ] Full description (4000 characters)
- [ ] Privacy policy URL (required)
- [ ] Content rating questionnaire
- [ ] Data safety form

## Build Profiles Explained

### Preview
- Builds APK for testing
- Can install directly on devices
- Faster builds
- Good for internal testing

### Production
- Builds AAB (App Bundle) for Play Store
- Required for Play Store submission
- Optimized by Google Play
- Longer build time

## Common Commands

```bash
# Build for Android (preview/APK)
eas build --platform android --profile preview

# Build for Android (production/AAB)
eas build --platform android --profile production

# Submit to Play Store
eas submit --platform android --latest

# Check build status
eas build:list

# View build details
eas build:view [BUILD_ID]

# Download build
eas build:download [BUILD_ID]
```

## Version Management

### Update Version Numbers

Before each build, update in `app.json`:

```json
{
  "expo": {
    "version": "1.0.0",  // User-facing version
    "android": {
      "versionCode": 1  // Increment for each build (1, 2, 3...)
    }
  }
}
```

**Important:**
- `version`: Semantic version (e.g., "1.0.0", "1.0.1")
- `versionCode`: Integer that must increase with each build
- Play Store uses `versionCode` to determine which build is newer

## Testing Tracks

1. **Internal Testing**
   - Up to 100 testers
   - Immediate availability
   - No review process
   - Best for quick testing

2. **Closed Testing**
   - Up to 100,000 testers
   - Requires testers to opt-in
   - Can have multiple test groups
   - Good for beta testing

3. **Open Testing**
   - Unlimited testers
   - Public opt-in
   - Requires review
   - Good for public betas

4. **Production**
   - Public release
   - Requires full review (1-7 days)
   - Available to all users

## Troubleshooting

### Build Fails
- Check build logs: `eas build:view [BUILD_ID]`
- Verify `app.json` configuration
- Ensure all dependencies are compatible
- Check for missing assets

### Submission Fails
- Verify service account has correct permissions
- Check `serviceAccountKeyPath` in `eas.json`
- Ensure package name matches Play Console
- Verify version code is incremented

### Play Console Errors
- Ensure all required fields are filled
- Check content rating is complete
- Verify privacy policy URL is accessible
- Review data safety information

## Security Best Practices

1. **Never commit service account keys to git:**
   - Add `*.json` keys to `.gitignore`
   - Use environment variables or secure storage
   - Rotate keys if exposed

2. **Use least privilege:**
   - Grant service account only necessary permissions
   - Use "Release manager" role instead of "Admin" if possible

3. **Store keys securely:**
   - Use password managers
   - Encrypt keys at rest
   - Limit access to keys

## Resources

- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [EAS Submit Documentation](https://docs.expo.dev/submit/introduction/)
- [Google Play Console](https://play.google.com/console)
- [Android App Bundle Guide](https://developer.android.com/guide/app-bundle)

