import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product } from '@/types';

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, variantId?: string, quantity?: number) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, variantId: string | undefined, quantity: number) => void;
  clearCart: () => void;
  itemCount: () => number;
  subtotal: () => number;
}

function itemKey(productId: string, variantId?: string) {
  return variantId ? `${productId}::${variantId}` : productId;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem(product, variantId, quantity = 1) {
        set((state) => {
          const key = itemKey(product.id, variantId);
          const existing = state.items.find(
            (i) => itemKey(i.product.id, i.variantId) === key
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                itemKey(i.product.id, i.variantId) === key
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, { product, variantId, quantity }] };
        });
      },

      removeItem(productId, variantId) {
        const key = itemKey(productId, variantId);
        set((state) => ({
          items: state.items.filter(
            (i) => itemKey(i.product.id, i.variantId) !== key
          ),
        }));
      },

      updateQuantity(productId, variantId, quantity) {
        if (quantity <= 0) {
          get().removeItem(productId, variantId);
          return;
        }
        const key = itemKey(productId, variantId);
        set((state) => ({
          items: state.items.map((i) =>
            itemKey(i.product.id, i.variantId) === key ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart() {
        set({ items: [] });
      },

      itemCount() {
        return get().items.reduce((sum, i) => sum + i.quantity, 0);
      },

      subtotal() {
        return get().items.reduce((sum, i) => {
          const variant = i.variantId
            ? i.product.variants?.find((v) => v.id === i.variantId)
            : null;
          const price = variant ? variant.price : i.product.price;
          return sum + price * i.quantity;
        }, 0);
      },
    }),
    { name: 'pow-cart', skipHydration: true }
  )
);

export function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export const SHIPPING_THRESHOLD = 5000; // free shipping over $50
export const SHIPPING_FLAT = 799; // $7.99

export function calculateShipping(subtotalCents: number): number {
  return subtotalCents >= SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
}
