# Update Android Keystore Instructions

## Expected SHA1 Fingerprint
```
88:4F:22:CA:57:80:9D:DF:4E:A0:C4:77:5C:76:0B:19:F4:37:5B:48
```

## Current SHA1 Fingerprint (Wrong)
```
76:84:BA:F3:63:A7:52:76:A5:EA:E8:FB:02:F3:03:92:9C:2B:46:52
```

## Available Keystore Files
1. `@billgalloway__aituki-native.jks` (most recent - Jan 16 00:48)
2. `@billgalloway__aituki-native_OLD_4.jks` (Jan 16 00:44)
3. `@billgalloway__aituki-native_OLD_3.jks` (Jan 16 00:44)
4. `@billgalloway__aituki-native_OLD_2.jks` (Jan 16 00:43)
5. `@billgalloway__aituki-native_OLD_1.jks` (Jan 16 00:43)

## Quick Fix Steps

1. **Find the correct keystore:**
   ```bash
   # Check each keystore's SHA1 (you'll need the password)
   keytool -list -v -keystore "@billgalloway__aituki-native.jks" | grep SHA1
   keytool -list -v -keystore "@billgalloway__aituki-native_OLD_4.jks" | grep SHA1
   keytool -list -v -keystore "@billgalloway__aituki-native_OLD_3.jks" | grep SHA1
   keytool -list -v -keystore "@billgalloway__aituki-native_OLD_2.jks" | grep SHA1
   keytool -list -v -keystore "@billgalloway__aituki-native_OLD_1.jks" | grep SHA1
   ```

2. **Update EAS credentials:**
   ```bash
   eas credentials --platform android
   ```
   - Select: **production**
   - Choose: **Update existing Android Keystore**
   - Provide the path to the keystore with matching SHA1
   - Enter keystore password
   - Enter key alias (usually: `@billgalloway__aituki-native`)
   - Enter key password

3. **Rebuild:**
   ```bash
   eas build --platform android --profile production
   ```

