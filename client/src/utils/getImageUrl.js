export const getImageUrl = (path) => {
  if (!path) return null;
  
  // Standardize slashes (fix Windows backslashes)
  const normalizedPath = path.toString().replace(/\\/g, '/');
  
  if (normalizedPath.startsWith('http')) return normalizedPath; // Cloudinary or other external URLs
  if (normalizedPath.startsWith('/uploads')) return `http://localhost:5000${normalizedPath}`; // Local storage paths
  if (normalizedPath.startsWith('uploads')) return `http://localhost:5000/${normalizedPath}`; // Local storage paths without leading slash
  
  return normalizedPath;
};
