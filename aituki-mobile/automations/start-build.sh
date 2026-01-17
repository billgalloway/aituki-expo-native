#!/bin/bash

# Script to start iOS build for TestFlight
# Run this after logging into EAS

echo "🚀 Starting iOS build for TestFlight..."
echo ""

# Check if logged in
if ! eas whoami &>/dev/null; then
    echo "❌ Not logged into EAS. Please run: eas login"
    exit 1
fi

echo "✅ Logged into EAS"
echo ""
echo "📦 Starting build..."
echo "   This will take 10-20 minutes"
echo ""

# Start the build
eas build --platform ios --profile preview

echo ""
echo "✅ Build started! Check status with: eas build:list"
echo "📱 Once complete, submit to TestFlight with: eas submit --platform ios --latest"

