#!/bin/bash

# Script to update EAS credentials to use the correct keystore
# Expected SHA1: 88:4F:22:CA:57:80:9D:DF:4E:A0:C4:77:5C:76:0B:19:F4:37:5B:48

set -e

cd "$(dirname "$0")"

EXPECTED_SHA1="88:4F:22:CA:57:80:9D:DF:4E:A0:C4:77:5C:76:0B:19:F4:37:5B:48"

echo "🔐 Update Android Keystore to Correct Certificate"
echo "=================================================="
echo ""
echo "Expected SHA1: $EXPECTED_SHA1"
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
KEYSTORES=($(ls -1 @billgalloway__aituki-native*.jks 2>/dev/null))
for i in "${!KEYSTORES[@]}"; do
    echo "  $((i+1)). ${KEYSTORES[$i]}"
done
echo ""

echo "🔍 To find the correct keystore, check each one's SHA1 fingerprint:"
echo ""
echo "   Run this command for each keystore (you'll need the password):"
for keystore in "${KEYSTORES[@]}"; do
    echo "     ./check-keystore-sha1.sh $keystore"
done
echo ""
echo "   Look for the one that shows: ✅ MATCH!"
echo ""

echo "📤 Once you identify the correct keystore, update EAS credentials:"
echo ""
echo "   eas credentials --platform android"
echo ""
echo "   When prompted:"
echo "   1. Select 'production' profile"
echo "   2. Choose 'Update existing Android Keystore' or 'Set up a new Android Keystore'"
echo "   3. Select the keystore file with SHA1: $EXPECTED_SHA1"
echo "   4. Enter keystore password"
echo "   5. Key alias: @billgalloway__aituki-native"
echo "   6. Enter key password"
echo ""
echo "Then rebuild:"
echo "   eas build --platform android --profile production"
echo ""

