import { create } from 'zustand';
import type { Product } from '@/types';

interface SizePickerState {
  product: Product | null;
  open: (product: Product) => void;
  close: () => void;
}

export const useSizePicker = create<SizePickerState>((set) => ({
  product: null,
  open: (product) => set({ product }),
  close: () => set({ product: null }),
}));
