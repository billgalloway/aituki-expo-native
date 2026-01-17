#!/bin/bash

# Build and Submit iOS App to App Store
# Account: billgalloway

set -e

echo "🚀 Building iOS app for production..."
echo ""

# Navigate to project directory
cd "$(dirname "$0")"

# Build for production
echo "Step 1: Building iOS app..."
eas build --platform ios --profile production

echo ""
echo "✅ Build completed!"
echo ""
echo "Step 2: Submitting to App Store..."
echo "Note: Make sure you have:"
echo "  - Apple Developer account configured"
echo "  - App Store Connect app created with bundle ID: com.aituki.mobile"
echo "  - Apple credentials configured in eas.json (optional for auto-submit)"
echo ""

# Submit to App Store
# If Apple credentials are configured, this will auto-submit
# Otherwise, you'll need to manually upload from the build page
eas submit --platform ios --latest

echo ""
echo "✅ Submission completed!"
echo ""
echo "Next steps:"
echo "1. Check build status: eas build:list"
echo "2. View build details: eas build:view [BUILD_ID]"
echo "3. If auto-submit didn't work, manually upload from:"
echo "   https://expo.dev/accounts/billgalloway/projects/aituki-mobile/builds"
echo "4. Complete store listing in App Store Connect if not already done"
echo ""

