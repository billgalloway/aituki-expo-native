/**
 * Upload Local Images to Supabase Storage
 * 
 * This script uploads images from the local desktop folder to Supabase Storage
 * and generates the updated ImageLibrary.tsx code with Supabase URLs.
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://hhdntbgtedclqqufpzfj.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_KEY) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY is required.');
  console.error('   Add it to your .env file: SUPABASE_SERVICE_ROLE_KEY=your_key_here');
  console.error('   Get it from: Supabase Dashboard > Settings > API > service_role key');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Local images directory
const IMAGES_DIR = path.join(process.env.HOME, 'Desktop', 'images aituki app');

// Image mapping - you may need to adjust this based on your actual image files
// This maps the image keys from ImageLibrary.tsx to local filenames
const IMAGE_MAPPING = {
  hero: {
    perimenopause: 'image-1.png', // Adjust based on actual files
    yoga: 'image-2.png',
    mindfulness: 'image-3.png',
    mealPlanning: 'image-4.png',
    sleep: 'image-5.jpg',
    symptomTracking: 'image-6.jpg',
  },
  today: {
    meditation: 'Rectangle 2233.png',
    perimenopause: 'Rectangle 2233-1.png',
    diet: 'Rectangle 2233-2.png',
    therapy: 'Rectangle 2233-3.png',
    exercise: 'image.png',
  },
  suggestions: {
    hormoneTherapy: 'image-1.jpg',
    weightManagement: 'image-2.jpg',
    fitness: 'image-3.jpg',
    stressReduction: 'image-4.jpg',
    conditionManagement: 'image.jpg',
  },
  programs: {
    healthyLife: 'image-1.png',
    mentalHealth: 'image-2.png',
    sleep: 'image-3.png',
    strength: 'image-4.png',
    relax: 'image.png',
    sport: 'image-1.jpg',
    community: 'image-2.jpg',
  },
};

/**
 * Upload a single image to Supabase Storage
 */
async function uploadImage(localPath, storagePath) {
  try {
    const fileBuffer = fs.readFileSync(localPath);
    const ext = path.extname(localPath).toLowerCase();
    
    // Determine content type
    const contentType = ext === '.png' ? 'image/png' : 
                       ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 
                       'image/png';

    console.log(`  📤 Uploading: ${path.basename(localPath)} → ${storagePath}`);

    const { data, error } = await supabase.storage
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

    return urlData.publicUrl;
  } catch (error) {
    console.error(`  ❌ Error uploading ${localPath}:`, error.message);
    throw error;
  }
}

/**
 * Process all images
 */
async function processImages() {
  console.log('🚀 Starting image upload to Supabase...\n');
  console.log(`📁 Source directory: ${IMAGES_DIR}\n`);

  // Check if directory exists
  if (!fs.existsSync(IMAGES_DIR)) {
    console.error(`❌ Directory not found: ${IMAGES_DIR}`);
    process.exit(1);
  }

  const results = {};
  const uploadedUrls = {};

  for (const [category, images] of Object.entries(IMAGE_MAPPING)) {
    console.log(`\n📁 Processing ${category} images...`);
    results[category] = {};
    uploadedUrls[category] = {};

    for (const [key, filename] of Object.entries(images)) {
      try {
        const localPath = path.join(IMAGES_DIR, filename);
        
        // Try different extensions if file doesn't exist
        let actualPath = localPath;
        if (!fs.existsSync(actualPath)) {
          // Try .png if .jpg, or .jpg if .png
          const ext = path.extname(filename);
          const baseName = path.basename(filename, ext);
          const altExt = ext === '.png' ? '.jpg' : '.png';
          const altPath = path.join(IMAGES_DIR, baseName + altExt);
          
          if (fs.existsSync(altPath)) {
            actualPath = altPath;
            console.log(`  ⚠️  Using ${path.basename(altPath)} instead of ${filename}`);
          } else {
            console.log(`  ⚠️  File not found: ${filename}, skipping...`);
            continue;
          }
        }

        const storagePath = `${category}/${key}${path.extname(actualPath)}`;
        const publicUrl = await uploadImage(actualPath, storagePath);
        
        results[category][key] = publicUrl;
        uploadedUrls[category][key] = publicUrl;
        console.log(`  ✅ ${key}: ${publicUrl}`);
        
      } catch (error) {
        console.error(`  ❌ Error processing ${key}:`, error.message);
      }
    }
  }

  // Generate updated ImageLibrary.tsx code
  console.log('\n\n📝 Generated ImageLibrary.tsx code:\n');
  console.log('='.repeat(60));
  
  let code = `// Hero program images (horizontal scroll cards)
export const heroImages = {\n`;
  
  for (const [key, url] of Object.entries(uploadedUrls.hero || {})) {
    code += `  ${key}: "${url}",\n`;
  }
  code += `};\n\n`;

  code += `// Today activity tile images
export const todayImages = {\n`;
  for (const [key, url] of Object.entries(uploadedUrls.today || {})) {
    code += `  ${key}: "${url}",\n`;
  }
  code += `};\n\n`;

  code += `// Digital twin suggestion card images
export const suggestionImages = {\n`;
  for (const [key, url] of Object.entries(uploadedUrls.suggestions || {})) {
    code += `  ${key}: "${url}",\n`;
  }
  code += `};\n\n`;

  code += `// Additional program images (Articles section)
export const programImages = {\n`;
  for (const [key, url] of Object.entries(uploadedUrls.programs || {})) {
    code += `  ${key}: "${url}",\n`;
  }
  code += `};\n`;

  console.log(code);
  console.log('='.repeat(60));

  // Save to file
  const outputPath = path.join(__dirname, '../IMAGE_LIBRARY_UPDATE.txt');
  fs.writeFileSync(outputPath, code);
  console.log(`\n💾 Code saved to: ${outputPath}`);
  console.log('\n✅ Upload complete!');
  console.log('\n📝 Next steps:');
  console.log('   1. Review the generated code above');
  console.log('   2. Copy it into components/ImageLibrary.tsx');
  console.log('   3. Test the app to verify images load correctly');
}

// Run the script
processImages().catch(console.error);

