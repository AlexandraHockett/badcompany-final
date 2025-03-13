// data/gallery.ts
import {
  GalleryCollection,
  GalleryCategory,
  CloudinaryImage,
  CloudinaryAlbum,
  MyAlbumCollection,
} from "@/types/media";

export const galleryCategories: GalleryCategory[] = [
  { id: "all", label: "Todos" },
  { id: "events", label: "Eventos" },
  { id: "backstage", label: "Bastidores" },
  { id: "portraits", label: "Retratos" },
  { id: "videos", label: "Vídeos" },
];

// MyAlbum collection (separado das coleções Cloudinary)
export const myAlbumCollection: MyAlbumCollection = {
  id: 1,
  title: "Hula Hula 2024",
  description: "Fotos do evento Hula Hula de 2024.",
  coverImage: "/images/logo-black.png",
  coverImages: [
    "https://thumbs-eu-west-1.myalbum.io/photo/360/7e0f76f7-bbff-476e-876d-990b40644e68.jpg",
    "https://thumbs-eu-west-1.myalbum.io/photo/360/e775f683-386d-4b23-bf62-67924dc4709e.jpg",
    "https://thumbs-eu-west-1.myalbum.io/photo/1k0/ff8137fd-6469-4c90-b803-47f73f0a004c.jpg",
    "https://thumbs-eu-west-1.myalbum.io/photo/540/7f61d9f2-b102-4e79-96d8-4ca5118900df.jpg",
  ],
  date: "2024-08-31",
  url: "https://myalbum.com/album/f26Bcff3zfWNbE/?invite=c20b515b-9b7d-4255-b10f-0cee8b36dc96",
  itemCount: 200,
  category: "events",
  featured: true,
};

// Cloudinary collections (sem incluir o MyAlbum)
export const cloudinaryGalleryCollections: GalleryCollection[] = [
  {
    id: 2,
    title: "White Emotion 2024",
    description: "Fotos do evento White Emotion de 2024.",
    coverImage: "/img/bclandia.jpg",
    coverImages: [
      "https://res.cloudinary.com/dsx99t2vn/image/upload/v1741830497/white-motion-24_105_ehih6d.jpg",
      "https://res.cloudinary.com/dsx99t2vn/image/upload/v1741830708/white-motion-24_160_esihet.jpg",
    ],
    date: "2023-07-22",
    url: "",
    itemCount: 327,
    category: "events",
    featured: false,
  },
  {
    id: 3,
    title: "Hula Hula 2023",
    description: "Fotos do evento Hula Hula de 2023.",
    coverImage: "/img/bclandia.jpg",
    coverImages: [
      "https://res.cloudinary.com/dsx99t2vn/image/upload/v1741830056/hula-hula-23_547_dviua3.jpg",
      "https://res.cloudinary.com/dsx99t2vn/image/upload/v1741830003/hula-hula-23_588_znnxjz.jpg",
      "https://res.cloudinary.com/dsx99t2vn/image/upload/v1741829968/hula-hula-23_566_nmsaxd.jpg",
      "https://res.cloudinary.com/dsx99t2vn/image/upload/v1741829873/hula-hula-23_504_cweoq6.jpg",
    ],
    date: "2023-06-30",
    url: "",
    itemCount: 612,
    category: "events",
    featured: false,
  },
];

// Mantém a lista completa para compatibilidade com componentes existentes
export const galleryCollections: GalleryCollection[] = [
  myAlbumCollection as GalleryCollection,
  ...cloudinaryGalleryCollections,
];

export const cloudinaryImages: CloudinaryImage[] = [
  {
    id: 1,
    title: "Evento 2023",
    url: "/img/bclandia.jpg",
    date: "2023-08-15",
  },
  {
    id: 2,
    title: "Backstage",
    url: "/img/bclandia.jpg",
    date: "2023-07-22",
  },
  {
    id: 3,
    title: "Palco Principal",
    url: "/img/bclandia.jpg",
    date: "2023-06-30",
  },
  {
    id: 4,
    title: "DJ Set",
    url: "/img/bclandia.jpg",
    date: "2023-05-15",
  },
  {
    id: 5,
    title: "Público",
    url: "/img/bclandia.jpg",
    date: "2023-04-20",
  },
  {
    id: 6,
    title: "Equipe BadCompany",
    url: "/img/bclandia.jpg",
    date: "2023-03-15",
  },
];

// Cria cloudinaryAlbums apenas para as coleções Cloudinary
export const cloudinaryAlbums: CloudinaryAlbum[] =
  cloudinaryGalleryCollections.map((collection) => ({
    id: collection.id,
    name: collection.title,
    folderPath: collection.id.toString(),
    description: collection.description,
    date: collection.date,
    imageCount: collection.itemCount,
    imageIdentifiers: collection.coverImages.map((url) => {
      const match = url.match(/upload\/v\d+\/(.+)\.jpg$/);
      return match
        ? match[1]
        : `${collection.id}_${Math.random().toString(36).substr(2, 9)}`;
    }),
    coverImage: collection.coverImages[0] || collection.coverImage,
  }));

export default {
  galleryCategories,
  galleryCollections,
  cloudinaryGalleryCollections,
  myAlbumCollection,
  cloudinaryImages,
  cloudinaryAlbums,
};
