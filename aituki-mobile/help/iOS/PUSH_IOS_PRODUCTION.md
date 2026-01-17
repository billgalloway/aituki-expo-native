# Push iOS Production Build to App Store

## Quick Command

Run this single command to build and submit:

```bash
cd "/Users/billgalloway/Local Sites/Figma/expo-dev/my-expo-app/aituki-mobile"
eas build --platform ios --profile production && eas submit --platform ios --latest
```

## Step-by-Step Instructions

### 1. Build the Production iOS App

```bash
cd "/Users/billgalloway/Local Sites/Figma/expo-dev/my-expo-app/aituki-mobile"
eas build --platform ios --profile production
```

**When prompted:**
- **"Do you want to log in to your Apple account?"** → Answer: **Yes**
- Enter your Apple Developer credentials if needed
- EAS will set up certificates and provisioning profiles automatically

**Build will take 10-20 minutes**

### 2. Wait for Build to Complete

Check build status:
```bash
eas build:list --platform ios --limit 1
```

Or check online:
https://expo.dev/accounts/billgalloway/projects/aituki-native/builds

### 3. Submit to App Store

Once build is complete (status: "finished"):

```bash
eas submit --platform ios --latest --profile production
```

This will automatically:
- Use the latest production build
- Submit to App Store Connect using your configured Apple ID
- Upload to the app ID: `6756360703`

## App Information

- **Bundle ID**: `com.aituki.mobile`
- **Version**: `2`
- **Build Number**: `12`
- **App Store Connect App ID**: `6756360703`
- **Apple Team ID**: `J2HMNHZVM9`
- **Apple ID**: `bill_galloway@icloud.com`

## Troubleshooting

### If credentials are not set up:

```bash
eas credentials --platform ios
```

Then select **"production"** when prompted for build profile.

### If build fails:

1. Check logs: `eas build:list` and click on the build link
2. Verify Apple Developer account access
3. Ensure Team ID `J2HMNHZVM9` is accessible
4. Check App Store Connect app exists (ID: `6756360703`)

### If submit fails:

1. Verify the build is complete (status: "finished")
2. Check App Store Connect has a valid app version
3. Ensure you have App Store Connect access
4. Try submitting manually from App Store Connect

## After Submission

1. Go to App Store Connect: https://appstoreconnect.apple.com
2. Navigate to your app (ID: `6756360703`)
3. Review the uploaded build
4. Complete app information if needed
5. Submit for review

## View Build Status

- **EAS Dashboard**: https://expo.dev/accounts/billgalloway/projects/aituki-native/builds
- **Build List**: `eas build:list --platform ios`
- **Latest Build**: `eas build:view --latest`

