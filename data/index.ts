// Importar dados de outros arquivos
import gallery from "./gallery";
import podcastEpisodes from "./podcasts"; // Importe os episódios de podcast (crie este arquivo se não existir)
import newsArticles from "./news"; // Importe os artigos de notícias (crie este arquivo se não existir)

// Definir seções de mídia (ou importe-as de outro arquivo)
const mediaSections = [
  { id: "photos", label: "Fotos", href: "/media/galeria" },
  { id: "podcast", label: "Podcast", href: "/media/podcast" },
  { id: "news", label: "Notícias", href: "/media/news" },
  // Adicione mais seções conforme necessário
];

// Exportar todos os dados
export default {
  mediaSections,
  podcastEpisodes,
  newsArticles,
  gallery,
};
