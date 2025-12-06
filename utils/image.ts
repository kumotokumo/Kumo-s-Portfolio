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
  // Remove leading slash if present
  const cleanPath = localPath.startsWith('/') ? localPath.slice(1) : localPath;
  
  // Ensure COS_BASE_URL doesn't end with a slash
  const baseUrl = COS_BASE_URL.endsWith('/') ? COS_BASE_URL.slice(0, -1) : COS_BASE_URL;
  
  return `${baseUrl}/${cleanPath}`;
}

/**
 * Check if COS is configured
 */
export function isCosConfigured(): boolean {
  return !!COS_BASE_URL;
}


