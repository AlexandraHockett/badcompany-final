"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

// Definição da interface para a seção
interface Section {
  title: string;
  path: string;
  description: string;
  icon: string;
}

// Definição de cards para cada seção
const sections: Section[] = [
  {
    title: "História",
    path: "/sobre/historia",
    description: "Descubra a nossa jornada e evolução ao longo do tempo.",
    icon: "📜",
  },
  {
    title: "Equipa",
    path: "/sobre/equipa",
    description:
      "Conheça os talentosos profissionais por trás do nosso sucesso.",
    icon: "👥",
  },
  {
    title: "Missão e Valores",
    path: "/sobre/missao",
    description: "Entenda o que nos motiva e os princípios que seguimos.",
    icon: "🎯",
  },
  {
    title: "Conquistas",
    path: "/sobre/conquistas",
    description: "Explore nossos marcos e realizações mais significativos.",
    icon: "🏆",
  },
];

// Componente de card individual
const SectionCard = ({
  section,
  index,
}: {
  section: Section;
  index: number;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: 0.5 + index * 0.1,
        type: "spring",
        stiffness: 50,
      }}
      whileHover={{
        y: -10,
        boxShadow: "0 10px 25px -5px rgba(138, 43, 226, 0.3)",
      }}
      className="relative overflow-hidden rounded-xl border border-white/20 bg-white/10 backdrop-blur-md shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={section.path} className="block p-6">
        <div className="relative z-10 mb-4 text-4xl bg-gradient-to-br from-purple-300 to-blue-300 text-transparent bg-clip-text">
          {section.icon}
        </div>
        <h2 className="relative z-10 mb-3 text-2xl font-bold text-white">
          {section.title}
        </h2>
        <p className="relative z-10 text-gray-200">{section.description}</p>

        <motion.div
          className="absolute bottom-4 right-4 mt-4 flex items-center text-blue-300"
          animate={{ x: isHovered ? 0 : 5, opacity: isHovered ? 1 : 0.7 }}
          transition={{ duration: 0.3 }}
        >
          <span className="mr-1">Saiba mais</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform"
          >
            <path d="M5 12h14"></path>
            <path d="m12 5 7 7-7 7"></path>
          </svg>
        </motion.div>

        {/* Efeito de glow no hover */}
        <div
          className={`absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20 opacity-0 transition-opacity duration-300 ${isHovered ? "opacity-100" : ""}`}
        ></div>
      </Link>
    </motion.div>
  );
};

export default function Sobre() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 relative z-10">
      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="inline-block mb-4 px-6 py-2 rounded-full bg-gradient-to-r from-purple-500/30 to-blue-500/30 backdrop-blur-md border border-purple-500/30 shadow-lg"
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-blue-300 font-semibold">
            Conheça a Bad Company
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl sm:text-5xl md:text-6xl font-zentry mb-6 text-white drop-shadow-md"
        >
          Sobre Nós
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-xl max-w-3xl mx-auto mb-8 text-gray-200 backdrop-blur-sm bg-black/10 py-4 px-6 rounded-lg"
        >
          Descobre quem somos, nossa jornada, valores e o que nos move a criar
          experiências extraordinárias.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {sections.map((section, index) => (
          <SectionCard key={index} section={section} index={index} />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="mt-16 text-center backdrop-blur-sm bg-white/5 p-4 rounded-xl border border-white/10"
      >
        <p className="text-gray-300">
          Tem alguma dúvida ou sugestão?{" "}
          <Link
            href="/contacto"
            className="text-blue-300 hover:text-blue-200 underline"
          >
            Entre em contacto connosco
          </Link>
        </p>
      </motion.div>
    </section>
  );
}
