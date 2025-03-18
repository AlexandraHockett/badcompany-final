"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "./Button";
import Image from "next/image";

// Interface para os eventos
interface Evento {
  id: number;
  nome: string;
  data: string;
  imagem: string;
  link: string;
}

// Dados fictícios dos eventos
const eventos: Evento[] = [
  {
    id: 1,
    nome: "BCLANDIA 25",
    data: "2025-03-03T23:59:00",
    imagem: "/img/bclandia.jpg",
    link: "https://3cket.com/event/bclandia-25/",
  },
  {
    id: 2,
    nome: "BCLANDIA 25",
    data: "2025-03-03T23:59:00",
    imagem: "/img/bclandia.jpg",
    link: "https://3cket.com/event/bclandia-25/",
  },
];

// Interface para o tempo restante
interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

// Componente Countdown estilizado
const Countdown: React.FC<{ targetDate: string }> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = (): TimeLeft => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();
      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  // Array com os dados do contador
  const timeUnits = [
    { value: timeLeft.days, label: "dias" },
    { value: timeLeft.hours, label: "horas" },
    { value: timeLeft.minutes, label: "min" },
    { value: timeLeft.seconds, label: "seg" },
  ];

  return (
    <div className="flex gap-3 sm:gap-4 my-4">
      {timeUnits.map((unit, index) => (
        <div key={index} className="flex flex-col items-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-black/60 backdrop-blur-md rounded-lg flex items-center justify-center border border-white/10">
            <motion.span
              key={unit.value}
              className="text-xl sm:text-2xl font-bold text-white"
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 10, opacity: 0 }}
            >
              {unit.value < 10 ? `0${unit.value}` : unit.value}
            </motion.span>
          </div>
          <span className="text-xs mt-1 text-gray-400">{unit.label}</span>
        </div>
      ))}
    </div>
  );
};

// Componente Carrossel melhorado
const CarrosselEventos: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Rotação automática
  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % eventos.length);
    }, 8000);

    setIsLoaded(true);

    return () => clearInterval(interval);
  }, []);

  // Função para slides anteriores
  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + eventos.length) % eventos.length);
  };

  // Função para próximos slides
  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % eventos.length);
  };

  // Variantes para animação
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? "-100%" : "100%",
      opacity: 0,
    }),
  };

  return (
    <section className="py-16 px-4 w-full text-white relative">
      {/* Background decorations - posicionados relativamente à seção */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-purple-900/20 filter blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[30rem] h-96 rounded-full bg-blue-900/20 filter blur-[150px]" />
      </div>

      <motion.div
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Título com animação */}
        <motion.div
          className="mb-12 text-center relative"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <h2 className="text-4xl sm:text-5xl relative inline-block">
            Próximos Eventos
            <motion.span
              className="absolute -bottom-3 left-0 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ delay: 0.5, duration: 1 }}
            />
          </h2>
        </motion.div>

        {/* Carrossel Principal */}
        <div
          ref={carouselRef}
          className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 backdrop-blur-md bg-black/20"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-purple-600/50 via-blue-500/50 to-purple-600/50" />
          <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500/50 via-purple-600/50 to-blue-500/50" />

          {/* Slide container with animation */}
          <div className="relative w-full h-[28rem] sm:h-[36rem] md:h-[42rem] overflow-hidden">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.5 },
                }}
                className="absolute w-full h-full"
              >
                <div className="relative w-full h-full">
                  {/* Image with overlay gradient */}
                  <div className="absolute inset-0 overflow-hidden rounded-xl">
                    <Image
                      src={eventos[currentIndex].imagem}
                      alt={eventos[currentIndex].nome}
                      fill
                      style={{ objectFit: "cover" }}
                      priority
                      className="transition-all duration-700 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
                  </div>

                  {/* Event details */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 md:p-10">
                    <div className="relative z-10">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                      >
                        <span className="px-3 py-1 bg-gradient-to-r from-purple-800 to-blue-800 rounded-full text-xs uppercase tracking-wide">
                          Próximo Evento
                        </span>
                      </motion.div>

                      <motion.h3
                        className="text-4xl sm:text-5xl md:text-6xl font-bold mt-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                      >
                        {eventos[currentIndex].nome}
                      </motion.h3>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                      >
                        <Countdown targetDate={eventos[currentIndex].data} />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.6 }}
                        className="mt-6"
                      >
                        <Button
                          title="Comprar Bilhetes"
                          href={eventos[currentIndex].link}
                          rightIcon={<span>→</span>}
                          containerClass="bg-gradient-to-r from-purple-600/30 to-blue-600/30 hover:from-purple-600/50 hover:to-blue-600/50"
                        />
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation buttons */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 p-3 rounded-full bg-black/30 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300"
              aria-label="Previous slide"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 p-3 rounded-full bg-black/30 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300"
              aria-label="Next slide"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Pagination dots */}
        <div className="flex justify-center mt-8">
          {eventos.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              className="group p-2 focus:outline-none"
              aria-label={`Go to slide ${index + 1}`}
            >
              <div
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-gradient-to-r from-purple-500 to-blue-500 scale-125"
                    : "bg-white/30 group-hover:bg-white/50"
                }`}
              />
            </button>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default CarrosselEventos;
