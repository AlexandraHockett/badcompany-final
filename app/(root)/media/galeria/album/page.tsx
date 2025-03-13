"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { galleryCollections } from "@/data/gallery";

export default function AlbumPage() {
  // Buscar a coleção MyAlbum (ID 1)
  const myAlbumCollection = galleryCollections.find(
    (collection) => collection.id === 1
  );

  // Garantir que temos imagens para exibir
  const coverImages = myAlbumCollection?.coverImages || [
    myAlbumCollection?.coverImage || "/img/bclandia.jpg",
  ];

  // URL para o álbum
  const albumUrl =
    myAlbumCollection?.url || "https://myalbum.com/album/f26Bcff3zfWNbE/";

  // Estado para a imagem atual
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [coverImage, setCoverImage] = useState(coverImages[0]);

  // Efeito para rotacionar as imagens a cada 5 segundos
  useEffect(() => {
    if (coverImages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => {
        const newIndex = (prevIndex + 1) % coverImages.length;
        setCoverImage(coverImages[newIndex]);
        return newIndex;
      });
    }, 5000); // Altera a imagem a cada 5 segundos

    return () => clearInterval(interval);
  }, [coverImages]);

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
            className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 bg-purple-600 text-white"
          >
            Album BadCompany
          </Link>
          <Link
            href="/media/galeria/fotos"
            className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 bg-gray-800 text-gray-300 hover:bg-gray-700"
          >
            Fotos Recentes
          </Link>
        </div>
      </div>

      {/* Conteúdo do Álbum MyAlbum com capa rotativa */}
      <div className="max-w-6xl mx-auto mb-16">
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg p-4">
          <h2 className="text-xl font-bold text-white mb-4 flex justify-between items-center">
            <span>{myAlbumCollection?.title || "Álbum BadCompany 2023"}</span>
            <span className="text-sm font-normal text-gray-400">
              Imagem {currentImageIndex + 1} de {coverImages.length}
            </span>
          </h2>

          <div className="relative rounded-lg overflow-hidden">
            <a
              href={albumUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block transition-transform duration-300 hover:scale-[1.01]"
            >
              {/* Imagem de capa dinâmica */}
              <div className="aspect-video w-full relative">
                <img
                  src={coverImage}
                  alt={`Foto do ${myAlbumCollection?.title || "Álbum BadCompany"} ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover rounded-lg shadow-lg"
                  style={{ transition: "opacity 1s ease-in-out" }}
                />
              </div>

              <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black/40">
                <div className="px-4 py-2 bg-purple-600/80 backdrop-blur-sm rounded-full text-white flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
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
                  Ver Álbum Completo
                </div>
              </div>
            </a>
          </div>

          {/* Controles manuais para mudar de imagem */}
          <div className="flex justify-center mt-4 space-x-2">
            {coverImages.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentImageIndex(index);
                  setCoverImage(coverImages[index]);
                }}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentImageIndex
                    ? "bg-purple-500 ring-2 ring-white ring-opacity-50"
                    : "bg-white bg-opacity-60 hover:bg-opacity-90"
                }`}
                aria-label={`Imagem ${index + 1}`}
              />
            ))}
          </div>

          <div className="mt-4 text-gray-400 text-sm">
            <p>
              {myAlbumCollection?.description ||
                "Clique na imagem acima para ver todas as fotos do álbum no MyAlbum."}
            </p>
            <div className="mt-2">
              <a
                href={albumUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors"
              >
                Abrir álbum em nova janela
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
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
