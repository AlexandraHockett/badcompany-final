"use client";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import Button from "@/components/Button";
import { events } from "@/data/eventsContent";

// Função para obter apenas eventos passados dos dados completos
const getPastEvents = () => {
  return events
    .filter((event) => event.status === "past")
    .map((event) => ({
      id: event.id,
      title: event.title,
      category: event.categories?.[0] || "Evento",
      year: new Date(event.date).getFullYear(),
      image: event.image,
      video: event.video || null,
      location: event.location,
      testimonial: event.description,
    }))
    .sort((a, b) => b.year - a.year); // Ordenar do mais recente para o mais antigo
};

export default function EventosPassados() {
  const pastEvents = useMemo(() => getPastEvents(), []);
  const [current, setCurrent] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [touchStart, setTouchStart] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const [filterYear, setFilterYear] = useState<number | null>(null);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  // Obter anos e categorias únicas para filtros
  const years = useMemo(
    () =>
      Array.from(new Set(pastEvents.map((event) => event.year))).sort(
        (a, b) => b - a
      ),
    [pastEvents]
  );

  const categories = useMemo(
    () => Array.from(new Set(pastEvents.map((event) => event.category))),
    [pastEvents]
  );

  // Filtrar eventos
  const filteredEvents = useMemo(() => {
    return pastEvents.filter((event) => {
      const matchesYear = filterYear ? event.year === filterYear : true;
      const matchesCategory = filterCategory
        ? event.category === filterCategory
        : true;
      return matchesYear && matchesCategory;
    });
  }, [pastEvents, filterYear, filterCategory]);

  // Reset filtros
  const resetFilters = () => {
    setFilterYear(null);
    setFilterCategory(null);
    setCurrent(0);
  };

  // Autoplay
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (autoplay && !isTransitioning && filteredEvents.length > 1) {
      interval = setInterval(() => {
        setCurrent((prev) => (prev + 1) % filteredEvents.length);
      }, 5000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoplay, filteredEvents.length, isTransitioning]);

  // Scroll to the current event when 'current' changes
  useEffect(() => {
    if (scrollRef.current && filteredEvents.length > 0) {
      setIsTransitioning(true);

      const scrollWidth = scrollRef.current.scrollWidth / filteredEvents.length;
      scrollRef.current.scrollTo({
        left: scrollWidth * current,
        behavior: "smooth",
      });

      // Definir um timeout para marcar quando a transição terminar
      const timeout = setTimeout(() => {
        setIsTransitioning(false);
      }, 800);

      return () => clearTimeout(timeout);
    }
  }, [current, filteredEvents.length]);

  // Arrow navigation handlers
  const handlePrev = () => {
    setAutoplay(false);
    setCurrent((prev) => {
      if (prev === 0) return filteredEvents.length - 1;
      return prev - 1;
    });
  };

  const handleNext = () => {
    setAutoplay(false);
    setCurrent((prev) => {
      if (prev === filteredEvents.length - 1) return 0;
      return prev + 1;
    });
  };

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    // Se o deslize for significativo (mais de 50px)
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Deslize para a esquerda (próximo)
        handleNext();
      } else {
        // Deslize para a direita (anterior)
        handlePrev();
      }
    }
  };

  // Se não houver eventos, mostrar mensagem
  if (filteredEvents.length === 0) {
    return (
      <section className="relative min-h-screen text-white py-12 overflow-hidden flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-center mb-8">
          Eventos Passados
        </h1>

        {/* Filtros */}
        <div className="mb-16 flex flex-wrap justify-center gap-4">
          <div className="flex flex-col items-center gap-2">
            <label className="text-sm text-gray-400">Ano</label>
            <select
              className="bg-gray-800 text-white rounded-lg px-4 py-2 min-w-32"
              value={filterYear || ""}
              onChange={(e) =>
                setFilterYear(e.target.value ? Number(e.target.value) : null)
              }
            >
              <option value="">Todos os anos</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col items-center gap-2">
            <label className="text-sm text-gray-400">Categoria</label>
            <select
              className="bg-gray-800 text-white rounded-lg px-4 py-2 min-w-32"
              value={filterCategory || ""}
              onChange={(e) => setFilterCategory(e.target.value || null)}
            >
              <option value="">Todas as categorias</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <Button
              title="Limpar Filtros"
              onClick={resetFilters}
              containerClass="bg-gray-700"
            />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-900/40 backdrop-blur-sm rounded-xl p-8 max-w-md text-center"
        >
          <svg
            className="w-16 h-16 text-gray-600 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <h2 className="text-xl font-bold mb-3">Nenhum evento encontrado</h2>
          <p className="text-gray-400 mb-6">
            Não encontramos eventos passados que correspondam aos critérios de
            filtro selecionados.
          </p>
          <Button title="Ver todos os eventos" onClick={resetFilters} />
        </motion.div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen text-white py-12 overflow-hidden">
      <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
        Eventos Passados
      </h1>

      {/* Filtros */}
      <div className="mb-8 flex flex-wrap justify-center gap-4">
        <div className="flex flex-col items-center gap-2">
          <label className="text-sm text-gray-400">Ano</label>
          <select
            className="bg-gray-800 text-white rounded-lg px-4 py-2 min-w-32"
            value={filterYear || ""}
            onChange={(e) =>
              setFilterYear(e.target.value ? Number(e.target.value) : null)
            }
          >
            <option value="">Todos os anos</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col items-center gap-2">
          <label className="text-sm text-gray-400">Categoria</label>
          <select
            className="bg-gray-800 text-white rounded-lg px-4 py-2 min-w-32"
            value={filterCategory || ""}
            onChange={(e) => setFilterCategory(e.target.value || null)}
          >
            <option value="">Todas as categorias</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <Button
            title="Limpar Filtros"
            onClick={resetFilters}
            containerClass="bg-gray-700"
          />
        </div>
      </div>

      <div className="relative">
        {/* Scrollable Container */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
          style={{
            scrollSnapType: "x mandatory",
            touchAction: "pan-x", // Allows vertical scrolls to propagate to the window
          }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onScroll={(e) => {
            // Prevent this scroll event from stopping propagation
            e.stopPropagation = function () {};
          }}
        >
          {filteredEvents.map((event, idx) => (
            <motion.div
              key={`${event.id}-${idx}`}
              className="flex-shrink-0 w-full snap-center relative h-[75vh] overflow-hidden"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative w-full h-full">
                {event.video ? (
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                    onLoadStart={() =>
                      console.log(`Video ${idx} started loading`)
                    }
                    onLoad={() => console.log(`Video ${idx} loaded`)}
                  >
                    <source src={event.video} type="video/mp4" />
                  </video>
                ) : (
                  <div className="relative w-full h-full">
                    <Image
                      src={event.image}
                      alt={event.title}
                      fill
                      priority={idx === current}
                      className="object-cover"
                      sizes="100vw"
                    />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent">
                  <div className="absolute inset-x-0 bottom-0 p-8 md:p-16 text-center md:text-left">
                    <div className="inline-block bg-purple-700 px-3 py-1 rounded-full text-xs md:text-sm font-medium mb-3">
                      {event.category} • {event.year}
                    </div>
                    <motion.h3
                      className="text-3xl md:text-5xl font-bold mb-4"
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      {event.title}
                    </motion.h3>

                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      <p className="text-xl italic mb-2 text-gray-200">
                        "{event.testimonial}"
                      </p>
                      <p className="text-sm text-gray-400 mb-6">
                        {event.location}
                      </p>

                      <Button
                        title="Ver Detalhes"
                        href={`/eventos/evento/${event.id}`}
                        rightIcon={
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M14 5l7 7m0 0l-7 7m7-7H3"
                            />
                          </svg>
                        }
                      />
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Controls & pagination - only show if we have multiple events */}
        {filteredEvents.length > 1 && (
          <>
            {/* Navigation Arrows */}
            <div className="absolute inset-y-0 left-4 flex items-center">
              <button
                onClick={handlePrev}
                className="bg-black/30 backdrop-blur-sm hover:bg-black/50 p-3 rounded-full text-white focus:outline-none transition-all"
                aria-label="Evento anterior"
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
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            </div>
            <div className="absolute inset-y-0 right-4 flex items-center">
              <button
                onClick={handleNext}
                className="bg-black/30 backdrop-blur-sm hover:bg-black/50 p-3 rounded-full text-white focus:outline-none transition-all"
                aria-label="Próximo evento"
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
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>

            {/* Pagination Dots */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 bg-black/30 backdrop-blur-sm p-2 rounded-full">
              {filteredEvents.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setAutoplay(false);
                    setCurrent(idx);
                  }}
                  aria-label={`Ver evento ${idx + 1}`}
                  className={`w-3 h-3 rounded-full transition-all ${
                    idx === current
                      ? "bg-purple-500 scale-110"
                      : "bg-gray-500 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>

            {/* Autoplay toggle */}
            <button
              onClick={() => setAutoplay(!autoplay)}
              className={`absolute top-4 right-4 bg-black/30 backdrop-blur-sm p-2 rounded-full transition-colors ${
                autoplay ? "text-purple-400" : "text-gray-400"
              }`}
              aria-label={
                autoplay
                  ? "Desativar reprodução automática"
                  : "Ativar reprodução automática"
              }
            >
              {autoplay ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          </>
        )}
      </div>

      {/* Lista de eventos em miniatura */}
      <div className="container mx-auto mt-12">
        <h2 className="text-2xl font-bold mb-6">Mais Eventos Passados</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {filteredEvents.slice(0, 8).map((event, idx) => (
            <motion.div
              key={`thumb-${event.id}-${idx}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className={`rounded-lg overflow-hidden cursor-pointer transition-all ${
                idx === current
                  ? "ring-2 ring-purple-500 scale-105"
                  : "hover:ring-2 hover:ring-purple-500/50"
              }`}
              onClick={() => {
                setAutoplay(false);
                setCurrent(idx);
              }}
            >
              <div className="relative h-32">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                  <div className="absolute bottom-2 left-2">
                    <div className="text-xs font-medium">{event.title}</div>
                    <div className="text-xs text-gray-400">{event.year}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
