"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";

interface VisitorCounterProps {
  title?: string;
}

export default function VisitorCounter({
  title = "Visitantes",
}: VisitorCounterProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [visitorCount, setVisitorCount] = useState<number | null>(null);
  const [deviceCount, setDeviceCount] = useState<number | null>(null);
  const [isError, setIsError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [glowPosition, setGlowPosition] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    // Set loaded after a small delay to trigger animations
    const timer = setTimeout(() => setIsLoaded(true), 500);

    // Check if this is a new visitor
    const checkVisitor = async () => {
      try {
        const storedId = localStorage.getItem("badcompany_visitor_id");
        if (!storedId) {
          const newId =
            "visitor_" +
            Math.random().toString(36).substr(2, 9) +
            "_" +
            Date.now();
          localStorage.setItem("badcompany_visitor_id", newId);

          // Register new visitor
          await fetch("/api/visitors/increment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              visitorId: newId,
              userAgent: navigator.userAgent,
            }),
          });
        }
      } catch (error) {
        console.error("Erro ao registrar visita:", error);
      }
    };

    // Fetch visitor counts from API
    const fetchCounts = async () => {
      try {
        // Get total visits
        const visitorsResponse = await fetch("/api/visitors/count");
        if (visitorsResponse.ok) {
          const visitorsData = await visitorsResponse.json();
          setVisitorCount(visitorsData.count);
        }

        // Get unique devices
        const devicesResponse = await fetch("/api/visitors/devices");
        if (devicesResponse.ok) {
          const devicesData = await devicesResponse.json();
          setDeviceCount(devicesData.count);
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        setIsError(true);
      }
    };

    // Sequential execution to ensure visitor is registered before counts are fetched
    const initializeCounter = async () => {
      await checkVisitor();
      await fetchCounts();
    };

    initializeCounter();

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

  // Fallback values for demonstration if API is not working yet
  const displayVisitorCount = isError ? 1234 : visitorCount || 0;
  const displayDeviceCount = isError ? 567 : deviceCount || 0;

  return (
    <section
      id="visitors"
      className="relative py-16 px-4 sm:px-8 w-full text-white overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/3 w-64 h-64 rounded-full bg-purple-600/20 filter blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 rounded-full bg-blue-600/20 filter blur-[120px]" />
      </div>

      {/* Data pulse decorative elements */}
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

      <div className="max-w-4xl mx-auto">
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
            Experiência compartilhada pela nossa comunidade
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

          {/* Stats container with glass effect */}
          <div className="relative rounded-xl overflow-hidden backdrop-blur-sm border border-white/10 bg-black/40">
            {/* Top decorative bar */}
            <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-800">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
              </div>
              <div className="text-xs text-gray-400 ml-auto">
                stats.badcompany.com
              </div>
            </div>

            {/* Stats content */}
            <div className="w-full relative z-10 p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Visitors counter */}
                <div className="relative">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-lg"
                    animate={{
                      opacity: [0.5, 0.8, 0.5],
                      scale: [1, 1.02, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                  />
                  <div className="relative backdrop-blur-sm border border-white/5 rounded-lg p-6 h-full flex flex-col justify-center items-center">
                    <div className="text-purple-400 mb-2">Visitas Totais</div>
                    <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                      {visitorCount !== null ? (
                        displayVisitorCount.toLocaleString("pt-BR")
                      ) : (
                        <motion.div
                          className="h-12 w-24 bg-gray-700/50 rounded-md"
                          animate={{ opacity: [0.5, 0.8, 0.5] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                      )}
                    </div>
                    <div className="mt-4 text-xs text-gray-400 flex items-center">
                      <motion.div
                        className="w-2 h-2 bg-green-500 rounded-full mr-2"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      Atualizado em tempo real
                    </div>
                  </div>
                </div>

                {/* Devices counter */}
                <div className="relative">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-lg"
                    animate={{
                      opacity: [0.5, 0.8, 0.5],
                      scale: [1, 1.02, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatType: "reverse",
                      delay: 0.5,
                    }}
                  />
                  <div className="relative backdrop-blur-sm border border-white/5 rounded-lg p-6 h-full flex flex-col justify-center items-center">
                    <div className="text-blue-400 mb-2">
                      Dispositivos Únicos
                    </div>
                    <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                      {deviceCount !== null ? (
                        displayDeviceCount.toLocaleString("pt-BR")
                      ) : (
                        <motion.div
                          className="h-12 w-24 bg-gray-700/50 rounded-md"
                          animate={{ opacity: [0.5, 0.8, 0.5] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                      )}
                    </div>
                    <div className="mt-4 text-xs text-gray-400 flex items-center">
                      <svg
                        className="w-4 h-4 mr-1 text-gray-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z"
                          clipRule="evenodd"
                        />
                        <path
                          fillRule="evenodd"
                          d="M10 5a1 1 0 011 1v3.586l2.707 2.707a1 1 0 01-1.414 1.414l-3-3A1 1 0 019 10V6a1 1 0 011-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Última atualização:{" "}
                      {new Date().toLocaleTimeString("pt-BR")}
                    </div>
                  </div>
                </div>
              </div>
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
          <p>Conectando pessoas na BadCompany</p>
        </motion.div>
      </div>
    </section>
  );
}