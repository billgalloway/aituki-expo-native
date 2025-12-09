/**
 * Diagnostic tool to test Contentful connection
 * Add this to your component temporarily to debug
 */

import { contentfulClient } from '@/services/contentful';
import Constants from 'expo-constants';

export async function testContentfulConnection() {
  console.log('=== Contentful Diagnostic Test ===');
  
  // Check environment variables
  const spaceId = Constants.expoConfig?.extra?.EXPO_PUBLIC_CONTENTFUL_SPACE_ID || 
                  process.env.EXPO_PUBLIC_CONTENTFUL_SPACE_ID;
  const accessToken = Constants.expoConfig?.extra?.EXPO_PUBLIC_CONTENTFUL_ACCESS_TOKEN || 
                      process.env.EXPO_PUBLIC_CONTENTFUL_ACCESS_TOKEN;
  
  console.log('1. Environment Check:');
  console.log('   Space ID:', spaceId ? `${spaceId.substring(0, 8)}...` : '❌ NOT SET');
  console.log('   Access Token:', accessToken ? '✅ SET' : '❌ NOT SET');
  console.log('   From Constants:', !!Constants.expoConfig?.extra?.EXPO_PUBLIC_CONTENTFUL_SPACE_ID);
  console.log('   From process.env:', !!process.env.EXPO_PUBLIC_CONTENTFUL_SPACE_ID);
  
  if (!spaceId || !accessToken) {
    console.error('❌ Environment variables not configured!');
    return;
  }
  
  try {
    // Test 1: Get all content types
    console.log('\n2. Testing Connection...');
    const contentTypes = await contentfulClient.getContentTypes();
    console.log(`   ✅ Connected! Found ${contentTypes.items.length} content types:`);
    contentTypes.items.forEach(ct => {
      console.log(`      - ${ct.name} (API ID: ${ct.sys.id})`);
    });
    
    // Test 2: Check if heroProgram content type exists
    console.log('\n3. Checking for heroProgram content type...');
    const heroProgramType = contentTypes.items.find(ct => ct.sys.id === 'heroProgram');
    if (heroProgramType) {
      console.log('   ✅ Found heroProgram content type!');
      console.log('   Fields:', heroProgramType.fields.map(f => `${f.id} (${f.type})`).join(', '));
    } else {
      console.error('   ❌ heroProgram content type NOT FOUND!');
      console.error('   Available content types:', contentTypes.items.map(ct => ct.sys.id).join(', '));
      return;
    }
    
    // Test 3: Get entries
    console.log('\n4. Fetching heroProgram entries...');
    const entries = await contentfulClient.getEntries({
      content_type: 'heroProgram',
      include: 2,
    });
    
    console.log(`   Found ${entries.items.length} entries`);
    
    if (entries.items.length === 0) {
      console.error('   ❌ No entries found!');
      console.error('   Make sure entries are PUBLISHED (not drafts)');
      return;
    }
    
    // Test 4: Inspect first entry
    console.log('\n5. Inspecting first entry:');
    const firstEntry = entries.items[0];
    console.log('   Entry ID:', firstEntry.sys.id);
    console.log('   Fields:', Object.keys(firstEntry.fields));
    console.log('   Title:', firstEntry.fields.title);
    console.log('   Duration:', firstEntry.fields.duration);
    
    if (firstEntry.fields.image) {
      if (firstEntry.fields.image.fields?.file?.url) {
        console.log('   Image URL:', `https:${firstEntry.fields.image.fields.file.url}`);
      } else {
        console.log('   Image:', JSON.stringify(firstEntry.fields.image, null, 2));
      }
    } else if (firstEntry.fields.imageUrl) {
      console.log('   Image URL:', firstEntry.fields.imageUrl);
    } else {
      console.warn('   ⚠️ No image field found!');
    }
    
    console.log('\n✅ All tests passed! Contentful is configured correctly.');
    console.log('   If content still not showing, check the component logs.');
    
  } catch (error: any) {
    console.error('\n❌ Error testing Contentful:', error);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Status Text:', error.response.statusText);
      console.error('   Message:', error.message);
    }
    if (error.sys) {
      console.error('   Contentful Error ID:', error.sys.id);
    }
  }
  
  console.log('=== End Diagnostic Test ===\n');
}

