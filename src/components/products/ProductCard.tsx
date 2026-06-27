'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart } from 'lucide-react';
import type { Product } from '@/types';
import { useCartStore, formatCents } from '@/lib/cart';
import { useCartUI } from '@/lib/cartUI';
import { useSizePicker } from '@/lib/sizePickerUI';
import clsx from 'clsx';

interface ProductCardProps {
  product: Product;
}

const badgeClass: Record<string, string> = {
  bestseller: 'badge-bestseller',
  new: 'badge-new',
  limited: 'badge-limited',
};

const badgeLabel: Record<string, string> = {
  bestseller: 'Best Seller',
  new: 'New',
  limited: 'Limited',
};

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const { openDrawer } = useCartUI();
  const openSizePicker = useSizePicker((s) => s.open);

  const hasVariants = product.variants && product.variants.length > 0;
  const startingPrice = hasVariants
    ? Math.min(...product.variants!.map((v) => v.price))
    : product.price;

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (hasVariants) {
      openSizePicker(product);
    } else {
      addItem(product, undefined, 1);
      openDrawer();
    }
  }

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group card overflow-hidden transition-shadow hover:shadow-md"
    >
      {/* Product image */}
      <div className="relative aspect-square overflow-hidden bg-linen-100">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-linen-200 to-linen-100 -z-10 flex items-center justify-center">
          <span className="font-serif text-4xl text-linen-400">✦</span>
        </div>

        {product.badge && (
          <span className={clsx('absolute left-3 top-3', badgeClass[product.badge])}>
            {badgeLabel[product.badge]}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-xs font-medium uppercase tracking-widest text-charcoal-400 mb-1">
          {product.scent}
        </p>
        <h3 className="font-serif text-base font-semibold text-charcoal-900 leading-snug">
          {product.name}
        </h3>
        <p className="mt-1 text-sm text-charcoal-500 line-clamp-2">{product.tagline}</p>

        <div className="mt-4 flex items-center justify-between gap-2">
          <span className="text-base font-semibold text-charcoal-900">
            {hasVariants ? 'From ' : ''}{formatCents(startingPrice)}
          </span>
          <button
            onClick={handleAdd}
            className="flex items-center gap-1.5 rounded-full bg-charcoal-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-charcoal-700 active:scale-95 transition-all"
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            {hasVariants ? 'Choose' : 'Add'}
          </button>
        </div>
      </div>
    </Link>
  );
}
