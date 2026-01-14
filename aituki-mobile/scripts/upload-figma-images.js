/**
 * Upload Figma Images to Supabase Storage
 * 
 * This script:
 * 1. Fetches image URLs from Figma design context
 * 2. Downloads the images
 * 3. Uploads them to Supabase Storage
 * 4. Updates ImageLibrary.tsx with Supabase URLs
 * 
 * Run this after setup-image-storage.js:
 * node scripts/upload-figma-images.js
 */

const { createClient } = require('@supabase/supabase-js');
const https = require('https');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://hhdntbgtedclqqufpzfj.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_KEY) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY is required for this script.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Image mapping from ImageLibrary.tsx
const imageMap = {
  hero: {
    perimenopause: { nodeId: '7e65b254-cb25-47c5-b232-fc4142b10519', description: 'Woman floating in water' },
    yoga: { nodeId: '67bd9410-30b6-4ccb-a6ff-640ac62711d2', description: 'Person in yoga pose' },
    mindfulness: { nodeId: 'a66a7586-f8f3-4d61-8c51-458ef146aa8c', description: 'Hands holding singing bowl' },
    mealPlanning: { nodeId: '8141d8d3-2ff8-42a7-95a2-200fb025134c', description: 'Salmon meal on plate' },
    sleep: { nodeId: '4cfa9d69-881d-4b40-a9ba-fb72a124d3a3', description: 'Woman sleeping on pillow' },
    symptomTracking: { nodeId: '3b344f7d-9dba-4a8a-9f8e-c6daf912f827', description: 'Two women checking pulse' },
  },
  today: {
    meditation: { nodeId: '240a5736-78e5-40b3-b7bd-eeab93539667', description: 'Meditation image (dried fruit slices)' },
    perimenopause: { nodeId: '93f7cede-00b4-4cde-8fa6-8c10df99fab2', description: 'Perimenopause image (cortisol test kit)' },
    diet: { nodeId: 'e8ec7a60-932e-4848-a5f1-751adc52fc97', description: 'Diet image (person cycling)' },
    therapy: { nodeId: 'd3360df0-ac36-43d7-88bc-7a7ed252724f', description: 'Therapy image (green capsule)' },
    exercise: { nodeId: '7e9fe9f0-b6bd-45e9-9883-d912db958427', description: 'Exercise image (person doing lunge)' },
  },
  suggestions: {
    hormoneTherapy: { nodeId: 'f7e3c16b-ea87-467b-8b14-03b1fb87f0dc', description: 'Hormone therapy - white and light green capsule pill' },
    weightManagement: { nodeId: '809f4054-f974-4008-9817-290692891d8d', description: 'Managing your weight - yellow banana' },
    fitness: { nodeId: 'bf236dc2-4b0d-418c-b320-75ba8a721449', description: 'Fitness - person doing pushup' },
    stressReduction: { nodeId: '5a28cf10-a200-4093-87ff-d62bb7913651', description: 'Stress reduction - person meditating' },
    conditionManagement: { nodeId: '8fd8d2cd-80f0-4fbe-8b89-31b8f18d4936', description: 'Condition management - person running' },
  },
  programs: {
    healthyLife: { nodeId: '83b687f3-8adc-4545-b23a-f9b0f6d227be', description: 'Life a healthier life - group in yoga pose' },
    mentalHealth: { nodeId: '3c17eae2-02a2-4924-a11e-7943085caa74', description: 'Focus on mental health - two hands clasped' },
    sleep: { nodeId: '4cfa9d69-881d-4b40-a9ba-fb72a124d3a3', description: 'Get a good nights sleep - woman sleeping' },
    strength: { nodeId: 'bf236dc2-4b0d-418c-b320-75ba8a721449', description: 'Get stronger - person doing pushup' },
    relax: { nodeId: 'a66a7586-f8f3-4d61-8c51-458ef146aa8c', description: 'Find time to relax - hands holding singing bowl' },
    sport: { nodeId: 'e8ec7a60-932e-4848-a5f1-751adc52fc97', description: 'Play a sport - person cycling' },
    community: { nodeId: '7e65b254-cb25-47c5-b232-fc4142b10519', description: 'Be part of a community - woman floating in water' },
  },
};

const FIGMA_FILE_KEY = 'DajMfwAJVdLDj6vjKbWudq';

/**
 * Download image from URL
 */
function downloadImage(url, filePath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(filePath);
      });
    }).on('error', (err) => {
      fs.unlink(filePath, () => {}); // Delete the file on error
      reject(err);
    });
  });
}

/**
 * Upload image to Supabase Storage
 */
async function uploadToSupabase(filePath, fileName) {
  const fileBuffer = fs.readFileSync(filePath);
  const { data, error } = await supabase.storage
    .from('images')
    .upload(fileName, fileBuffer, {
      contentType: 'image/png',
      upsert: true,
    });

  if (error) {
    throw error;
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from('images')
    .getPublicUrl(fileName);

  return urlData.publicUrl;
}

/**
 * Process all images
 */
async function processImages() {
  console.log('🚀 Starting image upload process...\n');

  const tempDir = path.join(__dirname, '../temp-images');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  const results = {};

  for (const [category, images] of Object.entries(imageMap)) {
    console.log(`\n📁 Processing ${category} images...`);
    results[category] = {};

    for (const [key, { nodeId, description }] of Object.entries(images)) {
      try {
        console.log(`  ⏳ ${key} (${description})...`);
        
        // NOTE: In a real implementation, you would use the Figma MCP tool here
        // to get the actual image download URL from the nodeId
        // For now, this is a placeholder that shows the structure
        
        console.log(`  ⚠️  Manual step required: Get image URL for node ${nodeId} from Figma`);
        console.log(`     You can use the Figma MCP get_design_context tool with nodeId: ${nodeId}`);
        console.log(`     Then extract the download URL from the response and update this script.`);
        
        // TODO: Replace this with actual Figma API call or MCP tool integration
        // const imageUrl = await getFigmaImageUrl(nodeId);
        // const tempPath = path.join(tempDir, `${category}-${key}.png`);
        // await downloadImage(imageUrl, tempPath);
        // const supabaseUrl = await uploadToSupabase(tempPath, `${category}/${key}.png`);
        // results[category][key] = supabaseUrl;
        // console.log(`  ✅ Uploaded: ${supabaseUrl}`);
        
      } catch (error) {
        console.error(`  ❌ Error processing ${key}:`, error.message);
      }
    }
  }

  // Cleanup temp directory
  fs.rmSync(tempDir, { recursive: true, force: true });

  console.log('\n✅ Process complete!');
  console.log('\n📝 Next steps:');
  console.log('   1. Use Figma MCP tool to get actual image URLs');
  console.log('   2. Update this script with the URLs');
  console.log('   3. Run the script again to upload images');
  console.log('   4. Update ImageLibrary.tsx with Supabase URLs');
}

processImages();

