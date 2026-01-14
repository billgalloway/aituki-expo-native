/**
 * Image Library Component
 * Centralized image asset management using Supabase Storage
 * 
 * All images are stored in Supabase Storage for permanent, reliable access.
 * Images were uploaded from local desktop folder and are now hosted on Supabase CDN.
 */

import { isValidImageUrl, getPlaceholderImageUrl } from '../utils/figmaImageHelper';

// Hero program images (horizontal scroll cards)
// Stored in Supabase Storage: images/hero/
export const heroImages = {
  perimenopause: "https://hhdntbgtedclqqufpzfj.supabase.co/storage/v1/object/public/images/hero/image-1.png",
  yoga: "https://hhdntbgtedclqqufpzfj.supabase.co/storage/v1/object/public/images/hero/image-2.png",
  mindfulness: "https://hhdntbgtedclqqufpzfj.supabase.co/storage/v1/object/public/images/hero/image-1.jpg",
  mealPlanning: "https://hhdntbgtedclqqufpzfj.supabase.co/storage/v1/object/public/images/hero/image-2.jpg",
  sleep: "https://hhdntbgtedclqqufpzfj.supabase.co/storage/v1/object/public/images/misc/image.png",
  symptomTracking: "https://hhdntbgtedclqqufpzfj.supabase.co/storage/v1/object/public/images/misc/image.jpg",
};

// Today activity tile images
// Stored in Supabase Storage: images/today/
export const todayImages = {
  meditation: "https://hhdntbgtedclqqufpzfj.supabase.co/storage/v1/object/public/images/today/rectangle-2233.png",
  perimenopause: "https://hhdntbgtedclqqufpzfj.supabase.co/storage/v1/object/public/images/today/rectangle-2233-1.png",
  diet: "https://hhdntbgtedclqqufpzfj.supabase.co/storage/v1/object/public/images/today/rectangle-2233-2.png",
  therapy: "https://hhdntbgtedclqqufpzfj.supabase.co/storage/v1/object/public/images/today/rectangle-2233-3.png",
  exercise: "https://hhdntbgtedclqqufpzfj.supabase.co/storage/v1/object/public/images/today/rectangle-2233.png",
};

// Digital twin suggestion card images
// Stored in Supabase Storage: images/suggestions/
export const suggestionImages = {
  hormoneTherapy: "https://hhdntbgtedclqqufpzfj.supabase.co/storage/v1/object/public/images/suggestions/image-3.png",
  weightManagement: "https://hhdntbgtedclqqufpzfj.supabase.co/storage/v1/object/public/images/suggestions/image-4.png",
  fitness: "https://hhdntbgtedclqqufpzfj.supabase.co/storage/v1/object/public/images/suggestions/image-3.jpg",
  stressReduction: "https://hhdntbgtedclqqufpzfj.supabase.co/storage/v1/object/public/images/suggestions/image-4.jpg",
  conditionManagement: "https://hhdntbgtedclqqufpzfj.supabase.co/storage/v1/object/public/images/suggestions/image-3.png",
};

// Additional program images (Articles section)
// Stored in Supabase Storage: images/programs/
export const programImages = {
  healthyLife: "https://hhdntbgtedclqqufpzfj.supabase.co/storage/v1/object/public/images/programs/image-5.jpg",
  mentalHealth: "https://hhdntbgtedclqqufpzfj.supabase.co/storage/v1/object/public/images/programs/image-6.jpg",
  sleep: "https://hhdntbgtedclqqufpzfj.supabase.co/storage/v1/object/public/images/programs/image-5.jpg",
  strength: "https://hhdntbgtedclqqufpzfj.supabase.co/storage/v1/object/public/images/programs/image-6.jpg",
  relax: "https://hhdntbgtedclqqufpzfj.supabase.co/storage/v1/object/public/images/programs/image-5.jpg",
  sport: "https://hhdntbgtedclqqufpzfj.supabase.co/storage/v1/object/public/images/programs/image-6.jpg",
  community: "https://hhdntbgtedclqqufpzfj.supabase.co/storage/v1/object/public/images/programs/image-5.jpg",
};

// Helper function to get image by key
export const getHeroImage = (key: keyof typeof heroImages): string => {
  return heroImages[key];
};

export const getTodayImage = (key: keyof typeof todayImages): string => {
  return todayImages[key];
};

export const getSuggestionImage = (key: keyof typeof suggestionImages): string => {
  return suggestionImages[key];
};

export const getProgramImage = (key: keyof typeof programImages): string => {
  return programImages[key];
};

// Helper function to get a safe image URL (fallback to placeholder if invalid)
function getSafeImageUrl(url: string): string {
  // Supabase URLs are always valid, but check anyway
  if (url && isValidImageUrl(url)) {
    return url;
  }
  // Fallback to placeholder if URL is invalid
  return getPlaceholderImageUrl();
}

// Main image library object for easy access
const ImageLibrary = {
  hero: heroImages,
  today: todayImages,
  suggestions: suggestionImages,
  programs: programImages,
  getHeroImage,
  getTodayImage,
  getSuggestionImage,
  getProgramImage,
  // Safe getters that validate URLs and provide fallbacks
  getSafeHeroImage: (key: keyof typeof heroImages): string => getSafeImageUrl(heroImages[key]),
  getSafeTodayImage: (key: keyof typeof todayImages): string => getSafeImageUrl(todayImages[key]),
  getSafeSuggestionImage: (key: keyof typeof suggestionImages): string => getSafeImageUrl(suggestionImages[key]),
  getSafeProgramImage: (key: keyof typeof programImages): string => getSafeImageUrl(programImages[key]),
};

export default ImageLibrary;

