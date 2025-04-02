import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { CloudinaryAlbum } from "@/types/media";

// Função para formatar data
function formatDate(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };

  return new Date(dateString).toLocaleDateString("pt-PT", options);
}

interface CloudinaryAlbumCardProps {
  album: CloudinaryAlbum;
}

export default function CloudinaryAlbumCard({
  album,
}: CloudinaryAlbumCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gray-800/30 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-purple-500/20 transition-all duration-300 group"
    >
      <Link href={`/media/galeria/fotos/${album.folderPath}`} className="block">
        <div className="relative h-64 overflow-hidden">
          <Image
            src={album.coverImage}
            alt={album.name}
            fill
            className="object-cover object-center transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent opacity-80 group-hover:opacity-70 transition-opacity duration-300"></div>

          {/* Contador de itens */}
          <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-full flex items-center">
            <svg
              className="w-3 h-3 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {album.imageCount} fotos
          </div>
        </div>

        <div className="p-5">
          <h2 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
            {album.name}
          </h2>

          <p className="text-gray-400 text-sm mb-4">{album.description}</p>

          <div className="flex justify-between items-center text-sm">
            {/* Data */}
            <div className="flex items-center text-gray-500">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {formatDate(album.date)}
            </div>

            {/* Ver Galeria */}
            <div className="text-purple-400 flex items-center group-hover:translate-x-1 transition-transform duration-300">
              Ver Fotos
              <svg
                className="w-4 h-4 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
