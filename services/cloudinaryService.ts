// services/cloudinaryService.ts
import galleryData from "@/data/gallery";
import { CloudinaryImage, CloudinaryAlbum } from "@/types/media";

// Client-side: use NEXT_PUBLIC_ prefix
// Server-side: we'll handle this differently
const CLOUDINARY_CLOUD_NAME = process.env
  .NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME as string;

// Map of folder prefixes for each album
const ALBUM_FOLDERS: Record<string, string> = {
  "2": "white-motion-24", // White Emotion 2024
  "3": "hula-hula-23", // Hula Hula 2023
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
    const albumId = folderPath;

    // Check if we've already cached this request
    if (imageCache[folderPath] && imageCache[folderPath].length > 0) {
      return imageCache[folderPath];
    }

    // Use our server API instead of direct Cloudinary API
    let apiEndpoint = "";

    // Map to the correct API endpoint based on the folder
    if (ALBUM_FOLDERS[folderPath] === "white-motion-24") {
      apiEndpoint = "/api/gallery/white-emotion";
    } else if (ALBUM_FOLDERS[folderPath] === "hula-hula-23") {
      apiEndpoint = "/api/gallery/hula-hula";
    } else {
      throw new Error(
        `No API endpoint configured for folder path: ${folderPath}`
      );
    }

    // Call our server API
    const response = await fetch(apiEndpoint);

    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.images || !Array.isArray(data.images)) {
      console.error("Invalid API response structure:", data);
      return [];
    }

    // Use the transformed images directly from our API
    const images: CloudinaryImage[] = data.images;

    // Cache the results
    imageCache[folderPath] = images;

    return images;
  } catch (error) {
    console.error("Error fetching Cloudinary images:", error);
    return [];
  }
}

// Client-side compatible version that uses known patterns when API is not available
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

  // Fall back to pattern-based approach if no cache
  const albumInfo = galleryData.cloudinaryGalleryCollections.find(
    (a) => a.id.toString() === folderPath
  );

  if (!albumInfo) {
    return [];
  }

  // Extract known image identifiers from the album info
  const knownIdentifiers = albumInfo.coverImages
    .map((url) => {
      const match = url.match(/upload\/v\d+\/(.+)\.jpg$/);
      return match ? match[1] : "";
    })
    .filter((id) => id !== "");

  // If we have enough known identifiers, use those
  if (knownIdentifiers.length >= startIndex + count) {
    const selectedIdentifiers = knownIdentifiers.slice(
      startIndex,
      startIndex + count
    );

    return selectedIdentifiers.map((identifier, index) => ({
      id: startIndex + index + 1,
      title: `${albumInfo.title} - Foto ${startIndex + index + 1}`,
      url: buildCloudinaryUrl(identifier),
      date: albumInfo.date,
      identifier,
    }));
  }

  // Otherwise, generate patterns based on known identifiers
  const folderPrefix = ALBUM_FOLDERS[folderPath] || "";
  const results: CloudinaryImage[] = [];

  // Use known identifiers first
  for (let i = 0; i < Math.min(knownIdentifiers.length, count); i++) {
    if (i + startIndex >= knownIdentifiers.length) break;

    results.push({
      id: startIndex + i + 1,
      title: `${albumInfo.title} - Foto ${startIndex + i + 1}`,
      url: buildCloudinaryUrl(knownIdentifiers[startIndex + i]),
      date: albumInfo.date,
      identifier: knownIdentifiers[startIndex + i],
    });
  }

  // Generate additional identifiers if needed
  const remaining = count - results.length;

  if (remaining > 0 && folderPrefix) {
    // Extract number patterns from known identifiers
    const numberPatterns: number[] = [];
    knownIdentifiers.forEach((id) => {
      const match = id.match(new RegExp(`${folderPrefix}_(\\d+)`));
      if (match && match[1]) {
        numberPatterns.push(parseInt(match[1]));
      }
    });

    // Generate sequential numbers starting from the highest known number
    const startNum = Math.max(0, ...numberPatterns);

    for (let i = 0; i < remaining; i++) {
      const num = startNum + i + 1;
      // Generate an identifier with the number and a placeholder for the random part
      const identifier = `${folderPrefix}_${num.toString().padStart(3, "0")}`;

      results.push({
        id: startIndex + results.length + 1,
        title: `${albumInfo.title} - Foto ${startIndex + results.length + 1}`,
        url: buildCloudinaryUrl(identifier),
        date: albumInfo.date,
        identifier,
      });
    }
  }

  return results;
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
