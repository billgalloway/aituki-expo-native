#!/bin/bash

# Script to check Android build logs and identify errors

echo "🔍 Checking Android build logs..."
echo ""

# List recent builds
echo "Recent Android builds:"
echo "===================="
eas build:list --platform android --limit 5

echo ""
echo "📋 To view detailed logs for a specific build, run:"
echo "   eas build:view [BUILD_ID] --platform android"
echo ""
echo "Or visit: https://expo.dev/accounts/billgalloway/projects/aituki-mobile/builds"
echo ""

