'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/lib/cart';

// Triggers Zustand's localStorage hydration after React has finished its
// hydration pass. Without this, Zustand reads localStorage synchronously
// at module load time, which means the server renders items=[] but the
// client renders items=[...persisted], causing a React hydration mismatch
// that leaves the DOM inconsistent and throws Node.removeChild errors.
export default function CartHydrator() {
  useEffect(() => {
    useCartStore.persist.rehydrate();
  }, []);
  return null;
}
