# Contentful Troubleshooting Guide

## What I Fixed

1. ✅ Added environment variables to `app.json` (required for Expo OTA updates)
2. ✅ Improved error handling and logging throughout
3. ✅ Added support for both `Constants.expoConfig` (for updates) and `process.env` (for dev)
4. ✅ Added detailed console logging to help diagnose issues

## How to Debug

### Step 1: Check Console Logs

Open your app and check the console/logs. You should see messages like:

```
Contentful Config: { spaceId: 'khv3gydij...', accessToken: 'SET', ... }
useHeroPrograms: Starting to load hero programs...
✅ Contentful credentials found, fetching programs...
Fetching hero programs from Contentful...
Found X hero programs in Contentful
```

### Step 2: Common Issues and Solutions

#### Issue: "Contentful not configured" warning

**Symptoms:**
- Console shows: `⚠️ Contentful not configured. Using fallback data.`
- App shows fallback hero programs

**Solutions:**
1. **For Local Development:**
   - Make sure `.env` file exists in `aituki-mobile/` directory
   - File should contain:
     ```
     EXPO_PUBLIC_CONTENTFUL_SPACE_ID=khv3gydijy42
     EXPO_PUBLIC_CONTENTFUL_ACCESS_TOKEN=7QpbzAYqvMOCfz8Zs1x9YJp_aAteBqqfIbFUZIfRhCc
     ```
   - Restart Expo server after creating/modifying `.env`

2. **For Expo Updates (OTA):**
   - Environment variables are now in `app.json` under `extra`
   - They should be included automatically in updates
   - If still not working, you may need to rebuild the development client

#### Issue: "No hero programs found in Contentful"

**Symptoms:**
- Console shows: `⚠️ No hero programs found in Contentful. Using fallback data.`
- Console shows: `Found 0 hero programs in Contentful`

**Solutions:**
1. **Check Content Type:**
   - Go to Contentful → Content model
   - Verify content type exists with API ID: `heroProgram` (exact match, case-sensitive)
   - If it has a different name, update `services/contentful.ts` line 58

2. **Check Entries:**
   - Go to Contentful → Content
   - Make sure you have entries of type "Hero Program"
   - **Important:** Entries must be **Published**, not just saved as drafts
   - Draft entries won't be returned by the Content Delivery API

3. **Check Field Names:**
   - Required fields: `title`, `duration`
   - Image field: Either `image` (Media asset) or `imageUrl` (Short text)
   - Field IDs must match exactly (case-sensitive)

#### Issue: "Contentful client not initialized"

**Symptoms:**
- Console shows: `Contentful credentials not found`
- Error: `Contentful client not initialized`

**Solutions:**
1. Check that environment variables are set correctly
2. Verify the values in `app.json` → `extra` section
3. For local dev, check `.env` file exists and has correct values
4. Restart Expo server after changes

#### Issue: API Errors (401, 403, 404)

**Symptoms:**
- Console shows: `Contentful API Error: { status: 401, ... }`

**Solutions:**
1. **401 Unauthorized:**
   - Check your Access Token is correct
   - Make sure you're using the **Content Delivery API** token, not Management API
   - Token should start with something like `7QpbzAYqv...`

2. **403 Forbidden:**
   - Check your Space ID is correct
   - Verify the token has access to the space

3. **404 Not Found:**
   - Check content type ID is correct: `heroProgram`
   - Verify the space ID is correct

#### Issue: Images Not Loading

**Symptoms:**
- Hero programs load but images don't display
- Console shows image load errors

**Solutions:**
1. **If using Contentful Assets:**
   - Make sure the image asset is published
   - Check that `fields.image.fields.file.url` exists in the response
   - Verify the image URL format: should be `https://images.ctfassets.net/...`

2. **If using External URLs:**
   - Use the `imageUrl` field (Short text type)
   - Make sure URLs are publicly accessible
   - URLs should start with `http://` or `https://`

## Testing Your Contentful Setup

### Quick Test Script

You can test the Contentful connection directly. Add this temporarily to your component:

```typescript
import { contentfulClient } from '@/services/contentful';
import Constants from 'expo-constants';

// Test function
const testContentful = async () => {
  console.log('Testing Contentful connection...');
  console.log('Constants.expoConfig.extra:', Constants.expoConfig?.extra);
  console.log('process.env:', {
    spaceId: process.env.EXPO_PUBLIC_CONTENTFUL_SPACE_ID ? 'SET' : 'NOT SET',
    token: process.env.EXPO_PUBLIC_CONTENTFUL_ACCESS_TOKEN ? 'SET' : 'NOT SET',
  });
  
  try {
    const response = await contentfulClient.getContentTypes();
    console.log('✅ Connected! Content types:', response.items.map(ct => ct.sys.id));
  } catch (error) {
    console.error('❌ Connection failed:', error);
  }
};

// Call it in useEffect
useEffect(() => {
  testContentful();
}, []);
```

## Verification Checklist

- [ ] `.env` file exists with correct values (for local dev)
- [ ] `app.json` has environment variables in `extra` section (for OTA updates)
- [ ] Content type `heroProgram` exists in Contentful
- [ ] Content type has fields: `title`, `duration`, and either `image` or `imageUrl`
- [ ] At least one entry exists and is **Published** (not draft)
- [ ] Access Token is a Content Delivery API token (not Management API)
- [ ] Space ID is correct
- [ ] Expo server restarted after `.env` changes
- [ ] Development client rebuilt if using OTA updates (after adding to app.json)

## Next Steps

1. **Check the console logs** - they now provide detailed information
2. **Verify Contentful setup** - make sure content type and entries exist
3. **Test locally first** - use `.env` file for local development
4. **Rebuild if needed** - if using OTA updates, you may need to rebuild the dev client after adding env vars to app.json

## Still Not Working?

If you're still having issues:

1. Share the console logs (especially the Contentful Config and error messages)
2. Verify your Contentful space has:
   - Content type: `heroProgram`
   - At least one published entry
   - Fields: `title`, `duration`, `image` (or `imageUrl`)
3. Check the EAS Dashboard for any update errors
4. Try rebuilding the development client if using OTA updates

