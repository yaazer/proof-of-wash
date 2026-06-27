'use client';

import { useState, useTransition } from 'react';
import { updateVariantStock } from '@/app/admin/(panel)/actions';
import type { Product } from '@/types';
import { Check, Loader2 } from 'lucide-react';

interface Props {
  product: Product;
}

function StockInput({
  value,
  onSave,
}: {
  value: number | null | undefined;
  onSave: (v: number | null) => Promise<unknown>;
}) {
  const [raw, setRaw] = useState(value == null ? '' : String(value));
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function handleSave() {
    const parsed = raw === '' ? null : parseInt(raw, 10);
    if (raw !== '' && (isNaN(parsed!) || parsed! < 0)) return;
    startTransition(async () => {
      await onSave(parsed ?? null);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  }

  return (
    <div className="flex items-center gap-1.5">
      <input
        type="number"
        min="0"
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        onBlur={handleSave}
        onKeyDown={(e) => e.key === 'Enter' && handleSave()}
        placeholder="—"
        className="w-20 rounded border border-gray-200 px-2 py-1 text-xs text-center focus:outline-none focus:ring-1 focus:ring-gray-400"
      />
      {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin text-gray-400" />}
      {saved && !isPending && <Check className="h-3.5 w-3.5 text-green-500" />}
    </div>
  );
}

export default function VariantStockEditor({ product }: Props) {
  if (product.variants && product.variants.length > 0) {
    return (
      <div className="space-y-1.5">
        {product.variants.map((v) => (
          <div key={v.id} className="flex items-center justify-between gap-2">
            <span className="text-xs text-gray-500 truncate max-w-[80px]" title={v.label}>
              {v.label}
            </span>
            <StockInput
              value={v.stock}
              onSave={(stock) => updateVariantStock(product.id, v.id, stock)}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <StockInput
      value={product.stock}
      onSave={(stock) => updateVariantStock(product.id, null, stock)}
    />
  );
}
