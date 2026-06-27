'use client';

import { useState } from 'react';
import { ShoppingCart, Minus, Plus, Check } from 'lucide-react';
import type { Product } from '@/types';
import { useCartStore, formatCents } from '@/lib/cart';
import { useCartUI } from '@/lib/cartUI';

function isVariantOOS(stock: number | null | undefined): boolean {
  return typeof stock === 'number' && stock === 0;
}

function variantStockLabel(stock: number | null | undefined): string | null {
  if (typeof stock !== 'number') return null;
  if (stock === 0) return 'Out of stock';
  if (stock <= 3) return `Only ${stock} left`;
  return null;
}

export default function AddToCartSection({ product }: { product: Product }) {
  const firstAvailableVariant = product.variants?.find((v) => !isVariantOOS(v.stock));

  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(
    firstAvailableVariant?.id ?? product.variants?.[0]?.id,
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const { openDrawer } = useCartUI();

  const selectedVariant = product.variants?.find((v) => v.id === selectedVariantId);
  const displayPrice = selectedVariant ? selectedVariant.price : product.price;

  const selectedVariantOOS = selectedVariant ? isVariantOOS(selectedVariant.stock) : false;
  const canAddToCart = product.inStock && !selectedVariantOOS;

  // For products without variants, check product-level stock
  const productOOS = !product.inStock || (typeof product.stock === 'number' && product.stock === 0);
  const isDisabled = product.variants && product.variants.length > 0 ? !canAddToCart : productOOS;

  // Low stock indicator for selected variant or product
  const stockLabel = selectedVariant
    ? variantStockLabel(selectedVariant.stock)
    : variantStockLabel(product.stock);

  function handleAdd() {
    if (isDisabled) return;
    addItem(product, selectedVariantId, quantity);
    openDrawer();
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
            {product.variants.map((v) => {
              const oos = isVariantOOS(v.stock);
              const lowLabel = variantStockLabel(v.stock);
              return (
                <button
                  key={v.id}
                  onClick={() => !oos && setSelectedVariantId(v.id)}
                  disabled={oos}
                  className={`relative rounded-xl border px-4 py-2 text-sm font-medium transition-colors ${
                    oos
                      ? 'border-linen-200 text-charcoal-300 bg-linen-50 cursor-not-allowed'
                      : selectedVariantId === v.id
                      ? 'border-charcoal-900 bg-charcoal-900 text-white'
                      : 'border-linen-300 text-charcoal-700 hover:border-charcoal-500'
                  }`}
                >
                  {v.label}
                  <span className="ml-1.5 text-xs opacity-70">{v.priceDisplay}</span>
                  {oos && (
                    <span className="absolute -top-2 left-2 rounded-full bg-red-100 px-1.5 py-0.5 text-[9px] font-medium text-red-600">
                      OOS
                    </span>
                  )}
                  {!oos && lowLabel && lowLabel !== 'Out of stock' && (
                    <span className="absolute -top-2 left-2 rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-medium text-amber-700">
                      {lowLabel}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Low stock notice for selected item */}
      {stockLabel && stockLabel !== 'Out of stock' && (
        <p className="text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5">
          ⚡ {stockLabel}!
        </p>
      )}

      {/* Quantity */}
      {!isDisabled && (
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
              onClick={() =>
                setQuantity((q) =>
                  typeof (selectedVariant?.stock ?? product.stock) === 'number'
                    ? Math.min(q + 1, (selectedVariant?.stock ?? product.stock) as number)
                    : q + 1,
                )
              }
              className="flex h-9 w-9 items-center justify-center rounded-full border border-linen-300 hover:border-charcoal-400 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Price + Add button */}
      <div className="flex items-center gap-4 pt-2">
        <span className="text-2xl font-semibold font-serif text-charcoal-900">
          {formatCents(displayPrice * quantity)}
        </span>
        <button
          onClick={handleAdd}
          disabled={isDisabled}
          className={`flex-1 btn-primary justify-center transition-all ${
            added ? 'bg-green-600 hover:bg-green-600' : ''
          }`}
        >
          {added ? (
            <>
              <Check className="h-4 w-4" /> Added!
            </>
          ) : isDisabled ? (
            <>
              <ShoppingCart className="h-4 w-4" />
              Out of Stock
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
}
