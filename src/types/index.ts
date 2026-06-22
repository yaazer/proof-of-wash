export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  ingredients: string[];
  scent: string;
  weight: string;
  price: number; // in cents
  priceDisplay: string;
  image: string;
  badge?: 'bestseller' | 'new' | 'limited';
  inStock: boolean;
  variants?: ProductVariant[];
}

export interface ProductVariant {
  id: string;
  label: string;
  price: number;
  priceDisplay: string;
}

export interface CartItem {
  product: Product;
  variantId?: string;
  quantity: number;
}

export interface OrderContact {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export type PaymentMethod = 'square' | 'btcpay';

export interface Order {
  id: string;
  items: CartItem[];
  contact: OrderContact;
  paymentMethod: PaymentMethod;
  subtotal: number;
  shipping: number;
  total: number;
  status: 'pending' | 'paid' | 'failed';
  createdAt: string;
}

export interface BTCPayInvoice {
  id: string;
  checkoutLink: string;
  status: string;
  amount: string;
  currency: string;
}

export interface SquarePaymentResult {
  paymentId: string;
  status: string;
}
