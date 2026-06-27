'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Minus, Plus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCartStore, formatCents, calculateShipping, SHIPPING_THRESHOLD, SHIPPING_FLAT } from '@/lib/cart';

export default function CartPage() {
  const { items, removeItem, updateQuantity } = useCartStore();
  const subtotal = useCartStore((s) => s.subtotal());
  const shipping = calculateShipping(subtotal);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-24 text-center">
        <ShoppingBag className="mx-auto h-14 w-14 text-linen-300 mb-6" />
        <h1 className="font-serif text-2xl font-semibold text-charcoal-900 mb-3">
          Your cart is empty
        </h1>
        <p className="text-sm text-charcoal-500 mb-8">
          Add something wonderful to get started.
        </p>
        <Link href="/products" className="btn-primary">
          Browse Products <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
      <h1 className="font-serif text-3xl font-semibold text-charcoal-900 mb-10">Your Cart</h1>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {/* Free shipping progress bar */}
          {(() => {
            const toFree = Math.max(0, SHIPPING_THRESHOLD - subtotal);
            const progress = Math.min(100, (subtotal / SHIPPING_THRESHOLD) * 100);
            return (
              <div className="rounded-2xl border border-linen-200 bg-linen-50 px-5 py-4">
                {toFree === 0 ? (
                  <p className="text-sm font-medium text-green-700">
                    🎉 You&apos;ve unlocked free shipping!
                  </p>
                ) : (
                  <>
                    <p className="text-sm text-charcoal-600 mb-2">
                      Add{' '}
                      <span className="font-semibold text-charcoal-900">{formatCents(toFree)}</span>{' '}
                      more to unlock free shipping{' '}
                      <span className="text-charcoal-400 line-through text-xs">
                        {formatCents(SHIPPING_FLAT)}
                      </span>
                    </p>
                    <div className="h-2 rounded-full bg-linen-200 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-charcoal-900 transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </>
                )}
              </div>
            );
          })()}
          {items.map((item) => {
            const variant = item.variantId
              ? item.product.variants?.find((v) => v.id === item.variantId)
              : null;
            const price = variant ? variant.price : item.product.price;
            const priceDisplay = variant ? variant.priceDisplay : item.product.priceDisplay;

            return (
              <div
                key={`${item.product.id}-${item.variantId ?? 'default'}`}
                className="card flex gap-4 p-4"
              >
                {/* Image */}
                <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-linen-100">
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-linen-200 to-linen-100 -z-10 flex items-center justify-center">
                    <span className="text-linen-400 text-xl">✦</span>
                  </div>
                </div>

                {/* Info */}
                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between">
                    <div>
                      <Link
                        href={`/products/${item.product.slug}`}
                        className="font-serif text-sm font-semibold text-charcoal-900 hover:underline"
                      >
                        {item.product.name}
                      </Link>
                      {variant && (
                        <p className="text-xs text-charcoal-400 mt-0.5">{variant.label}</p>
                      )}
                    </div>
                    <button
                      onClick={() => removeItem(item.product.id, item.variantId)}
                      className="text-charcoal-400 hover:text-red-500 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-auto flex items-center justify-between">
                    {/* Quantity */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.variantId, item.quantity - 1)
                        }
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-linen-300 hover:border-charcoal-400 text-xs"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-5 text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.variantId, item.quantity + 1)
                        }
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-linen-300 hover:border-charcoal-400 text-xs"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    {/* Line total */}
                    <span className="text-sm font-semibold text-charcoal-900">
                      {formatCents(price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h2 className="font-serif text-lg font-semibold text-charcoal-900 mb-5">
              Order Summary
            </h2>

            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-charcoal-500">Subtotal</dt>
                <dd className="font-medium">{formatCents(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-charcoal-500">Shipping</dt>
                <dd className="font-medium">
                  {shipping === 0 ? (
                    <span className="text-green-600">Free</span>
                  ) : (
                    formatCents(shipping)
                  )}
                </dd>
              </div>
              {subtotal < SHIPPING_THRESHOLD && (
                <p className="text-xs text-charcoal-400">
                  Add {formatCents(SHIPPING_THRESHOLD - subtotal)} more for free shipping
                </p>
              )}
              <div className="border-t border-linen-200 pt-3 flex justify-between text-base font-semibold">
                <dt>Total</dt>
                <dd>{formatCents(subtotal + shipping)}</dd>
              </div>
            </dl>

            <Link href="/checkout" className="btn-primary w-full mt-6 justify-center">
              Proceed to Checkout <ArrowRight className="h-4 w-4" />
            </Link>

            <p className="mt-4 text-center text-xs text-charcoal-400">
              Secure checkout · Card or ₿ Bitcoin
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
