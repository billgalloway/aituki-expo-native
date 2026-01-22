# Fixing EAS Build Step 5.2 Error with HealthKit

## What is Step 5.2?

Step 5.2 in EAS Build is the **Code Signing and Provisioning** step. This is where the build fails if HealthKit isn't properly configured.

## Quick Fix Checklist

### ✅ Step 1: Enable HealthKit in Apple Developer Portal

1. Go to https://developer.apple.com/account/
2. Navigate to **Certificates, Identifiers & Profiles**
3. Click **Identifiers** → Find **`com.aituki.mobile`**
4. **Edit** the App ID
5. Check the **HealthKit** checkbox
6. **Save** changes

### ✅ Step 2: Wait 5-10 Minutes

Apple needs time to propagate the changes. Wait a few minutes before building again.

### ✅ Step 3: Verify Configuration

Check your `app.json` has:
```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.aituki.mobile",
      "entitlements": {
        "com.apple.developer.healthkit": true
      }
    }
  }
}
```

### ✅ Step 4: Try Building Again

```bash
eas build --platform ios --profile development-device
```

## Common Error Messages at Step 5.2

### Error: "No provisioning profile found"
**Fix:** HealthKit isn't enabled in your App ID, or you need to wait for Apple to sync

### Error: "Entitlements don't match provisioning profile"
**Fix:** The profile needs to be regenerated. This should happen automatically with EAS, but try:
1. Enable HealthKit in Developer Portal (if not done)
2. Wait 5-10 minutes
3. Build again

### Error: "Bundle identifier doesn't match"
**Fix:** Check that `com.aituki.mobile` in app.json matches your App ID in Developer Portal

### Error: "Missing entitlement"
**Fix:** Ensure `entitlements` section exists in app.json with HealthKit enabled

## Alternative: Build Without HealthKit First

If you need to test the app without HealthKit first:

1. Temporarily remove HealthKit from `app.json`:
   ```json
   // Remove or comment out:
   // "entitlements": {
   //   "com.apple.developer.healthkit": true
   // }
   ```

2. Build and test the app

3. Once working, add HealthKit back and enable it in Developer Portal

## Still Having Issues?

1. Check the full build logs:
   ```bash
   eas build:view [latest-build-id] --platform ios
   ```

2. Share the specific error message from step 5.2

3. Verify your Apple Developer account has proper permissions

4. Try a different build profile (development vs production)

