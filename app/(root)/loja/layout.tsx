// app/(root)/loja/layout.tsx
import { ReactNode } from "react";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import Breadcrumbs from "@/components/Breadcrumbs";

type LojaLayoutProps = {
  children: ReactNode;
  params?: { slug?: string };
};

export default function LojaLayout({ children, params }: LojaLayoutProps) {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28 md:pt-36 lg:pt-40 pb-24 relative z-20">
        {/* Espaço extra em dispositivos móveis para evitar conflito com o header */}
        <div className="h-8 sm:h-4 md:h-0"></div>

        {params && (
          <div className="mb-6 md:mb-8">
            <Breadcrumbs slug={params.slug} basePath="loja" baseName="Loja" />
          </div>
        )}
        <main className="flex-1 w-full">{children}</main>
      </div>

      {/* Decoração visual */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-10">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-40 -left-20 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-40 left-20 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>
    </div>
  );
}
