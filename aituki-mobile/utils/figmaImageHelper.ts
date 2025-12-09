/**
 * Figma Image Helper
 * Utilities for fetching and managing images from Figma files
 */

/**
 * Get actual image download URLs from Figma design context
 * This function should be called with a Figma file key and node IDs to get
 * actual image URLs that can be used with expo-image
 * 
 * @param fileKey - The Figma file key (extracted from Figma URL)
 * @param nodeIds - Array of node IDs to get images for
 * @returns Promise with image URLs mapped to node IDs
 */
export async function getFigmaImageUrls(
  fileKey: string,
  nodeIds: string[]
): Promise<Record<string, string>> {
  // This would typically call the Figma MCP get_design_context tool
  // For now, this is a placeholder that shows the expected structure
  console.warn('getFigmaImageUrls: This function needs to be implemented with Figma MCP integration');
  
  // Example structure of what this should return:
  // {
  //   "node-id-1": "https://figma.com/file/.../image.png",
  //   "node-id-2": "https://figma.com/file/.../image2.png",
  // }
  
  return {};
}

/**
 * Validate if a URL is a valid image URL
 */
export function isValidImageUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  
  // Figma MCP asset URLs are valid temporary URLs (valid for 7 days)
  // They follow the pattern: https://www.figma.com/api/mcp/asset/{uuid}
  if (url.includes('figma.com/api/mcp/asset/')) {
    // Validate it has a proper UUID format (basic check)
    const uuidPattern = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
    return uuidPattern.test(url);
  }
  
  // Check if it's a valid HTTP/HTTPS URL
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Get a fallback placeholder image URL for testing
 */
export function getPlaceholderImageUrl(): string {
  // Using a known working placeholder image service
  return 'https://via.placeholder.com/400x300/69f0f0/1f5661?text=Image+Not+Loaded';
}

