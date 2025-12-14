# Manual Upload to Google Play Store - Quick Guide

## Your Build is Ready!

- **AAB File:** https://expo.dev/artifacts/eas/ssyV4fGJWan1ZHPWTfBm9c.aab
- **Version:** 1.0.2
- **Version Code:** 1
- **Package Name:** com.aituki.mobile

## Step-by-Step Manual Upload

### Step 1: Download the AAB File
1. Click this link: https://expo.dev/artifacts/eas/ssyV4fGJWan1ZHPWTfBm9c.aab
2. The file will download to your computer
3. Note where it's saved (usually in your Downloads folder)

### Step 2: Go to Google Play Console
1. Go to: https://play.google.com/console
2. Sign in with: **bill.galloway7@gmail.com**

### Step 3: Create App (If It Doesn't Exist)
1. Click **"Create app"** or **"Add new app"** button
2. Fill in:
   - **App name:** AiTuki
   - **Default language:** English (United States)
   - **App or game:** App
   - **Free or paid:** Free
3. Click **"Create"**

### Step 4: Upload Your Build
1. In the left sidebar, click **"Internal testing"** (or "Production" if you want to go straight to production)
2. Click **"Create new release"** or **"New release"**
3. Under **"App bundles"**, click **"Upload"**
4. Select the downloaded `.aab` file
5. Wait for upload to complete

### Step 5: Add Release Notes
1. In the **"Release notes"** section, add:
   ```
   Version 1.0.2
   - Updated app icons
   - Bug fixes and improvements
   ```
   (Or write your own release notes)

### Step 6: Review and Publish
1. Click **"Save"** at the bottom
2. Review the release
3. Click **"Review release"**
4. Click **"Start rollout to Internal testing"** (or "Start rollout to Production")

## That's It!

Your app will be submitted and Google will review it. For Internal testing, it's usually available immediately to your testers.

## Troubleshooting

**Can't find "Create app"?**
- Make sure you're on the main Play Console dashboard
- Look for a big button that says "Create app" or "Add new app"

**App already exists?**
- Just go directly to Step 4 and upload to the existing app

**Need help?**
- Check: https://support.google.com/googleplay/android-developer

