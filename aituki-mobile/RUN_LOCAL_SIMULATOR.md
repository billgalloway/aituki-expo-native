# Running Local Development Build in iOS Simulator

## Quick Start

1. **Open Terminal** and navigate to the project:
   ```bash
   cd "/Users/billgalloway/Local Sites/Figma/expo-dev/my-expo-app/aituki-mobile"
   ```

2. **Start the Expo dev server:**
   ```bash
   npm start
   ```
   Or:
   ```bash
   npx expo start
   ```

3. **Press `i`** in the terminal to open iOS Simulator, or:

4. **Alternative: Run directly on simulator:**
   ```bash
   npm run ios
   ```
   Or:
   ```bash
   npx expo run:ios
   ```

## If Build Fails

### Option 1: Clean and Rebuild
```bash
# Clean iOS build
cd ios
rm -rf build Pods Podfile.lock
pod install
cd ..

# Then run again
npx expo run:ios
```

### Option 2: Prebuild Fresh
```bash
# Remove existing iOS folder (backup first if needed)
rm -rf ios

# Generate fresh iOS project
npx expo prebuild --platform ios --clean

# Then run
npx expo run:ios
```

## Notes

- **Make sure Xcode is installed** (from Mac App Store)
- **Make sure iOS Simulator is installed** (comes with Xcode)
- The first build may take several minutes
- You'll see the app open automatically in the simulator

## Troubleshooting

### "Command not found" errors
```bash
# Make sure dependencies are installed
npm install
```

### Simulator won't open
```bash
# Open Xcode and select a simulator
open -a Simulator
```

### Build errors
- Check that you have the latest Xcode Command Line Tools:
  ```bash
  xcode-select --install
  ```

