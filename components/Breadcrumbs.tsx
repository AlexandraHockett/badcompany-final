import Link from "next/link";

type BreadcrumbsProps = {
  slug?: string;
  basePath: string;
  baseName: string;
};

export default function Breadcrumbs({
  slug,
  basePath,
  baseName,
}: BreadcrumbsProps) {
  // Se não houver slug, apenas mostrar o link base
  const pathSegments = slug ? slug.split("/") : [];

  // Função para formatar o texto do segmento (capitalizar primeira letra, substituir hífens por espaços)
  const formatSegment = (segment: string): string => {
    return segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <nav
      aria-label="Breadcrumbs"
      className="flex flex-wrap items-center text-sm text-gray-200 mb-4 z-20 w-full"
    >
      <div className="flex items-center space-x-1 md:space-x-2 flex-wrap">
        {/* Link para Home */}
        <Link href="/" className="hover:text-white transition-colors">
          Home
        </Link>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4 text-gray-400"
        >
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>

        {/* Link Base (ex: "Sobre") */}
        <Link
          href={`/${basePath}`}
          className="hover:text-white transition-colors"
        >
          {baseName}
        </Link>

        {/* Links adicionais para cada segmento do caminho */}
        {pathSegments.length > 0 && (
          <>
            {pathSegments.map((segment, index) => {
              // Construir o caminho para este segmento
              const currentPath = `/${basePath}/${pathSegments.slice(0, index + 1).join("/")}`;

              // Se for o último segmento, não torna clicável
              const isLastSegment = index === pathSegments.length - 1;

              return (
                <span key={segment} className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 text-gray-400 mx-1"
                  >
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>

                  {isLastSegment ? (
                    <span className="text-white font-medium">
                      {formatSegment(segment)}
                    </span>
                  ) : (
                    <Link
                      href={currentPath}
                      className="hover:text-white transition-colors"
                    >
                      {formatSegment(segment)}
                    </Link>
                  )}
                </span>
              );
            })}
          </>
        )}
      </div>
    </nav>
  );
}
