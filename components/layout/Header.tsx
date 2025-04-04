"use client";

import React, { useEffect, useRef, useState, useCallback, memo } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { FaBars, FaTimes } from "react-icons/fa";
import Playbutton from "../home/Playbutton";
import { useSession } from "next-auth/react";
import { ShoppingCart, User } from "lucide-react";
import LogoutButton from "@/components/autenticacao/LogoutButton";
import { CartItem } from "@/types/types";

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
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { data: session } = useSession();

  const navContainerRef = useRef<HTMLDivElement>(null);
  const mobileNavRef = useRef<HTMLDivElement>(null);
  const audioElementRef = useRef<HTMLAudioElement>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);
  const scrollTimeoutRef = useRef<number | null>(null);

  // Get cart items from localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart));
      } catch (error) {
        console.error("Error parsing cart data:", error);
        setCartItems([]);
      }
    }

    // Optional: Set up a storage event listener to update when cart changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "cart" && e.newValue) {
        try {
          setCartItems(JSON.parse(e.newValue));
        } catch (error) {
          console.error("Error parsing cart data from storage event:", error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleScroll = useCallback(() => {
    if (scrollTimeoutRef.current) {
      window.cancelAnimationFrame(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = window.requestAnimationFrame(() => {
      const currentScrollY = window.scrollY;

      if (navContainerRef.current) {
        if (currentScrollY <= 10) {
          setIsNavVisible(true);
          navContainerRef.current.classList.remove("floating-nav");
        } else if (currentScrollY > lastScrollY + 10) {
          setIsNavVisible(false);
          navContainerRef.current.classList.add("floating-nav");
        } else if (currentScrollY < lastScrollY - 10) {
          setIsNavVisible(true);
          navContainerRef.current.classList.add("floating-nav");
        }
      }

      setLastScrollY(currentScrollY);
    });
  }, [lastScrollY]);

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

  useEffect(() => {
    if (navContainerRef.current) {
      if (animationRef.current) {
        animationRef.current.kill();
      }

      animationRef.current = gsap.to(navContainerRef.current, {
        y: isNavVisible ? 0 : -100,
        opacity: isNavVisible ? 1 : 0,
        duration: 0.3,
        ease: "power2.out",
      });
    }

    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, [isNavVisible]);

  const toggleAudioIndicator = useCallback(() => {
    setIsAudioPlaying((prev) => !prev);
    setIsIndicatorActive((prev) => !prev);
  }, []);

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
        setIsAudioPlaying(false);
        setIsIndicatorActive(false);
      }
    };

    handlePlay();

    return () => {
      if (audioElement) {
        audioElement.pause();
      }
    };
  }, [isAudioPlaying]);

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
      if (animation) animation.kill();
    };
  }, [isMenuOpen]);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const NavLinks = memo(() => (
    <>
      {navItems.map((item, index) => (
        <Link
          key={item.label}
          href={item.href}
          className="nav-hover-btn text-lg md:text-xl whitespace-nowrap"
        >
          {item.label}
        </Link>
      ))}
    </>
  ));

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
            <div className="flex items-center shrink-0">
              <Image
                src="/images/logo-black.png"
                alt="logo"
                width={135}
                height={135}
                priority
                className="min-w-[135px] h-auto"
              />
            </div>
            <div className="flex h-full items-center">
              <div className="hidden md:flex items-center nav-container space-x-4">
                <NavLinks />
                <div className="flex items-center space-x-4">
                  {cartItems.length > 0 && (
                    <Link
                      href="/loja/checkout"
                      className="text-white hover:text-purple-300 transition-colors relative"
                    >
                      <ShoppingCart className="h-5 w-5" />
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                        {cartItems.length}
                      </span>
                    </Link>
                  )}

                  {!session ? (
                    <Link
                      href="/login"
                      className="flex items-center text-white hover:text-purple-300 transition-colors text-base auth-text whitespace-nowrap"
                    >
                      <User className="h-5 w-5 mr-1" /> Login
                    </Link>
                  ) : (
                    <div className="flex items-center space-x-2 relative">
                      <Link
                        href="/profile"
                        className="text-white text-base auth-text whitespace-nowrap overflow-hidden text-ellipsis hover:text-purple-300 transition-colors"
                        style={{ maxWidth: "150px" }}
                        title={session.user?.name || session.user?.email} // Tooltip with full name
                      >
                        {`${(session.user?.name || session.user?.email || "").slice(0, 10)}${
                          (session.user?.name || session.user?.email || "")
                            .length > 10
                            ? "..."
                            : ""
                        }`}
                      </Link>
                      <LogoutButton
                        variant="icon"
                        className="hover:text-red-500 text-white"
                      />
                    </div>
                  )}
                  <button
                    className="flex items-center space-x-0.5"
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
            </div>

            <div className="flex items-center justify-center w-full min-h-[4rem] md:hidden">
              <Playbutton
                onClick={toggleAudioIndicator}
                isPlaying={isAudioPlaying}
                aria-label={isAudioPlaying ? "Pause audio" : "Play audio"}
              />
            </div>

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

          <div className="w-full space-y-4 mt-4">
            {cartItems.length > 0 && (
              <Link
                href="/loja/checkout"
                className="flex items-center justify-center py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-md transition-colors relative"
                onClick={() => setIsMenuOpen(false)}
              >
                <ShoppingCart className="h-5 w-5 mr-2" /> Carrinho
                <span className="ml-2 bg-red-500 text-white text-xs px-1.5 rounded-full">
                  {cartItems.length}
                </span>
              </Link>
            )}

            {!session ? (
              <Link
                href="/login"
                className="flex items-center justify-center py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors mt-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <User className="h-5 w-5 mr-2" /> Login
              </Link>
            ) : (
              <>
                <Link
                  href="/profile"
                  className="flex items-center justify-center py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-md transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="h-5 w-5 mr-2" /> Meu Perfil
                </Link>
                <LogoutButton variant="full" className="w-full mt-2" />
              </>
            )}
          </div>
        </nav>
      </div>
    </>
  );
};

export default memo(Header);
