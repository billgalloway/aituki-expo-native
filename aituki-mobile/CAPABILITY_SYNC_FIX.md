# Fixing EAS Build Capability Sync Error

## Error
```
Failed to patch capabilities: [ { capabilityType: 'APPLE_ID_AUTH', option: 'OFF' } ]
✖ Failed to sync capabilities com.aituki.mobile
The bundle 'XZ4VG9T55X' cannot be deleted. Delete all the Apps related to this bundle to proceed.
```

## Solution: Disable Auto Capability Syncing

I've added `EXPO_NO_CAPABILITY_SYNC=1` to all build profiles in `eas.json`.

### Alternative: Set Environment Variable When Building

If the `env` section in `eas.json` doesn't work, you can set it when running the build command:

```bash
EXPO_NO_CAPABILITY_SYNC=1 eas build --platform ios --profile development-device
```

Or set it in your shell:
```bash
export EXPO_NO_CAPABILITY_SYNC=1
eas build --platform ios --profile development-device
```

## What This Does

- **Disables automatic capability syncing** with Apple Developer Portal
- **You'll need to manually manage capabilities** in Apple Developer Portal
- **Builds will proceed without trying to sync capabilities**

## Manual Capability Management

Since auto-sync is disabled, manage capabilities manually:

1. Go to https://developer.apple.com/account/
2. Navigate to **Certificates, Identifiers & Profiles**
3. Click **Identifiers** → Find `com.aituki.mobile`
4. Edit capabilities as needed

## Note

This is a temporary workaround. Once the bundle identifier issues are resolved in Apple Developer Portal, you can re-enable auto-sync by removing `EXPO_NO_CAPABILITY_SYNC=1` from `eas.json` or not setting the environment variable.

