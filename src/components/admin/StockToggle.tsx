'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  productId: string;
  inStock: boolean;
}

export default function StockToggle({ productId, inStock }: Props) {
  const [pending, startTransition] = useTransition();
  const [optimistic, setOptimistic] = useState(inStock);
  const router = useRouter();

  async function toggle() {
    const next = !optimistic;
    setOptimistic(next);

    const res = await fetch(`/api/admin/products/${productId}/stock`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inStock: next }),
    });

    if (!res.ok) {
      setOptimistic(!next); // revert
    } else {
      startTransition(() => router.refresh());
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={pending}
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium border transition-colors ${
        optimistic
          ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
          : 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200'
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${optimistic ? 'bg-green-500' : 'bg-gray-400'}`} />
      {optimistic ? 'In stock' : 'Out of stock'}
    </button>
  );
}
