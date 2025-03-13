"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { getCloudinaryAlbums } from "@/services/cloudinaryService";

// Função para formatar data
function formatDate(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };

  return new Date(dateString).toLocaleDateString("pt-PT", options);
}

export default function FotosPage() {
  // Obter álbuns do Cloudinary
  const albums = getCloudinaryAlbums();

  return (
    <div className="text-white">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-6">
        Galerias de Fotos
      </h1>
      <p className="text-gray-400 text-center mb-10 max-w-3xl mx-auto">
        Explore nossas coleções de fotos dos eventos e bastidores da BadCompany.
      </p>

      {/* Navegação */}
      <div className="mb-10 flex overflow-x-auto pb-2 scrollbar-hide">
        <div className="flex space-x-2 mx-auto">
          <Link
            href="/media/galeria"
            className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 bg-gray-800 text-gray-300 hover:bg-gray-700"
          >
            Coleções
          </Link>
          <Link
            href="/media/galeria/album"
            className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 bg-gray-800 text-gray-300 hover:bg-gray-700"
          >
            Album BadCompany
          </Link>
          <Link
            href="/media/galeria/fotos"
            className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 bg-purple-600 text-white"
          >
            Fotos Recentes
          </Link>
        </div>
      </div>

      {/* Grid de Álbuns Cloudinary */}
      <div className="mb-16">
        <p className="text-center text-gray-400 mb-8">
          Escolha uma das galerias abaixo para ver as fotos.
        </p>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {albums.map((album) => (
            <motion.div
              key={album.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-800/30 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-purple-500/20 transition-all duration-300 group"
            >
              <Link
                href={`/media/galeria/fotos/${album.folderPath}`}
                className="block"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={album.coverImage}
                    alt={album.name}
                    fill
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    onError={(e) => {
                      // Caso a imagem falhe, aplicamos uma cor de fundo baseada no id do álbum
                      const colors = [
                        "bg-blue-500",
                        "bg-green-500",
                        "bg-amber-500",
                        "bg-red-500",
                      ];
                      const target = e.currentTarget as HTMLImageElement;
                      const container = target.parentElement;
                      if (container) {
                        container.classList.add(
                          colors[(album.id - 1) % colors.length]
                        );
                        target.style.display = "none";
                      }
                    }}
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

                  <p className="text-gray-400 text-sm mb-4">
                    {album.description}
                  </p>

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
          ))}
        </motion.div>
      </div>
    </div>
  );
}
