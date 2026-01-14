# Supabase Image Storage Setup

This guide explains how to set up Supabase Storage for images and migrate images from Figma.

## Overview

Instead of using expired Figma MCP asset URLs, we'll store images in Supabase Storage, which provides:
- Permanent, reliable image URLs
- Public access without authentication
- CDN delivery for fast loading
- Easy management via Supabase Dashboard

## Setup Steps

### 1. Create Storage Bucket

Run the setup script:

```bash
node scripts/setup-image-storage.js
```

**Note:** You'll need to add `SUPABASE_SERVICE_ROLE_KEY` to your environment variables or `.env` file.

To get your service role key:
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to Settings > API
4. Copy the `service_role` key (keep this secret!)

### 2. Upload Images

#### Option A: Manual Upload (Recommended for now)

1. **Export images from Figma:**
   - Open the Figma file: https://www.figma.com/design/DajMfwAJVdLDj6vjKbWudq/aiTuki-prototype-V01
   - Select each image component
   - Right-click > Export > PNG (or your preferred format)
   - Export at 2x or 3x resolution for retina displays

2. **Upload to Supabase:**
   - Go to Supabase Dashboard > Storage > images bucket
   - Click "Upload file"
   - Organize by category:
     - `hero/` - Hero program images
     - `today/` - Today activity images
     - `suggestions/` - Digital twin suggestion images
     - `programs/` - Article/program images

3. **Get Public URLs:**
   - After uploading, click on each file
   - Copy the public URL (format: `https://[project].supabase.co/storage/v1/object/public/images/...`)

#### Option B: Automated Script (Future)

Once we have Figma API integration working, you can use:
```bash
node scripts/upload-figma-images.js
```

### 3. Update ImageLibrary.tsx

Replace the Figma MCP URLs with Supabase URLs:

```typescript
export const heroImages = {
  perimenopause: "https://hhdntbgtedclqqufpzfj.supabase.co/storage/v1/object/public/images/hero/perimenopause.png",
  yoga: "https://hhdntbgtedclqqufpzfj.supabase.co/storage/v1/object/public/images/hero/yoga.png",
  // ... etc
};
```

## File Structure in Supabase

```
images/
├── hero/
│   ├── perimenopause.png
│   ├── yoga.png
│   ├── mindfulness.png
│   ├── mealPlanning.png
│   ├── sleep.png
│   └── symptomTracking.png
├── today/
│   ├── meditation.png
│   ├── perimenopause.png
│   ├── diet.png
│   ├── therapy.png
│   └── exercise.png
├── suggestions/
│   ├── hormoneTherapy.png
│   ├── weightManagement.png
│   ├── fitness.png
│   ├── stressReduction.png
│   └── conditionManagement.png
└── programs/
    ├── healthyLife.png
    ├── mentalHealth.png
    ├── sleep.png
    ├── strength.png
    ├── relax.png
    ├── sport.png
    └── community.png
```

## Image Specifications

- **Format:** PNG or WebP (WebP preferred for smaller file sizes)
- **Resolution:** 2x or 3x for retina displays
- **Max Size:** 5MB per image (configured in bucket settings)
- **Aspect Ratios:** Maintain original aspect ratios from Figma

## Troubleshooting

### Images not loading
- Check that the bucket is set to public
- Verify the file paths match exactly (case-sensitive)
- Check CORS settings in Supabase Dashboard

### Upload errors
- Ensure you're using the service role key (not anon key)
- Check file size limits (5MB default)
- Verify file format is allowed (PNG, JPEG, WebP, GIF)

## Next Steps

1. ✅ Set up storage bucket
2. ⏳ Export images from Figma
3. ⏳ Upload to Supabase
4. ⏳ Update ImageLibrary.tsx
5. ⏳ Test in app

## References

- [Supabase Storage Docs](https://supabase.com/docs/guides/storage)
- [Figma Export Guide](https://help.figma.com/hc/en-us/articles/360040328153-Export-files-and-images)

