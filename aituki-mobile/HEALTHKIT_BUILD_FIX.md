# Fixing Swift Compilation Error in HealthKit Library

## Error: `'super.init' isn't called on all paths before returning from initializer`

This error is coming from the `@kingstinct/react-native-healthkit` library's native Swift code, not our code.

## Solutions

### Option 1: Remove HealthKit Library Temporarily (Recommended for now)

To get the build working immediately:

1. **Remove from package.json:**
   ```bash
   npm uninstall @kingstinct/react-native-healthkit
   ```

2. **Remove HealthKit entitlement from app.json temporarily:**
   - Comment out or remove the `entitlements` section

3. **Build should now work**

4. **Re-add later** once library is fixed or replaced

### Option 2: Try Different Library Version

The library might have a bug in version 2.0.0. Try:

```bash
npm uninstall @kingstinct/react-native-healthkit
npm install @kingstinct/react-native-healthkit@latest
# Or try a specific older version
npm install @kingstinct/react-native-healthkit@1.5.0
```

### Option 3: Use Alternative HealthKit Library

Consider using `react-native-health` instead:

```bash
npm uninstall @kingstinct/react-native-healthkit
npm install react-native-health
```

Note: You'll need to update `services/appleHealth.ts` to use the different API.

### Option 4: Contact Library Maintainer

If you want to keep using `@kingstinct/react-native-healthkit`:
1. Check their GitHub issues: https://github.com/kingstinct/react-native-healthkit/issues
2. Report the Swift compilation error
3. Wait for a fix

## Current Status

The HealthKit integration code is in place and will work once the library compiles successfully. The error is purely in the native library code.

## Recommendation

**For now:** Remove the library to get builds working, then we can add it back once fixed or switch to an alternative library.

