// components/ui/tracing-beam.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useTransform,
  useScroll,
  useVelocity,
  useSpring,
} from "framer-motion";
import { cn } from "@/lib/utils";

export const TracingBeam = ({
  children,
  className,
  containerClassName,
}: {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Track velocity of scroll to add a natural delay effect
  const scrollYVelocity = useVelocity(scrollYProgress);
  const [velY, setVelY] = useState<number>(0);

  const smoothVelocity = useSpring(velY, {
    damping: 50,
    stiffness: 400,
  });

  // Update velocity
  useEffect(() => {
    return scrollYVelocity.on("change", (latestVelocity) => {
      setVelY(latestVelocity);
    });
  }, [scrollYVelocity]);

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const scaleY = useTransform(smoothVelocity, [-2000, 0, 2000], [0.8, 1, 1.2]);

  return (
    <div ref={ref} className={cn("relative", containerClassName)}>
      <motion.div
        className={cn(
          "absolute left-0 top-3 bottom-0 w-[2px] bg-gradient-to-b from-purple-300 to-purple-600 z-10",
          className
        )}
        style={{
          scaleY,
          y,
          opacity: scrollYProgress,
        }}
      />
      {children}
    </div>
  );
};
