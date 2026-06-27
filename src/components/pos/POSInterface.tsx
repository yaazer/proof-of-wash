'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { ShoppingBag, Banknote, CreditCard, Bitcoin, Plus, Minus, X } from 'lucide-react';
import type { Product, ProductVariant } from '@/types';
import { formatCents } from '@/lib/cart';
import VariantModal from './VariantModal';
import CashModal from './CashModal';
import TerminalModal from './TerminalModal';
import BTCModal from './BTCModal';

interface POSItem {
  product: Product;
  variant?: ProductVariant;
  quantity: number;
}

function itemKey(productId: string, variantId?: string) {
  return variantId ? `${productId}::${variantId}` : productId;
}

interface Props {
  products: Product[];
}

export default function POSInterface({ products }: Props) {
  const [items, setItems] = useState<POSItem[]>([]);
  const [variantProduct, setVariantProduct] = useState<Product | null>(null);
  const [paymentModal, setPaymentModal] = useState<'cash' | 'terminal' | 'btcpay' | null>(null);
  const [completedMessage, setCompletedMessage] = useState<string | null>(null);

  const subtotal = items.reduce((sum, i) => {
    const price = i.variant ? i.variant.price : i.product.price;
    return sum + price * i.quantity;
  }, 0);

  const addItem = useCallback((product: Product, variant?: ProductVariant) => {
    const key = itemKey(product.id, variant?.id);
    setItems((prev) => {
      const existing = prev.find((i) => itemKey(i.product.id, i.variant?.id) === key);
      if (existing) {
        return prev.map((i) =>
          itemKey(i.product.id, i.variant?.id) === key ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [...prev, { product, variant, quantity: 1 }];
    });
  }, []);

  const updateQty = (key: string, delta: number) => {
    setItems((prev) =>
      prev.flatMap((i) => {
        if (itemKey(i.product.id, i.variant?.id) !== key) return [i];
        const newQty = i.quantity + delta;
        return newQty <= 0 ? [] : [{ ...i, quantity: newQty }];
      }),
    );
  };

  const handleProductTap = (product: Product) => {
    if (product.variants && product.variants.length > 0) {
      setVariantProduct(product);
    } else {
      addItem(product);
    }
  };

  const clearOrder = () => {
    setItems([]);
    setCompletedMessage(null);
  };

  const signOut = async () => {
    await fetch('/api/pos/auth', { method: 'DELETE' });
    window.location.href = '/pos/login';
  };

  const posItems = items.map((i) => ({
    productId: i.product.id,
    productName: i.product.name,
    variantId: i.variant?.id,
    variantLabel: i.variant?.label,
    price: i.variant ? i.variant.price : i.product.price,
    quantity: i.quantity,
  }));

  const saveOrder = async (
    method: 'cash' | 'square-terminal' | 'btcpay',
    extras: Record<string, unknown> = {},
  ) => {
    await fetch('/api/pos/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: posItems,
        subtotal,
        total: subtotal,
        paymentMethod: method,
        paymentStatus: 'completed',
        ...extras,
      }),
    });
  };

  if (completedMessage) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center space-y-4 px-4">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900">Payment Complete</h2>
          <p className="text-gray-500 text-sm">{completedMessage}</p>
          <button
            onClick={clearOrder}
            className="mt-2 px-8 py-3 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors"
          >
            New Order
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* ── Product grid ─────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Proof of Wash</p>
            <p className="text-sm font-semibold text-gray-900">Point of Sale</p>
          </div>
          <button onClick={signOut} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
            Sign out
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {products.map((product) => (
              <button
                key={product.id}
                onClick={() => handleProductTap(product)}
                className="bg-white rounded-xl border border-gray-200 p-3 text-left hover:border-gray-400 hover:shadow-md transition-all active:scale-95"
              >
                <div className="w-full aspect-square bg-gray-50 rounded-lg mb-2.5 overflow-hidden flex items-center justify-center">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={120}
                      height={120}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-200 rounded-lg" />
                  )}
                </div>
                <p className="text-sm font-medium text-gray-900 leading-tight">{product.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{product.priceDisplay}</p>
                {product.variants && product.variants.length > 0 && (
                  <p className="text-xs text-blue-500 mt-0.5">{product.variants.length} sizes</p>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Order panel ──────────────────────────────────── */}
      <div className="w-80 shrink-0 bg-white border-l border-gray-200 flex flex-col">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
          <ShoppingBag className="h-4 w-4 text-gray-400" />
          <span className="text-sm font-semibold text-gray-900">Current Order</span>
          {items.length > 0 && (
            <span className="ml-auto text-xs text-gray-400">
              {items.reduce((s, i) => s + i.quantity, 0)} item
              {items.reduce((s, i) => s + i.quantity, 0) !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
          {items.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-10">Tap a product to add it</p>
          ) : (
            items.map((i) => {
              const key = itemKey(i.product.id, i.variant?.id);
              const price = i.variant ? i.variant.price : i.product.price;
              return (
                <div key={key} className="flex items-center gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{i.product.name}</p>
                    {i.variant && (
                      <p className="text-xs text-gray-500 truncate">{i.variant.label}</p>
                    )}
                    <p className="text-xs text-gray-400">{formatCents(price)} ea.</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => updateQty(key, -1)}
                      className="w-6 h-6 rounded-md flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-5 text-center text-sm font-medium tabular-nums">{i.quantity}</span>
                    <button
                      onClick={() => updateQty(key, 1)}
                      className="w-6 h-6 rounded-md flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 w-14 text-right shrink-0 tabular-nums">
                    {formatCents(price * i.quantity)}
                  </p>
                  <button
                    onClick={() => updateQty(key, -i.quantity)}
                    className="text-gray-300 hover:text-red-400 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        <div className="border-t border-gray-100 px-4 py-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Total</span>
            <span className="text-xl font-bold text-gray-900 tabular-nums">{formatCents(subtotal)}</span>
          </div>

          {items.length > 0 ? (
            <>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setPaymentModal('cash')}
                  className="flex flex-col items-center gap-1.5 py-3 rounded-xl bg-green-50 border border-green-200 hover:bg-green-100 transition-colors"
                >
                  <Banknote className="w-5 h-5 text-green-700" />
                  <span className="text-xs font-semibold text-green-800">Cash</span>
                </button>
                <button
                  onClick={() => setPaymentModal('terminal')}
                  className="flex flex-col items-center gap-1.5 py-3 rounded-xl bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors"
                >
                  <CreditCard className="w-5 h-5 text-blue-700" />
                  <span className="text-xs font-semibold text-blue-800">Card</span>
                </button>
                <button
                  onClick={() => setPaymentModal('btcpay')}
                  className="flex flex-col items-center gap-1.5 py-3 rounded-xl bg-orange-50 border border-orange-200 hover:bg-orange-100 transition-colors"
                >
                  <Bitcoin className="w-5 h-5 text-orange-500" />
                  <span className="text-xs font-semibold text-orange-700">BTC</span>
                </button>
              </div>
              <button
                onClick={clearOrder}
                className="w-full text-center text-xs text-gray-400 hover:text-gray-600 py-1 transition-colors"
              >
                Clear order
              </button>
            </>
          ) : (
            <p className="text-xs text-gray-300 text-center">No items yet</p>
          )}
        </div>
      </div>

      {/* ── Modals ───────────────────────────────────────── */}
      {variantProduct && (
        <VariantModal
          product={variantProduct}
          onSelect={(variant) => {
            addItem(variantProduct, variant);
            setVariantProduct(null);
          }}
          onClose={() => setVariantProduct(null)}
        />
      )}

      {paymentModal === 'cash' && (
        <CashModal
          total={subtotal}
          onComplete={async ({ tendered }) => {
            await saveOrder('cash', { cashTendered: tendered, changeDue: tendered - subtotal });
            setPaymentModal(null);
            setCompletedMessage(`Cash — change due: ${formatCents(tendered - subtotal)}`);
          }}
          onClose={() => setPaymentModal(null)}
        />
      )}

      {paymentModal === 'terminal' && (
        <TerminalModal
          total={subtotal}
          onComplete={async (checkoutId) => {
            await saveOrder('square-terminal', { squareCheckoutId: checkoutId });
            setPaymentModal(null);
            setCompletedMessage('Card payment complete');
          }}
          onClose={() => setPaymentModal(null)}
        />
      )}

      {paymentModal === 'btcpay' && (
        <BTCModal
          total={subtotal}
          onComplete={async (invoiceId) => {
            await saveOrder('btcpay', { btcInvoiceId: invoiceId });
            setPaymentModal(null);
            setCompletedMessage('Bitcoin payment confirmed');
          }}
          onClose={() => setPaymentModal(null)}
        />
      )}
    </div>
  );
}
