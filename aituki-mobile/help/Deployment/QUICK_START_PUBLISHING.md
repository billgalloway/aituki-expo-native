# Quick Start: Publish to TestFlight & App Store

## 🚀 Quick Commands

### 1. First Time Setup (One-time)

```bash
# Make sure you're logged in
eas login

# Configure EAS (if not already done)
eas build:configure
```

### 2. Build for TestFlight

```bash
# Build iOS app for TestFlight
eas build --platform ios --profile preview
```

**What happens:**
- EAS will ask for Apple credentials (or use existing)
- Build takes 10-20 minutes
- You'll get a download link when done

### 3. Submit to TestFlight

```bash
# Submit the latest build to TestFlight
eas submit --platform ios --latest
```

**OR manually:**
1. Download the `.ipa` from the build page
2. Go to https://appstoreconnect.apple.com
3. Upload via Transporter app or web interface

### 4. Build for App Store Production

```bash
# Build for App Store
eas build --platform ios --profile production
```

### 5. Submit to App Store

```bash
# Submit to App Store (auto-submit)
eas submit --platform ios --latest
```

## 📋 Before You Start Checklist

- [ ] Apple Developer Account ($99/year)
- [ ] App created in App Store Connect
- [ ] Bundle identifier set in `app.json` (currently: `com.aituki.native`)
- [ ] App icon configured
- [ ] Version number set correctly
- [ ] EAS CLI installed (`npm install -g eas-cli`)
- [ ] Logged into EAS (`eas login`)

## 🔧 Important Configuration

### Update Bundle Identifier

In `app.json`, change:
```json
"bundleIdentifier": "com.aituki.native"
```
to your unique identifier (e.g., `com.yourcompany.aituki`)

### Update Version Numbers

Before each build, update in `app.json`:
- `version`: User-facing version (e.g., "1.0.0")
- `ios.buildNumber`: Build number (increment for each build)

## 📱 TestFlight Setup

1. **Internal Testing** (up to 100 testers)
   - Immediate access
   - No App Review needed
   - Add testers in App Store Connect

2. **External Testing** (up to 10,000 testers)
   - Requires App Review
   - Can take 24-48 hours for approval
   - Add testers in App Store Connect

## 🏪 App Store Submission

Before submitting, prepare:
- [ ] App screenshots (all required sizes)
- [ ] App description
- [ ] Keywords
- [ ] Privacy policy URL
- [ ] Support URL
- [ ] App category
- [ ] Age rating

## 🆘 Need Help?

- Check build status: `eas build:list`
- View build logs: `eas build:view [BUILD_ID]`
- Full guide: See `APP_STORE_PUBLISHING.md`

