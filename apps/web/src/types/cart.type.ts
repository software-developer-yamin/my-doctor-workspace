export type TCartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  category?: string;
};

export type TCartSummary = {
  subtotal: number;
  vat: number;
  discount: number;
  total: number;
};
