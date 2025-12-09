# Quick Start: Publish to Google Play Store

## 🚀 Quick Commands

### 1. First Time Setup

```bash
# Login to EAS
eas login

# Build for internal testing (APK)
eas build --platform android --profile preview
```

### 2. Submit to Internal Testing

```bash
# Automatic submission (requires service account key)
eas submit --platform android --latest
```

**OR manually:**
1. Download APK from build page
2. Upload to Play Console → Internal Testing

### 3. Build for Production (AAB)

```bash
# Build App Bundle for Play Store
eas build --platform android --profile production
```

### 4. Submit to Production

```bash
# Submit to Play Store
eas submit --platform android --latest
```

## 📋 Prerequisites Checklist

- [ ] Google Play Developer Account ($25 one-time)
- [ ] App created in Play Console
- [ ] Package name set in `app.json` (currently: `com.aituki.native`)
- [ ] Service account key created (for auto-submit)
- [ ] App icon configured
- [ ] Version numbers set correctly
- [ ] EAS CLI installed
- [ ] Logged into EAS

## 🔧 Important Configuration

### Update Package Name

In `app.json`, change:
```json
"package": "com.aituki.native"
```
to your unique package name (e.g., `com.yourcompany.aituki`)

**Must be:**
- Unique (not used by another app)
- Lowercase letters, numbers, underscores, dots
- Reverse domain notation

### Update Version Numbers

Before each build, update in `app.json`:
- `version`: User-facing version (e.g., "1.0.0")
- `android.versionCode`: Integer, must increment (1, 2, 3...)

## 📱 Testing Tracks

1. **Internal Testing** (up to 100 testers)
   - Immediate availability
   - No review needed
   - Best for quick testing

2. **Closed Testing** (up to 100,000 testers)
   - Requires opt-in
   - Multiple test groups
   - Good for beta

3. **Open Testing** (unlimited)
   - Public opt-in
   - Requires review
   - Public beta

4. **Production** (public release)
   - Full review (1-7 days)
   - Available to all

## 🔑 Service Account Setup (For Auto-Submit)

1. **Google Cloud Console:**
   - Create project
   - Enable "Google Play Android Developer API"
   - Create service account
   - Download JSON key

2. **Play Console:**
   - Setup → API access
   - Grant access to service account
   - Role: "Release manager" or "Admin"

3. **Update eas.json:**
   ```json
   "serviceAccountKeyPath": "./google-play-api-key.json"
   ```

## 📦 Build Types

- **APK** (preview): For testing, direct install
- **AAB** (production): Required for Play Store

## 🆘 Quick Troubleshooting

### Build fails
```bash
eas build:view [BUILD_ID]  # Check logs
```

### Submission fails
- Check service account permissions
- Verify package name matches Play Console
- Ensure version code incremented

### Need help?
- Full guide: See `ANDROID_PUBLISHING.md`
- EAS docs: https://docs.expo.dev/build/introduction/

