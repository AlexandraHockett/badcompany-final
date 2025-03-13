import { NewsArticle } from '@/types/media';

// Dados de Notícias
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
  {
    id: 5,
    title: "Tendências de Música Africana em 2023",
    slug: "tendencias-musica-africana-2023",
    image: "/img/bclandia.jpg",
    thumbnailUrl: "/img/bclandia.jpg",
    date: "2023-09-25",
    author: "DJ Kaze",
    excerpt:
      "A música africana continua a ganhar popularidade global, com ritmos como amapiano, afrobeats e kuduro a dominarem pistas de dança.",
    content:
      "A música africana continua a ganhar popularidade global, com ritmos como amapiano, afrobeats e kuduro a dominarem pistas de dança em todo o mundo. Em Portugal, estes estilos têm encontrado terreno fértil para crescer, especialmente graças a promotores como a BadCompany que há anos apostam na diversidade musical e na valorização de ritmos africanos nas suas festas.",
    views: 1200,
    featured: false,
    tags: ["música africana", "tendências", "amapiano", "afrobeats"],
  },
];

export default newsArticles;