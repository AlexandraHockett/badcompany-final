// File: app/media/galeria/fotos/[folderPath]/page.tsx
// Este é um Server Component por padrão (sem "use client")
import { Suspense } from "react";
import CloudinaryExplorer from "./CloudinaryExplorer"; // Importa o Client Component
import {
  getAlbumImages,
  getCloudinaryAlbumByPath,
  getImageCountInFolder,
} from "@/services/cloudinaryService";

// Função para buscar informações do álbum
async function fetchAlbumData(folderPath: string) {
  // Busca informações básicas do álbum
  const albumInfo = getCloudinaryAlbumByPath(folderPath);

  // Obtém o número real de imagens no álbum
  const totalImages = getImageCountInFolder(folderPath);

  // Busca apenas um lote inicial de imagens (para performance)
  const albumImages = getAlbumImages(folderPath, 24); // 24 imagens por página

  // Função para formatar data
  function formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };

    return new Date(dateString).toLocaleDateString("pt-PT", options);
  }

  return {
    folderPath,
    albumImages,
    totalImages,
    title: albumInfo?.name || `Álbum ${folderPath}`,
    description: albumInfo?.description || "Fotos do evento",
    date: albumInfo?.date ? formatDate(albumInfo.date) : "2023",
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ folderPath: string }>;
}) {
  const resolvedParams = await params; // Desembrulha o params
  const folderPath = resolvedParams.folderPath;
  const albumData = await fetchAlbumData(folderPath);

  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen text-white">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
            <p>Carregando galeria...</p>
          </div>
        </div>
      }
    >
      <CloudinaryExplorer
        folderPath={albumData.folderPath}
        albumImages={albumData.albumImages}
        totalImages={albumData.totalImages}
        title={albumData.title}
        description={albumData.description}
        date={albumData.date}
      />
    </Suspense>
  );
}
