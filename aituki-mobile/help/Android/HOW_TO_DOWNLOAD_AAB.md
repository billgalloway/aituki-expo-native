# How to Download the .aab File

After building your Android app, here are the easiest ways to download the `.aab` (Android App Bundle) file:

## Method 1: EAS Dashboard (Easiest - Recommended)

1. **Go to your builds page:**
   - Visit: https://expo.dev/accounts/billgalloway/projects/aituki-mobile/builds
   - Sign in with your Expo account if prompted

2. **Find your build:**
   - Look for the latest Android build
   - Status should be "Finished" or "Complete" (green checkmark)
   - Platform should show "Android"
   - Profile should show "production"

3. **Download the file:**
   - Click on the build row to open build details
   - Look for a **"Download"** button (usually at the top right)
   - Click it to download the `.aab` file
   - The file will be saved to your Downloads folder

4. **File details:**
   - File name: Usually `app-release.aab` or `build-[id].aab`
   - File size: Typically 20-50 MB (depends on your app size)
   - File type: Android App Bundle (.aab)

## Method 2: EAS CLI (Command Line)

If you prefer using the command line:

### Step 1: List your builds
```bash
cd expo-dev/my-expo-app/aituki-mobile
eas build:list --platform android
```

This will show:
- Build ID
- Status
- Platform
- Profile
- Created date

### Step 2: Download by Build ID
```bash
# Replace [BUILD_ID] with the actual ID from the list
eas build:download [BUILD_ID] --platform android
```

### Step 3: Or download the latest build
```bash
eas build:download --latest --platform android
```

The file will be downloaded to your current directory.

## Method 3: Direct Build URL

If you know your build ID:

1. **Get the build ID:**
   - From `eas build:list` output
   - Or from the URL when viewing a build in the dashboard

2. **Access directly:**
   - URL format: `https://expo.dev/accounts/billgalloway/projects/aituki-mobile/builds/[BUILD_ID]`
   - Replace `[BUILD_ID]` with your actual build ID
   - Click the download button on that page

## Troubleshooting

### Build not showing as "Finished"
- Wait a few more minutes - builds can take 10-20 minutes
- Check build logs: `eas build:view [BUILD_ID]`
- Look for any error messages

### Download button not visible
- Make sure you're signed in to the correct Expo account
- Check that the build status is "Finished" (not "In progress" or "Failed")
- Try refreshing the page

### File won't download
- Check your browser's download settings
- Try a different browser
- Use the CLI method instead: `eas build:download [BUILD_ID]`

### Can't find the build
- Make sure you're looking at the right project
- Check the platform filter (should be Android)
- Verify you're on the correct Expo account

## After Downloading

Once you have the `.aab` file:

1. **Verify the file:**
   - Check it has `.aab` extension
   - File size should be reasonable (not 0 bytes)
   - File should be in your Downloads folder (or current directory if using CLI)

2. **Upload to Google Play Console:**
   - Go to: https://play.google.com/console
   - Select your app
   - Go to "Production" or "Internal testing"
   - Click "Create new release"
   - Upload the `.aab` file

## Quick Reference

```bash
# Build the app
eas build --platform android --profile production

# List builds
eas build:list --platform android

# Download latest build
eas build:download --latest --platform android

# Download specific build
eas build:download [BUILD_ID] --platform android
```

## File Location

- **Web download:** Usually goes to your Downloads folder
- **CLI download:** Goes to your current directory (where you ran the command)
- **Default location:** `~/Downloads/` on Mac, `C:\Users\[YourName]\Downloads\` on Windows

