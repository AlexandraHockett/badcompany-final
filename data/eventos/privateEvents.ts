import { PrivateEventType, EventExample } from "./eventsContent";

// Tipos de Eventos Privados
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
    image: "/images/eventos/bclandia.jpg",
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
    image: "/images/eventos/bclandia.jpg",
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
    image: "/images/eventos/bclandia.jpg",
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
    image: "/images/eventos/bclandia.jpg",
    priceFrom: "4.500€",
  },
];

// Eventos emblemáticos da BadCompany (exemplos para a página de eventos privados)
export const eventExamples: EventExample[] = [
  {
    title: "BCLândia",
    image: "/images/eventos/bclandia.jpg",
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
    image: "/images/eventos/bclandia.jpg",
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
    image: "/images/eventos/bclandia.jpg",
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
    image: "/images/eventos/bclandia.jpg",
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

const privateEventsData = {
  privateEventTypes,
  eventExamples,
  privateEventsInfo,
};

// Exporte a variável como default
export default privateEventsData;
