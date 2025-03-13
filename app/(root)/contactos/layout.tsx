"use client";

import { ReactNode, useState, useEffect, CSSProperties } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";

type Props = {
  children: ReactNode;
  params: { slug?: string };
};

// Videos array defined outside the component
const videos = [
  "/videos/video-1.mp4",
  "/videos/video-2.mp4",
  "/videos/video-3.mp4",
  "/videos/video-4.mp4",
  "/videos/video-5.mp4",
  "/videos/video-6.mp4",
  "/videos/video-7.mp4",
  "/videos/video-8.mp4",
  "/videos/video-9.mp4",
];

export default function ContactosLayout({ children, params }: Props) {
  // Check if we're on client-side to avoid hydration errors
  const [isBrowser, setIsBrowser] = useState(false);

  // State to track the current video
  const [currentVideo, setCurrentVideo] = useState(0);

  // State to track window width
  const [windowWidth, setWindowWidth] = useState(0);

  // Verify we're on client-side before executing browser-specific code
  useEffect(() => {
    setIsBrowser(true);
  }, []);

  // Track window resizing
  useEffect(() => {
    if (!isBrowser) return;

    // Set initial width
    setWindowWidth(window.innerWidth);

    // Update width when window is resized
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    // Clean up event when component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isBrowser]);

  // Function to get styles based on current video
  const getVideoStyles = (): CSSProperties => {
    // Base style for all videos
    const baseStyle: CSSProperties = {
      objectPosition: windowWidth >= 1024 ? "center 30%" : "center center",
    };

    // If it's video-2, apply real zoom
    if (currentVideo === 1) {
      return {
        ...baseStyle,
        objectFit: "cover" as const,
        transform: "scale(1.3)", // 130% zoom (increases content)
        transformOrigin: "center center", // Center point of zoom
      };
    }

    // For other videos
    return baseStyle;
  };

  // Function to change to the next video when the current one ends
  const handleVideoEnd = () => {
    if (isBrowser) {
      setCurrentVideo((prev) => (prev >= videos.length - 1 ? 0 : prev + 1));
    }
  };

  return (
    <>
      <div className="absolute inset-0 z-0 overflow-hidden bg-black">
        {isBrowser && (
          <video
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover opacity-50"
            style={getVideoStyles()}
            onEnded={handleVideoEnd}
            key={videos[currentVideo]}
          >
            <source src={videos[currentVideo]} type="video/mp4" />O teu browser
            não suporta vídeo.
          </video>
        )}
      </div>

      {/* Content container */}
      <div className="relative min-h-screen w-full overflow-x-hidden">
        {/* Navigation area and main content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28 md:pt-36 lg:pt-40 pb-16 relative z-20">
          {/* Extra space on mobile devices to avoid conflict with header */}
          <div className="h-8 sm:h-4 md:h-0"></div>

          {/* Breadcrumbs */}
          <div className="mb-6 md:mb-8">
            <Breadcrumbs
              slug={params?.slug}
              basePath="contactos"
              baseName="Contactos"
            />
          </div>

          {/* Main content */}
          <main className="flex-1 w-full">{children}</main>
        </div>
      </div>
    </>
  );
}
