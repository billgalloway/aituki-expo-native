#!/bin/bash

# Script to verify the current keystore configuration

set -e

cd "$(dirname "$0")"

EXPECTED_SHA1="88:4F:22:CA:57:80:9D:DF:4E:A0:C4:77:5C:76:0B:19:F4:37:5B:48"
CURRENT_SHA1="76:84:BA:F3:63:A7:52:76:A5:EA:E8:FB:02:F3:03:92:9C:2B:46:52"

echo "🔍 Verifying Android Keystore Configuration"
echo "==========================================="
echo ""
echo "Expected SHA1 (from Google Play):"
echo "  $EXPECTED_SHA1"
echo ""
echo "Current SHA1 (from last build):"
echo "  $CURRENT_SHA1"
echo ""

# Check if logged in
if ! eas whoami &>/dev/null; then
    echo "❌ Not logged into EAS. Please run: eas login"
    exit 1
fi

echo "✅ Logged into EAS"
echo ""

echo "📋 To verify the keystore configuration:"
echo ""
echo "1. Check what keystore is currently configured in EAS:"
echo "   Run: eas credentials --platform android"
echo "   Select: production"
echo "   View: Keystore Configuration (should show the keystore file name)"
echo ""
echo "2. Verify the keystore file has the correct SHA1:"
echo ""
echo "   For each keystore file, check its SHA1:"
for keystore in @billgalloway__aituki-native*.jks; do
    echo "     keytool -list -v -keystore \"$keystore\" | grep SHA1"
done
echo ""
echo "   Look for the one that matches: $EXPECTED_SHA1"
echo ""
echo "3. Quick test - Build a new version to verify:"
echo "   eas build --platform android --profile production"
echo "   Then upload to Google Play and check if it accepts it"
echo ""

# Try to get info about current credentials (may not work non-interactively)
echo "📊 Current Build Information:"
echo ""
eas build:list --platform android --limit 1 2>&1 | grep -E "(Build|Status|Profile|Version|Build number)" || echo "   Run: eas build:list --platform android --limit 1"
echo ""

echo "💡 To check the actual keystore being used:"
echo "   The easiest way is to:"
echo "   1. Note which keystore file you selected when updating credentials"
echo "   2. Verify that file's SHA1 matches the expected: $EXPECTED_SHA1"
echo "   3. Or rebuild and check if Google Play accepts the new build"
echo ""

