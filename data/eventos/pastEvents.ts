import { Event } from "./eventsContent";

// Lista de eventos passados
const pastEvents: Event[] = [
  {
    id: "bclandia-25",
    title: "BCLândia 25",
    description:
      "O maior festival de cultura alternativa de Portugal com mais de 60 atrações entre shows musicais, performances e arte em uma celebração histórica.",
    longDescription:
      "O Festival BCLândia é o maior evento de cultura alternativa de Portugal e celebrou 25 anos de história! Com mais de 60 atrações entre shows musicais, performances teatrais, exposições de arte e oficinas criativas, o festival foi um marco no calendário cultural da região. Artistas nacionais e internacionais compartilharam os palcos nesta celebração única que aconteceu ao longo de 3 dias intensos, com 4 palcos simultâneos e uma área gastronômica com opções para todos os gostos.",
    date: "2025-03-03T23:59:00",
    location: "Altice Arena, Lisboa",
    address: "Rossio dos Olivais, 1990-231 Lisboa",
    image: "/images/eventos/bclandia.jpg",
    video: "/videos/video-7.mp4",
    price: "35€ - 120€",
    status: "past",
    categories: ["BCLandia"],
    coordinates: {
      lat: 38.768616,
      lng: -9.094229,
    },
    youtubeVideos: [
      "https://www.youtube.com/watch?v=example1",
      "https://www.youtube.com/watch?v=example2",
    ],
    organizador: {
      name: "BadCompany",
      contact: "eventos@badcompany.pt",
    },
  },
  {
    id: "bclandia-2023",
    title: "BCLândia 2023",
    description:
      "A maior edição do festival com mais de 40 artistas em três dias de evento, criando experiências inesquecíveis.",
    longDescription:
      "A edição 2023 do famoso festival BCLândia trouxe mais de 40 artistas em 3 dias de evento, com público recorde e experiências inesquecíveis.",
    date: "2023-06-20T16:00:00",
    time: "16:00 - 04:00",
    location: "MEO Arena",
    address: "Rossio dos Olivais, 1990-231 Lisboa",
    image: "/images/eventos/bclandia.jpg",
    video: "/videos/video-3.mp4",
    gallery: [
      "/images/eventos/bclandia.jpg",
      "/images/eventos/bclandia.jpg",
      "/images/eventos/bclandia.jpg",
    ],
    price: "45€ - 90€",
    status: "past",
    categories: ["Festivais", "BCFest"],
    tags: ["festival", "verão"],
    coordinates: {
      lat: 38.7677,
      lng: -9.0941,
    },
    organizador: {
      name: "BadCompany",
      contact: "eventos@badcompany.pt",
    },
  },
  {
    id: "monsanto-fest-2022",
    title: "Monsanto Fest",
    description:
      "Festival realizado no parque Monsanto, um dos eventos mais populares da BadCompany.",
    longDescription:
      "Festival realizado no parque Monsanto, um dos eventos mais populares da BadCompany com música ao ar livre.",
    date: "2022-08-15T18:00:00",
    location: "Parque Monsanto, Lisboa",
    address: "Parque Florestal de Monsanto, Lisboa",
    image: "/images/eventos/bclandia.jpg",
    video: "/videos/video-9.mp4",
    price: "25€",
    status: "past",
    categories: ["Festivais", "música"],
    tags: ["verão", "festival", "monsanto"],
    coordinates: {
      lat: 38.7223,
      lng: -9.1903,
    },
    organizador: {
      name: "BadCompany",
      contact: "eventos@badcompany.pt",
    },
  },
  {
    id: "bc-best-whiteEmotion-24-2022",
    title: "BC Best White Emotion",
    description:
      "Elegância e glamour em uma noite onde todos se vestem de branco, em um ambiente sofisticado à beira-mar.",
    longDescription:
      "Elegância e glamour reunidos em uma noite onde todos se vestem de branco, em um ambiente sofisticado com muita música e entretenimento.",
    date: "2022-07-10T21:00:00",
    location: "Praia da Costa da Caparica, Almada",
    address: "Praia da Costa da Caparica, Almada",
    image: "/images/eventos/bclandia.jpg",
    video: "/videos/video-8.mp4",
    price: "30€",
    status: "past",
    categories: ["Nacionais", "festa"],
    tags: ["white party", "verão", "praia"],
    coordinates: {
      lat: 38.6417,
      lng: -9.2357,
    },
    organizador: {
      name: "BadCompany",
      contact: "eventos@badcompany.pt",
    },
  },
  {
    id: "a-casa-assombrada-2022",
    title: "A Casa Assombrada 2022",
    description:
      "Evento temático de Halloween em um casarão antigo transformado em uma experiência terrorífica com performances ao vivo.",
    longDescription:
      "Evento temático de Halloween que transformou um casarão antigo em uma verdadeira casa do terror, com performances ao vivo e muitas surpresas assustadoras.",
    date: "2022-10-31T20:00:00",
    location: "Palácio da Ajuda, Lisboa",
    address: "Largo da Ajuda, 1349-021 Lisboa",
    image: "/images/eventos/bclandia.jpg",
    video: "/videos/video-1.mp4",
    youtubeVideos: [
      "https://www.youtube.com/watch?v=Q8Qsau_wEbA",
      "https://www.youtube.com/watch?v=anotherVideoID",
    ],
    price: "20€",
    status: "past",
    categories: ["Nacionais", "temático"],
    tags: ["halloween", "terror", "festa temática"],
    coordinates: {
      lat: 38.7066,
      lng: -9.1994,
    },
    organizador: {
      name: "BadCompany",
      contact: "eventos@badcompany.pt",
    },
  },
  {
    id: "bissau-xperience-2022",
    title: "Bissau Xperience",
    description:
      "Projeto cultural que celebra a música e as tradições da Guiné-Bissau em uma série de eventos durante seis meses.",
    longDescription:
      "Projeto cultural que promoveu a música e a cultura da Guiné-Bissau em uma série de eventos durante 6 meses.",
    date: "2022-04-15T19:00:00",
    location: "Bissau, Guiné-Bissau",
    address: "Centro Cultural de Bissau, Guiné-Bissau",
    image: "/images/eventos/bclandia.jpg",
    video: "/videos/video-2.mp4",
    price: "15€",
    status: "past",
    categories: ["Internacionais", "cultural"],
    tags: ["áfrica", "cultura", "música africana"],
    coordinates: {
      lat: 11.8037,
      lng: -15.1804,
    },
    organizador: {
      name: "BadCompany",
      contact: "eventos@badcompany.pt",
    },
    international: true,
  },

  {
    id: "bc-best-21",
    title: "BCBEST 2021",
    description:
      "O melhor festival em Portugal em tempos de pandemia",
    longDescription:
      "O melhor festival em Portugal em tempos de pandemia",
    date: "2021-08-28T16:00:00",
    time: "16:00 - 04:00",
    location: "MEO Arena",
    address: "Rossio dos Olivais, 1990-231 Lisboa",
    image: "/images/eventos/bclandia.jpg",
    video: "/images/eventos/bclandia.jpg",
    price: "45€ - 90€",
    status: "past",
    categories: ["Festivais", "BCFest"],
    tags: ["festival", "verão"],
    coordinates: {
      lat: 38.7677,
      lng: -9.0941,
    },
    organizador: {
      name: "BadCompany",
      contact: "eventos@badcompany.pt",
    },
  },
  {
    id: "badcompany-fest-2019",
    title: "BadCompany Fest 2019",
    description:
      "Uma das maiores festas de Afro Music em Lisboa, com Soraia Ramos, Força Suprema, Scró Q Cuia e muitos outros artistas.",
    longDescription:
      "O evento considerado uma das maiores festas de Afro Music em Lisboa apresenta um cartaz com vários destaques: Soraia Ramos, Força Suprema, Scró Q Cuia, Edgar Domingos, Monsta, Deezy, Irina Barros, entre outros.",
    date: "2019-12-15T20:00:00",
    location: "MEO Arena",
    address: "Rossio dos Olivais, 1990-231 Lisboa",
    image: "/images/eventos/bcfest-19.jpg",
    video: "/videos/video-3.mp4",
    youtubeVideos: [
      "https://www.youtube.com/watch?v=tCuRsIh0Ab8",
      "https://www.youtube.com/watch?v=xijRRmTmGBA",
      "https://www.youtube.com/watch?v=FF3o7wQZKIg",
      "https://www.youtube.com/watch?v=Q8Qsau_wEbA",
    ],
    price: "20€",
    status: "past",
    categories: ["BadCompanyFest"],
    tags: ["halloween", "terror", "festa temática"],
    coordinates: {
      lat: 38.7066,
      lng: -9.1994,
    },
    organizador: {
      name: "BadCompany",
      contact: "eventos@badcompany.pt",
    },
  },
  {
    id: "casa-assombrada-2019",
    title: "A Casa Assombrada 2019",
    description:
      "A primeira edição do evento de Halloween que transformou a discoteca Kristal em um cenário de terror com performances surpreendentes.",
    longDescription:
      "Evento temático de Halloween que transformou a discoteca Kristal em uma verdadeira casa do terror, com performances ao vivo e muitas surpresas assustadoras.",
    date: "2019-10-31T20:00:00",
    location: "Krystal Grand Club Lisbon",
    address: "R. da Cintura do Porto de Lisboa 40, 1950-326 Lisboa",
    image: "/images/eventos/casa-assombrada-19.jpg",
    video: "/videos/video-3.mp4",
    youtubeVideos: ["https://youtu.be/9G7ai4gPiZ0"],
    price: "20€",
    status: "past",
    categories: ["Casa Assombrada"],
    tags: ["halloween", "terror", "festa temática"],
    coordinates: {
      lat: 38.7066,
      lng: -9.1994,
    },
    organizador: {
      name: "BadCompany",
      contact: "eventos@badcompany.pt",
    },
  },
];

// Garante que todos os eventos passados tenham youtubeVideos definido
pastEvents.forEach((event) => {
  if (!event.youtubeVideos) event.youtubeVideos = [];
});

// Função para obter eventos passados com informações simplificadas
export const getPastEventsData = () => {
  return pastEvents
    .map((event) => ({
      id: event.id,
      title: event.title,
      category: event.categories?.[0] || "Evento",
      year: new Date(event.date).getFullYear(),
      image: event.image,
      video: event.video || null,
      location: event.location,
      testimonial: event.description,
      youtubeVideos: event.youtubeVideos || [],
    }))
    .sort((a, b) => b.year - a.year);
};

// Função para obter um evento passado específico pelo ID
export const getPastEventById = (id: string) => {
  return pastEvents.find((event) => event.id === id);
};

// Exporta a lista completa de eventos passados
export default pastEvents;
