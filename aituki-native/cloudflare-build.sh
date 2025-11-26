#!/bin/bash
# Cloudflare Pages build script
# This script builds the Expo web app and then deploys it

set -e

echo "Building Expo web app..."
npm run build

echo "Deploying to Cloudflare Pages..."
npx wrangler deploy

