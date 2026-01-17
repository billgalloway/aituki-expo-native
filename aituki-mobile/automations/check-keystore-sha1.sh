#!/bin/bash

# Script to check SHA1 fingerprint of a keystore file
# Usage: ./check-keystore-sha1.sh [KEYSTORE_FILE]

set -e

cd "$(dirname "$0")"

EXPECTED_SHA1="88:4F:22:CA:57:80:9D:DF:4E:A0:C4:77:5C:76:0B:19:F4:37:5B:48"

if [ -z "$1" ]; then
    echo "🔍 Check Keystore SHA1 Fingerprint"
    echo "=================================="
    echo ""
    echo "Usage: ./check-keystore-sha1.sh [KEYSTORE_FILE]"
    echo ""
    echo "Example:"
    echo "  ./check-keystore-sha1.sh @billgalloway__aituki-native_OLD_4.jks"
    echo ""
    echo "Available keystore files:"
    ls -1 @billgalloway__aituki-native*.jks 2>/dev/null | while read file; do
        echo "  - $file"
    done
    echo ""
    echo "Expected SHA1: $EXPECTED_SHA1"
    exit 1
fi

KEYSTORE_FILE="$1"

if [ ! -f "$KEYSTORE_FILE" ]; then
    echo "❌ File not found: $KEYSTORE_FILE"
    exit 1
fi

echo "🔍 Checking SHA1 fingerprint for: $KEYSTORE_FILE"
echo ""
echo "You'll be prompted for the keystore password..."
echo ""

SHA1=$(keytool -list -v -keystore "$KEYSTORE_FILE" 2>/dev/null | grep -i "SHA1:" | head -1 | sed 's/.*SHA1: //' | tr -d ' ')

if [ -z "$SHA1" ]; then
    echo "❌ Could not read keystore (check password or file)"
    exit 1
fi

echo "SHA1 Fingerprint: $SHA1"
echo ""

# Format for comparison
SHA1_FORMATTED=$(echo "$SHA1" | tr '[:lower:]' '[:upper:]')
EXPECTED_FORMATTED=$(echo "$EXPECTED_SHA1" | tr '[:lower:]' '[:upper:]' | tr -d ':')

# Remove colons from SHA1 for comparison
SHA1_COMPARE=$(echo "$SHA1_FORMATTED" | tr -d ':')

if [ "$SHA1_COMPARE" = "$EXPECTED_FORMATTED" ]; then
    echo "✅ MATCH! This keystore has the correct SHA1 fingerprint."
    echo "   This is the keystore that matches Google Play Console."
else
    echo "❌ NO MATCH. This keystore does NOT have the correct SHA1."
    echo ""
    echo "   Expected: $EXPECTED_SHA1"
    echo "   Got:      $SHA1"
    echo ""
    echo "   Try another keystore file."
fi

