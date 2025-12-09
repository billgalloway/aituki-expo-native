#!/bin/bash

# Build iOS Development Client for Expo Dev
# This builds a development client that can receive OTA updates
# Android builds remain unchanged

set -e

echo "🍎 Building iOS Development Client for Expo Dev..."
echo ""
echo "ℹ️  Note: This will only build iOS. Android builds are unaffected."
echo ""

# Navigate to project directory
cd "$(dirname "$0")"

# Check if logged in
if ! eas whoami &>/dev/null; then
    echo "❌ Not logged into EAS. Please run: eas login"
    exit 1
fi

echo "✅ Logged into EAS"
echo ""

# Verify project is configured for billgalloway account
PROJECT_INFO=$(eas project:info 2>/dev/null | grep "fullName" || echo "")
if [[ "$PROJECT_INFO" == *"@billgalloway"* ]]; then
    echo "✅ Project configured for billgalloway organization"
else
    echo "⚠️  Warning: Project may not be configured for billgalloway organization"
    echo "   Project info: $PROJECT_INFO"
fi
echo ""

echo "📦 Building iOS development client for SIMULATOR..."
echo "   This will take 10-20 minutes"
echo "   ✅ No Apple Developer credentials needed for simulator builds!"
echo ""

# Build iOS development client for simulator (no credentials needed)
eas build --platform ios --profile development

echo ""
echo "✅ iOS development client build started!"
echo ""
echo "Next steps:"
echo "1. Wait for build to complete (check status: eas build:list)"
echo "2. Install the development client on your iOS device/simulator"
echo "3. Publish updates with:"
echo "   eas update --branch development --platform ios --message 'Your update message'"
echo ""
echo "📱 The development client will automatically receive OTA updates"
echo "🤖 Android builds remain unchanged and unaffected"
echo ""

