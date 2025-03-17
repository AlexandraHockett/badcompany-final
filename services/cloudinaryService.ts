// services/cloudinaryService.ts
import galleryData from "@/data/gallery";
import { CloudinaryImage, CloudinaryAlbum } from "@/types/media";

// Client-side: use NEXT_PUBLIC_ prefix
// Server-side: we'll handle this differently
const CLOUDINARY_CLOUD_NAME = process.env
  .NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME as string;

// Map of folder paths to their API endpoints
const API_ENDPOINTS: Record<string, string> = {
  "white-emotion": "/api/gallery/white-emotion",
  "hula-hula": "/api/gallery/hula-hula",
};

// Cache for API responses to avoid repeated calls
const imageCache: Record<string, CloudinaryImage[]> = {};

export function buildCloudinaryUrl(
  publicId: string,
  options: any = {}
): string {
  if (!publicId) return "";

  const defaults = {
    width: 500,
    height: 500,
    crop: "fill",
    quality: "auto",
    format: "auto",
  };
  const settings = { ...defaults, ...options };
  const transformation = `w_${settings.width},h_${settings.height},c_${settings.crop},q_${settings.quality},f_${settings.format}`;
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${transformation}/${publicId}`;
}

export const cloudinaryAlbums = galleryData.cloudinaryAlbums;

export function getCloudinaryAlbums(): CloudinaryAlbum[] {
  return cloudinaryAlbums;
}

export function getCloudinaryAlbumByPath(
  folderPath: string
): CloudinaryAlbum | undefined {
  return cloudinaryAlbums.find((album) => album.folderPath === folderPath);
}

// Fetches images from Cloudinary using our server API endpoints
export async function fetchCloudinaryImages(
  folderPath: string
): Promise<CloudinaryImage[]> {
  try {
    // Check if we've already cached this request
    if (imageCache[folderPath] && imageCache[folderPath].length > 0) {
      return imageCache[folderPath];
    }

    // Map the folder path to the corresponding API endpoint
    let apiEndpoint = "";
    if (folderPath === "white-emotion") {
      apiEndpoint = API_ENDPOINTS["white-emotion"];
    } else if (folderPath === "hula-hula") {
      apiEndpoint = API_ENDPOINTS["hula-hula"];
    } else {
      // For other folder paths, try to use a direct mapping
      apiEndpoint = API_ENDPOINTS[folderPath];

      if (!apiEndpoint) {
        console.warn(
          `No API endpoint configured for folder path: ${folderPath}. Using fallback method.`
        );
        return getFallbackImages(folderPath);
      }
    }

    // Initialize variables for pagination
    let allImages: CloudinaryImage[] = [];
    let nextCursor: string | null = null;
    let hasMore = true;

    // Fetch all pages
    while (hasMore) {
      // Add cursor to URL if we have one
      const url: string = nextCursor
        ? `${apiEndpoint}?next_cursor=${encodeURIComponent(nextCursor)}&max_results=100`
        : `${apiEndpoint}?max_results=100`;

      const response: Response = await fetch(url);

      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }

      const data: {
        images?: CloudinaryImage[];
        nextCursor?: string;
        total?: number;
      } = await response.json();

      if (!data.images || !Array.isArray(data.images)) {
        console.error("Invalid API response structure:", data);
        break;
      }

      // Add this batch to our collection
      allImages = [...allImages, ...data.images];

      // Check if there are more images to fetch
      if (data.nextCursor) {
        nextCursor = data.nextCursor;
      } else {
        hasMore = false;
      }

      // Safety check - break if we have all images based on total count
      if (data.total && allImages.length >= data.total) {
        hasMore = false;
      }

      // Add some logging
      console.log(
        `Fetched ${data.images.length} images, total so far: ${allImages.length}, hasMore: ${hasMore}`
      );
    }

    // Cache the results
    imageCache[folderPath] = allImages;

    return allImages;
  } catch (error) {
    console.error("Error fetching Cloudinary images:", error);
    return getFallbackImages(folderPath);
  }
}

// Fallback method to get images when API is not available or fails
function getFallbackImages(folderPath: string): CloudinaryImage[] {
  console.log(`Using fallback method for folder: ${folderPath}`);

  // Try to find album info in gallery data
  const albumInfo = galleryData.cloudinaryGalleryCollections.find(
    (album) => album.id.toString() === folderPath
  );

  if (!albumInfo) {
    console.error(`No album info found for folder path: ${folderPath}`);
    return [];
  }

  // Use cover images as fallback
  return albumInfo.coverImages.map((imageUrl, index) => ({
    id: index + 1,
    title: `${albumInfo.title} - Foto ${index + 1}`,
    url: imageUrl,
    date: albumInfo.date,
    identifier: `fallback-${index}`,
  }));
}

// Client-side compatible version that fetches a subset of images
export function getAlbumImages(
  folderPath: string = "",
  count: number = 24,
  startIndex: number = 0
): CloudinaryImage[] {
  // Attempt to get cached API results first
  if (imageCache[folderPath] && imageCache[folderPath].length > 0) {
    const endIndex = Math.min(
      startIndex + count,
      imageCache[folderPath].length
    );
    return imageCache[folderPath].slice(startIndex, endIndex);
  }

  // Fall back to getting cover images from the album info
  const albumInfo = galleryData.cloudinaryGalleryCollections.find(
    (a) => a.id.toString() === folderPath
  );

  if (!albumInfo) {
    return [];
  }

  const coverImages = albumInfo.coverImages.map((imageUrl, index) => ({
    id: startIndex + index + 1,
    title: `${albumInfo.title} - Foto ${startIndex + index + 1}`,
    url: imageUrl,
    date: albumInfo.date,
    identifier: `cover-${index}`,
  }));

  // If we don't have enough cover images, just return what we have
  if (coverImages.length <= startIndex) {
    return [];
  }

  return coverImages.slice(startIndex, startIndex + count);
}

export function getImageCountInFolder(folderPath: string): number {
  // If we've already fetched the images, use that count
  if (imageCache[folderPath]) {
    return imageCache[folderPath].length;
  }

  // Otherwise use the count from the album info
  const albumInfo = galleryData.cloudinaryGalleryCollections.find(
    (a) => a.id.toString() === folderPath
  );
  return albumInfo ? albumInfo.itemCount : 0;
}

export type { CloudinaryImage };

// Utility function to trigger prefetching of images
export async function prefetchAlbumImages(folderPath: string): Promise<void> {
  if (!imageCache[folderPath]) {
    await fetchCloudinaryImages(folderPath);
  }
}
