"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";

interface SpotifyPlaylistProps {
  playlistId: string;
  title?: string;
}

export default function SpotifyPlaylist({
  playlistId,
  title = "BC Vibes",
}: SpotifyPlaylistProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [glowPosition, setGlowPosition] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    // Set loaded after a small delay to trigger animations
    const timer = setTimeout(() => setIsLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // Global mouse tracking for the glow effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const { left, top, width, height } =
        containerRef.current.getBoundingClientRect();

      // Check if mouse is within a larger area around the container
      if (
        e.clientX >= left - 200 &&
        e.clientX <= left + width + 200 &&
        e.clientY >= top - 200 &&
        e.clientY <= top + height + 200
      ) {
        // Calculate normalized position (0-1 range)
        const x = Math.min(Math.max((e.clientX - left) / width, 0), 1);
        const y = Math.min(Math.max((e.clientY - top) / height, 0), 1);

        setGlowPosition({ x, y });
      }
    };

    // Add the event listener to the window object
    window.addEventListener("mousemove", handleMouseMove);

    // Set an interval to ensure glow doesn't disappear
    const persistInterval = setInterval(() => {
      if (containerRef.current) {
        // Slightly modify position to keep effect active
        setGlowPosition((prev) => ({
          x: prev.x + (Math.random() * 0.001 - 0.0005),
          y: prev.y + (Math.random() * 0.001 - 0.0005),
        }));
      }
    }, 100);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearInterval(persistInterval);
    };
  }, []);

  return (
    <section
      id="playlist"
      className="relative py-20 px-4 sm:px-8 w-full text-white overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/3 w-64 h-64 rounded-full bg-purple-600/20 filter blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 rounded-full bg-blue-600/20 filter blur-[120px]" />
      </div>

      {/* Sound wave decorative elements */}
      <div className="absolute left-0 right-0 top-10 flex justify-center opacity-20 overflow-hidden">
        {[...Array(20)].map((_, index) => (
          <motion.div
            key={index}
            className="w-1 mx-0.5 bg-blue-400 rounded-full"
            animate={{
              height: [15, 30, 15, 45, 10, 25],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "reverse",
              delay: index * 0.05,
            }}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Title with animated underline */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-4xl sm:text-5xl font-zentry inline-block relative">
            {title}
            <motion.span
              className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: isLoaded ? "100%" : "0%" }}
              transition={{ duration: 0.8, delay: 0.6 }}
            />
          </h2>
          <p className="text-gray-400 mt-3 text-sm sm:text-base">
            A seleção musical que define a nossa energia
          </p>
        </motion.div>

        {/* Main container with the permanent glow effect */}
        <motion.div
          ref={containerRef}
          className="relative"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 0.95 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {/* Persistent glow effect - separate from any hover/mouse interaction */}
          <div
            className="absolute -inset-1 rounded-2xl blur-xl pointer-events-none"
            style={{
              background: `radial-gradient(circle at ${glowPosition.x * 100}% ${glowPosition.y * 100}%, rgba(139, 92, 246, 0.8), rgba(59, 130, 246, 0.8))`,
              opacity: 0.6,
            }}
          />

          {/* Playlist container with glass effect */}
          <div className="relative rounded-xl overflow-hidden backdrop-blur-sm border border-white/10 bg-black/40">
            {/* Top decorative bar */}
            <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-800">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
              </div>
              <div className="text-xs text-gray-400 ml-auto">
                spotify.com/badcompany
              </div>
            </div>

            {/* Spotify iframe */}
            <div className="w-full relative z-10">
              <iframe
                src={`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0`}
                width="100%"
                height="550"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
              />
            </div>
          </div>
        </motion.div>

        {/* Bottom notes */}
        <motion.div
          className="flex justify-center mt-6 text-sm text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <p>Atualizada regularmente com novas faixas</p>
        </motion.div>
      </div>
    </section>
  );
}
