// components/ui/sparkles.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

type SparklesProps = {
  className?: string;
  color?: string;
  minSize?: number;
  maxSize?: number;
  quantity?: number;
  recycle?: boolean;
  speed?: number;
};

type SparkleType = {
  id: string;
  createdAt: number;
  size: number;
  style: {
    top: string;
    left: string;
    zIndex: number;
  };
};

const generateSparkle = (minSize: number, maxSize: number): SparkleType => {
  const size = Math.random() * (maxSize - minSize) + minSize;
  return {
    id: String(Math.random()),
    createdAt: Date.now(),
    size,
    style: {
      top: Math.random() * 100 + "%",
      left: Math.random() * 100 + "%",
      zIndex: Math.floor(Math.random() * 3),
    },
  };
};

export const Sparkles: React.FC<SparklesProps> = ({
  className,
  color = "hsl(260, 100%, 80%)",
  minSize = 10,
  maxSize = 20,
  quantity = 15,
  recycle = true,
  speed = 1500,
}) => {
  const [sparkles, setSparkles] = useState<SparkleType[]>([]);
  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      prefersReducedMotion.current = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
    }
  }, []);

  useEffect(() => {
    if (prefersReducedMotion.current) return;

    // Create initial sparkles
    let initialSparkles = [];
    for (let i = 0; i < quantity; i++) {
      initialSparkles.push(generateSparkle(minSize, maxSize));
    }
    setSparkles(initialSparkles);

    if (recycle) {
      // Set up an interval to add new sparkles
      const interval = setInterval(() => {
        setSparkles((sparkles) => {
          // Remove the oldest sparkle
          const newSparkles = [...sparkles.slice(1)];
          // Add a new sparkle
          newSparkles.push(generateSparkle(minSize, maxSize));
          return newSparkles;
        });
      }, speed);

      return () => clearInterval(interval);
    }
  }, [minSize, maxSize, quantity, recycle, speed]);

  return (
    <span className={cn("relative inline-block", className)}>
      {sparkles.map((sparkle) => (
        <Sparkle
          key={sparkle.id}
          color={color}
          size={sparkle.size}
          style={sparkle.style}
          speed={speed}
        />
      ))}
    </span>
  );
};

const Sparkle: React.FC<{
  color: string;
  size: number;
  style: { top: string; left: string; zIndex: number };
  speed: number;
}> = ({ color, size, style, speed }) => {
  const path =
    "M26.5 25.5C19.0043 33.3697 0 34 0 34C0 34 19.1013 35.3684 26.5 43.5C33.234 50.901 34 70 34 70C34 70 36.9884 50.7065 44.5 43.5C51.6431 36.647 70 34 70 34C70 34 51.6947 32.0939 44.5 25.5C36.5605 18.2235 34 0 34 0C34 0 33.6591 17.9837 26.5 25.5Z";

  return (
    <AnimatePresence>
      <motion.svg
        key={style.left}
        className="absolute block"
        width={size}
        height={size}
        viewBox="0 0 70 70"
        fill="none"
        style={{
          ...style,
        }}
        initial={{ transform: "scale(0)", opacity: 0 }}
        animate={{ transform: "scale(1)", opacity: 1 }}
        exit={{ transform: "scale(0)", opacity: 0 }}
        transition={{
          duration: speed / 1000,
          ease: [0.23, 0.92, 0.07, 0.48],
        }}
      >
        <motion.path
          d={path}
          fill={color}
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: speed / 500,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      </motion.svg>
    </AnimatePresence>
  );
};
