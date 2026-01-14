# Quick Image Upload Guide

## Step 1: Get Supabase Service Role Key

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings** > **API**
4. Copy the **service_role** key (keep this secret!)

## Step 2: Set Environment Variable

```bash
export SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## Step 3: Create Storage Bucket (if not exists)

1. In Supabase Dashboard, go to **Storage**
2. Click **"New bucket"**
3. Name: `images`
4. Make it **Public**
5. Click **"Create bucket"**

## Step 4: Run Upload Script

```bash
cd expo-dev/my-expo-app/aituki-mobile
node scripts/upload-all-images.js
```

This will:
- Upload all images from `~/Desktop/images aituki app`
- Organize them into categories (hero, today, suggestions, programs)
- Generate a mapping file: `IMAGE_MAPPING.txt`

## Step 5: Review and Update ImageLibrary.tsx

1. Open `IMAGE_MAPPING.txt`
2. Review the uploaded images and their URLs
3. Manually map them to the correct keys in `ImageLibrary.tsx`:
   - `perimenopause`, `yoga`, `mindfulness`, etc. for hero images
   - `meditation`, `perimenopause`, `diet`, etc. for today images
   - And so on...

4. Update `components/ImageLibrary.tsx` with the Supabase URLs

## Troubleshooting

### "SUPABASE_SERVICE_ROLE_KEY is required"
- Make sure you've set the environment variable
- Or add it to a `.env` file in the project root

### "Bucket not found"
- Create the `images` bucket in Supabase Dashboard first
- Make sure it's set to public

### Images not loading in app
- Verify the bucket is public
- Check the URLs in ImageLibrary.tsx match the Supabase URLs
- Ensure file paths are correct (case-sensitive)

