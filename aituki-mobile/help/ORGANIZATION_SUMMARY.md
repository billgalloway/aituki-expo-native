# Documentation Organization Summary

This document summarizes the organization of all help documentation files.

## 📁 Folder Structure

All documentation is organized in the `help/` directory with the following structure:

```
help/
├── Android/              (15 files)
├── iOS/                  (12 files)
├── Integrations/         (9 files)
├── Deployment/           (9 files)
├── General/              (11 files)
├── README.md            (Main index)
├── CONFLUENCE_SETUP.md  (Confluence publishing guide)
└── ORGANIZATION_SUMMARY.md (This file)
```

## 📋 Files by Category

### Android (15 files)
- ANDROID_BUILD_READY.md
- ANDROID_BUILD_TROUBLESHOOTING.md
- ANDROID_EMULATOR_SETUP.md
- ANDROID_PUBLISHING.md
- ANDROID_QUICK_START.md
- FIX_SERVICE_ACCOUNT_PERMISSIONS.md
- GOOGLE_PLAY_SERVICE_ACCOUNT_SETUP.md
- GRADLE_ERROR_DIAGNOSIS.md
- HOW_TO_DOWNLOAD_AAB.md
- PLAY_CONSOLE_WARNINGS_FIX.md
- SIMPLE_KEYSTORE_FIX.md (moved from root)
- TRY_KEYSTORE_FIX.md (moved from root)
- update-keystore-instructions.md (moved from root)

### iOS (12 files)
- APP_STORE_PUBLISHING.md
- APPLE_JWT_GENERATION.md
- APPLE_SIGNIN_CHECKLIST.md
- APPLE_SIGNIN_TROUBLESHOOTING.md
- IOS_APP_STORE_SETUP.md
- IOS_EXPO_DEV_GUIDE.md
- IOS_EXPO_DEV_STATUS.md
- PUSH_IOS_PRODUCTION.md (moved from root)
- TESTFLIGHT_DISTRIBUTION.md

### Integrations (9 files)
- CONTENTFUL_SETUP.md
- CONTENTFUL_TROUBLESHOOTING.md
- EMAIL_CONFIGURATION.md
- GOOGLE_OAUTH_TROUBLESHOOTING.md
- GOOGLE_SIGNIN_SETUP.md
- OPENAI_SETUP.md
- SUPABASE_AUTH_SETUP.md
- SUPABASE_CHART_DATA_SETUP.md (moved from root)
- TESTING_EMAIL_AUTH.md

### Deployment (9 files)
- CREDENTIALS_SETUP.md (moved from root)
- EXPO_DEV_DEPLOYMENT_REVIEW.md
- FIRST_SUBMISSION_GUIDE.md
- MANUAL_UPLOAD_GUIDE.md
- QUICK_START_PUBLISHING.md
- QUICK_SUBMIT_GUIDE.md
- UPLOAD_INSTRUCTIONS.md

### General (11 files)
- AUTHENTICATION_IMPLEMENTATION.md
- AUTHENTICATION_PLAN.md
- BUILD_ERROR_ANALYSIS.md
- BUILD_STATUS.md
- BUILD_STEPS.md
- CHAT_ARCHITECTURE.md (moved from root)
- CHECK_BUILD_ERROR.md
- FIX_REACT_VERSION.md
- IMAGERY_FIX_SUMMARY.md
- SUPABASE_IMAGE_STORAGE.md
- UPLOAD_DATA_IMAGES.md (moved from root)

## 🔄 Files Moved from Root

The following files were moved from the project root to their appropriate folders:

1. `SUPABASE_CHART_DATA_SETUP.md` → `help/Integrations/`
2. `CREDENTIALS_SETUP.md` → `help/Deployment/`
3. `PUSH_IOS_PRODUCTION.md` → `help/iOS/`
4. `TRY_KEYSTORE_FIX.md` → `help/Android/`
5. `SIMPLE_KEYSTORE_FIX.md` → `help/Android/`
6. `update-keystore-instructions.md` → `help/Android/`
7. `UPLOAD_DATA_IMAGES.md` → `help/General/`
8. `CHAT_ARCHITECTURE.md` → `help/General/`

## 📤 Confluence Publishing

The Confluence script (`scripts/push-to-confluence.js`) automatically processes all `.md` files in each category folder. It:

- Filters out `.local` files (ignored for Confluence)
- Creates category pages for each folder (Android, iOS, Integrations, Deployment, General)
- Uploads all markdown files as Confluence pages
- Updates existing pages if they already exist

To publish to Confluence:

```bash
export CONFLUENCE_BASE_URL="https://your-domain.atlassian.net"
export CONFLUENCE_EMAIL="your-email@example.com"
export CONFLUENCE_API_TOKEN="your-api-token"
export CONFLUENCE_SPACE_KEY="DOC"
node scripts/push-to-confluence.js
```

## ✅ Organization Complete

All documentation files are now properly organized and ready for:
- Easy navigation via `help/README.md`
- Automatic Confluence publishing via the script
- Clear categorization by platform and topic

---

**Last Updated:** January 2025

