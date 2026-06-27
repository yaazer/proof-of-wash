import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { getProductBySlug, getAllProducts } from '@/data/products';
import AddToCartSection from '@/components/products/AddToCartSection';
import ProductCard from '@/components/products/ProductCard';
import clsx from 'clsx';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description,
  };
}

const badgeLabel: Record<string, string> = {
  bestseller: 'Best Seller',
  new: 'New',
  limited: 'Limited Edition',
};

const badgeClass: Record<string, string> = {
  bestseller: 'badge-bestseller',
  new: 'badge-new',
  limited: 'badge-limited',
};

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = getAllProducts()
    .filter((p) => p.id !== product.id && p.inStock)
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-xs text-charcoal-400">
        <Link href="/" className="hover:text-charcoal-700 transition-colors">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/products" className="hover:text-charcoal-700 transition-colors">Products</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-charcoal-700 font-medium">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-linen-100">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-linen-200 to-linen-100 -z-10 flex items-center justify-center">
            <span className="font-serif text-8xl text-linen-400">✦</span>
          </div>
          {product.badge && (
            <span className={clsx('absolute left-4 top-4', badgeClass[product.badge])}>
              {badgeLabel[product.badge]}
            </span>
          )}
        </div>

        <div className="flex flex-col">
          <p className="text-xs font-semibold uppercase tracking-widest text-charcoal-400 mb-2">
            {product.scent}
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-charcoal-900">
            {product.name}
          </h1>
          <p className="mt-2 text-base text-charcoal-500 italic">{product.tagline}</p>

          <p className="mt-6 text-sm text-charcoal-700 leading-relaxed">{product.description}</p>

          <p className="mt-4 text-sm text-charcoal-500">
            <span className="font-medium text-charcoal-700">Size:</span> {product.weight}
          </p>

          <AddToCartSection product={product} />

          {product.ingredients.length > 0 && (
            <div className="mt-8 card p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-charcoal-400 mb-3">
                Full Ingredient List
              </p>
              <p className="text-sm text-charcoal-600 leading-relaxed">
                {product.ingredients.join(', ')}
              </p>
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-linen-300 px-3 py-1 text-xs text-charcoal-500">
              💳 Pay with card via Square
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs text-amber-700">
              ₿ Pay with Bitcoin via BTCPay
            </span>
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section className="mt-20 border-t border-linen-200 pt-12">
          <h2 className="font-serif text-2xl font-semibold text-charcoal-900 mb-8">
            You might also like
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
