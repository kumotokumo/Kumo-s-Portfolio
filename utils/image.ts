/**
 * Image URL utilities for Tencent Cloud COS (Cloud Object Storage)
 * 
 * This utility converts local image paths to Tencent Cloud COS URLs.
 * 
 * Configuration:
 * - Set VITE_COS_BASE_URL environment variable to your COS bucket URL
 * - Example: https://your-bucket-name.cos.ap-region.myqcloud.com
 * - Or set it directly in this file if you prefer
 */

// Get COS base URL from environment variable or use the configured bucket
// Default to the user's Tencent Cloud COS bucket
const COS_BASE_URL = import.meta.env.VITE_COS_BASE_URL || 'https://kumotokumo-1305521879.cos.ap-guangzhou.myqcloud.com';

// Optional: Path prefix in the bucket (if files are stored with a different prefix)
// For example, if files are at root level, set to empty string ''
// If files are in 'images/' folder, set to 'images/' or leave default
const COS_PATH_PREFIX = import.meta.env.VITE_COS_PATH_PREFIX || '';

// File extension mapping for COS (convert .jpg to .webp if files are stored as webp)
// Set to true if all .jpg files in COS are actually .webp
const CONVERT_JPG_TO_WEBP = import.meta.env.VITE_CONVERT_JPG_TO_WEBP !== 'false';

/**
 * Convert a local image path to a Tencent Cloud COS URL
 * 
 * @param localPath - Local image path (e.g., '/images/projects/CLACKYAI/cover.jpg')
 * @returns Full COS URL or original path if COS_BASE_URL is not configured
 * 
 * Examples:
 * - '/images/projects/CLACKYAI/cover.jpg' -> 'https://bucket.cos.region.myqcloud.com/images/projects/CLACKYAI/cover.jpg'
 * - 'images/about/about-kumo.jpg' -> 'https://bucket.cos.region.myqcloud.com/images/about/about-kumo.jpg'
 */
export function getImageUrl(localPath: string): string {
  // If it's already a full URL (http/https), return as is
  if (localPath.startsWith('http://') || localPath.startsWith('https://')) {
    return localPath;
  }
  
  // If it's a base64 data URL, return as is
  if (localPath.startsWith('data:')) {
    return localPath;
  }
  
  // If COS_BASE_URL is not configured, return the original path (for local development)
  if (!COS_BASE_URL) {
    // Fallback to local path with base URL for GitHub Pages compatibility
    const base = import.meta.env.BASE_URL || '/';
    const cleanPath = localPath.startsWith('/') ? localPath.slice(1) : localPath;
    return `${base}${cleanPath}`;
  }
  
  // Convert local path to COS URL
  // Remove leading slash from local path if present
  let cleanPath = localPath.startsWith('/') ? localPath.slice(1) : localPath;
  
  // Convert .jpg to .webp if enabled (since COS files are stored as .webp)
  if (CONVERT_JPG_TO_WEBP && cleanPath.endsWith('.jpg')) {
    cleanPath = cleanPath.replace(/\.jpg$/, '.webp');
  }
  
  // The bucket structure matches local structure (with images/ prefix)
  // So we use the path as-is, but allow COS_PATH_PREFIX override if needed
  let finalPath = cleanPath;
  
  // If COS_PATH_PREFIX is set, use it instead of the path's natural prefix
  if (COS_PATH_PREFIX) {
    // Remove any existing prefix from cleanPath
    const pathWithoutPrefix = cleanPath.replace(/^(images\/)?/, '');
    finalPath = COS_PATH_PREFIX.endsWith('/') 
      ? `${COS_PATH_PREFIX}${pathWithoutPrefix}` 
      : `${COS_PATH_PREFIX}/${pathWithoutPrefix}`;
  }
  
  // Ensure COS_BASE_URL doesn't end with a slash
  const baseUrl = COS_BASE_URL.endsWith('/') ? COS_BASE_URL.slice(0, -1) : COS_BASE_URL;
  
  return `${baseUrl}/${finalPath}`;
}

/**
 * Check if COS is configured
 */
export function isCosConfigured(): boolean {
  return !!COS_BASE_URL;
}


