"use client";

import React, { useEffect, useRef } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
import { aboutContent } from "@/data/aboutContent";

const useSectionAnimation = () => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  return {
    ref,
    controls,
    // Use simpler animation variants when possible
    variants: {
      hidden: { opacity: 0, y: 50 },
      visible: {
        opacity: 1,
        y: 0,
        // Reduce the complexity of the animations
        transition: { duration: 0.5, staggerChildren: 0.1 },
      },
    },
  };
};

const Icon = ({ name }: { name: string }) => {
  switch (name) {
    case "star":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 text-amber-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      );
    case "lightbulb":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 text-yellow-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
      );
    case "award":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 text-emerald-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      );
    case "users":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 text-blue-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      );
    default:
      return null;
  }
};

export default function Missao() {
  const { title, text, values } = aboutContent.missao;
  const { ref, controls, variants } = useSectionAnimation();

  return (
    <section
      ref={ref}
      className="pb-16 text-center pt-[96px] max-w-7xl mx-auto px-4 sm:px-6 relative z-10"
    >
      {/* Background gradient */}
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
          initial="hidden"
          animate={controls}
          variants={variants}
          className="text-4xl sm:text-5xl mb-2 text-white drop-shadow-md"
        >
          {title}
        </motion.h1>
        <p className="text-gray-200">O que nos motiva e orienta</p>
      </motion.div>

      <motion.div
        initial="hidden"
        animate={controls}
        variants={variants}
        className="relative mb-20"
      >
        <div className="absolute inset-0 bg-white/5 backdrop-blur-md rounded-xl -z-10 transform scale-105 border border-white/10 shadow-xl" />

        <motion.p
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                delay: 0.3,
                duration: 0.8,
                when: "beforeChildren",
                staggerChildren: 0.08,
              },
            },
          }}
          className="text-3xl md:text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-400 px-6 py-12 max-w-4xl mx-auto"
        >
          {text.split("").map((char, index) => (
            <motion.span
              key={index}
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              {char}
            </motion.span>
          ))}
        </motion.p>
        <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-48 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-glow" />
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {values.map((value, index) => (
          <motion.div
            key={index}
            initial="hidden"
            animate={controls}
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.5, delay: 0.5 + index * 0.2 },
              },
            }}
            className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md p-6 rounded-xl border border-white/20 flex flex-col items-center text-center group hover:from-white/15 hover:to-white/10 transition-all duration-300 shadow-xl"
            whileHover={{
              y: -10,
              boxShadow: "0 15px 30px -10px rgba(138, 43, 226, 0.3)",
            }}
          >
            <div className="mb-5 transform group-hover:scale-110 transition-transform duration-300">
              <div className="p-4 rounded-full bg-white/10 shadow-inner backdrop-blur-md">
                <Icon name={value.icon} />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-3 drop-shadow-sm bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
              {value.title}
            </h3>
            <p className="text-gray-200">{value.description}</p>

            {/* Decorative element */}
            <div className="w-12 h-1 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full mt-4 opacity-70 group-hover:w-20 transition-all duration-300" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
