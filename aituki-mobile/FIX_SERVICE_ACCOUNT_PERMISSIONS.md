# Fix Service Account Permissions - Step by Step Guide

## Quick Steps to Grant Permissions

Your service account email: `play-store-submitter@inspiring-list-217022.iam.gserviceaccount.com`

### Step 1: Sign in to Google Play Console
1. Go to: https://play.google.com/console
2. Sign in with: **bill.galloway7@gmail.com**

### Step 2: Navigate to API Access
You can access it in multiple ways:

**Option A: Direct URL**
- Go to: https://play.google.com/console/u/0/developers/developer-account/api-access

**Option B: Through Navigation**
1. In the left sidebar, look for **"Setup"** or **"Settings"**
2. Click on it
3. Look for **"API access"** or **"API configuration"**
4. Click on it

**Option C: Search**
1. Use the search bar at the top of Play Console
2. Type: **"API access"**
3. Click on the result

### Step 3: Find Your Service Account
1. Scroll down to the **"Service accounts"** section
2. Look for: `play-store-submitter@inspiring-list-217022.iam.gserviceaccount.com`
3. You should see it listed there

### Step 4: Grant Access
1. Find your service account in the list
2. Click **"Grant access"** or the **pencil/edit icon** next to it
3. A dialog will open asking for permissions

### Step 5: Set Permissions
1. You'll see options for what the service account can access
2. Make sure to:
   - Select **"Admin"** role (or **"Release manager"** for limited access)
   - Ensure it has access to your app: **com.aituki.mobile**
3. Click **"Invite user"** or **"Save"**

### Step 6: Accept Invitation (if prompted)
- If you see an invitation notification, accept it
- This may require checking your email or notifications in Play Console

### Step 7: Verify Permissions
1. Go back to the API access page
2. Your service account should now show:
   - Status: **"Active"** or **"Invited"**
   - Permissions listed

### Step 8: Retry Submission
Once permissions are granted, run:
```bash
cd "/Users/billgalloway/Local Sites/Figma/expo-dev/my-expo-app/aituki-mobile"
eas submit --platform android --latest
```

## Troubleshooting

### Can't Find API Access?
- Make sure you're at the **Developer account level** (not inside a specific app)
- Your account must be fully activated (paid $25 registration fee)
- Try the direct URL: https://play.google.com/console/u/0/developers/developer-account/api-access

### Service Account Not Listed?
- The service account might not be linked yet
- Click **"Link service account"** or **"Create service account"**
- You'll be redirected to Google Cloud Console
- After linking, return to Play Console

### Still Getting Permission Errors?
- Make sure the service account has **"Admin"** role (not just "Viewer")
- Verify the app package name matches: `com.aituki.mobile`
- Check that the service account was granted access to the correct app

## Current Build Ready for Submission

- **Build ID:** d6433a45-6611-4ceb-a648-cb1e6da0cbe3
- **Version:** 1.0.2
- **AAB File:** https://expo.dev/artifacts/eas/ssyV4fGJWan1ZHPWTfBm9c.aab

Once permissions are fixed, the submission will work automatically!

