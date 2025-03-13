// Interfaces para tipos de mídia

// Interface para Seção de Mídia
export interface MediaSection {
  title: string;
  slug: string;
  image: string;
}

// Interface para Podcast
export interface Podcast {
  id: number;
  title: string;
  description: string;
  date: string;
  videoUrl: string;
  thumbnailUrl: string;
  hosts: string[];
  guests?: string[];
  topics: string[];
  duration: string;
  episodeNumber: number;
  isLive: boolean;
}

// Interface para Notícia
export interface NewsArticle {
  id: number;
  title: string;
  slug: string;
  image: string;
  thumbnailUrl: string;
  date: string;
  author: string;
  excerpt: string;
  content: string;
  videoUrl?: string;
  videoThumbnail?: string;
  views?: number;
  featured: boolean;
  tags: string[];
}

// types/media.ts

// Interface para categorias de galeria
export interface GalleryCategory {
  id: string;
  label: string;
}

// Interface para imagens do Cloudinary
export interface CloudinaryImage {
  id: number;
  title: string;
  url: string;
  date: string;
  identifier?: string;
}

// Interface para álbuns do Cloudinary
export interface CloudinaryAlbum {
  id: number;
  name: string;
  folderPath: string;
  description: string;
  date: string;
  imageCount: number;
  coverImage: string;
}

export interface GalleryCollection {
  id: number;
  title: string;
  description: string;
  coverImage: string;
  coverImages: string[];
  date: string;
  url: string;
  itemCount: number;
  category: string;
  featured: boolean;
}

export interface MyAlbumCollection {
  id: number;
  title: string;
  description: string;
  coverImage: string;
  coverImages: string[];
  date: string;
  url: string;
  itemCount: number;
  category: string;
  featured: boolean;
}
