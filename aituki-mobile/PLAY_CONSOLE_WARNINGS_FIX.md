# Fixing Google Play Console Warnings

## Warning 1: Advertising ID Declaration

### Issue
Apps targeting Android 13 (API 33) must declare whether they use advertising ID.

### Solution

**If you DON'T use advertising ID (most likely for a health app):**

1. Go to Google Play Console
2. Navigate to: **Policy** → **App content** → **Advertising ID**
3. Select: **"No, my app does not use an advertising ID"**
4. Save the declaration

**If you DO use advertising ID:**

Add the permission to your app.json:
```json
"android": {
  "permissions": [
    "com.google.android.gms.permission.AD_ID"
  ]
}
```

**For your app:** Since you don't have any advertising libraries (no Google Ads, AdMob, etc.), you should declare **"No, my app does not use an advertising ID"** in Play Console.

## Warning 2: Device Support Change

### Issue
The new release doesn't support 18,685 devices that were previously supported.

### Possible Causes
1. **Minimum SDK version increased** - Your app now requires a newer Android version
2. **Native library changes** - Some dependencies require newer devices
3. **Architecture changes** - New architecture enabled might drop some devices

### Solution

**Option 1: Accept the change (Recommended)**
- These are likely very old devices (Android 4.x or 5.x)
- Modern apps typically don't support devices older than Android 6.0 (API 23)
- The affected users are a small percentage

**Option 2: Check minimum SDK version**
- In Play Console, go to **Release** → **Production** → **App bundle explorer**
- Check what the minimum SDK version is
- If it's too high, you can lower it in app.json (but this may cause other issues)

**Option 3: Review affected devices**
- Click "Check changes to your supported devices" in the warning
- Review which devices are affected
- Decide if you want to support them

### Recommended Action
**Accept the device support change** - These are likely very old devices that most modern apps don't support anyway.

## Quick Steps in Play Console

1. **Fix Advertising ID:**
   - Go to: Policy → App content → Advertising ID
   - Select: "No, my app does not use an advertising ID"
   - Save

2. **Accept Device Support Change:**
   - In the release review page, you'll see the warning
   - Review the affected devices (optional)
   - Click "Continue" or "Accept" to proceed with the release

## After Fixing

Once you complete the advertising ID declaration, you can proceed with publishing your release. The device support warning is just informational - you can proceed with the release.

