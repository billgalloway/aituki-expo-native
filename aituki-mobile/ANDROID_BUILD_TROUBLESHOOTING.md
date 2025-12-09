# Android Build Troubleshooting Guide

## Common Gradle Build Errors and Solutions

### Error: "Gradle build failed with unknown error"

This is a generic error that can have several causes. Follow these steps:

## Step 1: Check Build Logs

Get detailed error information:

```bash
# List your builds to get the build ID
eas build:list --platform android

# View detailed logs for the failed build
eas build:view [BUILD_ID] --platform android
```

Look for specific error messages in the "Run gradlew" phase logs.

## Step 2: Common Issues and Fixes

### Issue 1: React 19 Compatibility
React 19.1.0 is very new and may have compatibility issues with React Native 0.81.5.

**Fix:**
```bash
# Try downgrading React to a more stable version
npm install react@18.3.1 react-dom@18.3.1
```

### Issue 2: New Architecture Enabled
`newArchEnabled: true` can cause build issues if not all dependencies support it.

**Fix:**
Temporarily disable new architecture in `app.json`:
```json
{
  "expo": {
    "newArchEnabled": false
  }
}
```

### Issue 3: Missing Android Configuration
Ensure all required Android fields are present.

**Check:**
- Package name is set: `"package": "com.aituki.mobile"`
- Version code is set: `"versionCode": 1`
- Icons exist and paths are correct

### Issue 4: Memory Issues
Gradle builds can fail due to memory constraints.

**Fix:**
Add to `eas.json`:
```json
{
  "build": {
    "production": {
      "android": {
        "resourceClass": "large"  // Upgrade from "medium"
      }
    }
  }
}
```

### Issue 5: Dependency Conflicts
Some packages may conflict with each other.

**Fix:**
```bash
# Clear cache and reinstall
rm -rf node_modules
rm package-lock.json
npm install

# Try building again
eas build --platform android --profile production
```

### Issue 6: Missing Assets
Icons or splash screens may be missing.

**Check:**
- `./assets/images/icon.png` exists
- `./assets/images/android-icon-foreground.png` exists
- `./assets/images/android-icon-background.png` exists
- `./assets/images/splash-icon.png` exists

## Step 3: Try a Clean Build

```bash
# Clear EAS build cache
eas build --platform android --profile production --clear-cache

# Or try preview profile first (faster, for testing)
eas build --platform android --profile preview
```

## Step 4: Check Specific Error Messages

After viewing logs, look for:

- **"Could not resolve dependencies"** → Dependency issue
- **"OutOfMemoryError"** → Memory issue (upgrade resourceClass)
- **"File not found"** → Missing asset files
- **"Gradle sync failed"** → Configuration issue
- **"Duplicate class"** → Dependency conflict

## Step 5: Quick Fixes to Try

### Fix 1: Disable New Architecture (Temporary)
```json
// app.json
{
  "expo": {
    "newArchEnabled": false
  }
}
```

### Fix 2: Downgrade React
```bash
npm install react@18.3.1 react-dom@18.3.1
```

### Fix 3: Upgrade Resource Class
```json
// eas.json
{
  "build": {
    "production": {
      "android": {
        "resourceClass": "large"
      }
    }
  }
}
```

### Fix 4: Verify Assets
```bash
# Check if all required files exist
ls -la assets/images/icon.png
ls -la assets/images/android-icon-foreground.png
ls -la assets/images/android-icon-background.png
ls -la assets/images/splash-icon.png
```

## Step 6: Get Help

If none of the above works:

1. **View full build logs:**
   ```bash
   eas build:view [BUILD_ID] --platform android
   ```

2. **Copy the error message** from the "Run gradlew" phase

3. **Check Expo forums:**
   - https://forums.expo.dev
   - Search for your specific error

4. **Contact Expo support:**
   - Include build ID
   - Include full error logs
   - Include your `app.json` and `package.json`

## Most Likely Fixes for Your Setup

Based on your configuration, try these in order:

1. **✅ Disable new architecture** (already done):
   ```json
   "newArchEnabled": false
   ```

2. **⚠️ Downgrade React** (React 19.1.0 is very new and likely causing issues):
   ```bash
   npm install react@18.3.1 react-dom@18.3.1
   ```
   **This is likely the issue!** React 19 is very new and may not be fully compatible with React Native 0.81.5.

3. **Try preview profile first** (to test, faster builds):
   ```bash
   eas build --platform android --profile preview
   ```

4. **View detailed logs** to see the actual error:
   ```bash
   # Get build ID
   eas build:list --platform android
   
   # View logs
   eas build:view [BUILD_ID] --platform android
   ```
   Look for specific errors in the "Run gradlew" phase.

## After Fixing

Once the build succeeds:

1. **Test the APK/AAB** on a device
2. **If preview works**, try production again
3. **Re-enable new architecture** if you disabled it (after confirming build works)

