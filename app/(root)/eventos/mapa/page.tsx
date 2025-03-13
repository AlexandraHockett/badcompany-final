"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Button from "@/components/Button";
import Image from "next/image";
import { events, Event, LocationEntry } from "@/data/eventsContent";

// Dynamically import InteractiveMap with SSR disabled
const InteractiveMap = dynamic(() => import("@/components/InteractiveMap"), {
  ssr: false,
});

// Filtrar apenas eventos internacionais
const internationalEvents = events.filter((event) => event.international);

// Agrupar eventos por país
const groupEventsByLocation = (): LocationEntry[] => {
  const locationMap = new Map<string, LocationEntry>();

  internationalEvents.forEach((event) => {
    if (!event.coordinates) return;

    // Safely extract location name
    const locationName = event.location.trim();

    if (!locationMap.has(locationName)) {
      locationMap.set(locationName, {
        name: locationName,
        coords: [event.coordinates.lat, event.coordinates.lng],
        images: [
          // Use the event's image if it exists, or a default flag
          event.image || "/path/to/default-flag.svg",
        ],
        events: [],
      });
    }

    const locationEntry = locationMap.get(locationName);
    if (locationEntry) {
      locationEntry.events.push({
        id: event.id,
        name: event.title,
        date: new Date(event.date).getFullYear().toString(),
        description: event.description,
        image: event.image,
      });
    }
  });

  return Array.from(locationMap.values());
};

export default function MapaEventos() {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const locations = groupEventsByLocation();

  // Encontrar o evento selecionado
  const getSelectedEventDetails = () => {
    if (!selectedEvent) return null;
    return (
      internationalEvents.find((event) => event.id === selectedEvent) || null
    );
  };

  const eventDetails = getSelectedEventDetails();

  return (
    <section className="py-12 text-white min-h-screen">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
            Eventos Internacionais
          </h1>
          <p className="text-lg text-purple-200 max-w-3xl mx-auto mb-8">
            A BadCompany tem presença global, com eventos realizados em diversos
            países. Explore o mapa interativo para descobrir onde já estivemos e
            o que realizámos.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Mapa Interativo - 2/3 da largura em desktop */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="md:col-span-2 bg-gray-900/40 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg h-[500px]"
          >
            <InteractiveMap
              locations={locations}
              onSelectLocation={setSelectedLocation}
              onSelectEvent={setSelectedEvent}
            />
          </motion.div>

          {/* Painel lateral - 1/3 da largura em desktop */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gray-900/40 backdrop-blur-sm rounded-xl p-6 overflow-auto max-h-[500px]"
          >
            <h2 className="text-2xl font-bold mb-6 text-center md:text-left">
              {selectedLocation
                ? `Eventos em ${selectedLocation}`
                : "Nossos Destinos"}
            </h2>

            {/* Lista de localizações e eventos */}
            {!selectedLocation ? (
              <div className="space-y-4">
                {locations.map((location, index) => (
                  <div
                    key={index}
                    className="p-3 hover:bg-gray-800/50 rounded-lg transition-colors cursor-pointer"
                    onClick={() => setSelectedLocation(location.name)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-6 relative overflow-hidden rounded-sm flex-shrink-0">
                        {location.images[0] && (
                          <Image
                            src={location.images[0]}
                            alt={location.name}
                            fill
                            className="object-cover"
                            sizes="32px"
                          />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-white">
                          {location.name}
                        </h3>
                        <p className="text-xs text-gray-400">
                          {location.events.length} evento(s)
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {locations.find((loc) => loc.name === selectedLocation)
                      ?.images[0] && (
                      <div className="w-8 h-6 relative overflow-hidden rounded-sm">
                        <Image
                          src={
                            locations.find(
                              (loc) => loc.name === selectedLocation
                            )?.images[0] || ""
                          }
                          alt={selectedLocation}
                          fill
                          className="object-cover"
                          sizes="32px"
                        />
                      </div>
                    )}
                    <h3 className="font-medium text-white">
                      {selectedLocation}
                    </h3>
                  </div>
                  <button
                    className="text-sm text-purple-300 hover:text-purple-200"
                    onClick={() => {
                      setSelectedLocation(null);
                      setSelectedEvent(null);
                    }}
                  >
                    Voltar
                  </button>
                </div>

                <div className="space-y-4 mt-4">
                  {locations
                    .find((loc) => loc.name === selectedLocation)
                    ?.events.map((event, index) => (
                      <div
                        key={event.id}
                        className={`p-3 hover:bg-gray-800/50 rounded-lg transition-colors cursor-pointer ${
                          selectedEvent === event.id
                            ? "bg-gray-800/70 ring-1 ring-purple-500"
                            : ""
                        }`}
                        onClick={() => setSelectedEvent(event.id)}
                      >
                        <div className="flex items-center gap-3">
                          {event.image && (
                            <div className="w-12 h-12 relative overflow-hidden rounded-md flex-shrink-0">
                              <Image
                                src={event.image}
                                alt={event.name}
                                fill
                                className="object-cover"
                                sizes="48px"
                              />
                            </div>
                          )}
                          <div>
                            <h4 className="font-medium text-white">
                              {event.name}
                            </h4>
                            <p className="text-xs text-gray-400">
                              {event.date}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Detalhes do evento selecionado */}
        {eventDetails && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-900/40 backdrop-blur-sm rounded-xl overflow-hidden mb-12"
          >
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="relative h-64 md:h-auto">
                <Image
                  src={eventDetails.image}
                  alt={eventDetails.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent md:hidden"></div>
              </div>
              <div className="p-6 md:p-8 flex flex-col justify-center">
                <div className="flex items-center gap-2 text-sm text-purple-300 mb-2">
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
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>{eventDetails.location}</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  {eventDetails.title}
                </h2>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-400">Data</p>
                    <p className="text-white">
                      {new Date(eventDetails.date).toLocaleDateString("pt-PT", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  {eventDetails.price && (
                    <div>
                      <p className="text-sm text-gray-400">Preço</p>
                      <p className="text-white">{eventDetails.price}</p>
                    </div>
                  )}
                </div>

                <p className="text-gray-300 mb-6">{eventDetails.description}</p>

                {eventDetails.longDescription && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">
                      Sobre o evento
                    </h3>
                    <p className="text-gray-300 text-sm">
                      {eventDetails.longDescription}
                    </p>
                  </div>
                )}

                {eventDetails.status === "upcoming" &&
                  eventDetails.tickets?.available && (
                    <Button
                      title="Comprar Bilhetes"
                      href={eventDetails.tickets.url || "#"}
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
                  )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Seção de estatísticas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          <div className="bg-gray-900/40 backdrop-blur-sm rounded-xl p-6 text-center">
            <div className="text-3xl md:text-4xl font-bold text-purple-300 mb-2">
              {locations.length}
            </div>
            <div className="text-gray-300 text-sm">Países</div>
          </div>
          <div className="bg-gray-900/40 backdrop-blur-sm rounded-xl p-6 text-center">
            <div className="text-3xl md:text-4xl font-bold text-purple-300 mb-2">
              {internationalEvents.length}
            </div>
            <div className="text-gray-300 text-sm">Eventos</div>
          </div>
          <div className="bg-gray-900/40 backdrop-blur-sm rounded-xl p-6 text-center">
            <div className="text-3xl md:text-4xl font-bold text-purple-300 mb-2">
              10+
            </div>
            <div className="text-gray-300 text-sm">Anos de Experiência</div>
          </div>
          <div className="bg-gray-900/40 backdrop-blur-sm rounded-xl p-6 text-center">
            <div className="text-3xl md:text-4xl font-bold text-purple-300 mb-2">
              500K+
            </div>
            <div className="text-gray-300 text-sm">Participantes</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
