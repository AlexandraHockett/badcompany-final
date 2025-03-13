"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { newsArticles } from "@/data/mediaContent";
import type { NewsArticle } from "@/data/mediaContent";

export default function NoticiasPage() {
  const [activeFilter, setActiveFilter] = useState<string>("all");

  // Extrair tags únicas para filtros
  const allTags = Array.from(
    new Set(newsArticles.flatMap((article) => article.tags))
  ).slice(0, 6); // Limitando a 6 tags para UI

  // Filtrar notícias baseado no filtro selecionado
  const filteredArticles =
    activeFilter === "all"
      ? newsArticles
      : newsArticles.filter((article) => article.tags.includes(activeFilter));

  return (
    <div className="text-white">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-6">
        Notícias
      </h1>
      <p className="text-gray-400 text-center mb-10 max-w-3xl mx-auto">
        As últimas atualizações sobre a BadCompany, entrevistas e eventos.
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
            Todas
          </button>

          {/* Filtros por tag */}
          {allTags.map((tag: string) => (
            <button
              key={tag}
              onClick={() => setActiveFilter(tag)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                activeFilter === tag
                  ? "bg-purple-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {tag.charAt(0).toUpperCase() + tag.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Notícias */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto mb-16">
        {filteredArticles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}

// Componente para artigos
function ArticleCard({ article }: { article: NewsArticle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800/30 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-purple-500/20 transition-all duration-300 h-full flex flex-col"
    >
      {/* Informações do artigo no topo */}
      <div className="p-4 md:p-6 pb-0 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center">
          <span className="text-gray-400 text-sm">
            {formatDate(article.date)}
          </span>

          {article.featured && (
            <span className="ml-2 bg-purple-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              Destaque
            </span>
          )}
        </div>

        {article.views && (
          <div className="flex items-center text-gray-400 text-sm">
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
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            {article.views}
          </div>
        )}
      </div>

      {/* Título do Artigo */}
      <div className="px-4 md:px-6 pt-2 pb-4">
        <h2 className="text-xl md:text-2xl font-bold text-white">
          {article.title}
        </h2>
      </div>

      {/* Vídeo do YouTube (se existir) */}
      {article.videoUrl && (
        <div className="aspect-video w-full bg-black">
          <iframe
            className="w-full h-full"
            src={article.videoUrl}
            title={article.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}

      {/* Imagem (se não tiver vídeo) */}
      {!article.videoUrl && (
        <div className="relative aspect-video w-full">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Conteúdo abaixo do vídeo/imagem */}
      <div className="p-4 md:p-6 flex-1 flex flex-col">
        {/* Descrição */}
        <p className="text-gray-400 mb-4 flex-grow">{article.excerpt}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {article.tags.map((tag: string) => (
            <span
              key={tag}
              className="bg-gray-700 text-gray-300 text-xs px-2.5 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Autor e Link */}
        <div className="flex justify-between items-center mt-auto">
          <span className="text-sm text-gray-500">
            Por <span className="text-purple-400">{article.author}</span>
          </span>

          <Link
            href={`/media/noticias/${article.slug}`}
            className="text-purple-400 text-sm flex items-center hover:text-purple-300 transition-colors"
          >
            Ler mais
            <svg
              className="w-4 h-4 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

// Função para formatar data
function formatDate(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };

  return new Date(dateString).toLocaleDateString("pt-PT", options);
}
