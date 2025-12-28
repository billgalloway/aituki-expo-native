# Quick Guide: Submit to Google Play Store

## Quick Commands

### 1. Build for Production
```bash
cd expo-dev/my-expo-app/aituki-mobile
eas build --platform android --profile production
```
⏱️ Takes 10-20 minutes

### 2. Submit to Play Store
```bash
eas submit --platform android --latest
```
✅ Automatically uploads to Play Console (if service account is configured)

## Before First Submission

1. **Complete Service Account Setup:**
   - Follow: `GOOGLE_PLAY_SERVICE_ACCOUNT_SETUP.md`
   - Download `google-play-api-key.json`
   - Place it in project root

2. **Create App in Play Console:**
   - Go to: https://play.google.com/console
   - Sign in with: **bill.galloway7@gmail.com**
   - Create app with package: `com.aituki.mobile`

3. **Complete Store Listing:**
   - App icon (512x512px)
   - Screenshots (at least 2)
   - Short description (80 chars)
   - Full description (4000 chars)
   - Privacy policy URL (required)
   - Content rating
   - Data safety form

## Submission Tracks

The current configuration uses `"track": "internal"` which submits to:
- **Internal Testing** track (up to 100 testers)

To change the track, edit `eas.json`:
```json
"android": {
  "serviceAccountKeyPath": "./google-play-api-key.json",
  "track": "internal"  // Options: "internal", "alpha", "beta", "production"
}
```

## Manual Submission (If Auto-Submit Fails)

1. **Download the AAB:**
   - Go to: https://expo.dev/accounts/billgalloway/projects/aituki-mobile/builds
   - Download the `.aab` file from the latest build

2. **Upload to Play Console:**
   - Go to: https://play.google.com/console
   - Select your app
   - Go to "Production" (or desired track)
   - Click "Create new release"
   - Upload the `.aab` file
   - Add release notes
   - Review and publish

## Version Management

Before each build, update in `app.json`:
- `version`: User-facing version (e.g., "1.0.0", "1.0.1")
- `android.versionCode`: Must increment (1, 2, 3...)

Current version: `1.0.0` (versionCode: 1)

## Troubleshooting

**Build fails?**
- Check logs: `eas build:view [BUILD_ID]`
- Verify `app.json` configuration

**Submit fails?**
- Verify service account key exists: `./google-play-api-key.json`
- Check service account has access in Play Console
- Verify package name matches: `com.aituki.mobile`

**Need help?**
- See: `GOOGLE_PLAY_SERVICE_ACCOUNT_SETUP.md`
- See: `ANDROID_PUBLISHING.md`

