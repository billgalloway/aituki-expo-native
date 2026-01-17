#!/bin/bash

# Script to help set up credentials for App Store and Play Store submissions

echo "🔐 Setting up Store Credentials"
echo "================================"
echo ""

# Check EAS login
if ! eas whoami &>/dev/null; then
    echo "❌ Not logged into EAS. Please run: eas login"
    exit 1
fi

echo "✅ Logged into EAS"
echo ""

# Check Google Play service account key
if [ -f "./google-play-api-key.json" ]; then
    echo "✅ Google Play service account key found: ./google-play-api-key.json"
else
    echo "❌ Google Play service account key NOT found"
    echo "   Please download from Google Play Console and place at: ./google-play-api-key.json"
fi
echo ""

# Instructions for iOS credentials
echo "🍎 iOS (App Store) Credentials Setup:"
echo "====================================="
echo "Your app.json shows:"
echo "  - Bundle Identifier: com.aituki.mobile"
echo "  - Apple Team ID: J2HMNHZVM9"
echo "  - Apple ID: bill_galloway@icloud.com"
echo "  - ASC App ID: 6756360703"
echo ""
echo "To set up iOS credentials:"
echo "1. Run: eas credentials --platform ios"
echo "2. Select 'production' profile when prompted"
echo "3. EAS will guide you through:"
echo "   - Apple Developer Portal login"
echo "   - Distribution certificate setup"
echo "   - Provisioning profile setup"
echo ""
echo "Press Enter to continue to iOS setup, or Ctrl+C to skip..."
read -r
echo ""
eas credentials --platform ios

echo ""
echo ""

# Instructions for Android credentials
echo "🤖 Android (Play Store) Credentials Setup:"
echo "=========================================="
echo "Your app.json shows:"
echo "  - Package Name: com.aituki.mobile"
echo "  - Version Code: 12"
echo ""
echo "To set up Android credentials:"
echo "1. Run: eas credentials --platform android"
echo "2. Select 'production' profile when prompted"
echo "3. EAS will guide you through:"
echo "   - Keystore setup (or use existing)"
echo "   - Service account key (already configured in eas.json)"
echo ""
echo "Press Enter to continue to Android setup, or Ctrl+C to skip..."
read -r
echo ""
eas credentials --platform android

echo ""
echo "✅ Credentials setup complete!"
echo ""
echo "Next steps:"
echo "  - Run: ./build-and-submit-stores.sh both"
echo "  - Or build individually:"
echo "    ./build-and-submit-stores.sh ios"
echo "    ./build-and-submit-stores.sh android"

