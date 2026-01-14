import { createClient } from 'contentful';
import Constants from 'expo-constants';

// Contentful configuration - use Constants.expoConfig for Expo updates
const getEnvVar = (key: string): string => {
  // Try Constants first (for Expo updates), then process.env (for dev)
  return Constants.expoConfig?.extra?.[key] || 
         process.env[key] || 
         '';
};

const SPACE_ID = getEnvVar('EXPO_PUBLIC_CONTENTFUL_SPACE_ID');
const ACCESS_TOKEN = getEnvVar('EXPO_PUBLIC_CONTENTFUL_ACCESS_TOKEN');

// Log configuration (without sensitive data)
console.log('Contentful Config:', {
  spaceId: SPACE_ID ? `${SPACE_ID.substring(0, 8)}...` : 'NOT SET',
  accessToken: ACCESS_TOKEN ? 'SET' : 'NOT SET',
  hasConstants: !!Constants.expoConfig?.extra,
  hasProcessEnv: !!process.env.EXPO_PUBLIC_CONTENTFUL_SPACE_ID,
});

// Create Contentful client only if credentials are available
let contentfulClient: ReturnType<typeof createClient> | null = null;

if (SPACE_ID && ACCESS_TOKEN) {
  try {
    contentfulClient = createClient({
      space: SPACE_ID,
      accessToken: ACCESS_TOKEN,
    });
  } catch (error) {
    console.error('Failed to create Contentful client:', error);
  }
} else {
  console.warn('Contentful credentials not found. Check your .env file or app.json extra config.');
}

// Export client for testing
export { contentfulClient };

// Helper function to format duration string
// Always shows in order: "X weeks • Day Y • Z min pw"
// Shows all three fields if they exist, even if some are 0
function formatDuration(weeks: number, days: number, minPerWeek: number): string {
  const parts: string[] = [];
  
  // Always include duration (weeks) first - show if it exists (even if 0)
  if (weeks !== undefined && weeks !== null && !isNaN(weeks)) {
    if (weeks > 0) {
      parts.push(`${weeks} week${weeks !== 1 ? 's' : ''}`);
    } else {
      // If 0, still show it but as "0 weeks" or skip - let's skip 0 values
      console.warn(`Duration weeks is 0 for program, skipping`);
    }
  } else {
    console.warn(`Duration weeks is missing (undefined/null/NaN)`);
  }
  
  // Always include durationDays second - show if it exists
  if (days !== undefined && days !== null && !isNaN(days)) {
    if (days > 0) {
      parts.push(`Day ${days}`);
    } else {
      console.warn(`Duration days is 0 for program, skipping`);
    }
  } else {
    console.warn(`Duration days is missing (undefined/null/NaN)`);
  }
  
  // Always include minPerWeek last - show if it exists
  if (minPerWeek !== undefined && minPerWeek !== null && !isNaN(minPerWeek)) {
    if (minPerWeek > 0) {
      parts.push(`${minPerWeek} min pw`);
    } else {
      console.warn(`Min per week is 0 for program, skipping`);
    }
  } else {
    console.warn(`Min per week is missing (undefined/null/NaN)`);
  }
  
  const result = parts.length > 0 ? parts.join(' • ') : '';
  console.log(`formatDuration result: "${result}" (weeks: ${weeks}, days: ${days}, minPerWeek: ${minPerWeek})`);
  return result;
}

// Hero Program content type interface
export interface HeroProgram {
  title: string;
  duration: number; // Number of weeks
  durationDays: number; // Number of days
  minPerWeek: number; // Minutes per week
  image: string;
  sys: {
    id: string;
  };
  // Computed formatted duration string
  formattedDuration?: string;
}

// Fetch hero programs from Contentful
export async function fetchHeroPrograms(): Promise<HeroProgram[]> {
  if (!contentfulClient) {
    throw new Error('Contentful client not initialized. Check your environment variables.');
  }

  try {
    console.log('Fetching hero programs from Contentful...');
    const response = await contentfulClient.getEntries({
      content_type: 'heroProgram', // Content type ID in Contentful
      order: 'sys.createdAt', // Order by creation date
      include: 2, // Include linked assets and entries
    });

    console.log(`Found ${response.items.length} hero programs in Contentful`);

    if (response.items.length === 0) {
      console.warn('No entries found for content type "heroProgram". Make sure:');
      console.warn('1. The content type exists in Contentful');
      console.warn('2. The content type API ID is exactly "heroProgram"');
      console.warn('3. You have published entries (not just drafts)');
      return [];
    }

    // Log raw first entry for debugging
    if (response.items.length > 0) {
      const firstEntry = response.items[0];
      // Safety check before accessing fields
      if (firstEntry && firstEntry.fields && typeof firstEntry.fields === 'object') {
        console.log('Raw first entry fields:', Object.keys(firstEntry.fields));
        console.log('Raw first entry sample:', {
          title: firstEntry.fields.title,
          duration: firstEntry.fields.duration,
          durationDays: firstEntry.fields.durationDays,
          minPerWeek: firstEntry.fields.minPerWeek,
          hasImage: !!firstEntry.fields.image,
          hasImageUrl: !!firstEntry.fields.imageUrl,
          imageType: firstEntry.fields.image ? typeof firstEntry.fields.image : 'none',
        });
        
        // Detailed image structure logging
        if (firstEntry.fields.image) {
          const image = firstEntry.fields.image;
          console.log('Image structure:', {
            isLink: image.sys?.type === 'Link',
            linkType: image.sys?.linkType,
            hasFields: !!image.fields,
            fieldsKeys: (image.fields && typeof image.fields === 'object') ? Object.keys(image.fields) : [],
            fileUrl: image.fields?.file?.url,
            fullImage: JSON.stringify(image, null, 2).substring(0, 500),
          });
        }
      } else {
        console.warn('⚠️ First entry has invalid structure:', firstEntry);
      }
    }

    return response.items.map((item: any) => {
      // Safety check: ensure item has fields
      if (!item || !item.fields) {
        console.warn('⚠️ Skipping item with missing fields:', item);
        return null;
      }
      
      const fields = item.fields;
      
      // Handle image - can be either a Contentful asset or external URL
      let imageUrl = '';
      
      if (fields.image) {
        // Contentful asset - try multiple possible structures
        const image = fields.image;
        
        // Structure 1: Resolved asset with fields.file.url
        if (image.fields?.file?.url) {
          const url = image.fields.file.url;
          imageUrl = url.startsWith('//') ? `https:${url}` : (url.startsWith('http') ? url : `https:${url}`);
          console.log(`✅ Found image URL (resolved asset): ${imageUrl.substring(0, 50)}...`);
        }
        // Structure 2: Link to asset (need to check includes)
        else if (image.sys?.type === 'Link' && image.sys?.linkType === 'Asset') {
          // Look for the asset in includes
          const assetId = image.sys.id;
          const asset = response.includes?.Asset?.find((a: any) => a.sys.id === assetId);
          if (asset?.fields?.file?.url) {
            const url = asset.fields.file.url;
            imageUrl = url.startsWith('//') ? `https:${url}` : (url.startsWith('http') ? url : `https:${url}`);
            console.log(`✅ Found image URL (linked asset): ${imageUrl.substring(0, 50)}...`);
          } else {
            console.warn(`⚠️ Asset link found but asset not in includes. Asset ID: ${assetId}`);
          }
        }
        // Structure 3: Direct URL string
        else if (typeof image === 'string') {
          imageUrl = image;
          console.log(`✅ Found image URL (string): ${imageUrl.substring(0, 50)}...`);
        }
        // Structure 4: Check if it's an object with a direct url property
        else if (image.url) {
          imageUrl = image.url;
          console.log(`✅ Found image URL (url property): ${imageUrl.substring(0, 50)}...`);
        }
        else {
          console.warn('⚠️ Image field exists but structure is unknown:', {
            type: typeof image,
            sysType: image?.sys?.type,
            keys: image && typeof image === 'object' ? Object.keys(image) : 'N/A',
          });
        }
      } else if (fields.imageUrl) {
        // External URL field
        imageUrl = fields.imageUrl;
        console.log(`✅ Found image URL (imageUrl field): ${imageUrl.substring(0, 50)}...`);
      }
      
      if (!imageUrl) {
        console.warn(`⚠️ No image URL found for "${fields.title}". Using fallback.`);
      }
      
      // Extract duration fields - handle various Contentful field types
      let duration = 0;
      let durationDays = 0;
      let minPerWeek = 0;
      
      // Handle duration (weeks)
      if (fields.duration !== undefined && fields.duration !== null) {
        if (typeof fields.duration === 'number') {
          duration = fields.duration;
        } else if (typeof fields.duration === 'string') {
          duration = parseInt(fields.duration, 10) || 0;
        }
      }
      
      // Handle durationDays
      if (fields.durationDays !== undefined && fields.durationDays !== null) {
        if (typeof fields.durationDays === 'number') {
          durationDays = fields.durationDays;
        } else if (typeof fields.durationDays === 'string') {
          durationDays = parseInt(fields.durationDays, 10) || 0;
        }
      }
      
      // Handle minPerWeek
      if (fields.minPerWeek !== undefined && fields.minPerWeek !== null) {
        if (typeof fields.minPerWeek === 'number') {
          minPerWeek = fields.minPerWeek;
        } else if (typeof fields.minPerWeek === 'string') {
          minPerWeek = parseInt(fields.minPerWeek, 10) || 0;
        }
      }
      
      // Safety check before logging
      if (fields && typeof fields === 'object') {
        console.log(`📊 Duration fields for "${fields.title || 'Unknown'}":`, {
          duration: { value: duration, type: typeof fields.duration, raw: fields.duration },
          durationDays: { value: durationDays, type: typeof fields.durationDays, raw: fields.durationDays },
          minPerWeek: { value: minPerWeek, type: typeof fields.minPerWeek, raw: fields.minPerWeek },
          allFields: Object.keys(fields),
        });
      } else {
        console.warn('⚠️ Fields is not a valid object:', fields);
      }
      
      // Format duration string: "8 weeks • Day 15 • 40 min pw"
      const formattedDuration = formatDuration(duration, durationDays, minPerWeek);
      console.log(`Formatted duration: "${formattedDuration}"`);
      
      const program: HeroProgram = {
        title: fields.title || '',
        duration: duration || 0,
        durationDays: durationDays || 0,
        minPerWeek: minPerWeek || 0,
        image: imageUrl,
        formattedDuration,
        sys: {
          id: item.sys.id,
        },
      };

      console.log(`Mapped hero program: ${program.title} (${duration} weeks, Day ${durationDays}, ${minPerWeek} min/week)`);
      return program;
    }).filter((program): program is HeroProgram => program !== null); // Filter out any null entries
  } catch (error: any) {
    console.error('Error fetching hero programs from Contentful:', error);
    if (error.response) {
      console.error('Contentful API Error:', {
        status: error.response.status,
        statusText: error.response.statusText,
        message: error.message,
      });
    }
    throw error;
  }
}

