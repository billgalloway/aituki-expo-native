# Builds Directory

This directory contains all build artifacts for the AiTuki mobile app.

## 📦 Contents

### Android Builds (.aab)
- `app-release.aab` - Initial release build
- `app-release-v1.0.2.aab` - Version 1.0.2 release
- `app-release-v1.0.3.aab` - Version 1.0.3 release
- `app-release-v2.aab` - Version 2.0 release
- `app-release-v2-auth.aab` - Version 2.0 with authentication
- `app-release-v2-build9.aab` - Version 2.0 build 9
- `app-release-v2-vc5.aab` - Version 2.0 variant C5
- `aituki-mobile-build-15.aab` - Build 15 (current production)

### iOS Builds (.ipa)
- `aituki-ios-build-91328c4a.ipa` - iOS build

### Development Builds
- `latest-ios-dev-build.tar.gz` - Latest iOS development build archive

### Debug Files
- `bugreport-sdk_gphone64_arm64-BE4B.251210.005-2026-01-12-00-36-33.zip` - Android bug report

## 📝 Notes

- All build files are versioned and dated
- Production builds are marked with version numbers
- Development builds may contain debug symbols
- Bug reports are saved for troubleshooting

## 🚀 Usage

These builds are ready for:
- **Android**: Upload to Google Play Console (.aab files)
- **iOS**: Upload to App Store Connect (.ipa files)
- **Testing**: Install directly on devices for testing

## 🔒 Security

**Important**: These build files may contain:
- Signed certificates
- API keys (if embedded)
- App bundle signatures

Do not share these files publicly or commit them to public repositories.

---

**Last Updated**: January 2025

