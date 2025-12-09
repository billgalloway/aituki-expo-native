# First Google Play Submission - Manual Steps

## ✅ Build Complete!

Your production AAB file has been built successfully:
- **Build ID:** `ebfc643f-baab-4694-89f4-5e58ecd7468e`
- **Download URL:** https://expo.dev/artifacts/eas/v99N8p4pPwaYzfkskUcbyf.aab
- **Version:** 1.0.1 (versionCode: 1)

## 📋 Manual Submission Steps

Google Play requires the **first submission** to be done manually. After this, you can use automatic submission.

### Step 1: Download the AAB File

The AAB file has been downloaded to your current directory, or you can download it from:
https://expo.dev/artifacts/eas/v99N8p4pPwaYzfkskUcbyf.aab

### Step 2: Go to Google Play Console

1. Visit: https://play.google.com/console
2. Sign in with: **bill.galloway7@gmail.com**
3. Select your app: **AiTuki** (package: `com.aituki.mobile`)

### Step 3: Create Your First Release

1. In the left sidebar, go to **"Production"** (or **"Internal testing"** for testing first)
2. Click **"Create new release"**
3. Click **"Upload"** and select your `.aab` file
4. Add **Release notes** (e.g., "Initial release of AiTuki")
5. Click **"Save"**

### Step 4: Complete Required Information

Before you can publish, you must complete:

#### Store Listing
- ✅ App icon (512x512px) - Already configured
- ⚠️ Screenshots (at least 2, up to 8)
- ⚠️ Short description (80 characters max)
- ⚠️ Full description (4000 characters max)
- ⚠️ Privacy policy URL (required)
- ⚠️ Feature graphic (1024x500px) - Optional but recommended

#### App Content
- ⚠️ Content rating questionnaire
- ⚠️ Data safety form
- ⚠️ Target audience

#### Pricing & Distribution
- ⚠️ Set as Free or Paid
- ⚠️ Select countries for distribution

### Step 5: Review and Publish

1. Review all the information
2. Click **"Review release"**
3. If everything looks good, click **"Start rollout to Production"** (or your chosen track)

## 🎯 Recommended: Start with Internal Testing

For your first submission, consider using **Internal testing** track:

1. Go to **"Testing" → "Internal testing"**
2. Create a new release there first
3. Test the app with a small group
4. Then promote to Production when ready

## 📝 After First Submission

Once you've completed the first manual submission, future submissions can be automated:

```bash
eas submit --platform android --latest
```

This will automatically upload new builds to Google Play.

## 🔗 Quick Links

- **Play Console:** https://play.google.com/console
- **Your App:** https://play.google.com/console/u/0/developers/.../app/...
- **Build Download:** https://expo.dev/artifacts/eas/v99N8p4pPwaYzfkskUcbyf.aab
- **EAS Dashboard:** https://expo.dev/accounts/billgalloway/projects/aituki-native/builds

## ⚠️ Important Notes

1. **Version Code:** Each new build must have a higher version code. Current: `1`
2. **Review Time:** First submission can take 1-7 days for review
3. **Testing:** Use Internal testing track first to test before public release
4. **Privacy Policy:** Required - make sure you have a valid URL

## 📚 Additional Resources

- See `ANDROID_PUBLISHING.md` for detailed publishing guide
- See `GOOGLE_PLAY_SERVICE_ACCOUNT_SETUP.md` for service account info
- See `QUICK_SUBMIT_GUIDE.md` for quick reference

