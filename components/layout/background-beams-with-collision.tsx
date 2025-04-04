"use client";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import React, { useRef, useState, useEffect } from "react";

export const BackgroundBeamsWithCollision = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const [isClient, setIsClient] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  // Ensure we only run client-side code after mounting
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Update container dimensions on mount and resize
  useEffect(() => {
    const updateDimensions = () => {
      if (parentRef.current) {
        setContainerWidth(parentRef.current.offsetWidth);
        setContainerHeight(parentRef.current.offsetHeight);
      }
    };

    if (isClient) {
      updateDimensions();
      window.addEventListener("resize", updateDimensions);
      return () => window.removeEventListener("resize", updateDimensions);
    }
  }, [isClient]);

  // Generate beam positions based on container width
  const getBeams = () => {
    if (!isClient || !containerWidth || !containerHeight) return [];

    return [
      {
        initialX: containerWidth * 0.1,
        translateX: containerWidth * 0.1,
        initialY: -100,
        translateY: containerHeight + 100,
        duration: 7,
        repeatDelay: 3,
        delay: 2,
      },
      {
        initialX: containerWidth * 0.4,
        translateX: containerWidth * 0.4,
        initialY: -100,
        translateY: containerHeight + 100,
        duration: 3,
        repeatDelay: 3,
        delay: 4,
      },
      {
        initialX: containerWidth * 0.15,
        translateX: containerWidth * 0.15,
        initialY: -100,
        translateY: containerHeight + 100,
        duration: 7,
        repeatDelay: 7,
        className: "h-6",
      },
      {
        initialX: containerWidth * 0.6,
        translateX: containerWidth * 0.6,
        initialY: -100,
        translateY: containerHeight + 100,
        duration: 5,
        repeatDelay: 14,
        delay: 4,
      },
      {
        initialX: containerWidth * 0.75,
        translateX: containerWidth * 0.75,
        initialY: -100,
        translateY: containerHeight + 100,
        duration: 11,
        repeatDelay: 2,
        className: "h-20",
      },
      {
        initialX: containerWidth * 0.9,
        translateX: containerWidth * 0.9,
        initialY: -100,
        translateY: containerHeight + 100,
        duration: 4,
        repeatDelay: 2,
        className: "h-12",
      },
      {
        initialX: containerWidth * 0.25,
        translateX: containerWidth * 0.25,
        initialY: -100,
        translateY: containerHeight + 100,
        duration: 6,
        repeatDelay: 4,
        delay: 2,
        className: "h-6",
      },
    ];
  };

  const beams = getBeams();

  return (
    <div
      ref={parentRef}
      className={cn(
        "relative min-h-full w-full bg-gradient-to-b from-neutral-800 to-neutral-900 dark:from-neutral-950 dark:to-neutral-800 flex flex-col items-center justify-center overflow-hidden",
        className
      )}
    >
      {isClient &&
        beams.map((beam) => (
          <CollisionMechanism
            key={beam.initialX + "beam-idx"}
            beamOptions={beam}
            containerRef={containerRef}
            parentRef={parentRef}
          />
        ))}

      <div className="relative z-10 w-full">{children}</div>

      <div
        ref={containerRef}
        className="absolute bottom-0 bg-neutral-100 w-full inset-x-0 pointer-events-none"
        style={{
          boxShadow:
            "0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset",
        }}
      ></div>
    </div>
  );
};

const CollisionMechanism = React.forwardRef<
  HTMLDivElement,
  {
    containerRef: React.RefObject<HTMLDivElement | null>;
    parentRef: React.RefObject<HTMLDivElement | null>;
    beamOptions?: {
      initialX?: number;
      translateX?: number;
      initialY?: number;
      translateY?: number;
      rotate?: number;
      className?: string;
      duration?: number;
      delay?: number;
      repeatDelay?: number;
    };
  }
>(({ parentRef, containerRef, beamOptions = {} }, ref) => {
  const beamRef = useRef<HTMLDivElement | null>(null);
  const [collision, setCollision] = useState<{
    detected: boolean;
    coordinates: { x: number; y: number } | null;
  }>({
    detected: false,
    coordinates: null,
  });
  const [beamKey, setBeamKey] = useState(0);
  const [cycleCollisionDetected, setCycleCollisionDetected] = useState(false);

  useEffect(() => {
    const checkCollision = () => {
      if (
        beamRef.current &&
        containerRef.current &&
        parentRef.current &&
        !cycleCollisionDetected
      ) {
        const beamRect = beamRef.current.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();
        const parentRect = parentRef.current.getBoundingClientRect();

        if (beamRect.bottom >= containerRect.top) {
          const relativeX =
            beamRect.left - parentRect.left + beamRect.width / 2;
          const relativeY = beamRect.bottom - parentRect.top;

          setCollision({
            detected: true,
            coordinates: {
              x: relativeX,
              y: relativeY,
            },
          });
          setCycleCollisionDetected(true);
        }
      }
    };

    const animationInterval = setInterval(checkCollision, 50);

    return () => clearInterval(animationInterval);
  }, [cycleCollisionDetected, containerRef, parentRef]); // Added parentRef to the dependency array

  useEffect(() => {
    if (collision.detected && collision.coordinates) {
      setTimeout(() => {
        setCollision({ detected: false, coordinates: null });
        setCycleCollisionDetected(false);
      }, 2000);

      setTimeout(() => {
        setBeamKey((prevKey) => prevKey + 1);
      }, 2000);
    }
  }, [collision]);

  return (
    <>
      <motion.div
        key={beamKey}
        ref={beamRef}
        initial={{
          translateY: beamOptions.initialY || "-100px",
          translateX: beamOptions.initialX || "0px",
          rotate: beamOptions.rotate || 0,
          opacity: 0,
        }}
        animate={{
          translateY: beamOptions.translateY || "800px",
          translateX: beamOptions.translateX || "0px",
          rotate: beamOptions.rotate || 0,
          opacity: 1,
        }}
        transition={{
          translateY: {
            duration: beamOptions.duration || 8,
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear",
            delay: beamOptions.delay || 0,
            repeatDelay: beamOptions.repeatDelay || 0,
          },
          opacity: {
            duration: 0.2,
          },
        }}
        className={cn(
          "absolute left-0 top-0 m-auto h-14 w-px rounded-full bg-gradient-to-t from-indigo-500 via-purple-500 to-transparent z-0",
          beamOptions.className
        )}
      />
      <AnimatePresence>
        {collision.detected && collision.coordinates && (
          <Explosion
            key={`${collision.coordinates.x}-${collision.coordinates.y}`}
            className=""
            style={{
              left: `${collision.coordinates.x}px`,
              top: `${collision.coordinates.y}px`,
              transform: "translate(-50%, -50%)",
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
});

CollisionMechanism.displayName = "CollisionMechanism";

const Explosion = ({ ...props }: React.HTMLProps<HTMLDivElement>) => {
  const spans = Array.from({ length: 20 }, (_, index) => ({
    id: index,
    initialX: 0,
    initialY: 0,
    directionX: Math.floor(Math.random() * 80 - 40),
    directionY: Math.floor(Math.random() * -50 - 10),
  }));

  return (
    <div {...props} className={cn("absolute z-50 h-2 w-2", props.className)}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute -inset-x-10 top-0 m-auto h-2 w-10 rounded-full bg-gradient-to-r from-transparent via-indigo-500 to-transparent blur-sm"
      ></motion.div>
      {spans.map((span) => (
        <motion.span
          key={span.id}
          initial={{ x: span.initialX, y: span.initialY, opacity: 1 }}
          animate={{
            x: span.directionX,
            y: span.directionY,
            opacity: 0,
          }}
          transition={{ duration: Math.random() * 1.5 + 0.5, ease: "easeOut" }}
          className="absolute h-1 w-1 rounded-full bg-gradient-to-b from-indigo-500 to-purple-500"
        />
      ))}
    </div>
  );
};
