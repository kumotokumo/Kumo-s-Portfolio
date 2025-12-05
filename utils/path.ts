/**
 * Get the base URL for assets based on the environment
 * In GitHub Pages, this will be '/Kumo-s-Portfolio/', otherwise '/'
 */
export function getAssetPath(path: string): string {
  // Use import.meta.env.BASE_URL which is set by Vite based on the base config
  const base = import.meta.env.BASE_URL || '/';
  // Remove leading slash from path if present, then combine with base
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${base}${cleanPath}`;
}

