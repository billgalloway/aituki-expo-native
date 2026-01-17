#!/bin/bash

# Script to build and submit iOS production build to App Store

echo "🍎 iOS Production Build and Submit"
echo "===================================="
echo ""

# Check if logged in
if ! eas whoami &>/dev/null; then
    echo "❌ Not logged into EAS. Please run: eas login"
    exit 1
fi

echo "✅ Logged into EAS"
echo ""

# Check if credentials are configured
echo "ℹ️  Checking iOS credentials..."
echo ""
echo "If credentials are not set up, you'll be prompted to:"
echo "  1. Log in to your Apple Developer account"
echo "  2. Configure certificates and provisioning profiles"
echo ""
echo "Press Enter to continue with the build, or Ctrl+C to set up credentials first..."
echo "   (Run: eas credentials --platform ios)"
read -r
echo ""

echo "📦 Building iOS app for App Store..."
echo "   This will take 10-20 minutes"
echo "   Profile: production"
echo "   Bundle ID: com.aituki.mobile"
echo ""

# Build iOS production
eas build --platform ios --profile production

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ iOS build complete!"
    echo ""
    echo "📤 Would you like to submit to App Store now? (y/n)"
    read -r SUBMIT
    
    if [[ "$SUBMIT" == "y" || "$SUBMIT" == "Y" ]]; then
        echo ""
        echo "📤 Submitting to App Store..."
        echo ""
        
        eas submit --platform ios --latest --profile production
        
        if [ $? -eq 0 ]; then
            echo ""
            echo "✅ iOS app submitted to App Store!"
            echo ""
            echo "📱 Check App Store Connect: https://appstoreconnect.apple.com"
            echo "   App ID: 6756360703"
        else
            echo ""
            echo "❌ Failed to submit. Check errors above."
            echo "   You can submit manually later with:"
            echo "   eas submit --platform ios --latest"
        fi
    else
        echo ""
        echo "✅ Build complete! Submit later with:"
        echo "   eas submit --platform ios --latest"
    fi
else
    echo ""
    echo "❌ Build failed. Check errors above."
    echo ""
    echo "Common issues:"
    echo "  - Credentials not set up: Run 'eas credentials --platform ios'"
    echo "  - Apple account access: Ensure you have access to Team ID J2HMNHZVM9"
    echo "  - Check build status: eas build:list"
fi

echo ""
echo "📊 View builds: https://expo.dev/accounts/billgalloway/projects/aituki-native/builds"

