# iOS Release to Expo Dev - Guide

## Understanding Expo Dev Deployment

For iOS, pushing to Expo Dev involves two steps:

### Step 1: Build Development Client (One-time)
Creates a native iOS app with development client capabilities.

### Step 2: Publish Updates (Ongoing)
Publishes JavaScript/asset updates that the development client receives OTA.

## Option A: Build Development Client + Publish Update

### 1. Build Development Client

This requires Apple Developer credentials. You'll be prompted to:
- Log in to your Apple account, OR
- Provide App Store Connect API key

```bash
cd "/Users/billgalloway/Local Sites/Figma/expo-dev/my-expo-app/aituki-mobile"
eas build --platform ios --profile development
```

**Note:** You'll need to provide Apple credentials when prompted. The build takes 10-20 minutes.

### 2. Install Development Client

Once built, install the development client on your iOS device or simulator.

### 3. Publish Update

After the development client is installed, publish updates:

```bash
eas update --branch development --platform ios --message "iOS dev update"
```

The development client will automatically receive and apply the update.

## Option B: Just Publish Update (If Dev Client Exists)

If you already have a development client built and installed, you can skip the build and just publish:

```bash
eas update --branch development --platform ios --message "iOS dev update"
```

## Current Configuration

- ✅ **expo-dev-client** installed
- ✅ **Development profile** configured in `eas.json`
- ✅ **Channel:** development
- ✅ **Runtime version:** appVersion (enables OTA updates)

## Quick Commands

```bash
# Build development client (first time)
eas build --platform ios --profile development

# Publish update to development channel
eas update --branch development --platform ios --message "Update message"

# Check update status
eas update:list --branch development --platform ios
```

## Next Steps

1. **If you have Apple credentials ready:** Run the build command above
2. **If you want to publish an update only:** Run the update command
3. **If you need to set up Apple credentials:** See APP_STORE_PUBLISHING.md


