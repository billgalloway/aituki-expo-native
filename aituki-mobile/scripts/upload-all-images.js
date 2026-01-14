/**
 * Upload All Local Images to Supabase Storage
 * 
 * This script:
 * 1. Scans the local images directory
 * 2. Uploads all images to Supabase Storage
 * 3. Generates a mapping file for ImageLibrary.tsx
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Get Supabase credentials from app.json or environment
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://hhdntbgtedclqqufpzfj.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_SERVICE_KEY) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY is required.');
  console.error('\n   Option 1: Add to environment:');
  console.error('   export SUPABASE_SERVICE_ROLE_KEY=your_key_here');
  console.error('\n   Option 2: Get it from:');
  console.error('   Supabase Dashboard > Settings > API > service_role key');
  console.error('\n   Then run this script again.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
const IMAGES_DIR = path.join(process.env.HOME, 'Desktop', 'images aituki app');

/**
 * Get all image files from directory
 */
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

/**
 * Upload image to Supabase
 */
async function uploadImage(filename, category = 'misc') {
  const localPath = path.join(IMAGES_DIR, filename);
  const ext = path.extname(filename).toLowerCase();
  const baseName = path.basename(filename, ext);
  
  // Clean filename for storage (remove spaces, special chars)
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

  // Get public URL
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

/**
 * Main function
 */
async function main() {
  console.log('🚀 Uploading images to Supabase Storage\n');
  console.log(`📁 Source: ${IMAGES_DIR}\n`);

  try {
    // Get all image files
    const imageFiles = getImageFiles();
    console.log(`📸 Found ${imageFiles.length} image files\n`);

    if (imageFiles.length === 0) {
      console.log('❌ No image files found!');
      return;
    }

    // Organize images by category (you can adjust this logic)
    const categories = {
      hero: [],
      today: [],
      suggestions: [],
      programs: [],
      misc: [],
    };

    // Simple categorization based on filename patterns
    imageFiles.forEach(file => {
      if (file.includes('Rectangle')) {
        categories.today.push(file);
      } else if (file.startsWith('image-')) {
        // Distribute across categories
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
          const result = await uploadImage(file, category);
          uploaded.push(result);
          console.log(`  ✅ ${result.publicUrl}`);
        } catch (error) {
          console.error(`  ❌ Error uploading ${file}:`, error.message);
        }
      }
    }

    // Generate mapping file
    console.log('\n\n📝 Generating mapping file...\n');
    
    let mapping = `// Image Mapping for ImageLibrary.tsx
// Generated: ${new Date().toISOString()}
// Total images uploaded: ${uploaded.length}

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

    // Also generate ImageLibrary format
    mapping += `// Copy this into ImageLibrary.tsx:\n\n`;
    mapping += `export const heroImages = {\n`;
    categories.hero.forEach((file, index) => {
      const upload = uploaded.find(u => u.originalName === file);
      if (upload) {
        const key = `image${index + 1}`;
        mapping += `  ${key}: "${upload.publicUrl}", // ${file}\n`;
      }
    });
    mapping += `};\n\n`;

    mapping += `export const todayImages = {\n`;
    categories.today.forEach((file, index) => {
      const upload = uploaded.find(u => u.originalName === file);
      if (upload) {
        const key = `image${index + 1}`;
        mapping += `  ${key}: "${upload.publicUrl}", // ${file}\n`;
      }
    });
    mapping += `};\n\n`;

    mapping += `export const suggestionImages = {\n`;
    categories.suggestions.forEach((file, index) => {
      const upload = uploaded.find(u => u.originalName === file);
      if (upload) {
        const key = `image${index + 1}`;
        mapping += `  ${key}: "${upload.publicUrl}", // ${file}\n`;
      }
    });
    mapping += `};\n\n`;

    mapping += `export const programImages = {\n`;
    categories.programs.forEach((file, index) => {
      const upload = uploaded.find(u => u.originalName === file);
      if (upload) {
        const key = `image${index + 1}`;
        mapping += `  ${key}: "${upload.publicUrl}", // ${file}\n`;
      }
    });
    mapping += `};\n`;

    // Save mapping file
    const mappingPath = path.join(__dirname, '../IMAGE_MAPPING.txt');
    fs.writeFileSync(mappingPath, mapping);
    
    console.log('✅ Upload complete!');
    console.log(`\n📄 Mapping saved to: ${mappingPath}`);
    console.log('\n📝 Next steps:');
    console.log('   1. Review IMAGE_MAPPING.txt');
    console.log('   2. Manually map images to the correct keys (perimenopause, yoga, etc.)');
    console.log('   3. Update ImageLibrary.tsx with the correct mappings');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();

