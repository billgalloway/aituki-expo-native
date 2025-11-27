/**
 * Image Library Component
 * Centralized image asset management based on Figma design
 */

// Hero program images (horizontal scroll cards)
export const heroImages = {
  perimenopause: "https://www.figma.com/api/mcp/asset/26448e25-bf4c-4dc9-9e61-450255743a81",
  yoga: "https://www.figma.com/api/mcp/asset/6bc90874-084c-45dd-9a21-0b02137248cc",
  mindfulness: "https://www.figma.com/api/mcp/asset/aea25446-6f42-42a2-84d6-12cab3a571d6",
  mealPlanning: "https://www.figma.com/api/mcp/asset/8e8e5043-4065-4193-a464-41cbff589cb1",
  sleep: "https://www.figma.com/api/mcp/asset/9afa34ef-7b08-4da1-ac43-da288996b39f",
  symptomTracking: "https://www.figma.com/api/mcp/asset/9457a270-0c16-49e1-a56b-bb6b96a72032",
};

// Today activity tile images
export const todayImages = {
  meditation: "https://www.figma.com/api/mcp/asset/ecc7c4d1-4ab0-4b49-b001-55217e2a0566",
  perimenopause: "https://www.figma.com/api/mcp/asset/d9c57c26-f7b5-4ef3-870b-e85504880d72",
  diet: "https://www.figma.com/api/mcp/asset/22df2773-6f34-4c49-9f26-d2716c506da6",
  therapy: "https://www.figma.com/api/mcp/asset/8d86fa28-df29-4f8a-af30-707876cc8a4e",
  exercise: "https://www.figma.com/api/mcp/asset/20c55d01-4b45-470e-b54e-ca828f5575dd",
};

// Digital twin suggestion card images
export const suggestionImages = {
  hormoneTherapy: "https://www.figma.com/api/mcp/asset/5f76d5b4-d410-4a34-b989-9930505ac5c4",
  weightManagement: "https://www.figma.com/api/mcp/asset/1db6815a-4bb7-44f5-943c-619c455da8fd",
  fitness: "https://www.figma.com/api/mcp/asset/bf236dc2-4b0d-418c-b320-75ba8a721449",
  stressReduction: "https://www.figma.com/api/mcp/asset/5a28cf10-a200-4093-87ff-d62bb7913651",
  conditionManagement: "https://www.figma.com/api/mcp/asset/8fd8d2cd-80f0-4fbe-8b89-31b8f18d4936",
};

// Additional program images
export const programImages = {
  healthyLife: "https://www.figma.com/api/mcp/asset/fede8274-db25-4c0b-a37b-90f6cb4f8073",
  mentalHealth: "https://www.figma.com/api/mcp/asset/bc0ca800-7079-4502-9582-e4b2439bbc90",
  sleep: "https://www.figma.com/api/mcp/asset/9afa34ef-7b08-4da1-ac43-da288996b39f",
  strength: "https://www.figma.com/api/mcp/asset/773483d3-50a7-4db2-ae47-4d6dd038a529",
  relax: "https://www.figma.com/api/mcp/asset/fb035dda-a6ec-44ad-a7a0-3eda6db418bc",
  sport: "https://www.figma.com/api/mcp/asset/cf0834ac-00a7-40d0-977d-9276958d62ca",
  community: "https://www.figma.com/api/mcp/asset/cf0834ac-00a7-40d0-977d-9276958d62ca",
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
};

export default ImageLibrary;

