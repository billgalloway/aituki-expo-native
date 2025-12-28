# Upload Instructions for Latest Builds

## ✅ iOS - Successfully Submitted!

**Status:** ✅ Submitted to App Store Connect automatically!

- **Build ID:** 2c4234de-716b-4beb-af49-8710c47a22dc
- **Version:** 2, Build 3
- **Status:** Processing (5-10 minutes)
- **View:** https://appstoreconnect.apple.com/apps/6756360703/testflight/ios

**Next Steps:**
1. Wait for Apple to process the build (you'll get an email)
2. Go to App Store Connect → TestFlight
3. Add the build to your testing group
4. Distribute to testers

## 📱 Android - Manual Upload Required

**Status:** ⚠️ Automated submission failed (service account permissions)

### Build Details:
- **Build ID:** b472b13d-e09a-43ec-ab45-bef70e1d074d
- **Version:** 2, Version Code 6
- **AAB URL:** https://expo.dev/artifacts/eas/ohoigPmGt1P9JBT3CxjLUn.aab
- **Local File:** Download from URL above

### Manual Upload Steps:

1. **Download the AAB:**
   - Go to: https://expo.dev/artifacts/eas/ohoigPmGt1P9JBT3CxjLUn.aab
   - Or visit: https://expo.dev/accounts/billgalloway/projects/aituki-native/builds/b472b13d-e09a-43ec-ab45-bef70e1d074d

2. **Go to Google Play Console:**
   - https://play.google.com/console
   - Sign in with: `bill.galloway7@gmail.com`

3. **Navigate to Internal Testing:**
   - Select your app: `com.aituki.mobile`
   - Go to: **Testing** → **Internal testing**
   - Click **"Create new release"** or **"New release"**

4. **Upload the AAB:**
   - Click **"Upload"** under "App bundles"
   - Select the downloaded `.aab` file
   - Wait for upload to complete

5. **Add Release Notes:**
   ```
   Version 2 (Version Code 6)
   - Fixed Contentful CMS content access on devices
   - Fixed accent color errors
   - Bug fixes and improvements
   ```

6. **Publish:**
   - Click **"Save"**
   - Click **"Review release"**
   - Click **"Start rollout to Internal testing"**

## 🔧 What Was Fixed

Both builds include:
- ✅ **Contentful CMS fix** - Apps now properly access Contentful content on devices
- ✅ **Accent color fix** - Fixed `Colors.light.accent` errors
- ✅ **Updated icons** - New app icons from your design files

## 📊 Build Summary

### Android
- Version: 2
- Version Code: 6
- Status: Ready for manual upload

### iOS  
- Version: 2
- Build Number: 3
- Status: ✅ Submitted and processing

Both apps will now properly load Contentful CMS content when installed on devices!

