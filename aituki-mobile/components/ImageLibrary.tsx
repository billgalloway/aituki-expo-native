/**
 * Image Library Component
 * Centralized image asset management based on Figma design
 * 
 * NOTE: The URLs below are placeholder asset IDs from Figma MCP.
 * These need to be replaced with actual image download URLs from Figma.
 * To get actual URLs, use the Figma MCP get_design_context tool which returns
 * download URLs for assets in the design context.
 * 
 * Current issue: These URLs are not valid image endpoints and will fail to load.
 * They should be replaced with actual Figma image export URLs or local asset paths.
 */

import { isValidImageUrl, getPlaceholderImageUrl } from '../utils/figmaImageHelper';

// Hero program images (horizontal scroll cards)
// Updated with actual Figma image URLs from HeroScroller component (valid for 7 days)
export const heroImages = {
  perimenopause: "https://www.figma.com/api/mcp/asset/7e65b254-cb25-47c5-b232-fc4142b10519", // Woman floating in water
  yoga: "https://www.figma.com/api/mcp/asset/67bd9410-30b6-4ccb-a6ff-640ac62711d2", // Person in yoga pose
  mindfulness: "https://www.figma.com/api/mcp/asset/a66a7586-f8f3-4d61-8c51-458ef146aa8c", // Hands holding singing bowl
  mealPlanning: "https://www.figma.com/api/mcp/asset/8141d8d3-2ff8-42a7-95a2-200fb025134c", // Salmon meal on plate
  sleep: "https://www.figma.com/api/mcp/asset/4cfa9d69-881d-4b40-a9ba-fb72a124d3a3", // Woman sleeping on pillow
  symptomTracking: "https://www.figma.com/api/mcp/asset/3b344f7d-9dba-4a8a-9f8e-c6daf912f827", // Two women checking pulse
};

// Today activity tile images
// Updated with actual Figma image URLs from design context (valid for 7 days)
export const todayImages = {
  meditation: "https://www.figma.com/api/mcp/asset/240a5736-78e5-40b3-b7bd-eeab93539667", // Meditation image (dried fruit slices)
  perimenopause: "https://www.figma.com/api/mcp/asset/93f7cede-00b4-4cde-8fa6-8c10df99fab2", // Perimenopause image (cortisol test kit)
  diet: "https://www.figma.com/api/mcp/asset/e8ec7a60-932e-4848-a5f1-751adc52fc97", // Diet image (person cycling)
  therapy: "https://www.figma.com/api/mcp/asset/d3360df0-ac36-43d7-88bc-7a7ed252724f", // Therapy image (green capsule)
  exercise: "https://www.figma.com/api/mcp/asset/7e9fe9f0-b6bd-45e9-9883-d912db958427", // Exercise image (person doing lunge)
};

// Digital twin suggestion card images
// Updated with actual Figma image URLs from twin-suggestions section (valid for 7 days)
export const suggestionImages = {
  hormoneTherapy: "https://www.figma.com/api/mcp/asset/f7e3c16b-ea87-467b-8b14-03b1fb87f0dc", // Hormone therapy - white and light green capsule pill
  weightManagement: "https://www.figma.com/api/mcp/asset/809f4054-f974-4008-9817-290692891d8d", // Managing your weight - yellow banana
  fitness: "https://www.figma.com/api/mcp/asset/b6d1b39e-557d-4d50-a3b4-5935c16b567a", // Fitness and strength - white exercise bike
  stressReduction: "https://www.figma.com/api/mcp/asset/aeabd1d1-2d91-43f5-8a1b-0a2723287daf", // Reducing stress - woman meditating
  conditionManagement: "https://www.figma.com/api/mcp/asset/f7e3c16b-ea87-467b-8b14-03b1fb87f0dc", // Managing a condition - white and light green capsule pill (same as hormone therapy)
};

// Additional program images (Articles section)
// Updated with actual Figma image URLs from articles section (valid for 7 days)
export const programImages = {
  healthyLife: "https://www.figma.com/api/mcp/asset/83b687f3-8adc-4545-b23a-f9b0f6d227be", // Life a healthier life - group in yoga pose
  mentalHealth: "https://www.figma.com/api/mcp/asset/3c17eae2-02a2-4924-a11e-7943085caa74", // Focus on mental health - two hands clasped
  sleep: "https://www.figma.com/api/mcp/asset/109b0f6b-4409-4bce-81c9-17bb88d2e158", // Get a good nights sleep - woman sleeping
  strength: "https://www.figma.com/api/mcp/asset/e0dadb59-2fbd-4968-8229-db6d53318b5b", // Get stronger - woman doing crunches
  relax: "https://www.figma.com/api/mcp/asset/d5894609-b069-4b68-b142-1bf538f1a5d5", // Find time to relax - woman in chair
  sport: "https://www.figma.com/api/mcp/asset/1ebae558-c577-4fcc-8121-fd77b32c4fcd", // Play a sport - group of cyclists
  community: "https://www.figma.com/api/mcp/asset/e0c118a3-cb26-48f3-8bc3-59e9ab74ad41", // Be part of a community - people embracing
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
  if (isValidImageUrl(url)) {
    return url;
  }
  console.warn(`Invalid image URL detected: ${url}. Using placeholder.`);
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

