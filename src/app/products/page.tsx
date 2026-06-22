import type { Metadata } from 'next';
import { products } from '@/data/products';
import ProductCard from '@/components/products/ProductCard';

export const metadata: Metadata = {
  title: 'Shop All Products',
  description: 'Browse our full line of artisan, plant-based laundry detergents.',
};

export default function ProductsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-charcoal-400 mb-2">
          The Collection
        </p>
        <h1 className="font-serif text-4xl font-semibold text-charcoal-900">
          All Products
        </h1>
        <p className="mt-3 text-sm text-charcoal-500 max-w-xl">
          Every formula is handcrafted in small batches using plant-derived surfactants, pure
          essential oils, and thoughtfully sourced botanicals.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
