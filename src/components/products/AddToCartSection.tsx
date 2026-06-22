'use client';

import { useState } from 'react';
import { ShoppingCart, Minus, Plus, Check } from 'lucide-react';
import type { Product } from '@/types';
import { useCartStore, formatCents } from '@/lib/cart';

export default function AddToCartSection({ product }: { product: Product }) {
  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(
    product.variants?.[1]?.id ?? product.variants?.[0]?.id
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const selectedVariant = product.variants?.find((v) => v.id === selectedVariantId);
  const displayPrice = selectedVariant ? selectedVariant.price : product.price;

  function handleAdd() {
    addItem(product, selectedVariantId, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="mt-6 space-y-4">
      {/* Variant picker */}
      {product.variants && product.variants.length > 0 && (
        <div>
          <p className="label">Size</p>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((v) => (
              <button
                key={v.id}
                onClick={() => setSelectedVariantId(v.id)}
                className={`rounded-xl border px-4 py-2 text-sm font-medium transition-colors ${
                  selectedVariantId === v.id
                    ? 'border-charcoal-900 bg-charcoal-900 text-white'
                    : 'border-linen-300 text-charcoal-700 hover:border-charcoal-500'
                }`}
              >
                {v.label}
                <span className="ml-1.5 text-xs opacity-70">{v.priceDisplay}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity */}
      <div>
        <p className="label">Quantity</p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-linen-300 hover:border-charcoal-400 transition-colors"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="w-6 text-center font-medium">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-linen-300 hover:border-charcoal-400 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Price + Add button */}
      <div className="flex items-center gap-4 pt-2">
        <span className="text-2xl font-semibold font-serif text-charcoal-900">
          {formatCents(displayPrice * quantity)}
        </span>
        <button
          onClick={handleAdd}
          disabled={!product.inStock}
          className={`flex-1 btn-primary justify-center transition-all ${
            added ? 'bg-green-600 hover:bg-green-600' : ''
          }`}
        >
          {added ? (
            <>
              <Check className="h-4 w-4" /> Added!
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4" />
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
