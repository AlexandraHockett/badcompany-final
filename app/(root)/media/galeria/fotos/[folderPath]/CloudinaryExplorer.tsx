"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  buildCloudinaryUrl,
  type CloudinaryImage,
} from "@/services/cloudinaryService";

const IMAGES_PER_PAGE = 24;

interface ImageCardProps {
  url: string;
  alt: string;
  onClick: () => void;
  index: number;
}

const ImageCard = ({ url, alt, onClick, index }: ImageCardProps) => {
  const [imageError, setImageError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: isLoaded || imageError ? 1 : 0,
        y: isLoaded || imageError ? 0 : 20,
      }}
      transition={{
        duration: 0.3,
        delay: Math.min(0.05 * (index % IMAGES_PER_PAGE), 1),
      }}
      className="relative aspect-square overflow-hidden bg-gray-800 rounded-lg cursor-pointer group"
      onClick={onClick}
    >
      {!imageError ? (
        <img
          src={url}
          alt={alt}
          className={`w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105 ${isLoaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setIsLoaded(true)}
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-700 p-4">
          <div className="text-center">
            <svg
              className="w-12 h-12 mx-auto text-gray-500 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-gray-400 text-sm">Imagem indisponível</p>
          </div>
        </div>
      )}
      {isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-0 group-hover:opacity-70 transition-opacity duration-300 flex items-end">
          <div className="p-4 w-full">
            <p className="text-white text-sm font-medium truncate">{alt}</p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

interface CloudinaryExplorerProps {
  folderPath: string;
  albumImages: CloudinaryImage[];
  totalImages: number;
  title: string;
  description: string;
  date: string;
}

export default function CloudinaryExplorer({
  folderPath,
  albumImages: initialAlbumImages,
  totalImages: initialTotalImages,
  title,
  description,
  date,
}: CloudinaryExplorerProps) {
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState<{
    id: number;
    url: string;
    title: string;
  } | null>(null);

  // States for managing images loaded from API
  const [allLoadedImages, setAllLoadedImages] = useState<CloudinaryImage[]>([]);
  const [pageImages, setPageImages] = useState<CloudinaryImage[]>([]);
  const [totalImagesCount, setTotalImagesCount] = useState(initialTotalImages);
  const [loadError, setLoadError] = useState(false);

  // New states for cursor-based pagination
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMoreImages, setHasMoreImages] = useState(true);

  const totalPages = Math.ceil(totalImagesCount / IMAGES_PER_PAGE);

  // Function to load images from API
  const fetchImagesFromApi = async () => {
    setLoading(true);
    setLoadError(false);

    try {
      // Fetch images from our API route with reduced batch size (100 instead of 500)
      const response = await fetch(
        `/api/cloudinary/${folderPath}?max_results=100`
      );

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      const data = await response.json();

      if (data.images && Array.isArray(data.images)) {
        const fetchedImages: CloudinaryImage[] = data.images.map(
          (img: any, index: number) => ({
            id: index + 1,
            title: `${title} - Foto ${index + 1}`,
            url: img.url,
            date: date,
            identifier: img.publicId,
          })
        );

        setAllLoadedImages(fetchedImages);
        setTotalImagesCount(data.total || fetchedImages.length);
        setNextCursor(data.nextCursor || null);
        setHasMoreImages(!!data.nextCursor);

        // Set images for current page
        updatePageImages(fetchedImages, currentPage);
      } else {
        console.error("Invalid API response format", data);
        throw new Error("Invalid API response format");
      }
    } catch (error) {
      console.error("Error fetching images from API:", error);
      setLoadError(true);

      // Fall back to initial images
      setAllLoadedImages(initialAlbumImages);
      updatePageImages(initialAlbumImages, currentPage);
    } finally {
      setLoading(false);
    }
  };

  // New function to load more images
  const loadMoreImages = async () => {
    if (!nextCursor || !hasMoreImages || loading) return;

    setLoading(true);

    try {
      const response = await fetch(
        `/api/cloudinary/${folderPath}?max_results=100&next_cursor=${nextCursor}`
      );

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      const data = await response.json();

      if (data.images && Array.isArray(data.images)) {
        const newImages: CloudinaryImage[] = data.images.map(
          (img: any, index: number) => ({
            id: allLoadedImages.length + index + 1,
            title: `${title} - Foto ${allLoadedImages.length + index + 1}`,
            url: img.url,
            date: date,
            identifier: img.publicId,
          })
        );

        // Append new images instead of replacing
        const updatedImages = [...allLoadedImages, ...newImages];
        setAllLoadedImages(updatedImages);
        setTotalImagesCount(data.total || updatedImages.length);
        setNextCursor(data.nextCursor || null);
        setHasMoreImages(!!data.nextCursor);

        // Update the current page view if needed
        if (
          currentPage === Math.ceil(allLoadedImages.length / IMAGES_PER_PAGE)
        ) {
          updatePageImages(updatedImages, currentPage);
        }
      }
    } catch (error) {
      console.error("Error loading more images:", error);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to update page images
  const updatePageImages = (images: CloudinaryImage[], page: number) => {
    const startIndex = (page - 1) * IMAGES_PER_PAGE;
    const endIndex = Math.min(startIndex + IMAGES_PER_PAGE, images.length);
    setPageImages(images.slice(startIndex, endIndex));
  };

  // Effect to load images when component mounts or folderPath changes
  useEffect(() => {
    fetchImagesFromApi();
  }, [folderPath]);

  // Effect to update page images when current page changes
  useEffect(() => {
    if (allLoadedImages.length > 0) {
      updatePageImages(allLoadedImages, currentPage);

      // Load more images if we're near the end and more are available
      const startIndex = (currentPage - 1) * IMAGES_PER_PAGE;
      if (
        hasMoreImages &&
        startIndex + IMAGES_PER_PAGE >= allLoadedImages.length - IMAGES_PER_PAGE
      ) {
        loadMoreImages();
      }
    }
  }, [currentPage]);

  const changePage = (page: number) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setCurrentPage(page);
  };

  const openImageViewer = (image: {
    id: number;
    url: string;
    title: string;
  }) => {
    // Extract the image identifier from the URL
    let imageId = "";
    if (image.url.includes("/upload/")) {
      const parts = image.url.split("/");
      imageId = parts[parts.length - 1].split(".")[0]; // Remove extension
    } else {
      imageId = image.url;
    }

    const largeUrl = buildCloudinaryUrl(imageId, {
      width: 1200,
      height: 1200,
      crop: "limit",
      quality: "auto",
    });

    setSelectedImage({ ...image, url: largeUrl });
    document.body.style.overflow = "hidden";
  };

  const closeImageViewer = () => {
    setSelectedImage(null);
    document.body.style.overflow = "auto";
  };

  const navigateImage = (direction: "next" | "prev") => {
    if (!selectedImage) return;

    // Find the current index in the full array of images
    const currentImageId = selectedImage.id;
    const currentPageIndex = pageImages.findIndex(
      (img) => img.id === currentImageId
    );

    if (currentPageIndex === -1) return;

    let newIndex: number;

    if (direction === "next") {
      // If we're at the end of the current page, load next page
      if (
        currentPageIndex === pageImages.length - 1 &&
        currentPage < totalPages
      ) {
        changePage(currentPage + 1);
        newIndex = 0; // First image of the new page
      } else {
        newIndex = (currentPageIndex + 1) % pageImages.length;
      }
    } else {
      // If we're at the start of the current page, load previous page
      if (currentPageIndex === 0 && currentPage > 1) {
        changePage(currentPage - 1);
        newIndex = IMAGES_PER_PAGE - 1; // Last image of previous page
      } else {
        newIndex =
          (currentPageIndex - 1 + pageImages.length) % pageImages.length;
      }
    }

    // Only proceed if we have a valid image
    if (newIndex >= 0 && newIndex < pageImages.length) {
      const newImage = pageImages[newIndex];

      // Extract the image identifier from the URL
      let imageId = "";
      if (newImage.url.includes("/upload/")) {
        const parts = newImage.url.split("/");
        imageId = parts[parts.length - 1].split(".")[0]; // Remove extension
      } else {
        imageId = newImage.url;
      }

      const largeUrl = buildCloudinaryUrl(imageId, {
        width: 1200,
        height: 1200,
        crop: "limit",
        quality: "auto",
      });

      setSelectedImage({ ...newImage, url: largeUrl });
    }
  };

  return (
    <div className="text-white">
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="mb-6">
          <Link
            href="/media/galeria/fotos"
            className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors mb-4"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Voltar para Galerias
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{title}</h1>
          <p className="text-gray-400 mb-4">{description}</p>
          <div className="flex items-center text-sm text-gray-500">
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
            {date}
            <span className="mx-2">•</span>
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
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {totalImagesCount} fotos
          </div>
        </div>

        {totalPages > 1 && (
          <div className="mb-6 text-center">
            <p className="text-gray-400 text-sm">
              Mostrando {(currentPage - 1) * IMAGES_PER_PAGE + 1} -{" "}
              {Math.min(currentPage * IMAGES_PER_PAGE, totalImagesCount)} de{" "}
              {totalImagesCount} fotos
            </p>
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center min-h-[300px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        )}

        {loadError && (
          <div className="text-center py-8">
            <svg
              className="w-16 h-16 text-red-500 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h3 className="text-xl font-bold mb-2">Erro ao carregar imagens</h3>
            <p className="text-gray-400 mb-4">
              Não foi possível carregar todas as imagens. Estamos exibindo
              apenas as imagens disponíveis.
            </p>
            <button
              onClick={fetchImagesFromApi}
              className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {!loading && pageImages.length > 0 && (
          <div className="mb-10">
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {pageImages.map((image, index) => (
                <ImageCard
                  key={image.id}
                  url={image.url}
                  alt={image.title}
                  onClick={() => openImageViewer(image)}
                  index={index}
                />
              ))}
            </motion.div>
          </div>
        )}

        {!loading && pageImages.length === 0 && !loadError && (
          <div className="text-center py-12">
            <svg
              className="w-16 h-16 text-gray-500 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <h3 className="text-xl font-bold mb-2">
              Nenhuma imagem encontrada
            </h3>
            <p className="text-gray-400">
              Não encontramos imagens para esta galeria. Tente novamente mais
              tarde.
            </p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-10 flex justify-center">
            <nav className="flex items-center">
              <button
                onClick={() => changePage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`mx-1 p-2 rounded-full ${currentPage === 1 ? "text-gray-500 cursor-not-allowed" : "text-white hover:bg-gray-700"}`}
                aria-label="Página anterior"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <div className="flex">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (page) =>
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                  )
                  .map((page, index, array) => {
                    const showEllipsisBefore =
                      index > 0 && array[index - 1] !== page - 1;
                    const showEllipsisAfter =
                      index < array.length - 1 && array[index + 1] !== page + 1;
                    return (
                      <div key={page} className="flex items-center">
                        {showEllipsisBefore && (
                          <span className="mx-1 text-gray-500">...</span>
                        )}
                        <button
                          onClick={() => changePage(page)}
                          className={`mx-1 w-8 h-8 flex items-center justify-center rounded-full ${currentPage === page ? "bg-purple-600 text-white" : "text-white hover:bg-gray-700"}`}
                          aria-label={`Página ${page}`}
                          aria-current={
                            currentPage === page ? "page" : undefined
                          }
                        >
                          {page}
                        </button>
                        {showEllipsisAfter && (
                          <span className="mx-1 text-gray-500">...</span>
                        )}
                      </div>
                    );
                  })}
              </div>
              <button
                onClick={() => changePage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`mx-1 p-2 rounded-full ${currentPage === totalPages ? "text-gray-500 cursor-not-allowed" : "text-white hover:bg-gray-700"}`}
                aria-label="Próxima página"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </nav>
          </div>
        )}

        {/* Add Load More button */}
        {hasMoreImages && (
          <div className="mt-6 text-center">
            <button
              onClick={loadMoreImages}
              disabled={loading}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Carregando...
                </span>
              ) : (
                "Carregar mais fotos"
              )}
            </button>
          </div>
        )}
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
          onClick={closeImageViewer}
        >
          <div className="relative max-w-6xl max-h-screen p-4">
            <img
              src={selectedImage.url}
              alt={selectedImage.title}
              className="max-w-full max-h-[90vh] object-contain mx-auto"
              onClick={(e) => e.stopPropagation()}
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                target.style.display = "none";
                const container = target.parentElement;
                if (container) {
                  const fallback = document.createElement("div");
                  fallback.className =
                    "bg-gray-800 flex items-center justify-center w-full h-[50vh] rounded-lg";
                  fallback.innerHTML = `
                    <div class="text-center text-gray-400">
                      <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p class="text-xl">Não foi possível carregar esta imagem</p>
                    </div>
                  `;
                  container.appendChild(fallback);
                }
              }}
            />
            <button
              className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 p-3 rounded-full text-white"
              onClick={(e) => {
                e.stopPropagation();
                navigateImage("prev");
              }}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 p-3 rounded-full text-white"
              onClick={(e) => {
                e.stopPropagation();
                navigateImage("next");
              }}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
            <button
              className="absolute top-4 right-4 bg-black bg-opacity-50 hover:bg-opacity-70 p-2 rounded-full text-white"
              onClick={closeImageViewer}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div className="absolute bottom-6 left-0 right-0 text-center text-white bg-black bg-opacity-60 py-2 px-4 mx-auto w-fit rounded-full">
              {selectedImage.title}{" "}
              <span className="opacity-70">
                ({selectedImage.id} de {totalImagesCount})
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
