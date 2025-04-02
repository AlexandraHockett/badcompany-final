"use client";

import { ReactNode, useState, useEffect, CSSProperties } from "react";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

type Props = {
  children: ReactNode;
  params: { slug?: string };
};

// Movendo variáveis que não mudam para fora do componente
const videos = [
  "/videos/video-1.mp4",
  "/videos/video-2.mp4",
  "/videos/video-3.mp4",
  "/videos/video-4.mp4",
  "/videos/video-5.mp4",
  "/videos/video-6.mp4",
  "/videos/video-7.mp4",
  "/videos/video-8.mp4",
  "/videos/video-9.mp4",
];

export default function SobreLayout({ children, params }: Props) {
  // Verificar se estamos no client-side para evitar erros de hidratação
  const [isBrowser, setIsBrowser] = useState(false);

  // Estado para controlar qual vídeo está sendo exibido
  const [currentVideo, setCurrentVideo] = useState(1);

  // Estado para controlar a largura da janela
  const [windowWidth, setWindowWidth] = useState(0);

  // Verificar se estamos no client-side antes de executar código específico do navegador
  useEffect(() => {
    setIsBrowser(true);
  }, []);

  // Acompanhar o redimensionamento da janela
  useEffect(() => {
    if (!isBrowser) return;

    // Definir largura inicial
    setWindowWidth(window.innerWidth);

    // Atualizar a largura quando a janela for redimensionada
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    // Limpar o evento quando o componente for desmontado
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isBrowser]);

  // Mudar o vídeo com base na rota (slug)
  useEffect(() => {
    // Executar apenas no client-side
    if (!isBrowser) return;

    // Usar o params diretamente
    if (params?.slug) {
      // Lógica para escolher um vídeo específico baseado no slug
      if (params.slug.includes("historia")) {
        setCurrentVideo(2);
      } else if (params.slug.includes("equipe")) {
        setCurrentVideo(3);
      } else {
        setCurrentVideo(1);
      }

      // Apenas para debug
      console.log("Slug atual:", params.slug);
      console.log("Vídeo selecionado:", currentVideo);
    }
  }, [params?.slug, isBrowser, currentVideo]);

  // Função para obter os estilos com base no vídeo atual
  const getVideoStyles = (videoIndex: number): CSSProperties => {
    // Estilo base para todos os vídeos
    const baseStyle: CSSProperties = {
      objectPosition: windowWidth >= 1024 ? "center 30%" : "center center",
    };

    // Se for o video-2, aplicar zoom real
    if (videoIndex === 1) {
      return {
        ...baseStyle,
        objectFit: "cover" as const,
        transform: "scale(1.3)", // Zoom de 130% (aumenta o conteúdo)
        transformOrigin: "center center", // Ponto central do zoom
      };
    }

    // Para os outros vídeos
    return baseStyle;
  };

  // Função para mudar para o próximo vídeo quando o atual terminar
  const handleVideoEnd = () => {
    if (isBrowser) {
      setCurrentVideo((prev: number) => (prev >= videos.length ? 1 : prev + 1));
      console.log("Vídeo terminado, mudando para o próximo");
    }
  };

  return (
    <>
      <div className="absolute inset-0 z-0 overflow-hidden bg-black">
        {isBrowser && (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-50"
            style={getVideoStyles(currentVideo - 1)}
            onEnded={handleVideoEnd}
            key={videos[currentVideo - 1]}
          >
            <source src={videos[currentVideo - 1]} type="video/mp4" />O teu
            browser não suporta vídeo.
          </video>
        )}
      </div>

      {/* Container do conteúdo */}
      <div className="relative min-h-screen w-full overflow-x-hidden">
        {/* Área de navegação e conteúdo principal */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28 md:pt-36 lg:pt-40 pb-16 relative z-20">
          {/* Espaço extra em dispositivos móveis para evitar conflito com o header */}
          <div className="h-8 sm:h-4 md:h-0"></div>

          {/* Breadcrumbs */}
          <div className="mb-6 md:mb-8">
            <Breadcrumbs
              slug={params?.slug}
              basePath="sobre"
              baseName="Sobre"
            />
          </div>

          {/* Botões para mudar vídeos manualmente (opcional) */}
          {isBrowser && (
            <div className="mb-4 flex space-x-2">
              {videos.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    console.log(`Botão ${index + 1} clicado`);
                    setCurrentVideo(index + 1);
                  }}
                  type="button" // Especificar explicitamente o tipo do botão
                  className={`w-8 h-8 rounded-full ${
                    currentVideo === index + 1 ? "bg-blue-500" : "bg-gray-300"
                  } hover:bg-blue-300 transition-colors cursor-pointer`}
                  aria-label={`Mudar para vídeo ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Conteúdo principal */}
          <main className="flex-1 w-full">{children}</main>
        </div>
      </div>
    </>
  );
}
