/**
 * Setup Supabase Storage for Images
 * 
 * This script:
 * 1. Creates a public 'images' bucket in Supabase Storage
 * 2. Sets up proper permissions for public read access
 * 
 * Run this once to set up the storage bucket:
 * node scripts/setup-image-storage.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://hhdntbgtedclqqufpzfj.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY; // You'll need to add this

if (!SUPABASE_SERVICE_KEY) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY is required for this script.');
  console.error('   Get it from: Supabase Dashboard > Settings > API > service_role key');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function setupImageStorage() {
  console.log('🚀 Setting up Supabase Storage for images...\n');

  try {
    // Check if bucket already exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('❌ Error listing buckets:', listError);
      return;
    }

    const imagesBucket = buckets.find(b => b.name === 'images');
    
    if (imagesBucket) {
      console.log('✅ Images bucket already exists');
    } else {
      // Create the bucket
      const { data, error } = await supabase.storage.createBucket('images', {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
        fileSizeLimit: 5242880, // 5MB
      });

      if (error) {
        console.error('❌ Error creating bucket:', error);
        return;
      }

      console.log('✅ Created images bucket');
    }

    // Set bucket to public (if not already)
    const { error: updateError } = await supabase.storage.updateBucket('images', {
      public: true,
    });

    if (updateError) {
      console.error('⚠️  Warning: Could not update bucket settings:', updateError.message);
    } else {
      console.log('✅ Bucket is set to public');
    }

    console.log('\n✅ Setup complete!');
    console.log('\n📝 Next steps:');
    console.log('   1. Run: node scripts/upload-figma-images.js');
    console.log('   2. This will fetch images from Figma and upload them to Supabase');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

setupImageStorage();

