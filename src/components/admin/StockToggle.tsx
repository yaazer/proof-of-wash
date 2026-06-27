'use client';

import { useState, useTransition } from 'react';
import { toggleStock } from '@/app/admin/(panel)/actions';

interface Props {
  productId: string;
  inStock: boolean;
}

export default function StockToggle({ productId, inStock }: Props) {
  const [isPending, startTransition] = useTransition();
  const [optimistic, setOptimistic] = useState(inStock);
  const [error, setError] = useState(false);

  function toggle() {
    const next = !optimistic;
    setOptimistic(next);
    setError(false);

    startTransition(async () => {
      const result = await toggleStock(productId, next);
      if (!result.ok) {
        setOptimistic(!next);
        setError(true);
        setTimeout(() => setError(false), 3000);
      }
    });
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggle}
        disabled={isPending}
        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium border transition-colors ${
          optimistic
            ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
            : 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200'
        }`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${optimistic ? 'bg-green-500' : 'bg-gray-400'}`} />
        {optimistic ? 'In stock' : 'Out of stock'}
      </button>
      {error && <span className="text-xs text-red-500">Failed</span>}
    </div>
  );
}
