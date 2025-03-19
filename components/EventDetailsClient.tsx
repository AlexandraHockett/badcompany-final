"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Button from "@/components/Button";
import { Sparkles } from "@/components/ui/sparkles";

type EventDetailsClientProps = {
  event: {
    id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    address?: string;
    categories?: string[];
    tags?: string[];
    longDescription?: string;
    image: string;
    video?: string;
    gallery?: string[];
    youtubeVideos?: string[];
    organizador?: { name: string; contact?: string };
  };
};

export default function EventDetailsClient({ event }: EventDetailsClientProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const getYoutubeEmbedUrl = (url: string) => {
    const videoId = url.split("v=")[1]?.split("&")[0] || url.split("/").pop();
    return `https://www.youtube.com/embed/${videoId}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-PT", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  useEffect(() => {
    // Aqui você pode integrar tsparticles ou outro efeito de partículas, se desejar
  }, []);

  return (
    <div className="relative text-white overflow-hidden">
      {/* Partículas de fundo */}
      <div className="absolute inset-0 pointer-events-none">
        <Sparkles className="w-full h-full opacity-50" />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[80vh] w-full">
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          {event.video ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover opacity-80"
            >
              <source src={event.video} type="video/mp4" />
            </video>
          ) : (
            <Image
              src={event.image}
              alt={event.title}
              fill
              className="object-cover object-center opacity-80"
              sizes="100vw"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-purple-950/50 to-transparent" />
        </motion.div>

        {/* Conteúdo do Hero */}
        <div className="container mx-auto px-6 relative z-10 h-full flex flex-col justify-center items-center text-center pt-24 pb-16">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-purple-400 via-fuchsia-500 to-indigo-500 bg-clip-text text-transparent drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]"
          >
            {event.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            className="text-xl md:text-3xl italic text-white/80 mt-4 max-w-2xl"
          >
            "{event.description}"
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-8 flex flex-wrap justify-center gap-4"
          >
            <div className="bg-black/50 backdrop-blur-lg px-6 py-3 rounded-full border border-purple-500/30 shadow-lg">
              <span className="text-purple-400 font-semibold">Data:</span>{" "}
              <span className="text-white">{formatDate(event.date)}</span>
            </div>
            <div className="bg-black/50 backdrop-blur-lg px-6 py-3 rounded-full border border-purple-500/30 shadow-lg">
              <span className="text-purple-400 font-semibold">Local:</span>{" "}
              <span className="text-white">{event.location}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Seção de Conteúdo Principal */}
      <section className="container mx-auto px-6 py-20 relative z-10">
        {/* Botão Voltar */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <Button
            title="Voltar para Eventos Passados"
            href="/eventos/passados"
            leftIcon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-purple-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
            }
          />
        </motion.div>

        {/* Grid Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Flyer */}
          <motion.div
            initial={{ opacity: 0, rotateY: 30 }}
            whileInView={{ opacity: 1, rotateY: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative lg:col-span-1 h-auto aspect-[2/3] max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl group transform-gpu perspective-1000"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-purple-950/80 to-transparent z-10 group-hover:opacity-60 transition-opacity duration-500" />
            <Image
              src={event.image}
              alt={`Flyer do evento ${event.title}`}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              sizes="(max-width: 1024px) 100vw, 33vw"
            />
            <motion.div
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20"
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-white text-3xl font-bold bg-black/50 backdrop-blur-md px-6 py-3 rounded-full shadow-lg">
                Flyer Oficial
              </span>
            </motion.div>
          </motion.div>

          {/* Descrição Longa */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="lg:col-span-2 space-y-10"
          >
            {event.longDescription && (
              <div className="bg-gradient-to-br from-gray-900/70 to-purple-950/70 backdrop-blur-lg p-10 rounded-2xl border border-purple-500/20 shadow-[0_0_20px_rgba(147,51,234,0.3)]">
                <h2 className="text-4xl font-extrabold mb-6 bg-gradient-to-r from-purple-400 via-fuchsia-500 to-indigo-500 bg-clip-text text-transparent flex items-center">
                  Sobre o Evento
                  <Sparkles className="inline-block h-8 w-8 ml-3 text-purple-400 animate-pulse" />
                </h2>
                <p className="text-gray-100 text-lg leading-relaxed whitespace-pre-line">
                  {event.longDescription}
                </p>
                {event.tags && event.tags.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-3">
                    {event.tags.map((tag, index) => (
                      <motion.span
                        key={index}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.1 * index + 0.6 }}
                        className="bg-purple-700/60 text-white text-sm px-4 py-2 rounded-full shadow-md hover:bg-purple-600/80 transition-colors"
                      >
                        #{tag}
                      </motion.span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Localização */}
            {event.address && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-gray-900/70 to-purple-950/70 backdrop-blur-lg p-10 rounded-2xl border border-purple-500/20 shadow-[0_0_20px_rgba(147,51,234,0.3)]"
              >
                <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent">
                  Localização
                </h2>
                <div className="flex items-start gap-4">
                  <motion.svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-purple-400 flex-shrink-0 mt-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    whileHover={{ scale: 1.2, rotate: 10 }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </motion.svg>
                  <div>
                    <p className="text-white text-xl font-semibold">
                      {event.location}
                    </p>
                    <p className="text-gray-300 mt-1">{event.address}</p>
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(
                        event.address
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors duration-300 text-sm font-medium"
                    >
                      Ver no Google Maps
                      <motion.svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 ml-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        whileHover={{ x: 5 }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </motion.svg>
                    </a>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Organizador */}
            {event.organizador && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-gray-900/70 to-purple-950/70 backdrop-blur-lg p-10 rounded-2xl border border-purple-500/20 shadow-[0_0_20px_rgba(147,51,234,0.3)]"
              >
                <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent">
                  Organizado por
                </h2>
                <p className="text-2xl font-semibold text-white">
                  {event.organizador.name}
                </p>
                {event.organizador.contact && (
                  <p className="text-gray-300 mt-2">
                    Contato:{" "}
                    <a
                      href={`mailto:${event.organizador.contact}`}
                      className="text-purple-400 hover:text-purple-300 transition-colors duration-300"
                    >
                      {event.organizador.contact}
                    </a>
                  </p>
                )}
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Galeria */}
        {event.gallery && event.gallery.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            viewport={{ once: true }}
            className="mt-24"
          >
            <h2 className="text-5xl font-extrabold mb-12 bg-gradient-to-r from-purple-400 via-fuchsia-500 to-indigo-500 bg-clip-text text-transparent text-center">
              Galeria de Fotos
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {event.gallery.map((img, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  viewport={{ once: true }}
                  className="relative h-72 rounded-2xl overflow-hidden shadow-xl group cursor-pointer border border-purple-500/20"
                  onClick={() => setSelectedImage(img)}
                  whileHover={{ scale: 1.05, rotate: 1 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                  <Image
                    src={img}
                    alt={`${event.title} - Foto ${index + 1}`}
                    fill
                    className="object-cover group-hover:scale-115 transition-transform duration-700 ease-out"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 p-4 text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20"
                    initial={{ y: 20 }}
                    whileHover={{ y: 0 }}
                  >
                    Foto {index + 1}
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Vídeos do YouTube */}
        {event.youtubeVideos && event.youtubeVideos.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            viewport={{ once: true }}
            className="mt-24"
          >
            <h2 className="text-5xl font-extrabold mb-12 bg-gradient-to-r from-purple-400 via-fuchsia-500 to-indigo-500 bg-clip-text text-transparent text-center">
              Vídeos do Evento
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {event.youtubeVideos.map((videoUrl, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  viewport={{ once: true }}
                  className="relative rounded-2xl overflow-hidden shadow-xl aspect-video bg-gradient-to-br from-gray-900/50 to-purple-950/50 border border-purple-500/30"
                  whileHover={{ scale: 1.03 }}
                >
                  <iframe
                    width="100%"
                    height="100%"
                    src={getYoutubeEmbedUrl(videoUrl)}
                    title={`${event.title} Video ${index + 1}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </section>

      {/* Overlay de Visualização de Imagem */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-6"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.8, opacity: 0, rotate: 10 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="relative max-w-5xl max-h-[90vh] w-full h-full shadow-2xl rounded-2xl overflow-hidden border border-purple-500/30"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedImage}
                alt="Imagem ampliada"
                fill
                className="object-contain"
                sizes="100vw"
              />
              <motion.button
                className="absolute top-4 right-4 bg-gradient-to-r from-purple-600 to-indigo-500 p-3 rounded-full text-white shadow-lg"
                onClick={() => setSelectedImage(null)}
                whileHover={{ scale: 1.2, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
