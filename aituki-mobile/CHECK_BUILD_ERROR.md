# How to Check Build Error Details

To diagnose the Android build failure, you need to see the specific error message.

## Step 1: Get the Build ID

```bash
cd "/Users/billgalloway/Local Sites/Figma/expo-dev/my-expo-app/aituki-mobile"
eas build:list --platform android --limit 1
```

This will show the most recent build with its ID.

## Step 2: View Detailed Logs

```bash
# Replace [BUILD_ID] with the actual ID from step 1
eas build:view [BUILD_ID] --platform android
```

## Step 3: Check the Error

Look for:
- **Gradle errors** in the "Run gradlew" phase
- **Package name errors** (should be fixed now)
- **Dependency conflicts**
- **Memory errors**
- **Asset missing errors**

## Common Issues After Our Fixes

### 1. Still Using Old Package Name
**Symptom**: Error about `com.aituki.native`
**Fix**: Use `--clear-cache` flag:
```bash
eas build --platform android --profile production --clear-cache
```

### 2. React 19 Compatibility
**Symptom**: Build fails during compilation
**Fix**: Downgrade React:
```bash
npm install react@18.3.1 react-dom@18.3.1
```

### 3. Missing Assets
**Symptom**: Error about missing icon or splash screen
**Fix**: Verify all assets exist in `assets/images/`

### 4. Memory Issues
**Symptom**: OutOfMemoryError
**Fix**: Already using medium resource class (free tier max)

## Quick Check Commands

```bash
# Verify package name is correct
cat app.json | grep -A 3 '"android"'

# Should show: "package": "com.aituki.mobile"

# Check React version
cat package.json | grep '"react"'

# Check if new architecture is disabled
cat app.json | grep newArchEnabled

# Should show: "newArchEnabled": false
```

## Next Steps

1. Run `eas build:view [BUILD_ID]` to see the exact error
2. Copy the error message from the "Run gradlew" phase
3. Share the error so we can provide a targeted fix

