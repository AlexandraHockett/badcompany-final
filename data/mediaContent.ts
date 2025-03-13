// Dados das seções de mídia
export const mediaSections = [
  { title: "Podcasts", slug: "podcasts", image: "/img/bclandia.jpg" },
  { title: "Notícias", slug: "noticias", image: "/img/bclandia.jpg" },
  { title: "Galeria", slug: "galeria", image: "/img/bclandia.jpg" },
];

// Interface para Podcast
export interface Podcast {
  id: number;
  title: string;
  description: string;
  date: string;
  videoUrl: string;
  thumbnailUrl: string;
  hosts: string[];
  guests?: string[];
  topics: string[];
  duration: string;
  episodeNumber: number;
  isLive: boolean;
}

// Dados dos Podcasts (adaptados de newsArticles)
export const podcastEpisodes: Podcast[] = [
  {
    id: 1,
    title: "Badcompany não é uma organização, mas sim uma família",
    description:
      'São conhecidos por organizar festas por todo o país (Portugal). O projecto em ascensão partiu de dois jovens Anyfá e Sanger que dão a cara pela Badcompany "má vida", eles que são os responsáveis por aquecer várias noites de Lisboa e não só, causando por onde passam um enorme alvoroço, a chamada família da "má vida". A chave do sucesso passa por fazer com que os clientes sintam-se em casa, tal como uma família.',
    date: "2015-08-10",
    videoUrl: "https://www.youtube.com/embed/Kh6vbIWFXzU",
    thumbnailUrl: "/img/bclandia.jpg",
    hosts: ["Rosa De Sousa"], // Autor como host
    guests: ["Anyfá", "Sanger"], // Pessoas mencionadas no conteúdo
    topics: ["entrevista", "evento", "lisboa"],
    duration: "0:00:00", // Duração desconhecida, placeholder
    episodeNumber: 1,
    isLive: false, // Não há indicação de ser ao vivo
  },
  {
    id: 2,
    title: "Entrevista com Anyfá - O homem de sorriso contagiante",
    description:
      "Anyfá, o homem de sorriso contagiante! Obrigada por nos ter dado a oportunidade de entrevistar uma pessoa como ele, alguém que fez também da juventude momentos incríveis. Falámos imenso, o Anyfá deu a conhecer os projetos de verão, falou da sua equipa, da sua família e de como se dá com as mães das suas crianças, do apoio que dá aos novos artistas. O Anyfá também deu-nos vários conselhos e mostrou o seu orgulho com o nosso projeto. Falámos de haters também e das suas festas mais populares e muito mais!",
    date: "2022-08-29",
    videoUrl: "https://www.youtube.com/embed/jmh_17spfpU",
    thumbnailUrl: "/img/bclandia.jpg",
    hosts: ["Equipa BadCompany"], // Autor como host
    guests: ["Anyfá"], // Pessoa entrevistada
    topics: ["entrevista", "anyfa", "projetos"],
    duration: "0:00:00", // Duração desconhecida, placeholder
    episodeNumber: 2,
    isLive: false,
  },
  {
    id: 3,
    title: "Anyfa e Mc Suxexo na RDP África",
    description:
      'Anyfa e Mc Suxexo estiveram à conversa com Miguel Paraíso e Mangope no programa "Na corda bamba" da RDP África. Uma entrevista reveladora onde discutiram os próximos passos da BadCompany e projetos futuros.',
    date: "2023-12-12",
    videoUrl: "https://www.youtube.com/embed/7LlDA1CLH48",
    thumbnailUrl: "/img/bclandia.jpg",
    hosts: ["Miguel Paraíso", "Mangope"], // Apresentadores do programa
    guests: ["Anyfa", "Mc Suxexo"], // Convidados da entrevista
    topics: ["rádio", "entrevista", "anyfa", "mc suxexo"],
    duration: "0:00:00", // Duração desconhecida, placeholder
    episodeNumber: 3,
    isLive: false,
  },
  {
    id: 4,
    title: "BC Fest 2023: Um Sucesso Absoluto",
    description:
      "O BC Fest 2023 foi um marco na história da BadCompany, reunindo milhares de pessoas para celebrar música e cultura. Com mais de 20 artistas nacionais e internacionais distribuídos por 3 palcos, o evento superou todas as expectativas e consolidou-se como um dos maiores festivais urbanos de Portugal.",
    date: "2023-10-01",
    videoUrl: "https://www.youtube.com/embed/-P2oVT0RVe4",
    thumbnailUrl: "/img/bclandia.jpg",
    hosts: ["Equipa BadCompany"], // Autor como host
    topics: ["festival", "evento", "música"],
    duration: "0:00:00", // Duração desconhecida, placeholder
    episodeNumber: 4,
    isLive: false,
  },
];

// Interface para Notícia
export interface NewsArticle {
  id: number;
  title: string;
  slug: string;
  image: string;
  thumbnailUrl: string;
  date: string;
  author: string;
  excerpt: string;
  content: string;
  videoUrl?: string;
  videoThumbnail?: string;
  views?: number;
  featured: boolean;
  tags: string[];
}

// Dados de Notícias (mantidos como estão)
export const newsArticles: NewsArticle[] = [
  {
    id: 1,
    title: "Badcompany não é uma organização, mas sim uma família",
    slug: "badcompany-nao-e-organizacao-mas-familia",
    image: "/img/bclandia.jpg",
    thumbnailUrl: "/img/bclandia.jpg",
    date: "2015-08-10",
    author: "Rosa De Sousa",
    excerpt:
      "São conhecidos por organizar festas por todo o país (Portugal). O projecto em ascensão partiu de dois jovens Anyfá e Sanger que dão a cara pela Badcompany...",
    content:
      'São conhecidos por organizar festas por todo o país (Portugal). O projecto em ascensão partiu de dois jovens Anyfá e Sanger que dão a cara pela Badcompany "má vida", eles que são os responsáveis por aquecer várias noites de Lisboa e não só, causando por onde passam um enorme alvoroço, a chamada família da "má vida". A chave do sucesso passa por fazer com que os clientes sintam-se em casa, tal como uma família.',
    videoUrl: "https://www.youtube.com/embed/Kh6vbIWFXzU",
    views: 344,
    featured: true,
    tags: ["entrevista", "evento", "lisboa"],
  },
  {
    id: 2,
    title: "Entrevista com Anyfá - O homem de sorriso contagiante",
    slug: "entrevista-anyfa-homem-sorriso-contagiante",
    image: "/img/bclandia.jpg",
    thumbnailUrl: "/img/bclandia.jpg",
    date: "2022-08-29",
    author: "Equipa BadCompany",
    excerpt:
      "Anyfá, o homem de sorriso contagiante, fala dos projetos de verão, da sua equipa, da sua família e de como se dá com as mães das suas crianças...",
    content:
      "Anyfá, o homem de sorriso contagiante! Obrigada por nos ter dado a oportunidade de entrevistar uma pessoa como ele, alguém que fez também da juventude momentos incríveis. Falámos imenso, o Anyfá deu a conhecer os projetos de verão, falou da sua equipa, da sua família e de como se dá com as mães das suas crianças, do apoio que dá aos novos artistas. O Anyfá também deu-nos vários conselhos e mostrou o seu orgulho com o nosso projeto. Falámos de haters também e das suas festas mais populares e muito mais!",
    videoUrl: "https://www.youtube.com/embed/jmh_17spfpU",
    views: 1136,
    featured: true,
    tags: ["entrevista", "anyfa", "projetos"],
  },
  {
    id: 3,
    title: "Anyfa e Mc Suxexo na RDP África",
    slug: "anyfa-mc-suxexo-rdp-africa",
    image: "/img/bclandia.jpg",
    thumbnailUrl: "/img/bclandia.jpg",
    date: "2023-12-12",
    author: "RDP África",
    excerpt:
      'Anyfa e Mc Suxexo estiveram à conversa com Miguel Paraíso e Mangope no programa "Na corda bamba" da RDP África.',
    content:
      'Anyfa e Mc Suxexo estiveram à conversa com Miguel Paraíso e Mangope no programa "Na corda bamba" da RDP África. Uma entrevista reveladora onde discutiram os próximos passos da BadCompany e projetos futuros.',
    videoUrl: "https://www.youtube.com/embed/7LlDA1CLH48",
    views: 1320,
    featured: false,
    tags: ["rádio", "entrevista", "anyfa", "mc suxexo"],
  },
  {
    id: 4,
    title: "BC Fest 2023: Um Sucesso Absoluto",
    slug: "bc-fest-2023-sucesso-absoluto",
    image: "/img/bclandia.jpg",
    thumbnailUrl: "/img/bclandia.jpg",
    date: "2023-10-01",
    author: "Equipa BadCompany",
    excerpt:
      "O BC Fest 2023 foi um marco na história da BadCompany, reunindo milhares de pessoas para celebrar música e cultura.",
    content:
      "O BC Fest 2023 foi um marco na história da BadCompany, reunindo milhares de pessoas para celebrar música e cultura. Com mais de 20 artistas nacionais e internacionais distribuídos por 3 palcos, o evento superou todas as expectativas e consolidou-se como um dos maiores festivais urbanos de Portugal.",
    videoUrl: "https://www.youtube.com/embed/-P2oVT0RVe4",
    views: 3500,
    featured: true,
    tags: ["festival", "evento", "música"],
  },
];

export default mediaSections;
