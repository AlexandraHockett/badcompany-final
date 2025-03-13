"use client";

import { memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

type EventCardProps = {
  title: string;
  description?: string;
  image: string;
  href: string;
  date?: string;
  location?: string;
  className?: string;
};

const EventCard = ({
  title,
  description,
  image,
  href,
  date,
  location,
  className,
}: EventCardProps) => {
  return (
    <Link
      href={href}
      className="group relative block rounded-xl overflow-hidden shadow-lg h-64 bg-gradient-to-br from-purple-900/20 to-black/40 backdrop-blur-sm transition-all duration-300 hover:shadow-purple-500/30 hover:shadow-xl"
    >
      <motion.div
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
        className="relative w-full h-full"
      >
        <div className="relative w-full h-full">
          <Image
            src={image}
            alt={title}
            width={500}
            height={300}
            priority={false}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/70 transition-colors duration-300" />
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-end p-6 text-white">
          <motion.h2
            className="text-2xl font-bold text-center mb-2 text-white drop-shadow-md"
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
          >
            {title}
          </motion.h2>

          {description && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 0, y: 10 }}
              whileHover={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-sm text-gray-200 text-center max-w-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              {description}
            </motion.p>
          )}

          {(date || location) && (
            <div className="flex items-center gap-3 mt-2 text-xs text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {date && (
                <span className="flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {date}
                </span>
              )}

              {location && (
                <span className="flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
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
                </span>
              )}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileHover={{ opacity: 1, y: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="mt-4 text-sm font-medium text-white bg-purple-700 hover:bg-purple-600 px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
          >
            Ver detalhes
          </motion.div>
        </div>
      </motion.div>
    </Link>
  );
};

export default memo(EventCard);
