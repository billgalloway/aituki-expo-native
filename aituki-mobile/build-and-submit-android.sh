#!/bin/bash

# Build and Submit Android App to Google Play Store
# Account: bill.galloway7@gmail.com

set -e

echo "🚀 Building Android app for production (AAB format)..."
echo ""

# Navigate to project directory
cd "$(dirname "$0")"

# Build for production (creates AAB file required for Play Store)
echo "Step 1: Building Android App Bundle..."
eas build --platform android --profile production

echo ""
echo "✅ Build completed!"
echo ""
echo "Step 2: Submitting to Google Play Store..."
echo "Note: Make sure you have:"
echo "  - Google Play Developer account (bill.galloway7@gmail.com)"
echo "  - Service account key configured in eas.json (optional for auto-submit)"
echo "  - App created in Play Console with package name: com.aituki.mobile"
echo ""

# Submit to Play Store
# If service account is configured, this will auto-submit
# Otherwise, you'll need to manually upload the AAB from the build page
eas submit --platform android --latest

echo ""
echo "✅ Submission completed!"
echo ""
echo "Next steps:"
echo "1. Check build status: eas build:list"
echo "2. View build details: eas build:view [BUILD_ID]"
echo "3. If auto-submit didn't work, manually upload the AAB from:"
echo "   https://expo.dev/accounts/billgalloway/projects/aituki-mobile/builds"
echo "4. Complete store listing in Play Console if not already done"
echo ""

