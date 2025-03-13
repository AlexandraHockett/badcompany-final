"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { newsArticles } from "@/data/mediaContent";
import type { NewsArticle } from "@/data/mediaContent";

export default function NoticiaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Encontrar o artigo com base no slug da URL
    const slug = params?.slug as string;
    const foundArticle = newsArticles.find((article) => article.slug === slug);

    if (foundArticle) {
      setArticle(foundArticle);
    }

    setLoading(false);
  }, [params]);

  // Redirecionar se o artigo não for encontrado
  useEffect(() => {
    if (!loading && !article) {
      router.push("/media/noticias");
    }
  }, [article, loading, router]);

  if (loading || !article) {
    return (
      <div className="text-white text-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
        <p>Carregando artigo...</p>
      </div>
    );
  }

  return (
    <div className="text-white max-w-4xl mx-auto">
      {/* Botão de Voltar */}
      <div className="mb-6">
        <Link
          href="/media/noticias"
          className="text-purple-400 hover:text-purple-300 transition-colors flex items-center text-sm font-medium"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Voltar para Notícias
        </Link>
      </div>

      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-800/30 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg"
      >
        {/* Cabeçalho com metadata */}
        <div className="p-6 border-b border-gray-700/50">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
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
                {article.views} visualizações
              </div>
            )}
          </div>

          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
            {article.title}
          </h1>

          <div className="flex items-center">
            <span className="text-gray-300">
              Por{" "}
              <span className="text-purple-400 font-medium">
                {article.author}
              </span>
            </span>
          </div>
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

        {/* Imagem principal (se não tiver vídeo) */}
        {!article.videoUrl && (
          <div className="relative aspect-video w-full">
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Conteúdo do artigo */}
        <div className="p-6">
          <div className="prose prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
          </div>

          {/* Tags */}
          <div className="mt-8 pt-6 border-t border-gray-700/50">
            <h3 className="text-lg font-bold mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="bg-gray-700 text-gray-300 text-xs px-3 py-1.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Botões de compartilhamento */}
          <div className="mt-8 flex justify-end">
            <div className="flex gap-2">
              <button className="text-gray-400 hover:text-white transition-colors p-2 rounded-full bg-gray-700/50 hover:bg-gray-700">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </button>
              <button className="text-gray-400 hover:text-white transition-colors p-2 rounded-full bg-gray-700/50 hover:bg-gray-700">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.162c3.196 0 3.584.012 4.85.07 1.17.054 1.805.249 2.227.419.559.217.96.477 1.382.896.419.42.677.823.895 1.382.17.422.364 1.057.418 2.227.058 1.265.07 1.644.07 4.85 0 3.196-.012 3.584-.07 4.85-.054 1.17-.249 1.805-.418 2.227-.217.559-.478.96-.896 1.382-.42.419-.823.677-1.382.895-.421.17-1.057.364-2.227.418-1.265.058-1.644.07-4.85.07-3.196 0-3.584-.012-4.85-.07-1.17-.054-1.805-.249-2.227-.418-.559-.217-.96-.477-1.382-.896-.42-.42-.677-.823-.895-1.382-.17-.422-.364-1.057-.418-2.227-.058-1.265-.07-1.644-.07-4.85 0-3.196.012-3.584.07-4.85.054-1.17.249-1.805.418-2.227.217-.559.478-.96.896-1.382.42-.419.823-.677 1.382-.895.421-.17 1.057-.364 2.227-.418 1.266-.058 1.644-.07 4.85-.07M12 0C8.741 0 8.333.014 7.053.072 5.775.131 4.902.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.902.131 5.775.072 7.053.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.059 1.277.261 2.15.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 1.277-.059 2.15-.261 2.913-.558.788-.306 1.459-.717 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.058-1.28.072-1.689.072-4.948 0-3.259-.014-3.667-.072-4.947-.059-1.277-.261-2.15-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </button>
              <button className="text-gray-400 hover:text-white transition-colors p-2 rounded-full bg-gray-700/50 hover:bg-gray-700">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
              </button>
              <button className="text-gray-400 hover:text-white transition-colors p-2 rounded-full bg-gray-700/50 hover:bg-gray-700">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </motion.article>
    </div>
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
