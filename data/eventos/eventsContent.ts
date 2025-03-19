// data/eventsContent.ts
import pastEvents from "./pastEvents";
import internationalEvents from "./internationalEvents";
import privateEventsData from "./privateEvents";
import futureEvents from "./futureEvents";

export type EventSection = {
  title: string;
  description: string;
  slug: string;
  image: string;
};

export type Event = {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  date: string;
  time?: string;
  location: string;
  address?: string;
  image: string;
  video?: string;
  gallery?: string[];
  price?: string;
  status: "upcoming" | "past" | "private";
  featured?: boolean;
  categories?: string[];
  tags?: string[];
  coordinates?: {
    lat: number;
    lng: number;
  };
  tickets?: {
    available: boolean;
    url?: string;
    price: string;
  };
  organizador?: {
    name: string;
    contact?: string;
  };
  international?: boolean;
  youtubeVideos?: string[];
};

// Seções da página principal de eventos
export const eventSections: EventSection[] = [
  {
    title: "Eventos Passados",
    description: "Relembre os melhores momentos dos nossos eventos anteriores",
    slug: "passados",
    image: "/images/eventos/bclandia.jpg",
  },
  {
    title: "Eventos Internacionais",
    description: "Explore nossos eventos em um mapa interativo da cidade",
    slug: "mapa",
    image: "/images/eventos/bclandia.jpg",
  },
  {
    title: "Eventos Privados",
    description: "Organize seu evento privado em nossos espaços exclusivos",
    slug: "privados",
    image: "/images/eventos/bclandia.jpg",
  },
  {
    title: "Próximos Eventos",
    description: "Confira nossa programação de eventos que estão por vir",
    slug: "proximos",
    image: "/images/eventos/bclandia.jpg",
  },
];

// Lista principal de eventos (agora vazia - usaremos os módulos separados)
export const events: Event[] = [];

// Adicionar todos os eventos ao array principal
events.push(...futureEvents);
events.push(...pastEvents);
events.push(...internationalEvents);

// Garantir que todos os eventos tenham youtubeVideos definido
events.forEach((event) => {
  if (!event.youtubeVideos) event.youtubeVideos = [];
});

// Funções utilitárias
export const getEventsByStatus = (status: "upcoming" | "past" | "private") => {
  return events.filter((event) => event.status === status);
};

export const getEventById = (id: string) => {
  return events.find((event) => event.id === id);
};

export const getFeaturedEvents = () => {
  return events.filter((event) => event.featured);
};

// Categorias de eventos
export const eventCategories = [
  "festival",
  "música",
  "arte",
  "exposição",
  "workshop",
  "literatura",
  "feira",
  "corporativo",
  "casamento",
  "teatro",
  "dança",
  "cinema",
  "gastronomia",
];

// Tipos de Eventos Privados
export type PrivateEventType = {
  id: string;
  title: string;
  description: string;
  features: string[];
  image: string;
  priceFrom: string;
};

// Eventos emblemáticos da BadCompany (exemplos para a página de eventos privados)
export type EventExample = {
  title: string;
  image: string;
  description: string;
  features?: string[];
};

// Re-exportações dos módulos separados
export { getPastEventsData, getPastEventById } from "./pastEvents";

export {
  getInternationalEventsForMap,
  getInternationalEventById,
} from "./internationalEvents";

export {
  getFutureEventsData,
  getFeaturedFutureEvents,
  getFutureEventById,
} from "./futureEvents";

export const { privateEventTypes, eventExamples, privateEventsInfo } =
  privateEventsData;

// Additional international events to add to the existing events array
export type LocationEntry = {
  name: string;
  coords: [number, number];
  images: string[];
  events: {
    id: string;
    name: string;
    date: string;
    description: string;
    image?: string;
  }[];
};
