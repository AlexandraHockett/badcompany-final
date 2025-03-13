"use client";

import MediaCard from "@/components/MediaCard";
import Button from "@/components/Button";
import { mediaSections } from "@/data/mediaContent";
import { motion } from "framer-motion";
import { Sparkles } from "@/components/ui/sparkles";

export default function MediaPage() {
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
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 relative z-10">
      <div className="text-center mb-16">
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-center mb-4 text-white"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Media
        </motion.h1>

        <motion.p
          className="text-lg text-center mb-10 text-purple-200 max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Explore nossa coleção de conteúdos multimédia: podcasts, notícias e
          galerias dos nossos melhores momentos.
          <Sparkles className="h-8 w-8 text-purple-300" />
        </motion.p>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {mediaSections.map((section) => (
            <motion.div key={section.slug} className="w-full" variants={item}>
              <MediaCard
                title={section.title}
                image={section.image}
                href={`/media/${section.slug}`}
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
            title="Enviar conteúdo"
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
    </section>
  );
}
