"use client";
import BudgetForm from "@/components/eventos/BudgetForm";
import { motion } from "framer-motion";
import Button from "@/components/layout/Button";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  privateEventsInfo,
  privateEventTypes,
  eventExamples,
} from "@/data/eventos/eventsContent";

export default function EventosPrivados() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<string>(privateEventTypes[0].id);
  const [selectedEventType, setSelectedEventType] = useState("");

  useEffect(() => {
    // Force normal scrolling behavior at the document level
    document.documentElement.style.overflow = "auto";
    document.body.style.overflow = "auto";

    // Set loaded state for animations
    setIsLoaded(true);

    return () => {
      // Cleanup when component unmounts
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, []);

  // Função para rolar até o formulário de orçamento
  const scrollToForm = (eventTypeId = "") => {
    setSelectedEventType(eventTypeId);
    document.getElementById("budget-form")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        delay: i * 0.1,
        ease: [0.17, 0.67, 0.83, 0.67],
      },
    }),
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  return (
    <section className="py-12 text-white min-h-screen">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          variants={fadeInUp}
          custom={0}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
            {privateEventsInfo.title}
          </h1>
          <p className="text-xl md:text-2xl mb-2 text-purple-200">
            {privateEventsInfo.subtitle}
          </p>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            {privateEventsInfo.description}
          </p>
        </motion.div>

        {/* Tipos de eventos privados */}
        <motion.div
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          variants={fadeInUp}
          custom={1}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold mb-8 text-center">
            Tipos de Eventos
          </h2>

          {/* Abas de categorias */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {privateEventTypes.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveTab(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeTab === category.id
                    ? "bg-purple-600 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {category.title}
              </button>
            ))}
          </div>

          {/* Conteúdo com base na aba selecionada */}
          <div className="bg-gray-900/40 backdrop-blur-sm p-6 rounded-xl">
            {privateEventTypes.map(
              (eventType) =>
                activeTab === eventType.id && (
                  <div
                    key={eventType.id}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  >
                    <div className="relative h-64 md:h-auto rounded-lg overflow-hidden">
                      <Image
                        src={eventType.image}
                        alt={eventType.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                      <div className="absolute bottom-4 left-4">
                        <p className="text-sm bg-purple-600 text-white px-2 py-1 rounded-full">
                          A partir de {eventType.priceFrom}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col justify-center">
                      <h3 className="text-xl font-bold mb-3">
                        {eventType.title}
                      </h3>
                      <p className="text-gray-300 mb-4">
                        {eventType.description}
                      </p>
                      <ul className="space-y-2 mb-6">
                        {eventType.features
                          .slice(0, 3)
                          .map((feature, index) => (
                            <li key={index} className="flex items-start">
                              <span className="bg-purple-600 p-1 rounded-full mr-3 mt-1 flex-shrink-0">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-3 w-3 text-white"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              </span>
                              <span className="text-sm">{feature}</span>
                            </li>
                          ))}
                      </ul>
                      <Button
                        title="Orçamento Personalizado"
                        onClick={() => scrollToForm(eventType.id)}
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
                    </div>
                  </div>
                )
            )}
          </div>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-8 mb-16">
          <motion.div
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            variants={fadeInUp}
            custom={2}
            className="md:w-1/2"
            id="budget-form"
          >
            <h2 className="text-2xl font-bold mb-6 text-center md:text-left">
              Solicita um Orçamento
            </h2>
            <BudgetForm selectedEventType={selectedEventType} />
          </motion.div>

          <motion.div
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            variants={fadeInUp}
            custom={3}
            className="md:w-1/2 flex flex-col justify-center"
          >
            <h2 className="text-2xl font-bold mb-6 text-center md:text-left">
              Por Que Escolher a BadCompany?
            </h2>
            <ul className="space-y-6">
              {privateEventsInfo.advantages.map((advantage, index) => (
                <li key={index} className="flex items-start group">
                  <span className="bg-purple-600 p-1.5 rounded-full mr-4 mt-1 group-hover:scale-110 transition-transform">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </span>
                  <div>
                    <h3 className="font-medium text-purple-200 mb-1">
                      {advantage.title}
                    </h3>
                    <p className="text-gray-300">{advantage.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          variants={staggerContainer}
        >
          <h2 className="text-2xl font-bold mb-8 text-center">
            Nossos Eventos Emblemáticos
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {eventExamples.map((event, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                custom={index}
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
                className="bg-gray-900/50 rounded-lg overflow-hidden shadow-lg group"
              >
                <div className="h-64 overflow-hidden relative">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-purple-300 transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-gray-300 text-sm">{event.description}</p>

                  {event.features && (
                    <div className="mt-3 pt-3 border-t border-gray-700">
                      <div className="text-xs text-purple-300 mb-2">
                        Destaques:
                      </div>
                      {event.features.slice(0, 2).map((feature, idx) => (
                        <p
                          key={idx}
                          className="text-xs text-gray-400 flex items-center gap-1 mb-1"
                        >
                          <svg
                            className="h-3 w-3 text-purple-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          {feature}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          variants={fadeInUp}
          custom={6}
          className="mt-16 text-center bg-gray-900/40 backdrop-blur-sm p-8 rounded-xl"
        >
          <h2 className="text-2xl font-bold mb-4">Pronto para Começar?</h2>
          <p className="mb-6 text-gray-300">
            Entre em contacto também pelo WhatsApp ou e-mail:
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              href={privateEventsInfo.contactInfo.whatsapp}
              title="WhatsApp"
              leftIcon={
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              }
            />
            <Button
              href={`mailto:${privateEventsInfo.contactInfo.email}`}
              title="Email"
              leftIcon={
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              }
            />
          </div>

          <div className="mt-8 max-w-lg mx-auto">
            <div className="flex items-center justify-center gap-6 mb-6">
              <span className="h-px bg-purple-600/50 w-full"></span>
              <span className="text-purple-300 whitespace-nowrap text-sm font-medium">
                Os Nossos Clientes
              </span>
              <span className="h-px bg-purple-600/50 w-full"></span>
            </div>

            <div className="flex flex-wrap justify-center gap-8">
              {privateEventsInfo.clients.map((client, index) => (
                <div
                  key={index}
                  className="w-20 h-12 bg-white/10 rounded-md flex items-center justify-center"
                >
                  <span className="text-xs text-gray-300">{client}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Testemunhos */}
        <motion.div
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          variants={fadeInUp}
          custom={7}
          className="mt-16"
        >
          <h2 className="text-2xl font-bold mb-8 text-center">
            O Que Os Nossos Clientes Dizem
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {privateEventsInfo.testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-900/80 to-purple-900/20 backdrop-blur-sm p-6 rounded-xl"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <div key={i} className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                  ))}
                </div>
                <p className="text-gray-300 mb-4">{testimonial.quote}</p>
                <div>
                  <p className="text-white font-medium">{testimonial.author}</p>
                  <p className="text-sm text-gray-400">{testimonial.event}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          variants={fadeInUp}
          custom={8}
          className="mt-16 mb-8"
        >
          <h2 className="text-2xl font-bold mb-8 text-center">
            Perguntas Frequentes
          </h2>

          <div className="max-w-3xl mx-auto divide-y divide-gray-700">
            {privateEventsInfo.faqs.map((faq, index) => (
              <div key={index} className="py-5">
                <details className="group">
                  <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                    <span>{faq.question}</span>
                    <span className="transition group-open:rotate-180">
                      <svg
                        fill="none"
                        height="24"
                        shapeRendering="geometricPrecision"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        viewBox="0 0 24 24"
                        width="24"
                      >
                        <path d="M6 9l6 6 6-6"></path>
                      </svg>
                    </span>
                  </summary>
                  <p className="text-gray-400 mt-3 group-open:animate-fadeIn">
                    {faq.answer}
                  </p>
                </details>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
