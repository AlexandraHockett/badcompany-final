"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { podcastEpisodes } from "@/data/mediaContent";
import type { Podcast } from "@/data/mediaContent";

export default function PodcastsPage() {
  const [activeFilter, setActiveFilter] = useState<string>("all");

  // Extrair tópicos únicos dos podcasts para filtros
  const allTopics = Array.from(
    new Set(podcastEpisodes.flatMap((podcast) => podcast.topics))
  ).slice(0, 6); // Limitando a 6 tópicos para UI

  // Filtrar podcasts baseado no filtro selecionado
  const filteredPodcasts =
    activeFilter === "all"
      ? podcastEpisodes
      : podcastEpisodes.filter((podcast) =>
          podcast.topics.includes(activeFilter)
        );

  return (
    <div className="text-white">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-6">
        Podcasts & Lives
      </h1>
      <p className="text-gray-400 text-center mb-10 max-w-3xl mx-auto">
        Assista a nossas lives e podcasts sobre música eletrônica, cultura e
        tendências do cenário underground.
      </p>

      {/* Filtros */}
      <div className="mb-10 flex overflow-x-auto pb-2 scrollbar-hide">
        <div className="flex space-x-2 mx-auto">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              activeFilter === "all"
                ? "bg-purple-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            Todos
          </button>

          {/* Filtros por tópico */}
          {allTopics.map((topic: string) => (
            <button
              key={topic}
              onClick={() => setActiveFilter(topic)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                activeFilter === topic
                  ? "bg-purple-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {topic.charAt(0).toUpperCase() + topic.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Podcasts */}
      <div className="grid grid-cols-1 gap-16 max-w-5xl mx-auto mb-20">
        {filteredPodcasts.map((podcast: Podcast) => (
          <PodcastCard key={podcast.id} podcast={podcast} />
        ))}
      </div>
    </div>
  );
}

function PodcastCard({ podcast }: { podcast: Podcast }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800/30 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
    >
      <div className="p-6 md:p-8">
        {/* Cabeçalho do Podcast */}
        <div className="flex flex-wrap md:flex-nowrap items-start gap-4 mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-purple-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                EP {podcast.episodeNumber}
              </span>
              {podcast.isLive && (
                <span className="bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center">
                  <span className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></span>
                  LIVE
                </span>
              )}
              <span className="text-gray-400 text-sm">
                {new Date(podcast.date).toLocaleDateString("pt-PT", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {podcast.title}
            </h2>

            <p className="text-gray-400 mb-4">{podcast.description}</p>

            {/* Tópicos */}
            <div className="flex flex-wrap gap-2 mb-4">
              {podcast.topics.map((topic: string) => (
                <span
                  key={topic}
                  className="bg-gray-700 text-gray-300 text-xs px-2.5 py-1 rounded-full"
                >
                  {topic}
                </span>
              ))}
            </div>

            {/* Hosts e Convidados */}
            <div className="flex gap-4">
              <div>
                <span className="text-xs text-gray-500 block mb-1">HOSTS</span>
                <div className="flex gap-1">
                  {podcast.hosts.map((host: string, index: number) => (
                    <span
                      key={index}
                      className="inline-block bg-purple-900/50 text-purple-300 text-sm px-2 py-1 rounded"
                    >
                      {host}
                    </span>
                  ))}
                </div>
              </div>

              {podcast.guests && podcast.guests.length > 0 && (
                <div>
                  <span className="text-xs text-gray-500 block mb-1">
                    CONVIDADOS
                  </span>
                  <div className="flex gap-1">
                    {podcast.guests.map((guest: string, index: number) => (
                      <span
                        key={index}
                        className="inline-block bg-indigo-900/50 text-indigo-300 text-sm px-2 py-1 rounded"
                      >
                        {guest}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Vídeo do YouTube */}
        <div className="aspect-video w-full rounded-lg overflow-hidden bg-black mb-4">
          <iframe
            className="w-full h-full"
            src={podcast.videoUrl}
            title={podcast.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            loading="lazy"
            sandbox="allow-scripts allow-same-origin"
            onError={(e) => {
              console.warn("YouTube embed failed", e);
              // Optional: Fallback mechanism
            }}
          />
        </div>

        {/* Duração */}
        <div className="flex justify-between items-center">
          <div className="flex items-center text-gray-400">
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {podcast.duration}
          </div>

          {/* Botão de compartilhar */}
          <button className="text-purple-400 hover:text-purple-300 transition-colors flex items-center text-sm">
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
            Compartilhar
          </button>
        </div>
      </div>
    </motion.div>
  );
}
