# Quick Start: Upload Images to Supabase

## Step 1: Set Up Storage Bucket

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project: `hhdntbgtedclqqufpzfj`
3. Go to **Storage** in the sidebar
4. Click **"New bucket"**
5. Name it: `images`
6. Make it **Public**
7. Click **"Create bucket"**

## Step 2: Export Images from Figma

1. Open: https://www.figma.com/design/DajMfwAJVdLDj6vjKbWudq/aiTuki-prototype-V01
2. For each image in `ImageLibrary.tsx`:
   - Find the image in Figma
   - Select it
   - Right-click > **Export** > Choose **PNG** or **WebP**
   - Export at **2x** or **3x** resolution
   - Save with the filename matching the key (e.g., `perimenopause.png`)

## Step 3: Upload to Supabase

1. In Supabase Dashboard > Storage > images bucket
2. Create folders: `hero/`, `today/`, `suggestions/`, `programs/`
3. Upload images to their respective folders:
   - Hero images → `hero/`
   - Today images → `today/`
   - Suggestion images → `suggestions/`
   - Program images → `programs/`

## Step 4: Get Public URLs

After uploading, click each file and copy the **Public URL**.

Format: `https://hhdntbgtedclqqufpzfj.supabase.co/storage/v1/object/public/images/hero/perimenopause.png`

## Step 5: Update ImageLibrary.tsx

Replace the Figma URLs with Supabase URLs:

```typescript
export const heroImages = {
  perimenopause: "https://hhdntbgtedclqqufpzfj.supabase.co/storage/v1/object/public/images/hero/perimenopause.png",
  // ... etc
};
```

## Image List

### Hero Images (6 images)
- perimenopause
- yoga
- mindfulness
- mealPlanning
- sleep
- symptomTracking

### Today Images (5 images)
- meditation
- perimenopause
- diet
- therapy
- exercise

### Suggestion Images (5 images)
- hormoneTherapy
- weightManagement
- fitness
- stressReduction
- conditionManagement

### Program Images (7 images)
- healthyLife
- mentalHealth
- sleep
- strength
- relax
- sport
- community

**Total: 23 images**

