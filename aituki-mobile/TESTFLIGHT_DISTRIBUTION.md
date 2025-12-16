# TestFlight Distribution Guide

## Quick Overview

TestFlight allows you to distribute your iOS app to up to 10,000 external testers and unlimited internal testers before it goes live on the App Store.

## Step 1: Upload Build to TestFlight

### Option A: Using EAS Submit (Automated)

If you have App Store Connect API key set up:

```bash
cd "/Users/billgalloway/Local Sites/Figma/expo-dev/my-expo-app/aituki-mobile"
eas submit --platform ios --latest
```

### Option B: Manual Upload (Recommended for First Time)

1. **Download the IPA file:**
   - URL: https://expo.dev/artifacts/eas/a4WdkeWzCJcEUxDoyUE8yX.ipa
   - Or download from: https://expo.dev/accounts/billgalloway/projects/aituki-native/builds/496ee392-fce5-4fe6-973d-1cde73a605a3

2. **Upload using Transporter:**
   - Download **Transporter** from Mac App Store (free)
   - Open Transporter
   - Sign in with: `bill_galloway@icloud.com`
   - Drag and drop the `.ipa` file
   - Click **"Deliver"**
   - Wait for upload to complete (5-10 minutes)

3. **Or upload using Xcode:**
   - Open Xcode
   - Window → Organizer
   - Click **"+"** → **"Distribute App"**
   - Select the `.ipa` file
   - Choose **"App Store Connect"**
   - Follow the prompts

## Step 2: Process Build in App Store Connect

1. **Go to App Store Connect:**
   - https://appstoreconnect.apple.com
   - Sign in with `bill_galloway@icloud.com`

2. **Navigate to your app:**
   - Click **"My Apps"**
   - Select **AiTuki**

3. **Go to TestFlight:**
   - Click **"TestFlight"** in the left sidebar
   - Wait for the build to process (10-30 minutes)
   - You'll see it under **"iOS Builds"**

4. **Add build information (if required):**
   - Click on the build
   - Add **"What to Test"** notes (optional but recommended)
   - Example: "Version 2 - Fixed accent color errors, bug fixes"

## Step 3: Set Up Internal Testing (Unlimited Testers)

**Internal Testers:** Members of your App Store Connect team (up to 100 people)

1. **In TestFlight, go to "Internal Testing"**
2. **Create a new group (or use default):**
   - Click **"+"** next to "Internal Groups"
   - Name: "Internal Testers" or "Team"
   - Click **"Create"**

3. **Add the build:**
   - Click on your group
   - Click **"+"** next to "Builds"
   - Select your build (Version 2, Build 2)
   - Click **"Add"**

4. **Add testers:**
   - Go to **"Users and Access"** in App Store Connect
   - Add team members (they'll automatically get access)
   - Or in TestFlight → Internal Testing → Your Group → **"+"** → Add email addresses

## Step 4: Set Up External Testing (Up to 10,000 Testers)

**External Testers:** Anyone with an email address (requires App Review for first build)

1. **In TestFlight, go to "External Testing"**
2. **Create a new group:**
   - Click **"+"** next to "External Groups"
   - Name: "Beta Testers" or "External Testers"
   - Click **"Create"**

3. **Add the build:**
   - Click on your group
   - Click **"+"** next to "Builds"
   - Select your build
   - Click **"Add"**

4. **Add test information:**
   - **"What to Test"** - Describe what testers should focus on
   - **"Feedback Email"** - Where testers send feedback
   - **"Description"** - Brief description of the build

5. **Submit for Beta App Review (First Time Only):**
   - Click **"Submit for Review"**
   - Fill in any required information
   - Submit (takes 24-48 hours for first review)

6. **Add testers:**
   - Click **"+"** next to "Testers"
   - Add email addresses (one per line or comma-separated)
   - Click **"Add"**
   - Testers will receive an email invitation

## Step 5: Testers Install TestFlight

1. **Testers need to:**
   - Install **TestFlight** app from App Store (free)
   - Accept the email invitation
   - Open TestFlight app
   - Tap **"Accept"** on your app
   - Tap **"Install"** to download your app

## Quick Commands

### Upload Build
```bash
# Automated (requires API key)
eas submit --platform ios --latest

# Or download and use Transporter manually
```

### Check Build Status
- App Store Connect → Your App → TestFlight → iOS Builds

## Current Build Ready for TestFlight

- **Build ID:** 496ee392-fce5-4fe6-973d-1cde73a605a3
- **Version:** 2
- **Build Number:** 2
- **IPA URL:** https://expo.dev/artifacts/eas/a4WdkeWzCJcEUxDoyUE8yX.ipa

## Tips

1. **Internal Testing** - No review needed, instant access for team members
2. **External Testing** - Requires review for first build, then instant for updates
3. **Build Expires** - TestFlight builds expire after 90 days
4. **Multiple Groups** - Create different groups for different testing phases
5. **Feedback** - Testers can send feedback directly from TestFlight app

## Troubleshooting

**Build not showing up?**
- Wait 10-30 minutes for processing
- Check email for any issues
- Verify bundle ID matches: `com.aituki.mobile`

**Can't add testers?**
- For external testing, build must pass Beta App Review first
- For internal testing, users must be added to your App Store Connect team

**Testers not receiving invites?**
- Check spam folder
- Verify email addresses are correct
- Testers must have TestFlight app installed

