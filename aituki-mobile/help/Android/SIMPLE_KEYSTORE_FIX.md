# Simple Keystore Fix Guide

## Goal
Update Android signing certificate to match Google Play Console
- **Expected SHA1:** `88:4F:22:CA:57:80:9D:DF:4E:A0:C4:77:5C:76:0B:19:F4:37:5B:48`

---

## Step 1: Check Each Keystore File

Open Terminal and run these commands ONE AT A TIME. You'll be asked for a password for each.

```bash
cd "/Users/billgalloway/Local Sites/Figma/expo-dev/my-expo-app/aituki-mobile"
```

Then check each keystore (copy and paste each command separately):

```bash
keytool -list -v -keystore "@billgalloway__aituki-native_OLD_4.jks" | grep SHA1
```

If that doesn't match, try the next one:

```bash
keytool -list -v -keystore "@billgalloway__aituki-native_OLD_3.jks" | grep SHA1
```

Continue with:

```bash
keytool -list -v -keystore "@billgalloway__aituki-native_OLD_2.jks" | grep SHA1
```

```bash
keytool -list -v -keystore "@billgalloway__aituki-native_OLD_1.jks" | grep SHA1
```

```bash
keytool -list -v -keystore "@billgalloway__aituki-native.jks" | grep SHA1
```

**What to look for:** One of these will show a line that says:
```
SHA1: 88:4F:22:CA:57:80:9D:DF:4E:A0:C4:77:5C:76:0B:19:F4:37:5B:48
```

**Write down which file has this SHA1!** (e.g., `@billgalloway__aituki-native_OLD_4.jks`)

---

## Step 2: Update EAS Credentials

Run this command:

```bash
eas credentials --platform android
```

You'll see a menu. Here's what to do:

1. **When asked "Which build profile do you want to configure?"**
   - Type: `production`
   - Press Enter

2. **When you see menu options:**
   - Choose: `Update existing Android Keystore` (or option that says "Update")
   - If you see "Set up a new Android Keystore", choose that instead

3. **When asked for keystore file path:**
   - Type the FULL PATH to the keystore file that matched in Step 1
   - Example: `/Users/billgalloway/Local Sites/Figma/expo-dev/my-expo-app/aituki-mobile/@billgalloway__aituki-native_OLD_4.jks`
   - Or use relative path: `@billgalloway__aituki-native_OLD_4.jks`

4. **When asked for keystore password:**
   - Enter the password for that keystore file
   - Press Enter

5. **When asked for key alias:**
   - Type: `@billgalloway__aituki-native`
   - Press Enter

6. **When asked for key password:**
   - Enter the key password (might be same as keystore password)
   - Press Enter

Done! Credentials are updated.

---

## Step 3: Rebuild the App

After updating credentials, tell me and I'll rebuild the app, or run:

```bash
eas build --platform android --profile production
```

---

## Troubleshooting

**If you get "file not found" error:**
- Make sure you're in the right directory: `cd "/Users/billgalloway/Local Sites/Figma/expo-dev/my-expo-app/aituki-mobile"`
- Use the full path to the keystore file

**If password doesn't work:**
- Try the same password you used for previous builds
- Check if you have the password saved somewhere

**If you can't find the matching SHA1:**
- One of the keystore files should match - try all of them
- The password might be the same for all files

