# Step-by-Step Build Instructions

## Step 1: Login to EAS (Required First Time)

Open your terminal and run:

```bash
cd aituki-native
eas login
```

You'll be prompted to:
- Enter your email/username
- Enter your password
- Or use a browser to authenticate

## Step 2: Verify Login

```bash
eas whoami
```

Should show your Expo username.

## Step 3: Start the Build

### Option A: Use the helper script
```bash
./start-build.sh
```

### Option B: Run directly
```bash
eas build --platform ios --profile preview
```

## Step 4: During the Build

You'll be asked:

1. **"Would you like to create a new Apple App Store Connect API key?"**
   - Choose: **Yes** (recommended for first time)
   - OR: **No** if you already have credentials

2. **If creating new key:**
   - You'll need to provide:
     - Apple ID (your developer account email)
     - App-specific password (create at appleid.apple.com)
     - Or use App Store Connect API key

3. **"What would you like to name your Apple App Store Connect API key?"**
   - Enter a name like: "aituki-ios-build"

## Step 5: Monitor Build Progress

The build will:
- Upload your project to EAS servers
- Install dependencies
- Build the iOS app
- Take 10-20 minutes

**Check status:**
```bash
eas build:list
```

**View detailed logs:**
```bash
eas build:view [BUILD_ID]
```

## Step 6: After Build Completes

You'll see:
- ✅ Build complete message
- Download link for the `.ipa` file
- Build ID

## Step 7: Submit to TestFlight

Once build is complete:

```bash
eas submit --platform ios --latest
```

This will:
- Upload the build to App Store Connect
- Make it available in TestFlight

## Troubleshooting

### "Not logged in" error
```bash
eas login
```

### Build fails
- Check logs: `eas build:view [BUILD_ID]`
- Verify `app.json` configuration
- Ensure bundle identifier is unique

### Credentials error
- Make sure you have an Apple Developer account
- Verify your Apple ID credentials
- Check App Store Connect access

## Next Steps After TestFlight

1. Add testers in App Store Connect
2. Test the app
3. Fix any issues
4. Build production version: `eas build --platform ios --profile production`
5. Submit to App Store: `eas submit --platform ios --latest`

