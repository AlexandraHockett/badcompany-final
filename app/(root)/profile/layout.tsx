import { ReactNode } from "react";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

type Props = {
  children: ReactNode;
  params: { slug?: string };
};

export default function ProfileLayout({ children, params }: Props) {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      {/* Container do conteúdo */}
      <div className="relative z-10 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28 md:pt-36 lg:pt-40 pb-16">
          {/* Espaço extra em dispositivos móveis */}
          <div className="h-8 sm:h-4 md:h-0"></div>

          {/* Breadcrumbs */}
          <div className="mb-6 md:mb-8">
            <Breadcrumbs
              slug={params?.slug}
              basePath="profile"
              baseName="Profile"
            />
          </div>

          {/* Conteúdo principal */}
          <main className="w-full">{children}</main>
        </div>
      </div>
    </div>
  );
}
