"use client";

import { useState, useEffect, useCallback, useMemo, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  buildCloudinaryUrl,
  type CloudinaryImage,
} from "@/services/cloudinaryService";

const IMAGES_PER_PAGE = 12;

// Improved ImageCard with better error handling and optimization
const ImageCard = memo(
  ({
    url,
    alt,
    onClick,
    index,
  }: {
    url: string;
    alt: string;
    onClick: () => void;
    index: number;
  }) => {
    const [imageError, setImageError] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    // Pre-calculate animation delay to avoid runtime calculation
    const animationDelay = Math.min(0.05 * (index % IMAGES_PER_PAGE), 0.6);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: isLoaded || imageError ? 1 : 0,
          y: isLoaded || imageError ? 0 : 20,
        }}
        transition={{
          duration: 0.3,
          delay: animationDelay,
        }}
        className="relative aspect-square overflow-hidden bg-gray-800 rounded-lg cursor-pointer group"
        onClick={onClick}
      >
        {!imageError ? (
          <div className="relative w-full h-full">
            <Image
              src={url}
              alt={alt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
              onLoadingComplete={() => setIsLoaded(true)}
              onError={() => setImageError(true)}
              unoptimized // For external Cloudinary images
              loading="lazy"
            />
          </div>
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
  },
  // Implement proper prop equality check for memo
  (prevProps, nextProps) => {
    return (
      prevProps.url === nextProps.url && prevProps.index === nextProps.index
    );
  }
);

ImageCard.displayName = "ImageCard";

// Optimized Pagination component with reduced re-renders
const Pagination = memo(
  ({
    currentPage,
    totalPages,
    changePage,
  }: {
    currentPage: number;
    totalPages: number;
    changePage: (page: number) => void;
  }) => {
    if (totalPages <= 1) return null;

    // Pre-calculate pagination array to avoid recreating it on each render
    const paginationItems = useMemo(() => {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
        .filter(
          (page) =>
            page === 1 ||
            page === totalPages ||
            (page >= currentPage - 1 && page <= currentPage + 1)
        )
        .map((page, index, array) => {
          const showEllipsisBefore = index > 0 && array[index - 1] !== page - 1;
          const showEllipsisAfter =
            index < array.length - 1 && array[index + 1] !== page + 1;

          return { page, showEllipsisBefore, showEllipsisAfter };
        });
    }, [currentPage, totalPages]);

    return (
      <div className="mt-10 flex justify-center">
        <nav className="flex items-center">
          <button
            onClick={() => changePage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`mx-1 p-2 rounded-full ${
              currentPage === 1
                ? "text-gray-500 cursor-not-allowed"
                : "text-white hover:bg-gray-700"
            }`}
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
            {paginationItems.map(
              ({ page, showEllipsisBefore, showEllipsisAfter }) => (
                <div key={page} className="flex items-center">
                  {showEllipsisBefore && (
                    <span className="mx-1 text-gray-500">...</span>
                  )}
                  <button
                    onClick={() => changePage(page)}
                    className={`mx-1 w-8 h-8 flex items-center justify-center rounded-full ${
                      currentPage === page
                        ? "bg-purple-600 text-white"
                        : "text-white hover:bg-gray-700"
                    }`}
                    aria-label={`Página ${page}`}
                    aria-current={currentPage === page ? "page" : undefined}
                  >
                    {page}
                  </button>
                  {showEllipsisAfter && (
                    <span className="mx-1 text-gray-500">...</span>
                  )}
                </div>
              )
            )}
          </div>
          <button
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`mx-1 p-2 rounded-full ${
              currentPage === totalPages
                ? "text-gray-500 cursor-not-allowed"
                : "text-white hover:bg-gray-700"
            }`}
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
    );
  },
  // Add proper equality check for memo
  (prevProps, nextProps) => {
    return (
      prevProps.currentPage === nextProps.currentPage &&
      prevProps.totalPages === nextProps.totalPages
    );
  }
);

Pagination.displayName = "Pagination";

// Optimized ImageViewer with better error handling and reduced re-renders
const ImageViewer = memo(
  ({
    selectedImage,
    closeImageViewer,
    navigateImage,
    totalImagesCount,
  }: {
    selectedImage: { id: number; url: string; title: string } | null;
    closeImageViewer: () => void;
    navigateImage: (direction: "next" | "prev") => void;
    totalImagesCount: number;
  }) => {
    if (!selectedImage) return null;

    // Create error handling function outside of JSX for better organization
    const handleImageError = () => {
      const container = document.querySelector(".image-viewer-container");
      if (container) {
        container.innerHTML = `
          <div class="bg-gray-800 flex items-center justify-center h-[50vh] rounded-lg w-full">
            <div class="text-center text-gray-400">
              <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p class="text-xl">Não foi possível carregar esta imagem</p>
            </div>
          </div>
        `;
      }
    };

    return (
      <div
        className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
        onClick={closeImageViewer}
      >
        <div className="relative max-w-6xl max-h-screen p-4">
          <div
            className="relative image-viewer-container"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selectedImage.url}
              alt={selectedImage.title}
              width={1200}
              height={800}
              className="max-w-full max-h-[90vh] object-contain mx-auto"
              unoptimized={true}
              priority={true}
              onError={handleImageError}
            />
          </div>
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
    );
  },
  // Implement proper equality check for memo
  (prevProps, nextProps) => {
    if (!prevProps.selectedImage && !nextProps.selectedImage) return true;
    if (!prevProps.selectedImage || !nextProps.selectedImage) return false;

    return (
      prevProps.selectedImage.id === nextProps.selectedImage.id &&
      prevProps.selectedImage.url === nextProps.selectedImage.url &&
      prevProps.totalImagesCount === nextProps.totalImagesCount
    );
  }
);

ImageViewer.displayName = "ImageViewer";

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
  // Improved state management with better initialization
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState<{
    id: number;
    url: string;
    title: string;
  } | null>(null);

  // States for managing images loaded from API
  const [allLoadedImages, setAllLoadedImages] = useState<CloudinaryImage[]>(
    initialAlbumImages || []
  );
  const [pageImages, setPageImages] = useState<CloudinaryImage[]>([]);
  const [totalImagesCount, setTotalImagesCount] = useState(
    initialTotalImages || 0
  );
  const [loadError, setLoadError] = useState(false);

  // Calculate total pages only when needed
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(totalImagesCount / IMAGES_PER_PAGE));
  }, [totalImagesCount]);

  // Memoize API endpoint selection to avoid recalculation
  const getApiEndpoint = useCallback((path: string) => {
    if (path === "2") return "/api/gallery/white-emotion";
    if (path === "3") return "/api/gallery/hula-hula";
    return `/api/cloudinary/${path}`;
  }, []);

  // Function to extract a valid image URL - memoized for performance
  const getValidImageUrl = useCallback((url: string) => {
    if (url.startsWith("http") || url.startsWith("https")) {
      return url;
    }

    try {
      let publicId = url;
      if (url.includes("/")) {
        const parts = url.split("/");
        publicId = parts[parts.length - 1].split(".")[0];
      }

      return buildCloudinaryUrl(publicId, {
        width: 1200,
        height: 1200,
        crop: "limit",
        quality: "auto",
      });
    } catch (error) {
      console.error("Error creating valid image URL:", error);
      return url;
    }
  }, []);

  // Helper function to update page images - memoized
  const updatePageImages = useCallback(
    (images: CloudinaryImage[], page: number) => {
      const startIndex = (page - 1) * IMAGES_PER_PAGE;
      const endIndex = Math.min(startIndex + IMAGES_PER_PAGE, images.length);
      setPageImages(images.slice(startIndex, endIndex));
    },
    []
  );

  // Optimized function to load images from API with fetch abort controller
  const fetchImagesFromApi = useCallback(async () => {
    setLoading(true);
    setLoadError(false);

    // Use AbortController to cancel previous requests
    const controller = new AbortController();
    const signal = controller.signal;

    try {
      const apiEndpoint = getApiEndpoint(folderPath);
      const response = await fetch(`${apiEndpoint}?max_results=100`, {
        signal, // Pass the signal to allow request cancellation
        cache: "force-cache", // Add caching strategy
      });

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

        // Set images for current page
        updatePageImages(fetchedImages, currentPage);
      } else {
        throw new Error("Invalid API response format");
      }
    } catch (error) {
      // Only show error if it's not an abort error
      if (!(error instanceof DOMException && error.name === "AbortError")) {
        console.error("Error fetching images from API:", error);
        setLoadError(true);

        // Fall back to initial images
        setAllLoadedImages(initialAlbumImages);
        updatePageImages(initialAlbumImages, currentPage);
      }
    } finally {
      setLoading(false);
    }

    // Return cleanup function to abort fetch if component unmounts
    return () => {
      controller.abort();
    };
  }, [
    folderPath,
    getApiEndpoint,
    updatePageImages,
    initialAlbumImages,
    currentPage,
    title,
    date,
  ]);

  // Effect to load images when component mounts or folderPath changes
  useEffect(() => {
    const fetchImages = fetchImagesFromApi();

    // Cleanup function
    return () => {
      fetchImages.then((cleanup) => {
        if (cleanup) cleanup();
      });
    };
  }, [folderPath, fetchImagesFromApi]);

  // Effect to update page images when current page changes - optimized to avoid unnecessary updates
  useEffect(() => {
    if (allLoadedImages.length > 0) {
      updatePageImages(allLoadedImages, currentPage);
    }
  }, [currentPage, allLoadedImages, updatePageImages]);

  // Handler for changing pages with debounce to prevent rapid multiple clicks
  const changePage = useCallback((page: number) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    // Add simple debounce to prevent rapid page changes
    setTimeout(() => {
      setCurrentPage(page);
    }, 100);
  }, []);

  // Handler for opening image viewer - memoized
  const openImageViewer = useCallback(
    (image: { id: number; url: string; title: string }) => {
      // Make sure we have a valid URL for the Next.js Image component
      const validUrl = getValidImageUrl(image.url);
      setSelectedImage({
        ...image,
        url: validUrl,
      });
      document.body.style.overflow = "hidden";
    },
    [getValidImageUrl]
  );

  // Handler for closing image viewer - memoized
  const closeImageViewer = useCallback(() => {
    setSelectedImage(null);
    document.body.style.overflow = "auto";
  }, []);

  // Optimized handler for navigating images - reducing unnecessary recalculations
  const navigateImage = useCallback(
    (direction: "next" | "prev") => {
      if (!selectedImage) return;

      // Find the current index in the full array of images
      const currentImageId = selectedImage.id;
      const currentPageIndex = pageImages.findIndex(
        (img) => img.id === currentImageId
      );

      if (currentPageIndex === -1) return;

      let newIndex: number;

      if (direction === "next") {
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
        // Create a valid URL for the Next.js Image component
        const validUrl = getValidImageUrl(newImage.url);
        setSelectedImage({
          ...newImage,
          url: validUrl,
        });
      }
    },
    [
      selectedImage,
      pageImages,
      currentPage,
      totalPages,
      changePage,
      getValidImageUrl,
    ]
  );

  // Memoize the page information to prevent unnecessary recalculations
  const pageInfo = useMemo(() => {
    if (totalPages <= 1) return null;

    const startItem = (currentPage - 1) * IMAGES_PER_PAGE + 1;
    const endItem = Math.min(currentPage * IMAGES_PER_PAGE, totalImagesCount);

    return {
      startItem,
      endItem,
      totalItems: totalImagesCount,
    };
  }, [currentPage, totalImagesCount, totalPages]);

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

        {pageInfo && (
          <div className="mb-6 text-center">
            <p className="text-gray-400 text-sm">
              Mostrando {pageInfo.startItem} - {pageInfo.endItem} de{" "}
              {pageInfo.totalItems} fotos
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
              onClick={() => fetchImagesFromApi()}
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
                  key={`${image.id}-${currentPage}`} // Add currentPage to key to force new instances on page change
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

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          changePage={changePage}
        />
      </div>

      <ImageViewer
        selectedImage={selectedImage}
        closeImageViewer={closeImageViewer}
        navigateImage={navigateImage}
        totalImagesCount={totalImagesCount}
      />
    </div>
  );
}
