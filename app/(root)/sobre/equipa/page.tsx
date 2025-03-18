"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
import Image from "next/image";
import { aboutContent } from "@/data/aboutContent";

const useSectionAnimation = () => {
  const controls = useAnimation();
  const ref = useRef<HTMLDivElement>(null);
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

// Componente para o cartão de membro da equipe
const TeamMemberCard = ({ member, index }: { member: any; index: number }) => {
  const [isHovering, setIsHovering] = useState(false);
  const cardAnimation = useAnimation();

  useEffect(() => {
    if (isHovering) {
      cardAnimation.start("hover");
    } else {
      cardAnimation.start("initial");
    }
  }, [isHovering, cardAnimation]);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0, scale: 0.9, y: 30 },
        visible: {
          opacity: 1,
          scale: 1,
          y: 0,
          transition: {
            duration: 0.6,
            delay: index * 0.15,
            type: "spring",
            stiffness: 100,
          },
        },
      }}
      className="perspective group"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onFocus={() => setIsHovering(true)}
      onBlur={() => setIsHovering(false)}
      tabIndex={0}
      aria-label={`${member.name}, ${member.role}`}
    >
      <motion.div
        className="relative h-[350px] sm:h-[400px] md:h-[450px] transform-style-3d transition-all duration-700 shadow-2xl"
        animate={isHovering ? { rotateY: 180 } : { rotateY: 0 }}
        transition={{ duration: 0.7, type: "spring", stiffness: 70 }}
      >
        {/* Frente do cartão */}
        <div className="absolute inset-0 backface-hidden">
          <div className="relative w-full h-full overflow-hidden rounded-xl border-2 border-white/20 shadow-lg">
            {/* Overlay de gradiente aprimorado */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/80 z-10" />
            
            {/* Efeito de glow no hover */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-b from-purple-600/20 via-transparent to-blue-600/20 z-10 opacity-0"
              animate={{ opacity: isHovering ? 0.6 : 0 }}
              transition={{ duration: 0.3 }}
            />
            
            <Image
              src={member.image}
              alt={member.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={index < 3}
              placeholder="blur"  // Add blur placeholder
              blurDataURL={`data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gIoSUNDX1BST0ZJTEUAAQEAAAEYAAAAAAIQAABtbnRyUkdCIFhZWiAAAAAAAAAAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAAHRyWFlaAAABZAAAABRnWFlaAAABeAAAABRiWFlaAAABjAAAABRyVFJDAAABoAAAAChnVFJDAAABoAAAAChiVFJDAAABoAAAACh3dHB0AAAByAAAABRjcHJ0AAAB3AAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAFgAAAAcAHMAUgBHAEIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFhZWiAAAAAAAABvogAAOPUAAAOQWFlaIAAAAAAAAGKZAAC3hQAAGNpYWVogAAAAAAAAJKAAAA+EAAC2z3BhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABYWVogAAAAAAAA9tYAAQAAAADTLW1sdWMAAAAAAAAAAQAAAAxlblVTAAAAIAAAABwARwBvAG8AZwBsAGUAIABJAG4AYwAuACAAMgAwADEANv/bAEMAFA4PEg8NFBIQEhcVFBgeMCEcGBgeMCMcHBccGhwaHBocGhwaKCwjGh0qHRwaIDAjKDIsLDs0NiglLjc5Ly0yMDL/2wBDAhUVFRgaGDEcHDE2JRonNjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjT/wAARCAAIAAoDASIAAhEBAxEB/8QAFwABAQEBAAAAAAAAAAAAAAAAAAECBf/EABYQAQEBAAAAAAAAAAAAAAAAAAARIf/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwDqAKAgA//Z`}
              className="object-cover transition-all duration-700 filter grayscale-[30%] group-hover:grayscale-0 group-focus:grayscale-0 scale-105 group-hover:scale-110"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 md:p-6 z-20 bg-gradient-to-t from-black/80 to-transparent">
              <h3 className="text-xl sm:text-2xl font-bold text-white drop-shadow-md">
                {member.name}
              </h3>
              <p className="text-base sm:text-lg text-gray-200 drop-shadow-md">
                {member.role}
              </p>
            </div>
          </div>
        </div>

        {/* Verso do cartão */}
        <div
          className="absolute inset-0 backface-hidden bg-gradient-to-br from-purple-900 to-blue-900 rounded-xl p-4 sm:p-5 md:p-6 flex flex-col justify-center shadow-lg border border-white/20 backdrop-blur-md"
          style={{ transform: "rotateY(180deg)" }}
        >
          {/* Padrão decorativo para o fundo */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 right-0 h-20 bg-white/10 rounded-t-xl" />
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-white/10 rounded-b-xl" />
            <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-white/20" />
            <div className="absolute bottom-20 right-10 w-16 h-16 rounded-full bg-white/15" />
          </div>
          
          <p className="text-lg sm:text-xl md:text-2xl italic text-white mb-4 md:mb-6 font-light relative z-10 drop-shadow-md">
            "{member.quote}"
          </p>
          <div className="text-sm sm:text-base text-gray-200 overflow-y-auto custom-scrollbar max-h-[150px] sm:max-h-none relative z-10">
            <p className="backdrop-blur-sm bg-white/5 p-3 rounded-lg">{member.bio}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function Equipa() {
  const { title, team } = aboutContent.equipa;
  const { ref, controls, variants } = useSectionAnimation();

  return (
    <section
      ref={ref}
      className="px-4 pb-16 pt-[96px] max-w-7xl mx-auto relative z-10"
      aria-labelledby="equipa-title"
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
        className="mb-10 bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center shadow-lg max-w-3xl mx-auto"
      >
        <motion.h1
          id="equipa-title"
          initial="hidden"
          animate={controls}
          variants={variants}
          className="text-3xl sm:text-4xl md:text-5xl text-center mb-2 text-white drop-shadow-md"
        >
          {title}
        </motion.h1>
        <p className="text-gray-200">Conheça os profissionais por trás da nossa excelência</p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 max-w-6xl mx-auto"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
        initial="hidden"
        animate={controls}
      >
        {team.map((member, index) => (
          <TeamMemberCard key={index} member={member} index={index} />
        ))}
      </motion.div>
    </section>
  );
}

