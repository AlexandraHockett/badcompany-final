"use client";

import React, { useEffect, useRef, useState, useCallback, memo } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { FaBars, FaTimes } from "react-icons/fa";
import Playbutton from "./Playbutton";

// Memoize nav items to prevent unnecessary re-rendering
const navItems = [
  { label: "Home", href: "/" },
  { label: "Sobre Nós", href: "/sobre" },
  { label: "Eventos", href: "/eventos" },
  { label: "Media", href: "/media" },
  { label: "Loja", href: "/loja" },
  { label: "Contactos", href: "/contactos" },
];

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isIndicatorActive, setIsIndicatorActive] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navContainerRef = useRef<HTMLDivElement>(null);
  const mobileNavRef = useRef<HTMLDivElement>(null);
  const audioElementRef = useRef<HTMLAudioElement>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);
  const scrollTimeoutRef = useRef<number | null>(null);

  // Memoized scroll handler with throttling
  const handleScroll = useCallback(() => {
    // Clear existing timeout
    if (scrollTimeoutRef.current) {
      window.cancelAnimationFrame(scrollTimeoutRef.current);
    }

    // Schedule new calculation
    scrollTimeoutRef.current = window.requestAnimationFrame(() => {
      const currentScrollY = window.scrollY;

      if (navContainerRef.current) {
        if (currentScrollY <= 10) {
          // At top of page
          setIsNavVisible(true);
          navContainerRef.current.classList.remove("floating-nav");
        } else if (currentScrollY > lastScrollY + 10) {
          // Scrolling down (with threshold to avoid micro-movements)
          setIsNavVisible(false);
          navContainerRef.current.classList.add("floating-nav");
        } else if (currentScrollY < lastScrollY - 10) {
          // Scrolling up (with threshold to avoid micro-movements)
          setIsNavVisible(true);
          navContainerRef.current.classList.add("floating-nav");
        }
      }

      setLastScrollY(currentScrollY);
    });
  }, [lastScrollY]);

  // Set up scroll listener with proper cleanup
  useEffect(() => {
    if (typeof window === "undefined") return;

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      if (scrollTimeoutRef.current) {
        window.cancelAnimationFrame(scrollTimeoutRef.current);
      }
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  // Apply animation when visibility changes
  useEffect(() => {
    if (navContainerRef.current) {
      // Kill any existing animation to prevent conflicts
      if (animationRef.current) {
        animationRef.current.kill();
      }

      // Create new animation
      animationRef.current = gsap.to(navContainerRef.current, {
        y: isNavVisible ? 0 : -100,
        opacity: isNavVisible ? 1 : 0,
        duration: 0.3,
        ease: "power2.out",
      });
    }

    return () => {
      // Clean up animation on unmount
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, [isNavVisible]);

  // Toggle audio indicator with proper memoization
  const toggleAudioIndicator = useCallback(() => {
    setIsAudioPlaying((prev) => !prev);
    setIsIndicatorActive((prev) => !prev);
  }, []);

  // Handle audio playback with proper error handling
  useEffect(() => {
    const audioElement = audioElementRef.current;
    if (!audioElement) return;

    const handlePlay = async () => {
      try {
        if (isAudioPlaying) {
          await audioElement.play();
        } else {
          audioElement.pause();
        }
      } catch (e) {
        console.error("Audio playback error:", e);
        // Reset state if playback fails
        setIsAudioPlaying(false);
        setIsIndicatorActive(false);
      }
    };

    handlePlay();

    return () => {
      // Ensure audio is paused when component unmounts
      if (audioElement) {
        audioElement.pause();
      }
    };
  }, [isAudioPlaying]);

  // Handle mobile menu animations
  useEffect(() => {
    const mobileNav = mobileNavRef.current;
    if (!mobileNav) return;

    let animation: gsap.core.Tween;

    if (isMenuOpen) {
      animation = gsap.fromTo(
        mobileNav,
        { height: 0, opacity: 0 },
        { height: "auto", opacity: 1, duration: 0.3 }
      );
    } else {
      animation = gsap.to(mobileNav, {
        height: 0,
        opacity: 0,
        duration: 0.3,
      });
    }

    return () => {
      animation.kill();
    };
  }, [isMenuOpen]);

  // Toggle menu with memoization
  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  // Memoized NavItems to prevent unnecessary re-renders
  const NavLinks = memo(() => (
    <>
      {navItems.map((item) => (
        <Link key={item.label} href={item.href} className="nav-hover-btn">
          {item.label}
        </Link>
      ))}
    </>
  ));

  // Memoized AudioIndicator component
  const AudioIndicator = memo(() => (
    <>
      {[1, 2, 3, 4].map((bar) => (
        <div
          key={bar}
          className={`indicator-line ${isIndicatorActive ? "active" : ""}`}
          style={{
            animationDelay: `${bar * 0.1}s`,
            willChange: isIndicatorActive ? "transform, height" : "auto",
          }}
        />
      ))}
    </>
  ));

  return (
    <>
      <div
        ref={navContainerRef}
        className={`fixed inset-x-0 top-4 z-50 h-16 border-none transition-all duration-700 sm:inset-x-6 ${className || ""}`}
        style={{ willChange: "transform, opacity" }}
      >
        <header className="absolute top-1/2 w-full -translate-y-1/2">
          <nav className="flex size-full items-center justify-between p-4">
            <div className="flex items-center gap-7">
              <Image
                src="/images/logo-black.png"
                alt="logo"
                width={135}
                height={135}
                priority
              />
            </div>
            <div className="flex h-full items-center">
              <div className="hidden md:block">
                <NavLinks />
              </div>

              <div className="hidden md:block">
                <button
                  className="ml-10 flex items-center space-x-0.5"
                  onClick={toggleAudioIndicator}
                  aria-label={isAudioPlaying ? "Pause audio" : "Play audio"}
                >
                  <audio
                    ref={audioElementRef}
                    className="hidden"
                    src="/audio/loop.mp3"
                    loop
                    preload="metadata"
                  />
                  <AudioIndicator />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-center w-full min-h-[4rem] md:hidden">
              <Playbutton
                onClick={toggleAudioIndicator}
                isPlaying={isAudioPlaying}
                aria-label={isAudioPlaying ? "Pause audio" : "Play audio"}
              />
            </div>

            {/* Mobile Menu Button */}
            <div className="relative block md:hidden">
              <button
                className="text-xl z-50 text-blue-200"
                onClick={toggleMenu}
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMenuOpen ? <FaTimes /> : <FaBars />}
              </button>
            </div>
          </nav>
        </header>
      </div>

      {/* Mobile Navigation Menu - Below Header with Left-Aligned Links */}
      <div
        ref={mobileNavRef}
        className="fixed top-20 inset-x-0 z-40 bg-black/30 backdrop-blur-md overflow-hidden h-0 opacity-0 transition-all duration-300 md:hidden"
      >
        <nav className="p-5 flex flex-col items-start w-full max-w-md mx-auto space-y-6 text-white text-xl">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="hover:text-gray-300 p-2 w-full text-left"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
};

export default memo(Header);
