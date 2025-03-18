"use client";

import React, { useEffect, useRef } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
import { aboutContent } from "@/data/aboutContent";

const useSectionAnimation = () => {
  useEffect(() => {
    // Force normal scrolling behavior at the document level
    document.documentElement.style.overflow = "auto";
    document.body.style.overflow = "auto";

    return () => {
      // Cleanup when component unmounts
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, []);

  const controls = useAnimation();
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  return {
    ref,
    controls,
    variants: {
      hidden: { opacity: 0, y: 50 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, staggerChildren: 0.2 },
      },
    },
  };
};

// Componente para estatísticas
const StatCard = ({ stat, index }: { stat: any; index: number }) => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={{
      hidden: { opacity: 0, y: 50 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, delay: index * 0.15 },
      },
    }}
    className="p-6 rounded-xl bg-gradient-to-br from-white/10 to-white/20 backdrop-blur-md border border-white/20 hover:from-white/15 hover:to-white/25 transition-all duration-300 text-center shadow-xl"
    whileHover={{
      y: -10,
      boxShadow: "0 15px 30px -10px rgba(138, 43, 226, 0.4)",
    }}
  >
    <div className="relative">
      <h3
        className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-400 mb-2"
        aria-label={`${stat.value}+`}
      >
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.8,
            delay: 0.1 + index * 0.15,
            type: "spring",
            stiffness: 50,
          }}
        >
          {stat.value}+
        </motion.span>
      </h3>
      <p className="text-xl text-white font-semibold mb-2 drop-shadow-sm">
        {stat.label}
      </p>
      <p className="text-gray-200 text-sm">{stat.description}</p>
    </div>
  </motion.div>
);

// Componente para depoimentos
const TestimonialCard = ({
  testimonial,
  index,
}: {
  testimonial: any;
  index: number;
}) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, scale: 0.9 },
      visible: {
        opacity: 1,
        scale: 1,
        transition: {
          duration: 0.6,
          delay: 0.3 + index * 0.2,
          type: "spring",
          stiffness: 100,
        },
      },
    }}
    className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 relative hover:bg-white/15 transition-colors duration-300 shadow-lg"
    whileHover={{
      y: -5,
      boxShadow: "0 15px 30px -5px rgba(138, 43, 226, 0.3)",
    }}
  >
    <div className="absolute -top-4 -left-4 text-6xl text-purple-400 opacity-80">
      "
    </div>
    <p className="text-gray-200 italic mb-4 relative z-10">
      {testimonial.text}
    </p>
    <div className="flex items-center">
      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold shadow-md">
        {testimonial.name[0]}
      </div>
      <div className="ml-3">
        <p className="text-white font-semibold">{testimonial.name}</p>
        <p className="text-gray-300 text-sm">{testimonial.role}</p>
      </div>
    </div>
  </motion.div>
);

export default function Conquistas() {
  const { title, stats, testimonials } = aboutContent.conquistas;
  const { ref, controls, variants } = useSectionAnimation();

  return (
    <section
      ref={ref}
      className="pb-16 pt-[96px] max-w-7xl mx-auto px-4 sm:px-6 relative z-10"
      aria-labelledby="conquistas-title"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 -z-10 bg-gradient-to-b from-purple-900/10 via-transparent to-blue-900/10 rounded-3xl blur-3xl"
      />

      <motion.h1
        id="conquistas-title"
        initial="hidden"
        animate={controls}
        variants={variants}
        className="text-4xl sm:text-5xl text-center mb-12 text-white drop-shadow-md"
      >
        {title}
      </motion.h1>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-6xl mx-auto mb-16"
        initial="hidden"
        animate={controls}
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.15,
            },
          },
        }}
      >
        {stats.map((stat, index) => (
          <StatCard key={index} stat={stat} index={index} />
        ))}
      </motion.div>

      <motion.div
        initial="hidden"
        animate={controls}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { delay: 0.5 },
          },
        }}
        className="mt-16 max-w-4xl mx-auto"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mb-10 bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center shadow-lg"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-white">
            Parceiros & Colaboradores
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={controls}
              variants={{
                hidden: { opacity: 0, scale: 0.9 },
                visible: {
                  opacity: 1,
                  scale: 1,
                  transition: {
                    duration: 0.6,
                    delay: 0.5 + index * 0.2,
                  },
                },
              }}
              className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 relative hover:bg-white/15 transition-colors duration-300 shadow-lg"
              whileHover={{
                y: -5,
                boxShadow: "0 15px 30px -5px rgba(138, 43, 226, 0.3)",
              }}
            >
              <div className="absolute -top-4 -left-4 text-6xl text-purple-400 opacity-80">
                "
              </div>
              <p className="text-gray-200 italic mb-4 relative z-10">
                {testimonial.text}
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold shadow-md">
                  {testimonial.name[0]}
                </div>
                <div className="ml-3">
                  <p className="text-white font-semibold">{testimonial.name}</p>
                  <p className="text-gray-300 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
