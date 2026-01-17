# Try Keystore Fix (No Java Needed)

Since Java isn't installed, we'll try updating EAS credentials with each keystore until one works.

## Simple 3-Step Process

### STEP 1: Update EAS Credentials

Run this command:

```bash
eas credentials --platform android
```

When prompted:
1. Type: `production` (then press Enter)
2. Choose: `Update existing Android Keystore` or `Set up a new Android Keystore`
3. **Try this keystore first:** `@billgalloway__aituki-native_OLD_4.jks`
   - Enter the full path or just the filename
4. Enter the keystore password (try the password you used before)
5. Key alias: `@billgalloway__aituki-native`
6. Enter key password (might be same as keystore password)

---

### STEP 2: Rebuild and Test

After updating, I'll rebuild the app. Then try uploading to Google Play.

If Google Play **accepts** the build → ✅ **Success! The keystore is correct.**

If Google Play **rejects** it (wrong SHA1) → Try the next keystore.

---

### STEP 3: If First Keystore Doesn't Work

Repeat STEP 1, but try these keystores in order:

1. `@billgalloway__aituki-native_OLD_4.jks` ← **Try this first**
2. `@billgalloway__aituki-native_OLD_3.jks`
3. `@billgalloway__aituki-native_OLD_2.jks`
4. `@billgalloway__aituki-native_OLD_1.jks`
5. `@billgalloway__aituki-native.jks`

---

## Quick Start

**Just run this and try OLD_4 first:**

```bash
cd "/Users/billgalloway/Local Sites/Figma/expo-dev/my-expo-app/aituki-mobile"
eas credentials --platform android
```

Then select `production` → Update keystore → Use `@billgalloway__aituki-native_OLD_4.jks`

Tell me when done and I'll rebuild!

