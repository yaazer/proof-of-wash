import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getProductBySlug, products } from '@/data/products';
import AddToCartSection from '@/components/products/AddToCartSection';
import clsx from 'clsx';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
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

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      {/* Back link */}
      <Link
        href="/products"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-charcoal-500 hover:text-charcoal-900 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> All Products
      </Link>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-linen-100">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
            priority
          />
          {/* Fallback gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-linen-200 to-linen-100 -z-10 flex items-center justify-center">
            <span className="font-serif text-8xl text-linen-400">✦</span>
          </div>
          {product.badge && (
            <span className={clsx('absolute left-4 top-4', badgeClass[product.badge])}>
              {badgeLabel[product.badge]}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <p className="text-xs font-semibold uppercase tracking-widest text-charcoal-400 mb-2">
            {product.scent}
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-charcoal-900">
            {product.name}
          </h1>
          <p className="mt-2 text-base text-charcoal-500 italic">{product.tagline}</p>

          <p className="mt-6 text-sm text-charcoal-700 leading-relaxed">{product.description}</p>

          {/* Weight */}
          <p className="mt-4 text-sm text-charcoal-500">
            <span className="font-medium text-charcoal-700">Size:</span> {product.weight}
          </p>

          {/* Add to cart with variant selection */}
          <AddToCartSection product={product} />

          {/* Ingredients */}
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

          {/* Payment callout */}
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
    </div>
  );
}
