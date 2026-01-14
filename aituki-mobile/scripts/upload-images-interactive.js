/**
 * Interactive Image Upload Script
 * 
 * This version prompts for the service role key if not set
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const SUPABASE_URL = 'https://hhdntbgtedclqqufpzfj.supabase.co';
const IMAGES_DIR = path.join(process.env.HOME, 'Desktop', 'images aituki app');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function getServiceKey() {
  let serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;
  
  if (!serviceKey) {
    console.log('\n📝 You need your Supabase Service Role Key to upload images.');
    console.log('\n   To get it:');
    console.log('   1. Go to https://app.supabase.com');
    console.log('   2. Select your project');
    console.log('   3. Go to Settings > API');
    console.log('   4. Copy the "service_role" key (keep this secret!)\n');
    
    serviceKey = await question('   Paste your service_role key here: ');
    
    if (!serviceKey || serviceKey.trim().length === 0) {
      console.log('\n❌ Service key is required. Exiting.');
      rl.close();
      process.exit(1);
    }
  }
  
  return serviceKey.trim();
}

function getImageFiles() {
  if (!fs.existsSync(IMAGES_DIR)) {
    throw new Error(`Directory not found: ${IMAGES_DIR}`);
  }

  const files = fs.readdirSync(IMAGES_DIR);
  return files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.png', '.jpg', '.jpeg', '.webp'].includes(ext);
  });
}

async function uploadImage(supabase, filename, category = 'misc') {
  const localPath = path.join(IMAGES_DIR, filename);
  const ext = path.extname(filename).toLowerCase();
  const baseName = path.basename(filename, ext);
  
  const cleanName = baseName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
  const storagePath = `${category}/${cleanName}${ext}`;
  
  const fileBuffer = fs.readFileSync(localPath);
  const contentType = ext === '.png' ? 'image/png' : 
                     ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 
                     'image/webp';

  console.log(`  📤 ${filename} → ${storagePath}`);

  const { error } = await supabase.storage
    .from('images')
    .upload(storagePath, fileBuffer, {
      contentType,
      upsert: true,
    });

  if (error) {
    throw error;
  }

  const { data: urlData } = supabase.storage
    .from('images')
    .getPublicUrl(storagePath);

  return {
    originalName: filename,
    storagePath,
    publicUrl: urlData.publicUrl,
    category,
  };
}

async function main() {
  console.log('🚀 Uploading images to Supabase Storage\n');
  console.log(`📁 Source: ${IMAGES_DIR}\n`);

  try {
    // Get service key
    const serviceKey = await getServiceKey();
    const supabase = createClient(SUPABASE_URL, serviceKey);
    
    // Check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    if (listError) {
      console.error('❌ Error accessing Supabase:', listError.message);
      rl.close();
      process.exit(1);
    }
    
    const imagesBucket = buckets.find(b => b.name === 'images');
    if (!imagesBucket) {
      console.log('\n⚠️  "images" bucket not found. Creating it...');
      const { error: createError } = await supabase.storage.createBucket('images', {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
        fileSizeLimit: 5242880,
      });
      
      if (createError) {
        console.error('❌ Error creating bucket:', createError.message);
        console.log('\n   Please create the bucket manually in Supabase Dashboard:');
        console.log('   Storage > New bucket > Name: "images" > Public: Yes');
        rl.close();
        process.exit(1);
      }
      console.log('✅ Bucket created!\n');
    }

    // Get all image files
    const imageFiles = getImageFiles();
    console.log(`📸 Found ${imageFiles.length} image files\n`);

    if (imageFiles.length === 0) {
      console.log('❌ No image files found!');
      rl.close();
      return;
    }

    // Organize images
    const categories = {
      hero: [],
      today: [],
      suggestions: [],
      programs: [],
      misc: [],
    };

    imageFiles.forEach(file => {
      if (file.includes('Rectangle')) {
        categories.today.push(file);
      } else if (file.startsWith('image-')) {
        const num = parseInt(file.match(/\d+/)?.[0] || '0');
        if (num <= 2) categories.hero.push(file);
        else if (num <= 4) categories.suggestions.push(file);
        else categories.programs.push(file);
      } else {
        categories.misc.push(file);
      }
    });

    const uploaded = [];

    // Upload by category
    for (const [category, files] of Object.entries(categories)) {
      if (files.length === 0) continue;
      
      console.log(`\n📁 ${category.toUpperCase()} (${files.length} files):`);
      for (const file of files) {
        try {
          const result = await uploadImage(supabase, file, category);
          uploaded.push(result);
          console.log(`  ✅ ${result.publicUrl}`);
        } catch (error) {
          console.error(`  ❌ Error uploading ${file}:`, error.message);
        }
      }
    }

    // Generate mapping
    console.log('\n\n📝 Generating mapping file...\n');
    
    let mapping = `// Image Mapping for ImageLibrary.tsx
// Generated: ${new Date().toISOString()}
// Total images uploaded: ${uploaded.length}

// All uploaded images by category:
export const uploadedImages = {\n`;

    for (const [category, files] of Object.entries(categories)) {
      if (files.length === 0) continue;
      mapping += `  ${category}: {\n`;
      const categoryUploads = uploaded.filter(u => u.category === category);
      categoryUploads.forEach((upload, index) => {
        const key = `image${index + 1}`;
        mapping += `    ${key}: "${upload.publicUrl}", // ${upload.originalName}\n`;
      });
      mapping += `  },\n`;
    }

    mapping += `};\n\n`;

    // Save mapping file
    const mappingPath = path.join(__dirname, '../IMAGE_MAPPING.txt');
    fs.writeFileSync(mappingPath, mapping);
    
    console.log('✅ Upload complete!');
    console.log(`\n📄 Mapping saved to: ${mappingPath}`);
    console.log('\n📝 Next steps:');
    console.log('   1. Review IMAGE_MAPPING.txt');
    console.log('   2. Map images to correct keys in ImageLibrary.tsx');
    console.log('   3. Update ImageLibrary.tsx with Supabase URLs');
    
    rl.close();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    rl.close();
    process.exit(1);
  }
}

main();

