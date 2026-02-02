/**
 * useArticles – fetches articles from Contentful CMS for the Articles section
 * (Figma node 668-20891). Falls back to holding content when Contentful is
 * unavailable or content type "article" is missing.
 */

import { useState, useEffect } from 'react';
import { fetchArticles, Article } from '@/services/contentful';
import { programImages } from '@/components/ImageLibrary';
import Constants from 'expo-constants';

const fallbackArticles: Article[] = [
  { title: 'Healthy life', slug: 'healthy-life', excerpt: 'Tips for a balanced lifestyle.', image: programImages.healthyLife, sys: { id: 'fb-1' } },
  { title: 'Mental health', slug: 'mental-health', excerpt: 'Supporting your mind and mood.', image: programImages.mentalHealth, sys: { id: 'fb-2' } },
  { title: 'Sleep & rest', slug: 'sleep-rest', excerpt: 'Better sleep habits.', image: programImages.sleep, sys: { id: 'fb-3' } },
  { title: 'Strength & fitness', slug: 'strength-fitness', excerpt: 'Build strength safely.', image: programImages.strength, sys: { id: 'fb-4' } },
];

export function useArticles() {
  const [articles, setArticles] = useState<Article[]>(fallbackArticles);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const getEnv = (key: string) => Constants.expoConfig?.extra?.[key] || process.env[key] || '';
        if (!getEnv('EXPO_PUBLIC_CONTENTFUL_SPACE_ID') || !getEnv('EXPO_PUBLIC_CONTENTFUL_ACCESS_TOKEN')) {
          setArticles(fallbackArticles);
          setLoading(false);
          return;
        }
        const list = await fetchArticles();
        setArticles(list.length > 0 ? list : fallbackArticles);
      } catch (e) {
        setError(e instanceof Error ? e : new Error('Failed to load articles'));
        setArticles(fallbackArticles);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return { articles, loading, error };
}
