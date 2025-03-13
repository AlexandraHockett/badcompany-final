import { CartItem } from "@/types/types";

// Define a type that includes optional ticket-specific fields
type Product = Omit<CartItem, "quantity" | "uniqueId"> & {
  category: string;
  description?: string; // Added for improved product details
  date?: string; // Optional, only for tickets
  location?: string; // Optional, only for tickets
  available?: boolean; // For inventory management
  featured?: boolean; // For highlighting products
  options?: {
    name: string;
    values: string[];
  }[]; // For product variations like sizes, colors
  rating?: number; // For customer ratings
};

export const products: Product[] = [
  // Merchandising
  {
    id: 1,
    title: "T-Shirt BadCompany",
    price: "25.00€",
    image: "/img/bclandia.jpg",
    category: "Merchandising",
    description:
      "T-shirt oficial BadCompany em algodão premium com estampa exclusiva.",
    available: true,
    featured: true,
    options: [
      { name: "Tamanho", values: ["S", "M", "L", "XL"] },
      { name: "Cor", values: ["Preto", "Branco"] },
    ],
    rating: 4.8,
  },
  {
    id: 2,
    title: "Boné BadCompany",
    price: "15.00€",
    image: "/img/bclandia.jpg",
    category: "Merchandising",
    description: "Boné ajustável com logo bordado BadCompany.",
    available: true,
    options: [{ name: "Cor", values: ["Preto", "Cinza", "Branco"] }],
    rating: 4.5,
  },
  {
    id: 3,
    title: "Hoodie BadCompany",
    price: "45.00€",
    image: "/img/bclandia.jpg",
    category: "Merchandising",
    description: "Hoodie quente e confortável com capuz e logo BadCompany.",
    available: true,
    featured: true,
    options: [
      { name: "Tamanho", values: ["S", "M", "L", "XL", "XXL"] },
      { name: "Cor", values: ["Preto", "Cinza"] },
    ],
    rating: 4.9,
  },
  {
    id: 8,
    title: "Máscara Logo BC",
    price: "10.00€",
    image: "/img/bclandia.jpg",
    category: "Merchandising",
    description: "Máscara facial reutilizável com o logo da BadCompany.",
    available: true,
    rating: 4.6,
  },
  // Exclusives
  {
    id: 4,
    title: "Vinil Omah Lay",
    price: "50.00€",
    image: "/img/bclandia.jpg",
    category: "Exclusives",
    description:
      "Vinil exclusivo com autógrafo do artista Omah Lay. Edição limitada.",
    available: true,
    featured: true,
    rating: 5.0,
  },
  {
    id: 5,
    title: "Poster Nelson Freitas",
    price: "30.00€",
    image: "/img/bclandia.jpg",
    category: "Exclusives",
    description:
      "Poster exclusivo da tour de Nelson Freitas, formato A2 em papel premium.",
    available: true,
    rating: 4.7,
  },
  {
    id: 9,
    title: "Coletânea BCLândia 2022",
    price: "35.00€",
    image: "/img/bclandia.jpg",
    category: "Exclusives",
    description:
      "CD com as melhores músicas do festival BCLândia 2022. Edição limitada.",
    available: true,
    rating: 4.8,
  },
  // Tickets
  {
    id: 6,
    title: "BC Fest 2023",
    price: "30.00€",
    image: "/img/bclandia.jpg", // Update to a ticket-specific image if available
    category: "Tickets",
    description:
      "Bilhete para o BC Fest 2023, o maior festival de música alternativa do ano.",
    date: "2023-12-15",
    location: "Altice Arena, Lisboa",
    available: true,
    featured: true,
    rating: 4.9,
  },
  {
    id: 7,
    title: "Monsanto Fest 2023",
    price: "20.00€",
    image: "/img/bclandia.jpg", // Update to a ticket-specific image if available
    category: "Tickets",
    description:
      "Entrada para o festival de verão no Parque Monsanto, com várias bandas nacionais.",
    date: "2023-11-20",
    location: "Monsanto, Lisboa",
    available: true,
    rating: 4.6,
  },
  {
    id: 10,
    title: "White Emotion Party",
    price: "25.00€",
    image: "/img/bclandia.jpg",
    category: "Tickets",
    description:
      "A festa mais elegante do ano, onde todos vestem branco. Open bar incluído.",
    date: "2023-12-30",
    location: "Praia do Tamariz, Estoril",
    available: true,
    featured: true,
    rating: 4.8,
  },
];

// Filter functions
export const tickets = products.filter((p) => p.category === "Tickets");
export const merchandising = products.filter(
  (p) => p.category === "Merchandising"
);
export const exclusives = products.filter((p) => p.category === "Exclusives");
export const featuredProducts = products.filter((p) => p.featured);

// Helper function to format price
export const formatPrice = (price: string): number => {
  return parseFloat(price.replace("€", "").replace(",", ".").trim());
};

// Helper function to sort products
export const sortProducts = (
  products: Product[],
  sortBy: string
): Product[] => {
  switch (sortBy) {
    case "price-low-high":
      return [...products].sort(
        (a, b) => formatPrice(a.price) - formatPrice(b.price)
      );
    case "price-high-low":
      return [...products].sort(
        (a, b) => formatPrice(b.price) - formatPrice(a.price)
      );
    case "rating":
      return [...products].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    case "featured":
      return [...products].sort(
        (a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
      );
    default:
      return products;
  }
};
