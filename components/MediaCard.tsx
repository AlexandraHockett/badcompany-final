"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

interface MediaCardProps {
  title: string;
  image: string;
  href: string;
  description?: string;
  date?: string;
}

export default function MediaCard({
  title,
  image,
  href,
  description,
  date,
}: MediaCardProps) {
  return (
    <motion.div
      className="h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link
        href={href}
        className="block h-full bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-purple-500/20 transition-all duration-300 group"
      >
        <div className="relative h-48 overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
        </div>

        <div className="p-5">
          <h3 className="text-xl font-bold text-white mb-1 transition-colors duration-300 group-hover:text-purple-300">
            {title}
          </h3>

          {description && (
            <p className="text-gray-400 text-sm mb-3 line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
              {description}
            </p>
          )}

          {date && (
            <p className="text-gray-500 text-xs">
              {new Date(date).toLocaleDateString("pt-PT", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          )}

          <div className="mt-3 flex justify-end">
            <span className="text-purple-400 text-sm flex items-center group-hover:translate-x-1 transition-transform duration-300">
              Explorar
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-1"
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
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
