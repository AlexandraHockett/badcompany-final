"use client";

import { useEffect, useRef, useState, useCallback, memo } from "react";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import gsap from "gsap";
import GlitchCursor from "./GlitchCursor";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [hasClicked, setHasClicked] = useState(false);
  const [loadedVideos, setLoadedVideos] = useState(0);
  const [cursorHovering, setCursorHovering] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);

  // Aumentado para 9 vídeos
  const totalVideos = 9;
  const nextVideoRef = useRef<HTMLVideoElement>(null);
  const badRef = useRef<HTMLDivElement | null>(null);
  const companyRef = useRef<HTMLDivElement | null>(null);
  const videoFrameRef = useRef<HTMLDivElement | null>(null);
  const loadedVideoSetRef = useRef<Set<string>>(new Set());

  // Apenas para detectar o tamanho da tela
  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowWidth(window.innerWidth);
      const handleResize = () => setWindowWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  // Memoized functions
  const getVideoSrc = useCallback(
    (index: number) => `/videos/video-${index}.mp4`,
    []
  );

  const upComingVideoIndex = (currentIndex % totalVideos) + 1;

  const handleVideoLoad = useCallback(
    (event: React.SyntheticEvent<HTMLVideoElement>) => {
      const src = event.currentTarget.src;

      if (!loadedVideoSetRef.current.has(src)) {
        loadedVideoSetRef.current.add(src);
        setLoadedVideos((prev) => prev + 1);
      }
    },
    []
  );

  const handleMiniVdClick = useCallback(() => {
    setHasClicked(true);
    setCurrentIndex(upComingVideoIndex);
  }, [upComingVideoIndex]);

  // Memoize hover handlers
  const handleMouseEnter = useCallback(() => {
    setCursorHovering(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setCursorHovering(false);
  }, []);

  // Memoize glitch effect
  const glitchEffect = useCallback((el: HTMLDivElement | null) => {
    if (!el) return;
    gsap.to(el, {
      x: () => (Math.random() - 0.5) * 10,
      y: () => (Math.random() - 0.5) * 5,
      color: () => (Math.random() > 0.5 ? "rgb(255,0,0)" : "rgb(0,255,255)"),
      duration: 0.1,
      repeat: 5,
      yoyo: true,
      ease: "power1.inOut",
    });
  }, []);

  // Handle text element glitch effect
  const handleTextMouseEnter = useCallback(
    (el: HTMLDivElement | null) => {
      glitchEffect(el);
      handleMouseEnter();
    },
    [glitchEffect, handleMouseEnter]
  );

  // Video animation on click
  useGSAP(
    () => {
      if (hasClicked && nextVideoRef.current) {
        gsap.set("#next-video", { visibility: "visible" });
        gsap.to("#next-video", {
          transformOrigin: "center center",
          scale: 1,
          width: "100%",
          height: "100%",
          duration: 1,
          ease: "power1.inOut",
          onStart: () => {
            nextVideoRef.current?.play();
          },
        });
        gsap.from("#current-video", {
          transformOrigin: "center center",
          scale: 0,
          duration: 1.5,
          ease: "power1.inOut",
        });
      }
    },
    {
      dependencies: [currentIndex, hasClicked],
      revertOnUpdate: true,
    }
  );

  // Video frame animation
  useGSAP(() => {
    if (!videoFrameRef.current) return;

    gsap.set(videoFrameRef.current, {
      clipPath: "polygon(14% 0%, 72% 0%, 90% 90%, 0% 100%)",
      borderRadius: "0 0 40% 10%",
    });

    gsap.from(videoFrameRef.current, {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      borderRadius: "0 0 0 0",
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: videoFrameRef.current,
        start: "center center",
        end: "bottom center",
        scrub: true,
      },
    });
  }, []);

  // Text glitch animation
  useEffect(() => {
    const badElement = badRef.current;
    const companyElement = companyRef.current;

    if (badElement && companyElement) {
      // Initial animation
      gsap.fromTo(
        badElement,
        { opacity: 0, x: -50, y: -50, scale: 0.8 },
        { opacity: 1, x: 0, y: 0, scale: 1, duration: 1, ease: "power2.out" }
      );

      gsap.fromTo(
        companyElement,
        { opacity: 0, x: 50, y: 50, scale: 0.8 },
        {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "power2.out",
          delay: 0.5,
        }
      );
    }

    // Automatic glitch effect with reduced frequency
    const glitchLoop = setInterval(() => {
      if (document.visibilityState === "visible") {
        glitchEffect(badRef.current);
        glitchEffect(companyRef.current);
      }
    }, 5000);

    return () => clearInterval(glitchLoop);
  }, [glitchEffect]);

  // Preload all videos on component mount
  useEffect(() => {
    const preloadVideos = async () => {
      for (let i = 1; i <= totalVideos; i++) {
        const video = new Audio();
        video.src = getVideoSrc(i);
        // No need to actually play them, just load them
      }
    };

    preloadVideos();
  }, [getVideoSrc, totalVideos]);

  // UI para selecionar vídeos específicos
  const handleSelectVideo = useCallback((index: number) => {
    setHasClicked(true);
    setCurrentIndex(index);
  }, []);

  return (
    <div className="relative h-dvh w-screen overflow-x-hidden">
      <div
        ref={videoFrameRef}
        id="video-frame"
        className="relative z-10 h-dvh w-screen overflow-hidden rounded-lg bg-blue-75"
        aria-label="Bad Company Hero Section"
      >
        {cursorHovering && <GlitchCursor isHovering={cursorHovering} />}
        <div>
          <div
            className="mask-clip-path absolute-center absolute z-50 size-64 cursor-pointer overflow-hidden rounded-lg"
            aria-description="Click to cycle through videos"
          >
            <div
              onClick={handleMiniVdClick}
              className="origin-center scale-50 opacity-0 transition-all duration-500 ease-in hover:scale-100 hover:opacity-100"
            >
              <video
                src={getVideoSrc(upComingVideoIndex)}
                loop
                muted
                playsInline
                id="current-video"
                className="size-64 origin-center scale-150 object-cover object-center"
                onLoadedData={handleVideoLoad}
              />
            </div>
          </div>

          <video
            ref={nextVideoRef}
            src={getVideoSrc(currentIndex)}
            loop
            muted
            playsInline
            id="next-video"
            className="absolute-center invisible absolute z-20 size-64 object-cover object-center"
            onLoadedData={handleVideoLoad}
          />
          <video
            src={getVideoSrc(currentIndex)}
            autoPlay
            loop
            muted
            playsInline
            className="absolute left-0 top-0 size-full object-cover object-center"
            style={
              windowWidth >= 768 ? { objectPosition: "center 30%" } : undefined
            }
            onCanPlayThrough={handleVideoLoad}
          />
        </div>

        {/* Seletor de vídeos */}
        <div className="absolute bottom-10 left-10 z-40 flex space-x-2">
          {Array.from({ length: totalVideos }).map((_, index) => (
            <button
              key={index}
              onClick={() => handleSelectVideo(index + 1)}
              className={`h-4 w-4 rounded-full transition-all duration-300 hover:scale-125 ${
                currentIndex === index + 1
                  ? "bg-red-500"
                  : "bg-white opacity-60"
              }`}
              aria-label={`Select video ${index + 1}`}
            />
          ))}
        </div>

        {/* BAD (Top-Left) with Softer Glow */}
        <div
          ref={badRef}
          onMouseEnter={() => handleTextMouseEnter(badRef.current)}
          onMouseLeave={handleMouseLeave}
          className="absolute top-20 left-10 z-40 text-5xl sm:text-7xl md:text-8xl font-bold opacity-0 neon-glow cursor-none"
          data-text="BAD"
        >
          BAD
        </div>

        {/* COMPANY (Bottom-Right) with Softer Glow */}
        <div
          ref={companyRef}
          onMouseEnter={() => handleTextMouseEnter(companyRef.current)}
          onMouseLeave={handleMouseLeave}
          className="absolute bottom-10 right-10 z-40 text-5xl sm:text-7xl md:text-8xl font-bold opacity-0 neon-glow cursor-none"
          data-text="COMPANY"
        >
          COMPANY
        </div>
      </div>
      {/* "COMPANY" static text */}
      <div className="absolute bottom-10 right-10 text-5xl sm:text-7xl md:text-8xl font-bold text-white">
        COMPANY
      </div>
      <style jsx>{`
        /* Extra Glow Effect */
        .neon-glow::before {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
          filter: blur(15px);
          opacity: 0.8;
        }
      `}</style>
    </div>
  );
};

// Memoize the entire component
export default memo(Hero);
