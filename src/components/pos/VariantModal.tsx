'use client';

import { X } from 'lucide-react';
import type { Product, ProductVariant } from '@/types';
import { formatCents } from '@/lib/cart';

interface Props {
  product: Product;
  onSelect: (variant: ProductVariant) => void;
  onClose: () => void;
}

export default function VariantModal({ product, onSelect, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h2 className="font-semibold text-gray-900">{product.name}</h2>
            <p className="text-xs text-gray-500 mt-0.5">Select a size</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 space-y-2">
          {product.variants?.map((variant) => (
            <button
              key={variant.id}
              onClick={() => onSelect(variant)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-gray-200 hover:border-gray-400 hover:bg-gray-50 transition-all text-left active:scale-98"
            >
              <span className="text-sm text-gray-800">{variant.label}</span>
              <span className="text-sm font-semibold text-gray-900">{formatCents(variant.price)}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
