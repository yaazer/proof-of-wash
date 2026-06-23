import Link from 'next/link';
import { ArrowRight, Leaf, Droplets, RefreshCw, Bitcoin } from 'lucide-react';
import { getAllProducts, getFeaturedProducts } from '@/data/products';
import ProductCard from '@/components/products/ProductCard';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const products = getAllProducts();
  const featured = getFeaturedProducts();

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-charcoal-950 via-charcoal-900 to-charcoal-800 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-24 sm:py-36 flex flex-col items-center text-center">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-linen-700/40 bg-linen-900/20 px-4 py-1.5 text-xs font-medium tracking-widest text-linen-300 uppercase">
            Small-Batch · Plant-Based · Artisan
          </span>

          <h1 className="font-serif text-4xl sm:text-6xl font-bold leading-tight max-w-3xl">
            Laundry that&apos;s{' '}
            <span className="italic text-linen-200">actually</span>{' '}
            good for your clothes.
          </h1>

          <p className="mt-6 text-base sm:text-lg text-linen-300 max-w-xl leading-relaxed">
            Hand-crafted in small batches using plant-derived surfactants and pure essential oils.
            No synthetic dyes, no hidden chemicals, no compromise.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/products" className="btn-primary text-base px-8 py-3.5">
              Shop Now <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/about" className="btn-outline border-linen-600 text-linen-200 hover:bg-linen-200 hover:text-charcoal-900 text-base px-8 py-3.5">
              Our Story
            </Link>
          </div>

          {/* Bitcoin badge */}
          <div className="mt-10 flex items-center gap-2 text-xs text-linen-500">
            <Bitcoin className="h-4 w-4 text-amber-400" />
            <span>Bitcoin accepted via BTCPay — pay with lightning or on-chain</span>
          </div>
        </div>

        {/* Decorative bubbles */}
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-soap-900/20 blur-3xl" />
        <div className="pointer-events-none absolute -top-16 -left-16 h-72 w-72 rounded-full bg-linen-900/10 blur-3xl" />
      </section>

      {/* ── Trust bar ── */}
      <section className="border-y border-linen-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6">
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { icon: Leaf, text: '100% plant-derived' },
              { icon: Droplets, text: 'HE machine safe' },
              { icon: RefreshCw, text: 'Refill & save' },
              { icon: Bitcoin, text: 'Pay with Bitcoin' },
            ].map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center justify-center gap-2 text-sm font-medium text-charcoal-600">
                <Icon className="h-4 w-4 text-charcoal-400" />
                {text}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Featured products ── */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-20">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-charcoal-400 mb-2">
              Top picks
            </p>
            <h2 className="font-serif text-3xl font-semibold text-charcoal-900">
              Featured Products
            </h2>
          </div>
          <Link
            href="/products"
            className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-charcoal-600 hover:text-charcoal-900 transition-colors"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link href="/products" className="btn-outline">
            View all products <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ── Why Proof of Wash ── */}
      <section className="bg-linen-100 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-charcoal-400 mb-2">
              Why we&apos;re different
            </p>
            <h2 className="font-serif text-3xl font-semibold text-charcoal-900">
              Proof is in every wash
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {[
              {
                title: 'Transparent Ingredients',
                body: 'Every ingredient listed, every batch traceable. No proprietary blends, no mystery fragrances.',
              },
              {
                title: 'Concentrated Formula',
                body: 'A single 32 oz bottle delivers up to 96 loads — less packaging waste, more value.',
              },
              {
                title: 'Sovereign Payments',
                body: 'Pay by card through Square or opt for privacy and independence with Bitcoin via BTCPay.',
              },
            ].map(({ title, body }) => (
              <div key={title} className="card p-6">
                <h3 className="font-serif text-lg font-semibold text-charcoal-900 mb-3">{title}</h3>
                <p className="text-sm text-charcoal-600 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Full product list teaser ── */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-20">
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-charcoal-400 mb-2">
            The full collection
          </p>
          <h2 className="font-serif text-3xl font-semibold text-charcoal-900">
            All Formulas
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* ── CTA banner ── */}
      <section className="bg-charcoal-900 text-white py-16">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 text-center">
          <h2 className="font-serif text-3xl font-semibold mb-4">
            Your laundry deserves better.
          </h2>
          <p className="text-linen-300 mb-8 text-base">
            Try the Starter Bundle — four 8 oz samples at one low price.
          </p>
          <Link href="/products/starter-bundle" className="btn-primary bg-white text-charcoal-900 hover:bg-linen-100 px-8 py-3.5 text-base">
            Get the Bundle <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
