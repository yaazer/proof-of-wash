'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { useCartStore, formatCents, calculateShipping, SHIPPING_THRESHOLD } from '@/lib/cart';
import { useCartUI } from '@/lib/cartUI';

export default function CartDrawer() {
  const { drawerOpen, closeDrawer } = useCartUI();
  const { items, removeItem, updateQuantity } = useCartStore();
  const subtotal = useCartStore((s) => s.subtotal());
  const shipping = calculateShipping(subtotal);
  const total = subtotal + shipping;
  const toFreeShipping = Math.max(0, SHIPPING_THRESHOLD - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / SHIPPING_THRESHOLD) * 100);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeDrawer(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [drawerOpen, closeDrawer]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={closeDrawer}
        className={`fixed inset-0 z-40 bg-charcoal-950/40 backdrop-blur-sm transition-opacity duration-300 ${
          drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Drawer panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={`fixed right-0 top-0 z-50 h-full w-full max-w-sm bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          drawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-linen-200">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-charcoal-700" />
            <h2 className="font-serif text-lg font-semibold text-charcoal-900">Your Cart</h2>
            {items.length > 0 && (
              <span className="text-xs text-charcoal-400">
                ({items.reduce((s, i) => s + i.quantity, 0)})
              </span>
            )}
          </div>
          <button
            onClick={closeDrawer}
            aria-label="Close cart"
            className="p-1.5 rounded-lg text-charcoal-400 hover:text-charcoal-900 hover:bg-linen-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 px-6 text-center">
            <ShoppingBag className="h-14 w-14 text-linen-300" />
            <p className="font-serif text-lg text-charcoal-700">Your cart is empty</p>
            <p className="text-sm text-charcoal-400">Add something wonderful to get started.</p>
            <button onClick={closeDrawer} className="btn-primary mt-2">
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            {/* Free shipping progress */}
            <div className="px-5 py-3 bg-linen-50 border-b border-linen-200">
              {toFreeShipping === 0 ? (
                <p className="text-xs font-medium text-green-700 text-center">
                  🎉 You unlocked free shipping!
                </p>
              ) : (
                <>
                  <p className="text-xs text-charcoal-500 mb-1.5">
                    Add{' '}
                    <span className="font-semibold text-charcoal-800">
                      {formatCents(toFreeShipping)}
                    </span>{' '}
                    more for free shipping
                  </p>
                  <div className="h-1.5 rounded-full bg-linen-200 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-charcoal-900 transition-all duration-500"
                      style={{ width: `${freeShippingProgress}%` }}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Items list */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {items.map((item) => {
                const variant = item.variantId
                  ? item.product.variants?.find((v) => v.id === item.variantId)
                  : null;
                const price = variant ? variant.price : item.product.price;
                return (
                  <div
                    key={`${item.product.id}-${item.variantId ?? 'default'}`}
                    className="flex gap-3"
                  >
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-linen-100">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-linen-200 to-linen-100 -z-10 flex items-center justify-center">
                        <span className="text-linen-400 text-sm">✦</span>
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-2">
                        <Link
                          href={`/products/${item.product.slug}`}
                          onClick={closeDrawer}
                          className="font-serif text-sm font-semibold text-charcoal-900 hover:underline truncate"
                        >
                          {item.product.name}
                        </Link>
                        <button
                          onClick={() => removeItem(item.product.id, item.variantId)}
                          aria-label="Remove item"
                          className="shrink-0 text-charcoal-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      {variant && (
                        <p className="text-xs text-charcoal-400 mt-0.5 truncate">{variant.label}</p>
                      )}
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.variantId, item.quantity - 1)
                            }
                            className="h-6 w-6 rounded-full border border-linen-300 flex items-center justify-center hover:border-charcoal-400 transition-colors"
                          >
                            <Minus className="h-2.5 w-2.5" />
                          </button>
                          <span className="w-5 text-center text-xs font-medium tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.variantId, item.quantity + 1)
                            }
                            className="h-6 w-6 rounded-full border border-linen-300 flex items-center justify-center hover:border-charcoal-400 transition-colors"
                          >
                            <Plus className="h-2.5 w-2.5" />
                          </button>
                        </div>
                        <span className="text-sm font-semibold text-charcoal-900 tabular-nums">
                          {formatCents(price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="border-t border-linen-200 px-5 py-5 space-y-3 bg-white">
              <div className="flex justify-between text-sm">
                <span className="text-charcoal-500">Subtotal</span>
                <span className="font-medium tabular-nums">{formatCents(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-charcoal-500">Shipping</span>
                <span className={`font-medium ${shipping === 0 ? 'text-green-600' : ''}`}>
                  {shipping === 0 ? 'Free' : formatCents(shipping)}
                </span>
              </div>
              <div className="flex justify-between text-base font-semibold border-t border-linen-200 pt-3">
                <span>Total</span>
                <span className="tabular-nums">{formatCents(total)}</span>
              </div>
              <Link
                href="/checkout"
                onClick={closeDrawer}
                className="btn-primary w-full justify-center"
              >
                Checkout <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/cart"
                onClick={closeDrawer}
                className="block text-center text-xs text-charcoal-400 hover:text-charcoal-700 transition-colors py-1"
              >
                View full cart
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
}
