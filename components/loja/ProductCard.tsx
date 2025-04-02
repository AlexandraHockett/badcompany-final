"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { BaseProduct } from "@/types/types";
import Button from "@/components/layout/Button";

interface ProductCardProps {
  id: number;
  title: string;
  price: string;
  image: string;
  description?: string;
  rating?: number;
  featured?: boolean;
  available?: boolean;
  date?: string;
  location?: string;
  onAddToCart: (item: BaseProduct) => void;
}

export default function ProductCard({
  id,
  title,
  price,
  image,
  description,
  rating,
  featured = false,
  available = true,
  date,
  location,
  onAddToCart,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    onAddToCart({ id, title, price, image });

    // Animation effect
    setTimeout(() => {
      setIsAdding(false);
    }, 600);
  };

  // Render stars based on rating
  const renderRating = () => {
    if (!rating) return null;

    return (
      <div className="flex items-center mb-2">
        {[...Array(5)].map((_, index) => (
          <svg
            key={index}
            className={`w-4 h-4 ${index < Math.floor(rating) ? "text-yellow-400" : "text-gray-500"}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-1 text-xs text-gray-400">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <motion.div
      className={`bg-gray-800/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg transition-all duration-300 group ${
        isHovered ? "scale-[1.02] shadow-xl shadow-purple-500/20" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Featured Badge */}
      {featured && (
        <div className="absolute top-3 left-3 z-20 bg-purple-600 text-white text-xs font-medium px-2 py-1 rounded-full">
          Destaque
        </div>
      )}

      {/* Out of stock overlay */}
      {!available && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-30">
          <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium transform -rotate-12">
            Esgotado
          </span>
        </div>
      )}

      {/* Product Image */}
      <div className="relative h-56 overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className={`object-cover transition-transform duration-500 ${
            isHovered ? "scale-110" : "scale-100"
          }`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Product Info */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-white mb-1 transition-colors duration-300 group-hover:text-purple-300">
          {title}
        </h3>

        {renderRating()}

        {description && (
          <p className="text-gray-400 text-sm mb-3 line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
            {description}
          </p>
        )}

        {/* Event Details for Tickets */}
        {date && location && (
          <div className="mb-3 bg-gray-700/50 p-2 rounded-lg text-xs space-y-1">
            <p className="text-gray-300 flex items-center">
              <svg
                className="w-3 h-3 mr-1 text-purple-400"
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
            </p>
            <p className="text-gray-300 flex items-center">
              <svg
                className="w-3 h-3 mr-1 text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {location}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between mt-3">
          <div className="text-purple-300 font-bold">{price}</div>
          <Button
            title={isAdding ? "Adicionado!" : "Adicionar"}
            onClick={handleAddToCart}
            disabled={!available || isAdding}
            rightIcon={
              isAdding ? (
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4 text-white"
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
              )
            }
            containerClass={`text-sm py-1 px-3 ${isAdding ? "bg-green-600" : ""}`}
          />
        </div>
      </div>
    </motion.div>
  );
}
