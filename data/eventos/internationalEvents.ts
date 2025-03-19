import { Event } from "./eventsContent";

// Lista de eventos internacionais
const internationalEvents: Event[] = [
  {
    id: "Londres",
    title: "The Indigo Tour London",
    description: "Evento realizado no espaço The O2, em Londres.",
    date: "2022-09-15T20:00:00",
    location: "Londres, Inglaterra",
    address: "The O2 Arena, Peninsula Square, London SE10 0DX, United Kingdom",
    image: "/images/eventos/bclandia.jpg",
    status: "past",
    international: true,
    coordinates: {
      lat: 51.5074,
      lng: -0.1278,
    },
    categories: ["música", "tour internacional"],
    tags: ["rock", "international"],
  },
  {
    id: "Suíça",
    title: "European Connection Switzerland",
    description: "Presença da BadCompany na Suíça durante a tour europeia.",
    date: "2022-07-22T19:00:00",
    location: "Zurique, Suíça",
    address: "Hallenstadion, Wallisellenstrasse 45, 8050 Zürich, Switzerland",
    image: "/images/eventos/bclandia.jpg",
    status: "past",
    international: true,
    coordinates: {
      lat: 47.3769,
      lng: 8.5417,
    },
    categories: ["música", "tour europeu"],
    tags: ["internacional", "europa"],
  },
  {
    id: "guinea-bissau-festival",
    title: "Bissau Xperience",
    description:
      "Festival de 6 meses para promover a cultura e música da Guiné-Bissau.",
    date: "2021-11-15T18:00:00",
    location: "Bissau, Guiné-Bissau",
    address: "Centro Cultural Português, Bissau, Guiné-Bissau",
    image: "/images/eventos/bclandia.jpg",
    status: "past",
    international: true,
    coordinates: {
      lat: 11.8037,
      lng: -15.1804,
    },
    categories: ["festival", "cultura"],
    tags: ["internacional", "africano"],
  },
  {
    id: "brazil-tour-2022",
    title: "Energia Brasil Tour",
    description:
      "Tour de 21 dias com eventos em Fortaleza, Rio de Janeiro e São Paulo.",
    date: "2022-01-10T21:00:00",
    location: "São Paulo, Brasil",
    address:
      "Allianz Parque, Av. Presidente Vargas, 5501 - Água Branca, São Paulo - SP, Brazil",
    image: "/images/eventos/bclandia.jpg",
    status: "past",
    international: true,
    coordinates: {
      lat: -23.5505,
      lng: -46.6333,
    },
    categories: ["música", "tour internacional"],
    tags: ["brasileiro", "latin"],
  },
  {
    id: "luxembourg-event",
    title: "Luxembourg Connexion",
    description: "Presença da BadCompany no centro de Luxemburgo.",
    date: "2023-05-18T20:00:00",
    location: "Luxemburgo",
    address:
      "Rockhal, 5 Avenue duRock'n'Roll, 4361 Esch-sur-Alzette, Luxembourg",
    image: "/images/eventos/bclandia.jpg",
    video: "/videos/video-4.mp4",
    status: "past",
    international: true,
    coordinates: {
      lat: 49.5039,
      lng: 5.9339,
    },
    categories: ["música", "evento internacional"],
    tags: ["europa", "luxemburgo"],
  },
];

// Garante que todos os eventos internacionais tenham youtubeVideos definido
internationalEvents.forEach((event) => {
  if (!event.youtubeVideos) event.youtubeVideos = [];
});

// Função para obter eventos internacionais com localização para o mapa
export const getInternationalEventsForMap = () => {
  return internationalEvents.map((event) => ({
    id: event.id,
    title: event.title,
    location: event.location,
    coordinates: event.coordinates,
    image: event.image,
    description: event.description,
    date: event.date,
  }));
};

// Função para obter um evento internacional específico pelo ID
export const getInternationalEventById = (id: string) => {
  return internationalEvents.find((event) => event.id === id);
};

// Exporta a lista completa de eventos internacionais
export default internationalEvents;
