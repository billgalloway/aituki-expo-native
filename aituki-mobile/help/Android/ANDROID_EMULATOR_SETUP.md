# Android Emulator Setup Guide

This guide will help you set up Android emulators to test your Expo app on Android.

## Step 1: Install Android Studio

1. **Download Android Studio:**
   - Go to https://developer.android.com/studio
   - Download Android Studio for macOS
   - The download is ~1 GB

2. **Install Android Studio:**
   - Open the downloaded `.dmg` file
   - Drag Android Studio to Applications folder
   - Launch Android Studio from Applications

3. **First Launch Setup:**
   - Android Studio will download additional components (SDK, build tools, etc.)
   - This may take 10-20 minutes depending on your internet speed
   - Follow the setup wizard:
     - Choose "Standard" installation
     - Accept license agreements
     - Let it download SDK components

## Step 2: Install Android SDK Components

1. **Open SDK Manager:**
   - In Android Studio, go to **Tools** → **SDK Manager**
   - Or click the SDK Manager icon in the toolbar

2. **Install Required Components:**
   - Go to **SDK Platforms** tab
   - Check the latest Android version (e.g., Android 15.0 "Vanilla Ice Cream")
   - Check at least one older stable version (e.g., Android 14.0)
   - Click **Apply** to install

3. **Install SDK Tools:**
   - Go to **SDK Tools** tab
   - Ensure these are checked:
     - ✅ Android SDK Build-Tools
     - ✅ Android Emulator
     - ✅ Android SDK Platform-Tools
     - ✅ Intel x86 Emulator Accelerator (HAXM installer) - if using Intel Mac
     - ✅ Android SDK Command-line Tools
   - Click **Apply** to install

## Step 3: Create an Android Virtual Device (AVD)

1. **Open AVD Manager:**
   - In Android Studio, go to **Tools** → **Device Manager**
   - Or click the Device Manager icon in the toolbar

2. **Create New Device:**
   - Click **Create Device** button
   - Select a device definition (recommended: **Pixel 7** or **Pixel 6**)
   - Click **Next**

3. **Select System Image:**
   - Choose a system image (recommended: latest API level with Google Play)
   - If you see "Download" next to it, click to download it first
   - Click **Next**

4. **Configure AVD:**
   - Name your AVD (e.g., "Pixel_7_API_34")
   - Review settings (can leave defaults)
   - Click **Finish**

## Step 4: Set Environment Variables

Add Android SDK to your PATH so Expo can find it:

1. **Find Android SDK Location:**
   - In Android Studio: **Tools** → **SDK Manager**
   - Note the "Android SDK Location" path (usually `~/Library/Android/sdk`)

2. **Add to Shell Profile:**
   Open your shell profile file:
   ```bash
   nano ~/.zshrc
   ```
   
   Add these lines (replace the path if your SDK is in a different location):
   ```bash
   export ANDROID_HOME=$HOME/Library/Android/sdk
   export ANDROID_SDK_ROOT=$HOME/Library/Android/sdk
   export PATH=$PATH:$ANDROID_HOME/emulator
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   export PATH=$PATH:$ANDROID_HOME/tools
   export PATH=$PATH:$ANDROID_HOME/tools/bin
   export ANDROID_HOME=$HOME/Library/Android/sdk
   export PATH=$PATH:$ANDROID_HOME/emulator
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```

3. **Reload Shell:**
   ```bash
   source ~/.zshrc
   ```

4. **Verify Installation:**
   ```bash
   echo $ANDROID_HOME
   adb version
   emulator -list-avds
   ```

## Step 5: Test the Emulator

1. **Start Emulator:**
   - In Android Studio Device Manager, click the ▶️ play button next to your AVD
   - Or from command line: `emulator -avd <AVD_NAME>`

2. **Verify Expo Can See It:**
   ```bash
   adb devices
   ```
   You should see your emulator listed

3. **Start Expo and Test:**
   ```bash
   cd "/Users/billgalloway/Local Sites/Figma/expo-dev/my-expo-app/aituki-mobile"
   npx expo start
   ```
   - Press `a` to open on Android
   - Or scan QR code with Expo Go on a physical Android device

## Troubleshooting

### Android Studio Not Found
- Make sure Android Studio is installed and launched at least once
- Check that SDK was downloaded during first launch

### "adb: command not found"
- Verify ANDROID_HOME is set: `echo $ANDROID_HOME`
- Make sure you've reloaded your shell: `source ~/.zshrc`
- Check that platform-tools is in the SDK directory

### Emulator Won't Start
- Make sure virtualization is enabled in your Mac's BIOS/UEFI (usually already enabled on Mac)
- Try creating a new AVD with different settings
- Check Android Studio's log for errors: Help → Show Log in Finder

### Expo Can't Find Android Device
- Make sure emulator is running: `adb devices`
- Try restarting ADB: `adb kill-server && adb start-server`
- Check that `ANDROID_HOME` is set correctly

### Performance Issues
- Allocate more RAM to the emulator in AVD settings
- Enable hardware acceleration (usually enabled by default on Mac)
- Close other applications to free up resources

## Quick Commands Reference

```bash
# List available AVDs
emulator -list-avds

# Start specific emulator
emulator -avd <AVD_NAME>

# List connected devices
adb devices

# Restart ADB server
adb kill-server && adb start-server

# Check Android SDK version
adb version

# Check environment variables
echo $ANDROID_HOME
echo $ANDROID_SDK_ROOT
```

## Alternative: Use Physical Android Device

If you don't want to set up an emulator, you can use a physical Android device:

1. **Enable Developer Options:**
   - Go to Settings → About Phone
   - Tap "Build Number" 7 times
   - Go back to Settings → Developer Options
   - Enable "USB Debugging"

2. **Connect Device:**
   - Connect via USB
   - Allow USB debugging on the device
   - Verify: `adb devices` should show your device

3. **Run Expo:**
   - `npx expo start`
   - Press `a` or scan QR code with Expo Go app

## Next Steps

Once the emulator is set up:
1. Start your emulator
2. Run `npx expo start`
3. Press `a` to launch your app on Android
4. Test your OpenAI chat interface on Android!

