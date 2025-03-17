// data/eventsContent.ts

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
};

// Seções da página principal de eventos
export const eventSections: EventSection[] = [
  {
    title: "Eventos Passados",
    description: "Relembre os melhores momentos dos nossos eventos anteriores",
    slug: "passados",
    image: "/img/bclandia.jpg",
  },
  {
    title: "Eventos Internacionais",
    description: "Explore nossos eventos em um mapa interativo da cidade",
    slug: "mapa",
    image: "/img/bclandia.jpg",
  },
  {
    title: "Eventos Privados",
    description: "Organize seu evento privado em nossos espaços exclusivos",
    slug: "privados",
    image: "/img/bclandia.jpg",
  },
  {
    title: "Próximos Eventos",
    description: "Confira nossa programação de eventos que estão por vir",
    slug: "proximos",
    image: "/img/bclandia.jpg",
  },
];

// Lista de eventos
export const events: Event[] = [
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
    image: "/img/bclandia.jpg",
    video: "/videos/video-7.mp4",
    gallery: ["/img/bclandia.jpg", "/img/bclandia.jpg", "/img/bclandia.jpg"],
    price: "A partir de 35€",
    status: "upcoming",
    featured: true,
    categories: ["festival", "música", "arte"],
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
    image: "/img/bclandia.jpg",
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
    image: "/img/bclandia.jpg",
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

// Função para obter eventos por status
export const getEventsByStatus = (status: "upcoming" | "past" | "private") => {
  return events.filter((event) => event.status === status);
};

// Função para obter evento por ID
export const getEventById = (id: string) => {
  return events.find((event) => event.id === id);
};

// Função para obter eventos em destaque
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

// Adiciona isto ao teu arquivo eventsContent.ts

// Tipos de Eventos Privados
export type PrivateEventType = {
  id: string;
  title: string;
  description: string;
  features: string[];
  image: string;
  priceFrom: string;
};

// Eventos privados oferecidos
export const privateEventTypes: PrivateEventType[] = [
  {
    id: "corporate",
    title: "Eventos Corporativos",
    description:
      "Desde lançamentos de produtos a conferências e festas de fim de ano, criamos eventos corporativos memoráveis que alinham-se perfeitamente com a imagem da sua empresa.",
    features: [
      "Apresentações com tecnologia de ponta",
      "Decoração e branding personalizado",
      "Catering executivo e bar premium",
      "Entretenimento exclusivo",
      "Fotografia e vídeo profissional",
    ],
    image: "/img/bclandia.jpg",
    priceFrom: "5.000€",
  },
  {
    id: "wedding",
    title: "Casamentos",
    description:
      "Criamos casamentos únicos e personalizados, desde cerimónias íntimas a grandes celebrações, sempre com o toque BadCompany que torna o dia ainda mais especial.",
    features: [
      "Decoração e ambientação temática",
      "DJs e bandas exclusivas",
      "Gestão completa do evento",
      "Catering gourmet",
      "Coordenação no dia do evento",
    ],
    image: "/img/bclandia.jpg",
    priceFrom: "15.000€",
  },
  {
    id: "birthday",
    title: "Aniversários",
    description:
      "Celebre o seu aniversário ou o de alguém especial com uma festa incomparável. Desde festas íntimas a grandes celebrações, criamos momentos inesquecíveis.",
    features: [
      "Decoração temática personalizada",
      "Animação e entretenimento",
      "Serviço de catering completo",
      "DJs e música ao vivo",
      "Fotografia e vídeo",
    ],
    image: "/img/bclandia.jpg",
    priceFrom: "3.000€",
  },
  {
    id: "themed",
    title: "Festas Temáticas",
    description:
      "Desde Halloween a anos 80, criamos festas temáticas imersivas que transportam os convidados para outra dimensão, com atenção a cada detalhe.",
    features: [
      "Cenografia completa",
      "Atores e performances exclusivas",
      "Menu e cocktails temáticos",
      "Iluminação e efeitos especiais",
      "Guarda-roupa para convidados",
    ],
    image: "/img/bclandia.jpg",
    priceFrom: "4.500€",
  },
];

// Eventos emblemáticos da BadCompany (exemplos para a página de eventos privados)
export type EventExample = {
  title: string;
  image: string;
  description: string;
  features?: string[];
};

export const eventExamples: EventExample[] = [
  {
    title: "BCLândia",
    image: "/img/bclandia.jpg",
    description:
      "Um evento de Carnaval único onde os participantes se mascaram, criando um ambiente de celebração e criatividade inigualável.",
    features: [
      "Mais de 5.000 participantes anualmente",
      "Decoração imersiva",
      "Performers internacionais",
      "Sistema de som de alto nível",
    ],
  },
  {
    title: "White Emotion",
    image: "/img/bclandia.jpg",
    description:
      "Celebração do verão com dress code branco, realizada tanto em Portugal como no Brasil, proporcionando uma atmosfera elegante e vibrante.",
    features: [
      "Produção internacional",
      "Locais exclusivos",
      "DJs renomados",
      "Experiência gastronómica premium",
    ],
  },
  {
    title: "BC Best",
    image: "/img/bclandia.jpg",
    description:
      "Festival de música no Altice Arena que reúne milhares de pessoas e artistas de renome internacional para uma experiência inesquecível.",
    features: [
      "Line-up internacional",
      "Sistema de som e luz de última geração",
      "Produções originais",
      "Experiência VIP exclusiva",
    ],
  },
  {
    title: "A Casa Assombrada",
    image: "/img/bclandia.jpg",
    description:
      "Festa temática de Halloween com decoração assustadora e competição de fantasias, criando um ambiente de mistério e diversão.",
    features: [
      "Cenografia imersiva",
      "Atores profissionais",
      "Efeitos especiais",
      "Cocktails temáticos",
    ],
  },
];

// Informações para a página de eventos privados
export const privateEventsInfo = {
  title: "Eventos Privados",
  subtitle: "Queres a tua festa BadCompany?",
  description:
    "Personalizamos cada detalhe para criar uma experiência única e inesquecível para ti e os teus convidados.",
  advantages: [
    {
      title: "Experiência Inigualável",
      description:
        "Mais de 20 anos de experiência em eventos nacionais e internacionais",
    },
    {
      title: "Equipa Especializada",
      description:
        "Equipa especializada em produção, som, iluminação e entretenimento",
    },
    {
      title: "Parcerias Exclusivas",
      description:
        "Parcerias exclusivas com os melhores fornecedores do mercado",
    },
    {
      title: "Atendimento Personalizado",
      description: "Atendimento personalizado do início ao fim do projeto",
    },
  ],
  testimonials: [
    {
      quote:
        "A equipa da BadCompany transformou o nosso casamento num evento mágico e único. Desde o início do planeamento até ao fim da festa, tudo correu impecavelmente.",
      author: "Maria e João Silva",
      event: "Casamento em Lisboa",
      rating: 5,
    },
    {
      quote:
        "Realizámos o nosso evento corporativo com a BadCompany e foi simplesmente incrível. A atenção aos detalhes e o profissionalismo da equipa fez toda a diferença.",
      author: "Pedro Santos",
      event: "Diretor de Marketing, Empresa XYZ",
      rating: 5,
    },
    {
      quote:
        "A festa temática que a BadCompany organizou para o meu aniversário foi falada durante meses! Cada detalhe foi pensado para criar uma experiência inesquecível.",
      author: "Ana Oliveira",
      event: "Festa de 30 anos",
      rating: 5,
    },
  ],
  faqs: [
    {
      question: "Com quanto tempo de antecedência devo reservar o meu evento?",
      answer:
        "Recomendamos reservar com pelo menos 3 a 6 meses de antecedência para eventos maiores como casamentos e eventos corporativos. Para festas menores, 1 a 2 meses podem ser suficientes, dependendo da disponibilidade.",
    },
    {
      question: "O que está incluído no orçamento?",
      answer:
        "Cada orçamento é personalizado de acordo com as suas necessidades. Geralmente incluímos planeamento do evento, produção, decoração, som e iluminação, catering, bebidas, entretenimento e gestão no dia do evento. Podemos adicionar ou remover serviços conforme necessário.",
    },
    {
      question: "Realizam eventos fora de Lisboa?",
      answer:
        "Sim! Realizamos eventos em todo Portugal e também temos experiência em eventos internacionais. Para eventos fora de Lisboa, podem ser aplicadas taxas adicionais para transporte e logística.",
    },
    {
      question:
        "Qual é o número mínimo e máximo de convidados para eventos privados?",
      answer:
        "Temos experiência na organização de eventos desde reuniões íntimas de 20 pessoas até festivais com 20.000 participantes. O tamanho do evento afetará o orçamento e as necessidades logísticas.",
    },
  ],
  contactInfo: {
    email: "geral@badcompany.pt",
    phone: "+351 926 036 987",
    whatsapp: "https://wa.me/351926036987",
  },
  clients: ["Cliente 1", "Cliente 2", "Cliente 3", "Cliente 4"],
};

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

const internationalEvents: Event[] = [
  {
    id: "Londres",
    title: "The Indigo Tour London",
    description: "Evento realizado no espaço The O2, em Londres.",
    date: "2022-09-15T20:00:00",
    location: "Londres, Inglaterra",
    address: "The O2 Arena, Peninsula Square, London SE10 0DX, United Kingdom",
    image: "/img/bclandia.jpg",
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
    image: "/img/bclandia.jpg",
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
    image: "/img/bclandia.jpg",
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
    image: "/img/bclandia.jpg",
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
    image: "/img/bclandia.jpg",
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

// Add these new events to the existing events array
events.push(...internationalEvents);

// Eventos passados para mostrar na página de eventos passados
const pastEvents: Event[] = [
  {
    id: "monsanto-fest-2022",
    title: "Monsanto Fest",
    description: "Incrível!",
    longDescription:
      "Festival realizado no parque Monsanto, um dos eventos mais populares da BadCompany.",
    date: "2022-08-15T18:00:00",
    location: "Parque Monsanto, Lisboa",
    address: "Parque Florestal de Monsanto, Lisboa",
    image: "/img/bclandia.jpg",
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
      name: "BCLândia Productions",
      contact: "eventos@bclandia.com.pt",
    },
  },
  {
    id: "bc-best-whiteEmotion-24-2022",
    title: "BC Best White Emotion",
    description: "Noite mágica.",
    longDescription:
      "Elegância e glamour reunidos em uma noite onde todos se vestem de branco, em um ambiente sofisticado com muita música e entretenimento.",
    date: "2022-07-10T21:00:00",
    location: "Praia da Costa da Caparica, Almada",
    address: "Praia da Costa da Caparica, Almada",
    image: "/img/bclandia.jpg",
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
      name: "BCLândia Productions",
      contact: "eventos@bclandia.com.pt",
    },
  },
  {
    id: "a-casa-assombrada-2022",
    title: "A Casa Assombrada",
    description: "Adrenalina pura!",
    longDescription:
      "Evento temático de Halloween que transformou um casarão antigo em uma verdadeira casa do terror, com performances ao vivo e muitas surpresas assustadoras.",
    date: "2022-10-31T20:00:00",
    location: "Palácio da Ajuda, Lisboa",
    address: "Largo da Ajuda, 1349-021 Lisboa",
    image: "/img/bclandia.jpg",
    video: "/videos/video-1.mp4",
    price: "20€",
    status: "past",
    categories: ["Nacionais", "temático"],
    tags: ["halloween", "terror", "festa temática"],
    coordinates: {
      lat: 38.7066,
      lng: -9.1994,
    },
    organizador: {
      name: "BCLândia Productions",
      contact: "eventos@bclandia.com.pt",
    },
  },
  {
    id: "bissau-xperience-2022",
    title: "Bissau Xperience",
    description: "Cultura viva.",
    longDescription:
      "Projeto cultural que promoveu a música e a cultura da Guiné-Bissau em uma série de eventos durante 6 meses.",
    date: "2022-04-15T19:00:00",
    location: "Bissau, Guiné-Bissau",
    address: "Centro Cultural de Bissau, Guiné-Bissau",
    image: "/img/bclandia.jpg",
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
      name: "BCLândia International",
      contact: "internacional@bclandia.com.pt",
    },
    international: true,
  },
  {
    id: "bclandia-2023",
    title: "BCLândia 2023",
    description:
      "Festival que reuniu os principais artistas da cena nacional e internacional.",
    longDescription:
      "A edição 2023 do famoso festival BCLândia trouxe mais de 40 artistas em 3 dias de evento, com público recorde e experiências inesquecíveis.",
    date: "2023-06-20T16:00:00",
    time: "16:00 - 04:00",
    location: "MEO Arena, Lisboa",
    address: "Rossio dos Olivais, 1990-231 Lisboa",
    image: "/img/bclandia.jpg",
    video: "/videos/video-3.mp4",
    gallery: ["/img/bclandia.jpg", "/img/bclandia.jpg", "/img/bclandia.jpg"],
    price: "45€ - 90€",
    status: "past",
    categories: ["Festivais", "música", "arte"],
    tags: ["festival", "verão"],
    coordinates: {
      lat: 38.7677,
      lng: -9.0941,
    },
    organizador: {
      name: "BCLândia Productions",
      contact: "eventos@bclandia.com.pt",
    },
  },
];

events.push(...pastEvents);
