import { useState, useEffect } from 'react';
import { fetchHeroPrograms, HeroProgram } from '@/services/contentful';
import ImageLibrary from '@/components/ImageLibrary';

// Helper function to format duration (same as in contentful.ts)
function formatDuration(weeks: number, days: number, minPerWeek: number): string {
  const parts: string[] = [];
  
  if (weeks > 0) {
    parts.push(`${weeks} week${weeks !== 1 ? 's' : ''}`);
  }
  
  if (days > 0) {
    parts.push(`Day ${days}`);
  }
  
  if (minPerWeek > 0) {
    parts.push(`${minPerWeek} min pw`);
  }
  
  return parts.length > 0 ? parts.join(' • ') : '';
}

// Fallback hero programs (used if Contentful fails or is not configured)
const fallbackHeroPrograms: HeroProgram[] = [
  {
    title: 'Relaxation and fun',
    duration: 8,
    durationDays: 15,
    minPerWeek: 40,
    formattedDuration: formatDuration(8, 15, 40),
    image: ImageLibrary.getSafeHeroImage('perimenopause'),
    sys: { id: 'fallback-1' },
  },
  {
    title: 'Yoga and Pilates',
    duration: 8,
    durationDays: 15,
    minPerWeek: 40,
    formattedDuration: formatDuration(8, 15, 40),
    image: ImageLibrary.getSafeHeroImage('yoga'),
    sys: { id: 'fallback-2' },
  },
  {
    title: 'Mindfulness or meditation',
    duration: 8,
    durationDays: 15,
    minPerWeek: 40,
    formattedDuration: formatDuration(8, 15, 40),
    image: ImageLibrary.getSafeHeroImage('mindfulness'),
    sys: { id: 'fallback-3' },
  },
  {
    title: 'Meal planning & Mindful eating',
    duration: 8,
    durationDays: 15,
    minPerWeek: 40,
    formattedDuration: formatDuration(8, 15, 40),
    image: ImageLibrary.getSafeHeroImage('mealPlanning'),
    sys: { id: 'fallback-4' },
  },
  {
    title: 'Sleep routine',
    duration: 8,
    durationDays: 15,
    minPerWeek: 40,
    formattedDuration: formatDuration(8, 15, 40),
    image: ImageLibrary.getSafeHeroImage('sleep'),
    sys: { id: 'fallback-5' },
  },
  {
    title: 'Symptom tracking',
    duration: 8,
    durationDays: 15,
    minPerWeek: 40,
    formattedDuration: formatDuration(8, 15, 40),
    image: ImageLibrary.getSafeHeroImage('symptomTracking'),
    sys: { id: 'fallback-6' },
  },
];

export function useHeroPrograms() {
  const [heroPrograms, setHeroPrograms] = useState<HeroProgram[]>(fallbackHeroPrograms);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadHeroPrograms() {
      try {
        setLoading(true);
        setError(null);
        
        console.log('useHeroPrograms: Starting to load hero programs...');
        
        // Check if Contentful is configured
        const spaceId = process.env.EXPO_PUBLIC_CONTENTFUL_SPACE_ID;
        const accessToken = process.env.EXPO_PUBLIC_CONTENTFUL_ACCESS_TOKEN;
        
        console.log('useHeroPrograms: Environment check:', {
          hasSpaceId: !!spaceId,
          hasAccessToken: !!accessToken,
          spaceIdLength: spaceId?.length || 0,
        });
        
        if (!spaceId || !accessToken) {
          console.warn('⚠️ Contentful not configured. Using fallback data.');
          console.warn('   Make sure EXPO_PUBLIC_CONTENTFUL_SPACE_ID and EXPO_PUBLIC_CONTENTFUL_ACCESS_TOKEN are set in .env or app.json');
          setHeroPrograms(fallbackHeroPrograms);
          setLoading(false);
          return;
        }

        console.log('✅ Contentful credentials found, fetching programs...');
        const programs = await fetchHeroPrograms();
        
        if (programs.length > 0) {
          console.log(`✅ Successfully loaded ${programs.length} hero programs from Contentful`);
          
          // Add fallback images for programs missing images
          const programsWithFallbacks = programs.map((program, index) => {
            if (!program.image) {
              // Use fallback image from ImageLibrary based on index
              const fallbackKeys: Array<keyof typeof ImageLibrary.heroImages> = [
                'perimenopause',
                'yoga',
                'mindfulness',
                'mealPlanning',
                'sleep',
                'symptomTracking',
              ];
              const fallbackKey = fallbackKeys[index % fallbackKeys.length];
              program.image = ImageLibrary.getSafeHeroImage(fallbackKey);
              console.log(`   Added fallback image for "${program.title}"`);
            }
            return program;
          });
          
          setHeroPrograms(programsWithFallbacks);
        } else {
          console.warn('⚠️ No hero programs found in Contentful. Using fallback data.');
          console.warn('   Check that:');
          console.warn('   1. Content type "heroProgram" exists in Contentful');
          console.warn('   2. You have published entries (not drafts)');
          console.warn('   3. The content type API ID matches exactly');
          setHeroPrograms(fallbackHeroPrograms);
        }
      } catch (err) {
        console.error('❌ Failed to load hero programs from Contentful:', err);
        if (err instanceof Error) {
          console.error('   Error message:', err.message);
          console.error('   Error stack:', err.stack);
        }
        setError(err instanceof Error ? err : new Error('Unknown error'));
        // Use fallback data on error
        console.log('   Falling back to default hero programs');
        setHeroPrograms(fallbackHeroPrograms);
      } finally {
        setLoading(false);
      }
    }

    loadHeroPrograms();
  }, []);

  return { heroPrograms, loading, error };
}

