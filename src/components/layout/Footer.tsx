import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-linen-200 bg-charcoal-950 text-linen-300">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          {/* Brand */}
          <div>
            <p className="font-serif text-lg font-semibold text-white">Proof of Wash</p>
            <p className="mt-2 text-sm leading-relaxed text-linen-400">
              Small-batch, plant-based laundry care. Made with intention, designed to last.
            </p>
            <p className="mt-4 text-xs text-linen-500">
              Handcrafted in small batches. Ship within 3–5 business days.
            </p>
          </div>

          {/* Shop links */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-linen-500 mb-4">
              Shop
            </p>
            <ul className="space-y-2 text-sm">
              {[
                { href: '/products', label: 'All Products' },
                { href: '/products/lavender-cedar-concentrate', label: 'Lavender & Cedar' },
                { href: '/products/unscented-sensitive', label: 'Sensitive Formula' },
                { href: '/products/starter-bundle', label: 'Starter Bundle' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info links */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-linen-500 mb-4">
              Info
            </p>
            <ul className="space-y-2 text-sm">
              {[
                { href: '/about', label: 'Our Story' },
                { href: '/contact', label: 'Contact Us' },
                { href: '/about#ingredients', label: 'Ingredients & Safety' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-3 py-1 text-xs font-medium text-amber-400">
                ₿ Bitcoin accepted
              </span>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-charcoal-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-linen-600">
          <p>© {new Date().getFullYear()} Proof of Wash. All rights reserved.</p>
          <p>Payments secured by Square &amp; BTCPay Server</p>
        </div>
      </div>
    </footer>
  );
}
