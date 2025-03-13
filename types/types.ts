export type BaseProduct = {
  id: number;
  title: string;
  price: string;
  image: string;
  category?: string;
  date?: string; // Added for tickets
  location?: string; // Added for tickets
};

export type CartItem = BaseProduct & {
  quantity: number;
  uniqueId?: string;
};