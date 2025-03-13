import { ReactNode } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";

type Props = {
  children: ReactNode;
  params: { slug?: string };
};

export default function EventosLayout({ children, params }: Props) {
  return (
    <>
      <div className="absolute inset-0 z-0"></div>

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
              basePath="eventos"
              baseName="Eventos"
            />
          </div>

          {/* Conteúdo principal */}
          <main className="flex-1 w-full">{children}</main>
        </div>
      </div>

      {/* Decoração visual */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-40 -left-20 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-40 left-20 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>
    </>
  );
}
