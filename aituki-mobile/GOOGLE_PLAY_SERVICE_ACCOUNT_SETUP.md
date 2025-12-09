# Google Play Service Account Setup Guide

This guide will help you set up automated submission to Google Play Store using a service account.

## Prerequisites

- Google Play Developer account: **bill.galloway7@gmail.com**
- Access to Google Cloud Console
- App package name: `com.aituki.mobile`

## Step 1: Create Google Cloud Project

1. **Go to Google Cloud Console:**
   - Visit: https://console.cloud.google.com
   - Sign in with **bill.galloway7@gmail.com**

2. **Create a new project (or select existing):**
   - Click the project dropdown at the top
   - Click "New Project"
   - Name: `aituki-play-store` (or any name you prefer)
   - Click "Create"

## Step 2: Enable Google Play Android Developer API

1. **Navigate to APIs & Services:**
   - In the left sidebar, go to "APIs & Services" → "Library"

2. **Enable the API:**
   - Search for "Google Play Android Developer API"
   - Click on it
   - Click "Enable"
   - Wait for it to enable (usually instant)

## Step 3: Create Service Account

1. **Go to Service Accounts:**
   - In the left sidebar, go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "Service Account"

2. **Fill in service account details:**
   - Service account name: `play-store-submitter`
   - Service account ID: (auto-generated, can leave as is)
   - Description: `Service account for automated Play Store submissions`
   - Click "Create and Continue"

3. **Grant access (optional):**
   - Skip the optional step for now
   - Click "Done"

## Step 4: Create and Download Service Account Key

1. **Open the service account:**
   - In the Credentials page, find your service account
   - Click on it to open details

2. **Create a key:**
   - Go to the "Keys" tab
   - Click "Add Key" → "Create new key"
   - Select "JSON" format
   - Click "Create"

3. **Download the key:**
   - The JSON file will automatically download
   - **IMPORTANT:** Save this file securely
   - Rename it to: `google-play-api-key.json`
   - Move it to your project directory: `expo-dev/my-expo-app/aituki-mobile/`

## Step 5: Grant Access in Google Play Console

⚠️ **IMPORTANT: Account Must Be Fully Activated**

Before proceeding, make sure your Google Play Developer account is **fully confirmed and activated**:
- ✅ Payment of $25 registration fee is complete
- ✅ Developer account verification is complete
- ✅ All required information is filled out
- ✅ Account is not in "pending" or "under review" status

**If your account is not fully activated:**
- API access will NOT be visible until activation is complete
- Complete the account setup process first
- Wait for Google's confirmation email
- Then return to this step

1. **Go to Google Play Console:**
   - Visit: https://play.google.com/console
   - Sign in with **bill.galloway7@gmail.com**

2. **Check account status:**
   - Look for any warnings or notifications about account verification
   - Check if there are any pending steps in account setup
   - Verify payment status if required

3. **Navigate to API access (Multiple ways to find it):**

   **Option A: From the main dashboard:**
   - In the left sidebar, look for "Setup" or "Settings"
   - Click on it, then look for "API access" or "API configuration"
   
   **Option B: Direct URL:**
   - Go directly to: https://play.google.com/console/u/0/developers/[YOUR_DEVELOPER_ID]/api-access
   - Replace `[YOUR_DEVELOPER_ID]` with your developer account ID (you'll see it in the URL when logged in)
   
   **Option C: Through Settings:**
   - Click on your profile/account icon (top right)
   - Look for "Settings" or "Developer account settings"
   - Find "API access" in the settings menu
   
   **Option D: Search for it:**
   - Use the search bar at the top of Play Console
   - Type "API access" or "API"
   - It should appear in the search results

3. **If you still can't find it, try this:**
   - Make sure you're on the **Developer account level** (not inside a specific app)
   - Look in the left sidebar for:
     - "Setup" → "API access"
     - "Settings" → "API access"  
     - "Users and permissions" → "API access"
   - The API access page shows all service accounts and API credentials

4. **Link service account:**
   - On the API access page, scroll down to the "Service accounts" section
   - Click "Link service account" or "Create service account"
   - You'll be redirected to Google Cloud Console to create/link the account
   - After creating in Cloud Console, return to Play Console
   - Your service account email should appear (format: `play-store-submitter@[project-id].iam.gserviceaccount.com`)

5. **Grant permissions:**
   - Find your service account in the "Service accounts" list
   - Click "Grant access" or the pencil/edit icon
   - Select role: **"Admin"** (or "Release manager" for limited access)
   - Click "Invite user" or "Save"
   - Accept the invitation if prompted

## Step 6: Verify Service Account Email

1. **Note the service account email:**
   - It will be in format: `play-store-submitter@[project-id].iam.gserviceaccount.com`
   - You'll need this email in Play Console

2. **In Play Console:**
   - The service account should now appear under "Service accounts"
   - Status should show as "Active" or "Invited"

## Step 7: Update eas.json

The `eas.json` file has been updated with the service account configuration. You just need to:

1. **Place the key file:**
   - Make sure `google-play-api-key.json` is in the project root: `expo-dev/my-expo-app/aituki-mobile/`

2. **Verify the path in eas.json:**
   - The path should be: `"./google-play-api-key.json"`
   - This is already configured

3. **Add to .gitignore (IMPORTANT):**
   - Make sure `google-play-api-key.json` is in `.gitignore`
   - Never commit this file to git!

## Step 6.5: Alternative - Manual Submission (If API Access Not Available)

If your account is not fully activated and you need to submit immediately, you can manually upload builds:

1. **Build your app:**
   ```bash
   eas build --platform android --profile production
   ```

2. **Download the AAB file:**

   **Method A: From EAS Dashboard (Web Interface)**
   - Go to: https://expo.dev/accounts/billgalloway/projects/aituki-mobile/builds
   - Sign in with your Expo account
   - Find your latest Android build (look for the one with status "Finished" or "Complete")
   - Click on the build to open details
   - Look for a "Download" button or link
   - The file will be named something like: `app-release.aab` or `build-[id].aab`
   - Click to download the `.aab` file to your computer

   **Method B: Using EAS CLI (Command Line)**
   ```bash
   # List your builds to find the build ID
   eas build:list --platform android
   
   # Download the specific build (replace [BUILD_ID] with actual ID)
   eas build:download [BUILD_ID] --platform android
   
   # Or download the latest build
   eas build:download --latest --platform android
   ```
   - The file will be downloaded to your current directory
   - Look for a file ending in `.aab`

   **Method C: Direct URL (if you have the build ID)**
   - Builds are also accessible at: `https://expo.dev/accounts/billgalloway/projects/aituki-mobile/builds/[BUILD_ID]`
   - Replace `[BUILD_ID]` with your actual build ID from the build list

3. **Verify the file:**
   - The downloaded file should have a `.aab` extension
   - File size is typically 20-50 MB (varies based on app size)
   - File name format: `app-release.aab` or similar

4. **Upload manually to Play Console:**
   - Go to: https://play.google.com/console
   - Sign in with **bill.galloway7@gmail.com**
   - Select your app (or create it with package name: `com.aituki.mobile`)
   - Go to "Production" or "Internal testing" (left sidebar)
   - Click "Create new release" or "New release"
   - Under "App bundles", click "Upload"
   - Select the `.aab` file you downloaded
   - Wait for upload to complete
   - Add release notes (required)
   - Review the release
   - Click "Save" then "Review release" then "Start rollout" (for production) or "Save" (for testing)

**Note:** Once your account is fully activated, you can set up the service account for automated submissions.

## Step 8: Test the Setup

1. **Build your app:**
   ```bash
   cd expo-dev/my-expo-app/aituki-mobile
   eas build --platform android --profile production
   ```

2. **Submit automatically:**
   ```bash
   eas submit --platform android --latest
   ```

3. **Verify in Play Console:**
   - Go to Play Console → Your App → "Production" or "Internal testing"
   - You should see the new release being processed

## Security Best Practices

1. **Never commit the key file:**
   - Add to `.gitignore`: `google-play-api-key.json`
   - Use environment variables in CI/CD if needed

2. **Rotate keys periodically:**
   - Delete old keys in Google Cloud Console
   - Create new keys as needed

3. **Use least privilege:**
   - "Release manager" role is sufficient for submissions
   - Only use "Admin" if you need full access

4. **Store keys securely:**
   - Use password managers
   - Encrypt keys at rest
   - Limit access to team members who need it

## Troubleshooting

### Can't find "API access" in Play Console

**⚠️ MOST COMMON REASON: Account Not Fully Activated**

If you can't find API access, it's most likely because:
- Your developer account is not fully confirmed/activated yet
- The $25 registration fee hasn't been processed
- Account verification is still pending
- You haven't completed all required account setup steps

**Solution 1: Verify Account Status**
- Check your email for any Google Play Console notifications
- Look for account verification or activation emails
- In Play Console, check for any warning banners about account status
- Go to "Account details" or "Settings" to see account status
- Complete any pending verification steps

**Solution 2: Complete Account Setup**
- Make sure you've paid the $25 registration fee
- Complete all required profile information
- Verify your identity if required
- Wait 24-48 hours after payment for account activation
- Check for confirmation email from Google

**Solution 3: Check you're at the right level**
- API access is at the **Developer account level**, not the app level
- Make sure you're on the main Play Console dashboard, not inside a specific app
- Look for it in the left sidebar at the top level

**Solution 4: Try direct navigation (after account is activated)**
- Go to: https://play.google.com/console
- Look for "Setup" in the left sidebar (usually near the top)
- Click it, then look for "API access"

**Solution 5: Use the search (after account is activated)**
- Click the search icon (magnifying glass) at the top
- Type "API access"
- It should show up in the results

**Solution 6: Contact Support**
- If account is activated but API access still missing, contact Google Play support
- Go to: https://support.google.com/googleplay/android-developer
- Explain that API access is not visible in your console

### "Service account not found" error
- Verify the service account email matches in both Google Cloud and Play Console
- Make sure you granted access in Play Console
- Check that you're using the correct service account email

### "Permission denied" error
- Check that the service account has "Admin" or "Release manager" role
- Verify the app package name matches: `com.aituki.mobile`
- Make sure the service account was granted access to the correct app

### "Invalid credentials" error
- Verify the JSON key file path is correct in `eas.json`
- Check that the key file is valid JSON
- Make sure the key hasn't been deleted in Google Cloud Console
- Verify the service account still exists in Google Cloud Console

### Key file not found
- Verify the file is in the project root directory
- Check the path in `eas.json` matches the actual file location
- Use absolute path if relative path doesn't work
- Make sure the filename is exactly: `google-play-api-key.json`

## Next Steps

Once the service account is set up:

1. ✅ Build your app: `eas build --platform android --profile production`
2. ✅ Submit automatically: `eas submit --platform android --latest`
3. ✅ Monitor in Play Console for release status

## Resources

- [Google Cloud Console](https://console.cloud.google.com)
- [Google Play Console](https://play.google.com/console)
- [EAS Submit Documentation](https://docs.expo.dev/submit/android/)
- [Service Account Best Practices](https://cloud.google.com/iam/docs/service-accounts)

