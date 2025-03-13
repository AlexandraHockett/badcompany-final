import { Podcast } from '@/types/media';

// Dados dos Podcasts
export const podcastEpisodes: Podcast[] = [
  {
    id: 1,
    title: "O Futuro da Música Eletrônica em Portugal",
    description:
      "Neste episódio exploramos as tendências emergentes da música eletrônica em Portugal, desde o techno underground até os eventos mainstream. Conversamos com DJs e produtores sobre o que podemos esperar para o futuro da cena.",
    date: "2024-02-25",
    videoUrl: "https://www.youtube.com/embed/C0DPdy98e4c",
    thumbnailUrl: "/img/bclandia.jpg",
    hosts: ["DJ Kaze", "Maria Silva"],
    guests: ["Pedro Vasconcelos", "Ana Flores"],
    topics: ["música eletrônica", "techno", "portugal", "tendências"],
    duration: "1:24:35",
    episodeNumber: 1,
    isLive: true,
  },
  {
    id: 2,
    title: "Evolução do Drum & Bass na Cena Portuguesa",
    description:
      "Uma conversa fascinante sobre como o Drum & Bass se desenvolveu em Portugal nas últimas duas décadas. Com convidados especiais que ajudaram a moldar a cena, discutimos a evolução sonora e cultural deste gênero no país.",
    date: "2024-03-10",
    videoUrl: "https://www.youtube.com/embed/5qap5aO4i9A",
    thumbnailUrl: "/img/bclandia.jpg",
    hosts: ["DJ Kaze", "Maria Silva"],
    guests: ["Carlos Mendes", "Beatriz Santos"],
    topics: ["drum & bass", "jungle", "portugal", "história musical"],
    duration: "1:35:22",
    episodeNumber: 2,
    isLive: true,
  },
  {
    id: 3,
    title: "A Influência da Música Africana na Cena Eletrônica Global",
    description:
      "Exploramos as raízes africanas de muitos estilos de música eletrônica contemporânea e como produtores de todo o mundo estão incorporando elementos de afrobeat, kuduro e amapiano em suas produções.",
    date: "2024-03-25",
    videoUrl: "https://www.youtube.com/embed/ceqgwo7U28Y",
    thumbnailUrl: "/img/bclandia.jpg",
    hosts: ["DJ Kaze", "Maria Silva"],
    guests: ["DJ Marfox", "Nídia Minaj"],
    topics: [
      "afrobeat",
      "kuduro",
      "amapiano",
      "música africana",
      "influências culturais",
    ],
    duration: "1:47:10",
    episodeNumber: 3,
    isLive: true,
  },
  {
    id: 4,
    title: "Sustentabilidade e Eventos: O Futuro dos Festivais",
    description:
      "Como os festivais e eventos de música podem se tornar mais sustentáveis? Neste episódio, conversamos com organizadores e especialistas sobre práticas ecológicas e como reduzir o impacto ambiental sem comprometer a experiência.",
    date: "2024-04-05",
    videoUrl: "https://www.youtube.com/embed/21qNxnCS8WU",
    thumbnailUrl: "/img/bclandia.jpg",
    hosts: ["DJ Kaze", "Maria Silva"],
    guests: ["João Carvalho", "Sofia Mendonça"],
    topics: ["sustentabilidade", "festivais", "ecologia", "eventos"],
    duration: "1:28:45",
    episodeNumber: 4,
    isLive: true,
  },
  {
    id: 5,
    title: "A Revolução do Home Studio: Produção Musical Acessível",
    description:
      "Analisamos como a tecnologia democratizou a produção musical, permitindo que artistas criem música profissional em casa. Do equipamento essencial às melhores práticas, este é um guia para quem quer começar no mundo da produção.",
    date: "2024-04-20",
    videoUrl: "https://www.youtube.com/embed/1ZYbU82GVz4",
    thumbnailUrl: "/img/bclandia.jpg",
    hosts: ["DJ Kaze", "Maria Silva"],
    guests: ["Miguel Teixeira", "Carolina Duarte"],
    topics: [
      "produção musical",
      "home studio",
      "tecnologia",
      "daw",
      "tutoriais",
    ],
    duration: "1:52:30",
    episodeNumber: 5,
    isLive: false,
  },
];

export default podcastEpisodes;
