'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useCartStore } from '@/lib/cart';
import { useCartUI } from '@/lib/cartUI';
import clsx from 'clsx';

const navLinks = [
  { href: '/products', label: 'Shop' },
  { href: '/about', label: 'Our Story' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const itemCount = useCartStore((s) => s.itemCount());
  const { openDrawer } = useCartUI();

  return (
    <header className="sticky top-0 z-50 bg-linen-50/95 backdrop-blur-sm border-b border-linen-200">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-lg font-serif font-semibold text-charcoal-900 group-hover:text-charcoal-600 transition-colors">
              Proof of Wash
            </span>
            <span className="hidden sm:inline-block text-xs font-light tracking-widest text-charcoal-400 uppercase">
              Artisan Laundry
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-charcoal-600 hover:text-charcoal-900 transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={openDrawer}
              className="relative p-2 text-charcoal-700 hover:text-charcoal-900 transition-colors"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-charcoal-900 text-[10px] font-bold text-white">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </button>

            <button
              className="md:hidden p-2 text-charcoal-700"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      <div
        className={clsx(
          'md:hidden overflow-hidden transition-all duration-300',
          mobileOpen ? 'max-h-60' : 'max-h-0'
        )}
      >
        <nav className="border-t border-linen-200 px-4 pb-4 pt-3 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-charcoal-700 hover:bg-linen-100 hover:text-charcoal-900 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
