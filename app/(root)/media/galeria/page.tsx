"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  galleryCollections,
  myAlbumCollection,
} from "@/data/gallery";
import { cloudinaryAlbums } from "@/services/cloudinaryService";

interface ActiveCollectionImages {
  [key: number]: {
    index: number;
    image: string;
  };
}

export default function GaleriaPage() {
  const [activeCollectionImages, setActiveCollectionImages] =
    useState<ActiveCollectionImages>({});
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [coverImage, setCoverImage] = useState(
    myAlbumCollection.coverImages[0]
  );

  useEffect(() => {
    console.log("galleryCollections:", galleryCollections);
    if (!galleryCollections || galleryCollections.length === 0) return;

    const initialState: ActiveCollectionImages = {};
    galleryCollections.forEach((collection) => {
      initialState[collection.id] = {
        index: 0,
        image: collection.coverImages?.[0] || collection.coverImage,
      };
    });
    setActiveCollectionImages(initialState);
  }, []);

  useEffect(() => {
    if (!galleryCollections || galleryCollections.length === 0) return;
    if (Object.keys(activeCollectionImages).length === 0) return;

    const intervals: Record<number, NodeJS.Timeout> = {};
    galleryCollections.forEach((collection) => {
      if (collection.coverImages?.length > 1) {
        intervals[collection.id] = setInterval(
          () => {
            setActiveCollectionImages((prev) => {
              const current = prev[collection.id];
              if (!current) return prev;

              const nextIndex =
                (current.index + 1) % collection.coverImages.length;
              return {
                ...prev,
                [collection.id]: {
                  index: nextIndex,
                  image: collection.coverImages[nextIndex],
                },
              };
            });
          },
          5000 + collection.id * 500
        );
      }
    });

    return () => Object.values(intervals).forEach(clearInterval);
  }, [galleryCollections, activeCollectionImages]);

  useEffect(() => {
    if (myAlbumCollection.coverImages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => {
        const newIndex = (prevIndex + 1) % myAlbumCollection.coverImages.length;
        setCoverImage(myAlbumCollection.coverImages[newIndex]);
        return newIndex;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [myAlbumCollection.coverImages]);

  return (
    <div className="text-white">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-6">
        Galerias de Fotos
      </h1>
      <p className="text-gray-400 text-center mb-10 max-w-3xl mx-auto">
        Explore nossas coleções de fotos dos eventos e bastidores da BadCompany.
      </p>

      <div className="mb-10 flex overflow-x-auto pb-2 scrollbar-hide">
        <div className="flex space-x-2 mx-auto">
          <Link
            href="/media/galeria"
            className="px-4 py-2 rounded-full bg-purple-600 text-white"
          >
            Coleções
          </Link>
          <Link
            href="/media/galeria/album"
            className="px-4 py-2 rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700"
          >
            Album BadCompany
          </Link>
          <Link
            href="/media/galeria/fotos"
            className="px-4 py-2 rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700"
          >
            Fotos Recentes
          </Link>
        </div>
      </div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {[myAlbumCollection, ...cloudinaryAlbums].map((album) => (
          <motion.div
            key={album.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-800/30 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-purple-500/20 transition-all duration-300 group"
          >
            <Link
              href={
                "url" in album
                  ? album.url
                  : `/media/galeria/fotos/${"folderPath" in album ? album.folderPath : ""}`
              }
              className="block"
            >
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={
                    activeCollectionImages[album.id]?.image || album.coverImage
                  }
                  alt={
                    "name" in album
                      ? album.name
                      : "title" in album
                        ? album.title
                        : "Imagem do álbum"
                  }
                  fill
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="p-5">
                <h2 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                  {"name" in album
                    ? album.name
                    : "title" in album
                      ? album.title
                      : "Álbum sem nome"}
                </h2>
                <p className="text-gray-400 text-sm mb-4">
                  {album.description}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
//         Galeria de Fotos
//       </h1>
//       <p className="text-gray-400 text-center mb-10 max-w-3xl mx-auto">
//         Explore as nossas coleções de fotos de alguns dos eventos da BadCompany.
//       </p>

//       <div className="mb-10 flex overflow-x-auto pb-2 scrollbar-hide">
//         <div className="flex space-x-2 mx-auto">
//           <Link
//             href="/media/galeria"
//             className="px-4 py-2 rounded-full bg-purple-600 text-white"
//           >
//             Coleções
//           </Link>
//           <Link
//             href="/media/galeria/album"
//             className="px-4 py-2 rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700"
//           >
//             Albuns
//           </Link>
//           <Link
//             href="/media/galeria/fotos"
//             className="px-4 py-2 rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700"
//           >
//             Fotos
//           </Link>
//         </div>
//       </div>

//       <motion.div
//         className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.5 }}
//       >
//         {[myAlbumCollection, ...cloudinaryAlbums].map((album) => (
//           <motion.div
//             key={album.id}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.3 }}
//             className="bg-gray-800/30 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-purple-500/20 transition-all duration-300 group"
//           >
//             <Link
//               href={
//                 "url" in album
//                   ? album.url
//                   : `/media/galeria/fotos/${"folderPath" in album ? album.folderPath : ""}`
//               }
//               className="block"
//             >
//               <div className="relative h-64 overflow-hidden">
//                 <Image
//                   src={album.coverImage}
//                   alt={
//                     "name" in album
//                       ? album.name
//                       : "title" in album
//                         ? album.title
//                         : "Imagem do álbum"
//                   }
//                   fill
//                   className="object-cover object-center transition-transform duration-500 group-hover:scale-110"
//                   sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//                   onError={(e) => {
//                     const colors = [
//                       "bg-blue-500",
//                       "bg-green-500",
//                       "bg-amber-500",
//                       "bg-red-500",
//                     ];
//                     const target = e.currentTarget;
//                     const container = target.parentElement;
//                     if (container) {
//                       container.classList.add(
//                         colors[(album.id - 1) % colors.length]
//                       );
//                       target.style.display = "none";
//                     }
//                   }}
//                 />
//               </div>
//               <div className="p-5">
//                 <h2 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
//                   {"name" in album
//                     ? album.name
//                     : "title" in album
//                       ? album.title
//                       : "Álbum sem nome"}
//                 </h2>
//                 <p className="text-gray-400 text-sm mb-4">
//                   {album.description}
//                 </p>
//               </div>
//             </Link>
//           </motion.div>
//         ))}
//       </motion.div>
//     </div>
//   );
// }
