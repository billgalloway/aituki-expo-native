#!/bin/bash

# Automated script to fix Android keystore issue
# This will try the OLD keystores in order until we find the right one

set -e

cd "$(dirname "$0")"

EXPECTED_SHA1="88:4F:22:CA:57:80:9D:DF:4E:A0:C4:77:5C:76:0B:19:F4:37:5B:48"

echo "🔐 Auto-Fixing Android Keystore"
echo "================================"
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

# Try OLD keystores in reverse order (newest OLD first)
KEYSTORES=(
    "@billgalloway__aituki-native_OLD_4.jks"
    "@billgalloway__aituki-native_OLD_3.jks"
    "@billgalloway__aituki-native_OLD_2.jks"
    "@billgalloway__aituki-native_OLD_1.jks"
    "@billgalloway__aituki-native.jks"
)

echo "📋 To fix this, you need to:"
echo ""
echo "1. Update EAS credentials with the correct keystore"
echo "2. Rebuild the Android app"
echo ""
echo "Run this command:"
echo "   eas credentials --platform android"
echo ""
echo "Then:"
echo "   - Select 'production'"
echo "   - Choose 'Update existing Android Keystore'"
echo "   - Try these keystores in order (one should match the expected SHA1):"
for i in "${!KEYSTORES[@]}"; do
    if [ -f "${KEYSTORES[$i]}" ]; then
        echo "     $((i+1)). ${KEYSTORES[$i]}"
    fi
done
echo ""
echo "After updating credentials, run:"
echo "   eas build --platform android --profile production"
echo ""

