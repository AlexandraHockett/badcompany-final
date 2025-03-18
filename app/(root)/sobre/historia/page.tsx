"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useAnimation,
} from "framer-motion";
import Image from "next/image";
import { getAboutContentBySlug, HistoriaContent } from "@/data/aboutContent";

// Animation hook for fading in items
const useItemAnimation = (index: number, threshold = 0.3) => {
  const controls = useAnimation();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: threshold });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView, index]);

  return {
    ref,
    controls,
    variants: {
      hidden: { opacity: 0, y: 30 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.6,
          type: "spring",
          stiffness: 100,
          delay: index * 0.1,
        },
      },
    },
  };
};

export default function Historia() {
  const historiaContent = useMemo(
    () => getAboutContentBySlug("historia") as HistoriaContent,
    []
  );
  const { title, timeline } = historiaContent;

  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  const titleAnimation = useItemAnimation(0, 0.1);

  useEffect(() => {
    const updateHeight = () => {
      if (timelineRef.current) {
        const rect = timelineRef.current.getBoundingClientRect();
        setHeight(rect.height);
      }
    };

    updateHeight();

    const resizeObserver = new ResizeObserver(updateHeight);
    const timelineElement = timelineRef.current;

    if (timelineElement) {
      resizeObserver.observe(timelineElement);
    }

    return () => {
      if (timelineElement) {
        resizeObserver.disconnect();
      }
    };
  }, [timeline]);

  const endProgress = 0.85;

  // Especificar o container de rolagem explicitamente
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    container: containerRef, // Adicionado para definir o section como contêiner de rolagem
    offset: ["start end", "end center"],
  });

  const heightTransform = useTransform(
    scrollYProgress,
    [0, 0.1, endProgress],
    [0, height * 0.1, height]
  );
  const opacityTransform = useTransform(
    scrollYProgress,
    [0, 0.1, 0.2],
    [0, 0.7, 1]
  );

  return (
    <section
      ref={containerRef}
      className="pb-16 max-w-7xl mx-auto px-4 sm:px-6 pt-[96px] relative z-10"
      style={{
        minHeight: "100vh",
        position: "relative",
        overflow: "visible",
      }}
      aria-labelledby="historia-title"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 -z-10 bg-gradient-to-b from-purple-900/10 via-transparent to-blue-900/10 rounded-3xl blur-3xl"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-16 bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center shadow-lg max-w-3xl mx-auto"
      >
        <motion.h1
          id="historia-title"
          ref={titleAnimation.ref}
          initial="hidden"
          animate={titleAnimation.controls}
          variants={titleAnimation.variants}
          className="text-4xl sm:text-5xl text-center mb-2 text-white drop-shadow-md"
        >
          {title}
        </motion.h1>
        <p className="text-gray-200">Nossa jornada através do tempo</p>
      </motion.div>

      <div
        ref={timelineRef}
        className="relative max-w-6xl mx-auto min-h-[200px]" // Altura mínima para estabilidade
        style={{ position: "relative" }}
        aria-label="Linha do tempo histórica"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="absolute left-3 md:left-1/2 transform md:-translate-x-[1px] top-0 w-[2px] h-full"
          aria-hidden="true"
        >
          <div className="absolute inset-x-0 top-0 w-full h-full bg-gradient-to-t from-purple-500/40 via-blue-500/40 to-transparent" />
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-full bg-gradient-to-t from-purple-500 via-blue-500 to-teal-300 rounded-full shadow-glow"
          />
        </motion.div>

        <div className="space-y-20 relative">
          {timeline.map((item, index) => {
            const itemAnimation = useItemAnimation(index + 1);
            const isEven = index % 2 === 0;

            return (
              <motion.div
                key={index}
                ref={itemAnimation.ref}
                initial="hidden"
                animate={itemAnimation.controls}
                variants={itemAnimation.variants}
                className={`relative flex flex-col ${
                  isEven ? "md:flex-row" : "md:flex-row-reverse"
                } items-start gap-8 md:gap-12`}
                aria-labelledby={`timeline-item-${index}`}
              >
                <div
                  className="absolute left-3 md:left-1/2 transform md:-translate-x-1/2 top-0 z-30 flex items-center justify-center"
                  aria-hidden="true"
                >
                  <div className="h-10 w-10 rounded-full bg-black/80 border-2 border-purple-400 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                    <div className="h-4 w-4 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 border border-white/50" />
                  </div>
                </div>

                <div
                  className="pl-12 md:pl-0 text-lg font-bold md:absolute md:left-1/2 md:transform md:translate-y-[-28px] md:translate-x-[-50%] z-20 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
                  aria-label={`Ano: ${item.year}`}
                >
                  {item.year}
                </div>

                <div
                  className={`pl-12 md:pl-0 md:w-[45%] ${
                    isEven ? "md:pr-12" : "md:pl-12"
                  }`}
                >
                  <div className="relative w-full h-[250px] sm:h-[300px] overflow-hidden rounded-lg shadow-2xl group mb-4 border border-white/20">
                    <div
                      className="absolute inset-0 bg-gradient-to-br from-purple-500/40 to-blue-500/40 group-hover:opacity-10 transition-opacity duration-500 z-10"
                      aria-hidden="true"
                    />
                    <Image
                      src={item.image}
                      alt={`Imagem ilustrativa: ${item.title}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transform group-hover:scale-110 transition-transform duration-700 filter brightness-75 group-hover:brightness-100"
                      loading="lazy"
                    />
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-white border border-white/20 shadow-lg z-20">
                      {item.year}
                    </div>
                  </div>

                  <div className="p-6 bg-white/10 backdrop-blur-md rounded-lg shadow-lg border border-white/20 z-20 hover:bg-white/15 transition-colors duration-300">
                    <h3
                      id={`timeline-item-${index}`}
                      className="text-2xl font-bold mb-2 bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent"
                    >
                      {item.title}
                    </h3>
                    <p className="text-gray-200">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
