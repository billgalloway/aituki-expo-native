# Help Documentation

This folder contains all documentation for the AiTuki mobile app, organized by category.

## 📱 Platform-Specific Guides

### Android
- [Android Quick Start](Android/ANDROID_QUICK_START.md) - Get started with Android development
- [Android Emulator Setup](Android/ANDROID_EMULATOR_SETUP.md) - Set up Android emulators for testing
- [Android Build Ready](Android/ANDROID_BUILD_READY.md) - Build preparation checklist
- [Android Publishing](Android/ANDROID_PUBLISHING.md) - How to publish to Google Play Store
- [Android Build Troubleshooting](Android/ANDROID_BUILD_TROUBLESHOOTING.md) - Common build issues
- [Google Play Service Account Setup](Android/GOOGLE_PLAY_SERVICE_ACCOUNT_SETUP.md) - Configure service accounts
- [Fix Service Account Permissions](Android/FIX_SERVICE_ACCOUNT_PERMISSIONS.md) - Troubleshoot permissions
- [Play Console Warnings Fix](Android/PLAY_CONSOLE_WARNINGS_FIX.md) - Fix common Play Console issues
- [How to Download AAB](Android/HOW_TO_DOWNLOAD_AAB.md) - Download app bundles
- [Gradle Error Diagnosis](Android/GRADLE_ERROR_DIAGNOSIS.md) - Fix Gradle build errors
- [Simple Keystore Fix](Android/SIMPLE_KEYSTORE_FIX.md) - Simple keystore troubleshooting guide
- [Try Keystore Fix](Android/TRY_KEYSTORE_FIX.md) - Alternative keystore fix approach
- [Update Keystore Instructions](Android/update-keystore-instructions.md) - Update keystore configuration

### iOS
- [iOS Expo Dev Guide](iOS/IOS_EXPO_DEV_GUIDE.md) - Development setup for iOS
- [iOS Expo Dev Status](iOS/IOS_EXPO_DEV_STATUS.md) - Development status tracking
- [Apple Sign-In Checklist](iOS/APPLE_SIGNIN_CHECKLIST.md) - Complete Apple Sign-In checklist
- [Apple JWT Generation](iOS/APPLE_JWT_GENERATION.md) - Generate JWT for Apple Sign-In
- [Apple Sign-In Troubleshooting](iOS/APPLE_SIGNIN_TROUBLESHOOTING.md) - Fix Apple Sign-In issues
- [iOS App Store Setup](iOS/IOS_APP_STORE_SETUP.md) - Configure App Store Connect
- [App Store Publishing](iOS/APP_STORE_PUBLISHING.md) - Publish to App Store
- [TestFlight Distribution](iOS/TESTFLIGHT_DISTRIBUTION.md) - Distribute via TestFlight
- [Push iOS Production](iOS/PUSH_IOS_PRODUCTION.md) - Push production builds to App Store

## 🔌 Integrations

### Authentication
- [Supabase Auth Setup](Integrations/SUPABASE_AUTH_SETUP.md) - Complete Supabase authentication guide
- [Google Sign-In Setup](Integrations/GOOGLE_SIGNIN_SETUP.md) - Configure Google Sign-In
- [Google OAuth Troubleshooting](Integrations/GOOGLE_OAUTH_TROUBLESHOOTING.md) - Fix Google OAuth issues
- [Email Configuration](Integrations/EMAIL_CONFIGURATION.md) - Set up email confirmations
- [Testing Email Auth](Integrations/TESTING_EMAIL_AUTH.md) - Test email authentication

### Third-Party Services
- [OpenAI Setup](Integrations/OPENAI_SETUP.md) - Configure OpenAI chat integration
- [Contentful Setup](Integrations/CONTENTFUL_SETUP.md) - Set up Contentful CMS
- [Contentful Troubleshooting](Integrations/CONTENTFUL_TROUBLESHOOTING.md) - Fix Contentful issues
- [Supabase Chart Data Setup](Integrations/SUPABASE_CHART_DATA_SETUP.md) - Set up Supabase for chart data integration

## 🚀 Deployment

- [Quick Start Publishing](Deployment/QUICK_START_PUBLISHING.md) - Quick publishing guide
- [First Submission Guide](Deployment/FIRST_SUBMISSION_GUIDE.md) - First time publishing
- [Quick Submit Guide](Deployment/QUICK_SUBMIT_GUIDE.md) - Fast submission process
- [Credentials Setup](Deployment/CREDENTIALS_SETUP.md) - Set up build and deployment credentials
- [Expo Dev Deployment Review](Deployment/EXPO_DEV_DEPLOYMENT_REVIEW.md) - Expo dev deployment
- [Manual Upload Guide](Deployment/MANUAL_UPLOAD_GUIDE.md) - Manual app upload process
- [Upload Instructions](Deployment/UPLOAD_INSTRUCTIONS.md) - General upload instructions

## 📚 General Documentation

### Authentication
- [Authentication Implementation](General/AUTHENTICATION_IMPLEMENTATION.md) - Implementation details
- [Authentication Plan](General/AUTHENTICATION_PLAN.md) - Authentication roadmap

### Build & Development
- [Build Steps](General/BUILD_STEPS.md) - Step-by-step build process
- [Build Status](General/BUILD_STATUS.md) - Track build status
- [Build Error Analysis](General/BUILD_ERROR_ANALYSIS.md) - Analyze build errors
- [Check Build Error](General/CHECK_BUILD_ERROR.md) - Debug build issues
- [Fix React Version](General/FIX_REACT_VERSION.md) - Fix React version conflicts

### Architecture & Design
- [Chat Architecture](General/CHAT_ARCHITECTURE.md) - Chat interface architecture and design
- [Supabase Image Storage](General/SUPABASE_IMAGE_STORAGE.md) - Image storage setup with Supabase
- [Upload Data Images](General/UPLOAD_DATA_IMAGES.md) - Guide for uploading data images

### Other
- [Imagery Fix Summary](General/IMAGERY_FIX_SUMMARY.md) - Image-related fixes

## 📤 Publishing to Confluence

- [Confluence Setup](CONFLUENCE_SETUP.md) - Push documentation to Confluence

To push all documentation to Confluence, run:

```bash
export CONFLUENCE_BASE_URL="https://your-domain.atlassian.net"
export CONFLUENCE_EMAIL="your-email@example.com"
export CONFLUENCE_API_TOKEN="your-api-token"
export CONFLUENCE_SPACE_KEY="DOC"
node scripts/push-to-confluence.js
```

## Quick Links

### Getting Started
1. Choose your platform: [Android Quick Start](Android/ANDROID_QUICK_START.md) or [iOS Expo Dev Guide](iOS/IOS_EXPO_DEV_GUIDE.md)
2. Set up authentication: [Supabase Auth Setup](Integrations/SUPABASE_AUTH_SETUP.md)
3. Configure integrations: [OpenAI Setup](Integrations/OPENAI_SETUP.md) | [Contentful Setup](Integrations/CONTENTFUL_SETUP.md)

### Publishing
- Android: [Android Publishing](Android/ANDROID_PUBLISHING.md) | [Credentials Setup](Deployment/CREDENTIALS_SETUP.md)
- iOS: [App Store Publishing](iOS/APP_STORE_PUBLISHING.md) | [Push iOS Production](iOS/PUSH_IOS_PRODUCTION.md)

### Troubleshooting
- [Android Build Troubleshooting](Android/ANDROID_BUILD_TROUBLESHOOTING.md) | [Simple Keystore Fix](Android/SIMPLE_KEYSTORE_FIX.md)
- [Google OAuth Troubleshooting](Integrations/GOOGLE_OAUTH_TROUBLESHOOTING.md)
- [Apple Sign-In Troubleshooting](iOS/APPLE_SIGNIN_TROUBLESHOOTING.md)
- [Contentful Troubleshooting](Integrations/CONTENTFUL_TROUBLESHOOTING.md)

### Chart Data & Integrations
- [Supabase Chart Data Setup](Integrations/SUPABASE_CHART_DATA_SETUP.md) - Set up chart data from Supabase

---

**Note:** Keep `README.md` in the project root for general project information.
