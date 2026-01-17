#!/bin/bash

# Script to fix Android keystore signing issue
# Expected SHA1: 88:4F:22:CA:57:80:9D:DF:4E:A0:C4:77:5C:76:0B:19:F4:37:5B:48

set -e

cd "$(dirname "$0")"

echo "🔐 Fixing Android Keystore Issue"
echo "================================"
echo ""
echo "Expected SHA1 fingerprint:"
echo "88:4F:22:CA:57:80:9D:DF:4E:A0:C4:77:5C:76:0B:19:F4:37:5B:48"
echo ""
echo "Current SHA1 fingerprint (from build):"
echo "76:84:BA:F3:63:A7:52:76:A5:EA:E8:FB:02:F3:03:92:9C:2B:46:52"
echo ""

# Check if logged in
if ! eas whoami &>/dev/null; then
    echo "❌ Not logged into EAS. Please run: eas login"
    exit 1
fi

echo "✅ Logged into EAS"
echo ""

# List available keystore files
echo "📁 Available keystore files:"
ls -lh @billgalloway__aituki-native*.jks 2>/dev/null | awk '{print "  - " $9 " (" $5 ")"}'
echo ""

echo "🔍 To find the correct keystore, you'll need to check each one's SHA1 fingerprint."
echo "   Run this command for each keystore file:"
echo ""
echo "   keytool -list -v -keystore [KEYSTORE_FILE] | grep SHA1"
echo ""
echo "   Look for the one that matches: 88:4F:22:CA:57:80:9D:DF:4E:A0:C4:77:5C:76:0B:19:F4:37:5B:48"
echo ""

# Prompt for keystore file
echo "Which keystore file has the correct SHA1 fingerprint?"
echo "Enter the filename (e.g., @billgalloway__aituki-native_OLD_4.jks):"
read -r KEYSTORE_FILE

if [ ! -f "$KEYSTORE_FILE" ]; then
    echo "❌ File not found: $KEYSTORE_FILE"
    exit 1
fi

echo ""
echo "✅ Found keystore: $KEYSTORE_FILE"
echo ""
echo "📤 Now updating EAS credentials..."
echo "   You'll be prompted to:"
echo "   1. Select 'production' profile"
echo "   2. Choose to update existing keystore"
echo "   3. Provide the keystore file path: $KEYSTORE_FILE"
echo "   4. Enter keystore password"
echo "   5. Enter key alias (usually: @billgalloway__aituki-native)"
echo "   6. Enter key password"
echo ""
echo "Press Enter to continue..."
read -r

# Update EAS credentials
eas credentials --platform android

echo ""
echo "✅ Credentials updated!"
echo ""
echo "🔄 Rebuilding Android app with correct keystore..."
echo ""

# Rebuild
eas build --platform android --profile production

echo ""
echo "✅ Build started with correct keystore!"
echo "   Check status: eas build:list"
echo ""

