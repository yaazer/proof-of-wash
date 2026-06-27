import { create } from 'zustand';

interface CartUIStore {
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

export const useCartUI = create<CartUIStore>((set) => ({
  drawerOpen: false,
  openDrawer: () => set({ drawerOpen: true }),
  closeDrawer: () => set({ drawerOpen: false }),
}));
