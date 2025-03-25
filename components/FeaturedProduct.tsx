"use client";
import { useState, useEffect, useCallback } from "react"; // Added useCallback import
import { motion } from "framer-motion";
import Image from "next/image";
import Button from "@/components/Button";
import { BaseProduct } from "@/types/types";
// Removed unnecessary div import from framer-motion/client

interface FeaturedProductProps {
  products: any[]; // Using any for simplicity, should be properly typed in a real app
  onAddToCart: (product: BaseProduct) => void;
}

export default function FeaturedProduct({
  products,
  onAddToCart,
}: FeaturedProductProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Get current featured product
  const currentProduct = products[currentIndex];

  // Autoplay functionality
  const handleNext = useCallback(() => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % products.length);

    // Reset transitioning state after animation completes
    setTimeout(() => {
      setIsTransitioning(false);
    }, 600);
  }, [isTransitioning, products.length]);

  // Then use it in your useEffect
  useEffect(() => {
    if (!autoplay || products.length <= 1 || isTransitioning) return;

    const timer = setTimeout(() => {
      handleNext();
    }, 5000);

    return () => clearTimeout(timer);
  }, [currentIndex, autoplay, products.length, isTransitioning, handleNext]);

  // Navigate to previous product
  const handlePrev = useCallback(() => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);

    // Reset transitioning state after animation completes
    setTimeout(() => {
      setIsTransitioning(false);
    }, 600);
  }, [isTransitioning, products.length]);

  // If no featured products, don't render anything
  if (products.length === 0) return null;

  return (
    <div className="relative">
      <h2 className="text-2xl font-bold mb-6 text-purple-200 border-b border-purple-500/30 pb-2">
        Destaques
      </h2>

      <div className="relative overflow-hidden rounded-xl bg-gray-900/40 backdrop-blur-sm">
        {/* Products Carousel */}
        <div className="relative aspect-[21/9]">
          {/* Current Product Image */}
          <motion.div
            key={`image-${currentIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0"
          >
            <Image
              src={currentProduct.image}
              alt={currentProduct.title}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div>
          </motion.div>

          {/* Product Info */}
          <div className="absolute inset-0 flex items-center">
            <div className="ml-8 md:ml-16 max-w-lg p-6 bg-black/30 backdrop-blur-sm rounded-lg">
              <motion.div
                key={`content-${currentIndex}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
              >
                {currentProduct.featured && (
                  <span className="bg-purple-600 text-white text-xs font-medium px-2.5 py-1 rounded-full mb-3 inline-block">
                    Destaque
                  </span>
                )}
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  {currentProduct.title}
                </h3>
                <p className="text-gray-300 mb-4 max-w-md">
                  {currentProduct.description}
                </p>
                <div className="flex items-center gap-6 mb-4">
                  <p className="text-purple-300 text-xl font-bold">
                    {currentProduct.price}
                  </p>
                  {currentProduct.rating && (
                    <div className="flex items-center">
                      {[...Array(5)].map((_, index) => (
                        <svg
                          key={index}
                          className={`w-4 h-4 ${index < Math.floor(currentProduct.rating) ? "text-yellow-400" : "text-gray-500"}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="ml-2 text-sm text-gray-400">
                        {currentProduct.rating.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
                <Button
                  title="Adicionar ao Carrinho"
                  onClick={() => onAddToCart(currentProduct)}
                  rightIcon={
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  }
                />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Navigation Controls */}
        {products.length > 1 && (
          <>
            {/* Previous Button */}
            <button
              onClick={() => {
                setAutoplay(false);
                handlePrev();
              }}
              className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/30 backdrop-blur-sm hover:bg-black/50 p-2 rounded-full text-white focus:outline-none transition-all z-10"
              aria-label="Previous product"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            {/* Next Button */}
            <button
              onClick={() => {
                setAutoplay(false);
                handleNext();
              }}
              className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/30 backdrop-blur-sm hover:bg-black/50 p-2 rounded-full text-white focus:outline-none transition-all z-10"
              aria-label="Next product"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            {/* Progress Indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 bg-black/30 backdrop-blur-sm p-2 rounded-full z-10">
              {products.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setAutoplay(false);
                    setCurrentIndex(index);
                  }}
                  aria-label={`Go to product ${index + 1}`}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? "bg-purple-500 w-4"
                      : "bg-gray-500 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>

            {/* Autoplay Toggle */}
            <button
              onClick={() => setAutoplay(!autoplay)}
              className={`absolute top-4 right-4 bg-black/30 backdrop-blur-sm p-2 rounded-full transition-colors z-10 ${
                autoplay ? "text-purple-400" : "text-gray-400"
              }`}
              aria-label={autoplay ? "Pause autoplay" : "Start autoplay"}
            >
              {autoplay ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
