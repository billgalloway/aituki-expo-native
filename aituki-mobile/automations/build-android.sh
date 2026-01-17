#!/bin/bash

# Script to build Android app for Play Store
# Usage: ./build-android.sh [preview|production]

PROFILE=${1:-preview}

echo "🤖 Building Android app..."
echo "   Profile: $PROFILE"
echo ""

# Check if logged in
if ! eas whoami &>/dev/null; then
    echo "❌ Not logged into EAS. Please run: eas login"
    exit 1
fi

echo "✅ Logged into EAS"
echo ""

if [ "$PROFILE" = "production" ]; then
    echo "📦 Building App Bundle (AAB) for Play Store..."
    echo "   This will take 10-20 minutes"
    echo ""
    eas build --platform android --profile production
else
    echo "📦 Building APK for testing..."
    echo "   This will take 10-20 minutes"
    echo ""
    eas build --platform android --profile preview
fi

echo ""
echo "✅ Build started! Check status with: eas build:list"
echo "📱 Once complete, submit with: eas submit --platform android --latest"

