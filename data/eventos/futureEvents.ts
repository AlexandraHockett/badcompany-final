// data/futureEvents.ts
import { Event } from "./eventsContent";

// Lista de eventos futuros
const futureEvents: Event[] = [
  {
    id: "bclandia-25",
    title: "BCLANDIA 25",
    description:
      "O maior festival de cultura alternativa de Portugal regressa para uma edição comemorativa",
    longDescription: `O Festival BCLândia é o maior evento de cultura alternativa de Portugal e celebra 25 anos de história em 2025! 
    
    Com mais de 60 atrações entre shows musicais, performances teatrais, exposições de arte e oficinas criativas, o festival é um marco no calendário cultural da região. Artistas nacionais e internacionais compartilharão os palcos nesta celebração única.
    
    Este ano, o festival acontecerá ao longo de 3 dias intensos, com 4 palcos simultâneos e uma área gastronômica com opções para todos os gostos. Não perca a oportunidade de vivenciar esta experiência única que reúne artistas locais e internacionais em um ambiente de celebração e intercâmbio cultural.`,
    date: "2025-03-03T23:59:00",
    time: "16:00 - 23:00",
    location: "Altice Arena, Lisboa",
    address: "Rossio dos Olivais, 1990-231 Lisboa",
    image: "/images/eventos/bclandia.jpg",
    video: "/videos/video-7.mp4",
    gallery: [
      "/images/eventos/bclandia.jpg",
      "/images/eventos/bclandia.jpg",
      "/images/eventos/bclandia.jpg",
    ],
    price: "A partir de 35€",
    status: "upcoming",
    featured: true,
    categories: ["bclandia"],
    tags: ["verão", "cultura alternativa", "25 anos"],
    coordinates: {
      lat: 38.768616,
      lng: -9.094229,
    },
    tickets: {
      available: false,
      url: "https://3cket.com/event/bclandia-25/",
      price: "35€ - 120€",
    },
    organizador: {
      name: "BCLândia Productions",
      contact: "contato@bclandia.com.pt",
    },
  },
  {
    id: "bclandia-24",
    title: "BCLANDIA 24",
    description:
      "O maior festival de cultura alternativa de Portugal regressa para uma edição comemorativa",
    longDescription: `O Festival BCLândia é o maior evento de cultura alternativa de Portugal e celebra 25 anos de história em 2025! 
    
    Com mais de 60 atrações entre shows musicais, performances teatrais, exposições de arte e oficinas criativas, o festival é um marco no calendário cultural da região. Artistas nacionais e internacionais compartilharão os palcos nesta celebração única.
    
    Este ano, o festival acontecerá ao longo de 3 dias intensos, com 4 palcos simultâneos e uma área gastronômica com opções para todos os gostos. Não perca a oportunidade de vivenciar esta experiência única que reúne artistas locais e internacionais em um ambiente de celebração e intercâmbio cultural.`,
    date: "2025-03-03T23:59:00",
    time: "16:00 - 23:00",
    location: "Altice Arena, Lisboa",
    address: "Rossio dos Olivais, 1990-231 Lisboa",
    image: "/images/eventos/bclandia.jpg",
    video: "/videos/video-7.mp4",
    gallery: [
      "/images/eventos/bclandia.jpg",
      "/images/eventos/bclandia.jpg",
      "/images/eventos/bclandia.jpg",
    ],
    price: "A partir de 35€",
    status: "upcoming",
    featured: true,
    categories: ["bclandia"],
    tags: ["verão", "cultura alternativa", "25 anos"],
    coordinates: {
      lat: 38.768616,
      lng: -9.094229,
    },
    tickets: {
      available: true,
      url: "https://3cket.com/event/bclandia-25/",
      price: "35€ - 120€",
    },
    organizador: {
      name: "BCLândia Productions",
      contact: "contato@bclandia.com.pt",
    },
  },
  {
    id: "bc-sessions-noite-eletronica",
    title: "BC SESSIONS: NOITE ELETRÓNICA",
    description:
      "Uma noite de música eletrónica com os melhores DJs da cena nacional",
    date: "2024-05-15T22:00:00",
    time: "22:00 - 06:00",
    location: "Underground Club, Porto",
    address: "Rua dos Mercadores, 140, 4050-374 Porto",
    image: "/images/eventos/bclandia.jpg",
    video: "/videos/video-6.mp4",
    price: "15€",
    status: "upcoming",
    categories: ["música eletrónica", "festa", "noite"],
    tags: ["dj", "underground", "eletrónica"],
    tickets: {
      available: true,
      url: "https://3cket.com/",
      price: "15€",
    },
    organizador: {
      name: "BCLândia Productions",
      contact: "eventos@bclandia.com.pt",
    },
  },
  {
    id: "workshop-producao-musical",
    title: "WORKSHOP DE PRODUÇÃO MUSICAL",
    description:
      "Aprenda técnicas avançadas de produção musical com produtores profissionais",
    date: "2024-04-20T14:00:00",
    time: "14:00 - 19:00",
    location: "Estúdios BCLândia, Lisboa",
    address: "Avenida da Liberdade, 10, Lisboa",
    image: "/images/eventos/bclandia.jpg",
    video: "/videos/video-8.mp4",
    price: "50€",
    status: "upcoming",
    categories: ["workshop", "música", "educação"],
    tags: ["produção musical", "formação", "estúdio"],
    tickets: {
      available: true,
      url: "https://3cket.com/",
      price: "50€",
    },
    organizador: {
      name: "BCLândia Academy",
      contact: "academia@bclandia.com.pt",
    },
  },
];

// Garante que todos os eventos futuros tenham youtubeVideos definido
futureEvents.forEach((event) => {
  if (!event.youtubeVideos) event.youtubeVideos = [];
});

// Função para obter eventos futuros simplificados
export const getFutureEventsData = () => {
  return futureEvents.map((event) => ({
    id: event.id,
    title: event.title,
    description: event.description,
    date: event.date,
    time: event.time,
    location: event.location,
    image: event.image,
    price: event.price || "Consultar",
    categories: event.categories || [],
    tickets: event.tickets,
  }));
};

// Função para obter eventos em destaque
export const getFeaturedFutureEvents = () => {
  return futureEvents.filter((event) => event.featured);
};

// Função para obter um evento futuro específico pelo ID
export const getFutureEventById = (id: string) => {
  return futureEvents.find((event) => event.id === id);
};

// Exporta a lista completa de eventos futuros
export default futureEvents;
