"use client";

import { useState, useEffect } from "react";
import Button from "@/components/Button";
import Countdown from "@/components/Countdown";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { events } from "@/data/eventos/eventsContent";

// Filtrar apenas eventos próximos
const upcomingEvents = events.filter((event) => event.status === "upcoming");

export default function ProximosEventos() {
  // Estado para controlar o hover em cada evento
  const [hoveredEventId, setHoveredEventId] = useState<string | null>(null);
  // Estado para controlar o evento ativo/expandido (em dispositivos móveis)
  const [activeEventId, setActiveEventId] = useState<string | null>(null);
  // Estado para controlar animações
  const [isLoaded, setIsLoaded] = useState(false);
  // Estado para controlar se está no modo desktop ou não
  const [isDesktop, setIsDesktop] = useState(false);

  // Ativar animações após carregamento e verificar tamanho da tela
  useEffect(() => {
    setIsLoaded(true);

    // Verificar tamanho da tela de forma segura (apenas no client-side)
    const checkIfDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    // Verificar inicialmente
    checkIfDesktop();

    // Adicionar event listener para redimensionamento
    window.addEventListener("resize", checkIfDesktop);

    // Cleanup
    return () => {
      window.removeEventListener("resize", checkIfDesktop);
    };
  }, []);

  // Formatar data para exibição
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-PT", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Alternar entre expandir/recolher evento no mobile
  const toggleEventExpansion = (id: string) => {
    if (activeEventId === id) {
      setActiveEventId(null);
    } else {
      setActiveEventId(id);
    }
  };

  return (
    <section className="py-12 text-white">
      <motion.div
        className="max-w-5xl mx-auto px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
            Próximos Eventos
          </h1>
          <p className="text-lg text-purple-200 max-w-2xl mx-auto">
            Conhece os eventos que estão a chegar e garante já o teu lugar
          </p>
        </div>

        <div className="space-y-16">
          {upcomingEvents.map((event, index) => (
            <motion.div
              className="w-full bg-gradient-to-br from-gray-900/60 to-purple-900/20 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl"
              key={event.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{
                opacity: isLoaded ? 1 : 0,
                y: isLoaded ? 0 : 30,
              }}
              transition={{
                duration: 0.7,
                delay: index * 0.2,
                ease: [0.25, 0.1, 0.25, 1.0],
              }}
            >
              <div className="flex flex-col md:flex-row">
                {/* Media container (lado esquerdo no desktop, topo no mobile) */}
                <div
                  className="relative w-full md:w-1/2 h-64 md:h-auto"
                  onMouseEnter={() => setHoveredEventId(event.id)}
                  onMouseLeave={() => setHoveredEventId(null)}
                >
                  {event.video && (
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      className={`w-full h-full object-cover absolute top-0 left-0 transition-opacity duration-500 ${
                        hoveredEventId === event.id
                          ? "opacity-0"
                          : "opacity-100"
                      }`}
                    >
                      <source src={event.video} type="video/mp4" />O teu
                      navegador não suporta vídeo.
                    </video>
                  )}

                  {/* Imagem que aparece no hover */}
                  <div
                    className={`absolute inset-0 transition-opacity duration-500 ${
                      hoveredEventId === event.id ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <Image
                      src={event.image}
                      alt={event.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>

                  {/* Overlay gradiente */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent md:hidden"></div>
                </div>

                {/* Conteúdo (lado direito no desktop, parte inferior no mobile) */}
                <div className="relative w-full md:w-1/2 p-6 md:p-8">
                  {/* Status e preço */}
                  <div className="flex justify-between items-center mb-4">
                    <div className="bg-purple-600 text-white text-xs font-medium px-2.5 py-1 rounded-full">
                      Próximo Evento
                    </div>
                    {event.price && (
                      <div className="text-purple-300 font-medium">
                        {event.price}
                      </div>
                    )}
                  </div>

                  <h2 className="text-2xl md:text-3xl font-bold mb-2">
                    {event.title}
                  </h2>

                  <div className="flex items-center text-sm text-gray-300 mb-4">
                    <svg
                      className="w-4 h-4 mr-1 text-purple-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      ></path>
                    </svg>
                    <span>{formatDate(event.date)}</span>
                  </div>

                  {event.location && (
                    <div className="flex items-center text-sm text-gray-300 mb-6">
                      <svg
                        className="w-4 h-4 mr-1 text-purple-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        ></path>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        ></path>
                      </svg>
                      <span>{event.location}</span>
                    </div>
                  )}

                  {/* Descrição (expandível no mobile) - AQUI ESTÁ A CORREÇÃO */}
                  <div
                    className={`text-gray-300 mb-6 overflow-hidden transition-all duration-300 ${
                      activeEventId === event.id || isDesktop
                        ? "max-h-96"
                        : "max-h-16 md:max-h-96"
                    }`}
                  >
                    <p>{event.description}</p>
                  </div>

                  {/* Botão para expandir no mobile */}
                  <button
                    className="text-purple-400 text-sm font-medium hover:text-purple-300 mb-6 md:hidden"
                    onClick={() => toggleEventExpansion(event.id)}
                  >
                    {activeEventId === event.id ? "Ver menos" : "Ver mais"}
                  </button>

                  {/* Contagem regressiva e botão */}
                  <div className="flex flex-col sm:flex-row items-center space-y-6 sm:space-y-0 sm:space-x-6">
                    <div className="w-full sm:w-auto">
                      <Countdown targetDate={new Date(event.date)} />
                    </div>

                    <div className="w-full sm:w-auto sm:ml-auto">
                      <Button
                        title="Comprar Bilhetes"
                        href={event.tickets?.url || "#"}
                        rightIcon={
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 100 4v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2a2 2 0 100-4V6z" />
                          </svg>
                        }
                      />
                    </div>
                  </div>

                  {/* Tags */}
                  {event.tags && event.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-6">
                      {event.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="bg-purple-900/40 px-3 py-1 rounded-full text-xs text-purple-200"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mensagem caso não hajam eventos próximos */}
        {upcomingEvents.length === 0 && (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-white mb-4">
              Sem eventos próximos de momento
            </h2>
            <p className="text-gray-300 mb-6">
              Estamos a preparar novos eventos. Fica atento!
            </p>
            <Button title="Ver eventos passados" href="/eventos/passados" />
          </div>
        )}
      </motion.div>
    </section>
  );
}
