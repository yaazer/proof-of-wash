'use client';

import { useEffect } from 'react';
import { X, Check } from 'lucide-react';
import type { Product } from '@/types';
import { useCartStore } from '@/lib/cart';
import { useCartUI } from '@/lib/cartUI';

interface Props {
  product: Product;
  onClose: () => void;
}

function isOOS(stock: number | null | undefined): boolean {
  return typeof stock === 'number' && stock === 0;
}

export default function SizePickerModal({ product, onClose }: Props) {
  const addItem = useCartStore((s) => s.addItem);
  const { openDrawer } = useCartUI();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  function handleSelect(variantId: string) {
    addItem(product, variantId, 1);
    openDrawer();
    onClose();
  }

  const variants = product.variants ?? [];

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className="fixed inset-0 z-40 bg-charcoal-950/50 backdrop-blur-sm"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Choose size for ${product.name}`}
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-4 border-b border-linen-200">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-linen-100 font-serif text-lg text-linen-500 shrink-0">
              ✦
            </span>
            <div>
              <h2 className="font-serif text-base font-semibold text-charcoal-900">
                {product.name}
              </h2>
              <p className="text-xs text-charcoal-400 mt-0.5">Choose your size</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="mt-0.5 p-1.5 rounded-lg text-charcoal-400 hover:text-charcoal-700 hover:bg-linen-100 transition-colors shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Variant list */}
        <div className="p-3 space-y-2">
          {variants.map((v) => {
            const oos = isOOS(v.stock);
            const lowStock = typeof v.stock === 'number' && v.stock > 0 && v.stock <= 3;
            return (
              <button
                key={v.id}
                onClick={() => !oos && handleSelect(v.id)}
                disabled={oos}
                className={`w-full flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition-all group ${
                  oos
                    ? 'border-linen-200 bg-linen-50 opacity-50 cursor-not-allowed'
                    : 'border-linen-300 hover:border-charcoal-700 hover:bg-charcoal-50 active:scale-[0.98]'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                      oos ? 'border-linen-300' : 'border-linen-400 group-hover:border-charcoal-700'
                    }`}
                  >
                    {!oos && (
                      <Check className="h-3 w-3 text-charcoal-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </span>
                  <div className="min-w-0">
                    <span className={`text-sm font-medium ${oos ? 'text-charcoal-300' : 'text-charcoal-800'}`}>
                      {v.label}
                    </span>
                    {oos && <span className="ml-2 text-xs text-red-400">Out of stock</span>}
                    {lowStock && !oos && (
                      <span className="ml-2 text-xs text-amber-600">Only {v.stock} left</span>
                    )}
                  </div>
                </div>
                <span className="text-sm font-semibold text-charcoal-900 text-right shrink-0">
                  {v.priceDisplay}
                </span>
              </button>
            );
          })}
        </div>

        <p className="px-5 pb-4 text-center text-[11px] text-charcoal-300">
          Tap a size to add it to your cart
        </p>
      </div>
    </>
  );
}
