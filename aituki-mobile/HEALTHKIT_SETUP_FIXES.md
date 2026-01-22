# HealthKit Setup and Fix Guide

## Changes Made

### 1. Added HealthKit Library
- ✅ Added `@kingstinct/react-native-healthkit@^6.1.1` to `package.json`
- This is the latest stable version with TypeScript support

### 2. Configured HealthKit Plugin
- ✅ Added `@kingstinct/react-native-healthkit` plugin to `app.json`
- Configured with proper permission descriptions
- Plugin will automatically configure entitlements and Info.plist

### 3. Fixed Upsert Syntax
- ✅ Added comment clarifying Supabase upsert syntax
- The current format should work, but verified it matches Supabase requirements

## Next Steps to Complete Setup

### Step 1: Install Dependencies
```bash
cd "/Users/billgalloway/Local Sites/Figma/expo-dev/my-expo-app/aituki-mobile"
npm install
```

### Step 2: Enable HealthKit in Apple Developer Portal
1. Go to [Apple Developer Portal](https://developer.apple.com/account/)
2. Navigate to **Certificates, Identifiers & Profiles**
3. Click **Identifiers** → Find your app ID (`com.aituki.mobile`)
4. Edit the app ID and enable **HealthKit** capability
5. Save changes
6. **Wait 5-10 minutes** for changes to propagate

### Step 3: Regenerate iOS Project
```bash
# Clean and regenerate iOS project with new HealthKit configuration
npx expo prebuild --clean --platform ios
```

### Step 4: Verify HealthKit Capability
1. Open `ios/aituki-mobile.xcworkspace` in Xcode
2. Select the project → **aituki-mobile** target
3. Go to **Signing & Capabilities** tab
4. Verify **HealthKit** capability is present and enabled
5. If not, click **"+ Capability"** and add HealthKit

### Step 5: Build and Test
```bash
# For development build on physical device
npx expo run:ios --device

# OR for EAS Build
eas build --platform ios --profile development-device
```

**Important:** HealthKit only works on **physical devices**, not simulators!

## API Compatibility Notes

The current implementation in `services/appleHealth.ts` uses a generic API wrapper. The `@kingstinct/react-native-healthkit` library uses HealthKit's native type identifiers. The code should work, but you may need to verify:

1. **Permission Types**: The library uses full HealthKit identifiers like `HKQuantityTypeIdentifierStepCount`
2. **Query Methods**: Methods may be named differently (e.g., `getQuantitySamples` vs `queryQuantitySamples`)
3. **Response Format**: Data structure may differ slightly

If you encounter API mismatches, refer to the library documentation:
- GitHub: https://github.com/kingstinct/react-native-healthkit
- NPM: https://www.npmjs.com/package/@kingstinct/react-native-healthkit

## Testing Checklist

After setup, test the following:

- [ ] App builds without errors
- [ ] HealthKit capability appears in Xcode
- [ ] App requests HealthKit permissions on first launch
- [ ] Permissions can be granted
- [ ] HealthKit data can be fetched (test with steps first)
- [ ] Data syncs to Supabase `health_data` table
- [ ] Charts display HealthKit data

## Troubleshooting

### Build Errors
- **"HealthKit capability not found"**: Ensure HealthKit is enabled in Apple Developer Portal and wait 5-10 minutes
- **"Swift compilation error"**: Try updating to latest library version or check for known issues on GitHub
- **"No provisioning profile"**: Regenerate provisioning profiles after enabling HealthKit

### Runtime Errors
- **"HealthKit not available"**: Make sure you're testing on a physical device, not simulator
- **"Permission denied"**: Check Info.plist has usage descriptions
- **"No data returned"**: Verify HealthKit has data (check Health app on device)

### Sync Errors
- **"RLS policy violation"**: Check Supabase RLS policies allow inserts
- **"Duplicate key error"**: Verify unique constraint matches upsert conflict resolution
- **"Network error"**: Check Supabase credentials and network connectivity

## Additional Resources

- [HealthKit Setup Guide](./HEALTHKIT_SETUP.md)
- [HealthKit Evaluation Report](./HEALTHKIT_EVALUATION_REPORT.md)
- [Library Documentation](https://github.com/kingstinct/react-native-healthkit)
