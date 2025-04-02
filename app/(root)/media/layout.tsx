import { ReactNode } from "react";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

type Props = {
  children: ReactNode;
  params: { slug?: string };
};

export default function MediaLayout({ children, params }: Props) {
  return (
    <>
      <div className="absolute inset-0 z-0">
        {/* Fundo alternativo para a seção de mídia */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-indigo-900/30 to-gray-900"></div>

        {/* Grade de pontos decorativa */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)",
              backgroundSize: "30px 30px",
            }}
          ></div>
        </div>
      </div>

      {/* Container do conteúdo */}
      <div className="relative min-h-screen w-full overflow-x-hidden">
        {/* Área de navegação e conteúdo principal */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28 md:pt-36 lg:pt-40 pb-16 relative z-20">
          {/* Espaço extra em dispositivos móveis para evitar conflito com o header */}
          <div className="h-8 sm:h-4 md:h-0"></div>

          {/* Breadcrumbs */}
          <div className="mb-6 md:mb-8 animate-fade-in">
            <Breadcrumbs
              slug={params?.slug}
              basePath="media"
              baseName="Media"
            />
          </div>

          {/* Conteúdo principal */}
          <main className="flex-1 w-full">{children}</main>
        </div>
      </div>

      {/* Decoração visual personalizada para mídia - sem bolhas */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        {/* Equalizador estilizado */}
        <div className="absolute bottom-20 left-10 opacity-10">
          <div className="flex items-end space-x-1">
            {[40, 20, 60, 30, 70, 25, 55, 45, 65, 35, 50, 25, 40].map(
              (height, index) => (
                <div
                  key={index}
                  className="w-2 bg-purple-400"
                  style={{ height: `${height}px` }}
                ></div>
              )
            )}
          </div>
        </div>

        {/* Linhas diagonais sutis */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(45deg, rgba(139, 92, 246, 0.5) 25%, transparent 25%, transparent 50%, rgba(139, 92, 246, 0.5) 50%, rgba(139, 92, 246, 0.5) 75%, transparent 75%, transparent)",
            backgroundSize: "100px 100px",
          }}
        ></div>
      </div>
    </>
  );
}
