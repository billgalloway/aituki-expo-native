#!/bin/bash

# Script to build and submit to Apple App Store and Google Play Store
# Usage: ./build-and-submit-stores.sh [ios|android|both]

PLATFORM=${1:-both}

echo "🚀 Building and Submitting to Stores"
echo "   Platform: $PLATFORM"
echo ""

# Check if logged in
if ! eas whoami &>/dev/null; then
    echo "❌ Not logged into EAS. Please run: eas login"
    exit 1
fi

echo "✅ Logged into EAS"
echo ""

# Check for Google Play service account key
if [[ "$PLATFORM" == "android" || "$PLATFORM" == "both" ]]; then
    if [ ! -f "./google-play-api-key.json" ]; then
        echo "⚠️  Warning: Google Play service account key not found at ./google-play-api-key.json"
        echo "   Android submission will be skipped. Please add the key file to continue."
        echo ""
        ANDROID_SKIP=true
    else
        echo "✅ Google Play service account key found"
        ANDROID_SKIP=false
    fi
    echo ""
fi

# Build and submit iOS
if [[ "$PLATFORM" == "ios" || "$PLATFORM" == "both" ]]; then
    echo "🍎 Building iOS app for App Store..."
    echo "   This will take 10-20 minutes"
    echo ""
    
    eas build --platform ios --profile production --non-interactive
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ iOS build complete!"
        echo "📤 Submitting to App Store..."
        echo ""
        
        eas submit --platform ios --latest --profile production --non-interactive
        
        if [ $? -eq 0 ]; then
            echo ""
            echo "✅ iOS app submitted to App Store!"
        else
            echo ""
            echo "❌ Failed to submit iOS app. Check errors above."
        fi
    else
        echo ""
        echo "❌ iOS build failed. Check errors above."
    fi
    echo ""
fi

# Build and submit Android
if [[ "$PLATFORM" == "android" || "$PLATFORM" == "both" ]]; then
    if [ "$ANDROID_SKIP" = false ]; then
        echo "🤖 Building Android app for Play Store..."
        echo "   This will take 10-20 minutes"
        echo ""
        
        eas build --platform android --profile production --non-interactive
        
        if [ $? -eq 0 ]; then
            echo ""
            echo "✅ Android build complete!"
            echo "📤 Submitting to Google Play Store (Internal track)..."
            echo ""
            
            eas submit --platform android --latest --profile production --non-interactive
            
            if [ $? -eq 0 ]; then
                echo ""
                echo "✅ Android app submitted to Google Play Store!"
            else
                echo ""
                echo "❌ Failed to submit Android app. Check errors above."
            fi
        else
            echo ""
            echo "❌ Android build failed. Check errors above."
        fi
        echo ""
    else
        echo "⏭️  Skipping Android build (service account key missing)"
        echo ""
    fi
fi

echo "🎉 Done! Check your builds:"
echo "   iOS: https://expo.dev/accounts/billgalloway/projects/aituki-native/builds"
echo "   Android: https://expo.dev/accounts/billgalloway/projects/aituki-native/builds"
echo ""

