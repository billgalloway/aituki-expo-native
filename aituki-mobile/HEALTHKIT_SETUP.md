# HealthKit Setup Guide

## Important Notes

**HealthKit does NOT work on iOS Simulators** - You must test on a physical iPhone or iPad.

## Fixing Build Error 65

The build error occurs because HealthKit capability needs to be properly configured. Follow these steps:

### Step 1: Enable HealthKit in Apple Developer Portal

1. Go to [Apple Developer Portal](https://developer.apple.com/account/)
2. Navigate to **Certificates, Identifiers & Profiles**
3. Click **Identifiers** → Find your app ID (`com.aituki.mobile`)
4. Edit the app ID and enable **HealthKit** capability
5. Save changes

### Step 2: Regenerate Provisioning Profiles

After enabling HealthKit in the Developer Portal:
1. Go to **Profiles** section
2. Regenerate your Development and Distribution profiles
3. Download and install the new profiles

### Step 3: Configure Xcode Project

If you're building locally (not using EAS Build):

1. **Regenerate iOS project:**
   ```bash
   cd "/Users/billgalloway/Local Sites/Figma/expo-dev/my-expo-app/aituki-mobile"
   npx expo prebuild --clean --platform ios
   ```

2. **Open in Xcode:**
   - Open `ios/aituki-mobile.xcworkspace` (NOT .xcodeproj)

3. **Enable HealthKit Capability:**
   - Select the project in left sidebar
   - Select **aituki-mobile** target
   - Go to **Signing & Capabilities** tab
   - Click **"+ Capability"**
   - Add **HealthKit**
   - Ensure it's checked/enabled

4. **Clean and Rebuild:**
   - In Xcode: **Product → Clean Build Folder** (Cmd+Shift+K)
   - Then rebuild: `npx expo run:ios`

### Step 4: For EAS Build

If using EAS Build, the `entitlements` in `app.json` should automatically enable HealthKit. However, you still need to:

1. Enable HealthKit in Apple Developer Portal (Step 1)
2. Ensure your provisioning profiles include HealthKit (Step 2)
3. Build with EAS:
   ```bash
   eas build --platform ios --profile development
   ```

## Testing

**Remember:** HealthKit only works on physical devices, not simulators.

1. Connect a physical iPhone/iPad
2. Build and run on the device
3. The "HealthKit is not available" message should disappear
4. You can then connect Apple Health and sync data

## Troubleshooting

### Still getting build error 65 or "Build failed at step 5.2"?

Step 5.2 is typically code signing/provisioning. Common fixes:

#### For EAS Build:

1. **Verify HealthKit is enabled in Apple Developer Portal:**
   - Go to developer.apple.com → Identifiers → `com.aituki.mobile`
   - Ensure HealthKit checkbox is checked and saved

2. **Wait 5-10 minutes** after enabling HealthKit in Developer Portal before building (Apple needs to propagate changes)

3. **Check EAS Build logs** for specific error:
   ```bash
   eas build:list --platform ios
   eas build:view [build-id] --platform ios
   ```

4. **Common EAS Build step 5.2 errors:**
   - "No provisioning profile found" → HealthKit not enabled in App ID
   - "Entitlements don't match provisioning profile" → Profile needs regeneration
   - "Bundle identifier doesn't match" → Check app.json bundleIdentifier

5. **Try building with development profile:**
   ```bash
   eas build --platform ios --profile development-device
   ```
   This uses development signing which is easier to set up.

#### For Local Build:

1. **Check entitlements file:**
   - Open `ios/aituki-mobile/aituki-mobile.entitlements`
   - Ensure it contains: `<key>com.apple.developer.healthkit</key><true/>`

2. **Verify provisioning profile:**
   - In Xcode: **Signing & Capabilities** → Check provisioning profile
   - Ensure it includes HealthKit entitlement

3. **Clean everything:**
   ```bash
   cd ios
   rm -rf Pods Podfile.lock
   pod install
   cd ..
   npx expo prebuild --clean --platform ios
   ```

4. **Check bundle identifier matches:**
   - Ensure `com.aituki.mobile` in app.json matches the one in Developer Portal with HealthKit enabled

### HealthKit still shows as unavailable?

- Make sure you're on a **physical device** (not simulator)
- Verify HealthKit capability is enabled in Xcode
- Check that the app is properly signed with a profile that includes HealthKit
- Rebuild the app after making changes

