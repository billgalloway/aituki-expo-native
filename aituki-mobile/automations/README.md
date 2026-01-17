# Automation Scripts

This directory contains all automation scripts for building, deploying, and managing the AiTuki mobile app.

## 📁 Script Categories

### 🚀 Build Scripts

**Android Builds:**
- `build-android.sh` - Build Android production app
- `build-android-expo-dev.sh` - Build Android Expo dev client
- `build-and-submit-android.sh` - Build and submit Android to Google Play

**iOS Builds:**
- `build-ios.sh` - Build iOS production app
- `build-ios-expo-dev.sh` - Build iOS Expo dev client
- `build-ios-production.sh` - Build iOS for production (App Store)
- `build-and-submit-ios.sh` - Build and submit iOS to App Store

**Universal:**
- `build-and-submit-stores.sh` - Build and submit to both iOS and Android stores
- `start-build.sh` - Start a build process
- `check-build-logs.sh` - Check build logs and status

### 🔐 Credential & Keystore Scripts

**Keystore Management:**
- `setup-credentials.sh` - Set up EAS credentials for iOS and Android
- `fix-keystore.sh` - Fix Android keystore signing issues
- `auto-fix-keystore.sh` - Automatically fix keystore problems
- `update-to-correct-keystore.sh` - Update to the correct keystore

**Keystore Verification:**
- `verify-keystore.sh` - Verify keystore configuration
- `check-keystore-sha1.sh` - Check SHA1 fingerprint of keystore
- `check-keystore-1.sh` through `check-keystore-5.sh` - Check individual keystore files

### 🍎 Apple-Specific Scripts

**Authentication:**
- `generate-apple-jwt.js` - Generate JWT for Apple Sign-In

## 📝 Usage

### Building for Production

**Android:**
```bash
./automations/build-and-submit-android.sh
```

**iOS:**
```bash
./automations/build-and-submit-ios.sh
```

**Both:**
```bash
./automations/build-and-submit-stores.sh
```

### Setting Up Credentials

```bash
./automations/setup-credentials.sh
```

### Fixing Keystore Issues

```bash
./automations/auto-fix-keystore.sh
```

### Checking Build Status

```bash
./automations/check-build-logs.sh
```

## 🔧 Prerequisites

- **Node.js** and **npm** installed
- **EAS CLI** installed (`npm install -g eas-cli`)
- **Expo CLI** installed (`npm install -g expo-cli`)
- Environment variables configured (see individual scripts for details)

## 📋 Required Environment Variables

Many scripts require environment variables to be set:

```bash
# For EAS builds
export EXPO_TOKEN="your-expo-token"

# For Confluence publishing (if applicable)
export CONFLUENCE_BASE_URL="https://your-domain.atlassian.net"
export CONFLUENCE_EMAIL="your-email@example.com"
export CONFLUENCE_API_TOKEN="your-api-token"
export CONFLUENCE_SPACE_KEY="DOC"
```

## 🛡️ Security Notes

- **Keystore files** (`.jks`) contain sensitive signing certificates
- **API keys** and tokens should be stored in environment variables, not in scripts
- Never commit credentials or keystores to version control
- Use `.gitignore` to exclude sensitive files

## 📚 Related Documentation

- Build guides: `help/Deployment/`
- Credentials setup: `help/Deployment/CREDENTIALS_SETUP.md`
- Android publishing: `help/Android/ANDROID_PUBLISHING.md`
- iOS publishing: `help/iOS/APP_STORE_PUBLISHING.md`

## 🔄 Script Maintenance

When updating scripts:
1. Test scripts in a development environment first
2. Document any new required environment variables
3. Update this README if adding new scripts
4. Ensure scripts are executable (`chmod +x script.sh`)

---

**Last Updated**: January 2025

