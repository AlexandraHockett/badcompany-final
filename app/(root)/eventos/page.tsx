"use client";

import EventCard from "@/components/EventCard";
import Button from "@/components/Button";
import { eventSections } from "@/data/eventsContent";
import { motion } from "framer-motion";
import { Sparkles } from "@/components/ui/sparkles";

export default function EventosPage() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20 md:py-28 lg:py-32 relative z-10">
      {/* Espaçamento adicional no topo para dispositivos móveis */}
      <div className="h-12 sm:h-16 md:h-0"></div>

      <div className="text-center mb-12 sm:mb-16">
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-center mb-4 text-white"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Nossos Eventos
        </motion.h1>

        <motion.p
          className="text-lg text-center mb-8 sm:mb-10 text-purple-200 max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Descubra experiências únicas em nossos eventos culturais e artísticos.
          <Sparkles className="h-8 w-8 text-purple-300" />
        </motion.p>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10 sm:mb-16"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {eventSections.map((section) => (
            <motion.div key={section.slug} className="w-full" variants={item}>
              <EventCard
                title={section.title}
                description={section.description}
                image={section.image}
                href={`/eventos/${section.slug}`}
                // Reduza a altura dos cards em dispositivos móveis
                className="sm:h-auto h-64"
              />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="w-full flex justify-center mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <Button
            title="Organizar um evento?"
            href="/contato"
            rightIcon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            }
          />
        </motion.div>
      </div>

      {/* Espaçamento adicional na parte inferior para dispositivos móveis */}
      <div className="h-12 sm:h-16 md:h-0"></div>
    </section>
  );
}
