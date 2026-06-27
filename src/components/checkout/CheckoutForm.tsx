'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, Bitcoin, ChevronRight, Lock } from 'lucide-react';
import { useCartStore, formatCents, calculateShipping } from '@/lib/cart';
import type { OrderContact, PaymentMethod } from '@/types';
import SquarePaymentForm from '@/components/checkout/SquarePaymentForm';
import BTCPayButton from '@/components/checkout/BTCPayButton';


const initialContact: OrderContact = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  country: 'US',
};

type Step = 'contact' | 'payment';

export default function CheckoutForm() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal());
  const shipping = calculateShipping(subtotal);
  const total = subtotal + shipping;

  const [step, setStep] = useState<Step>('contact');
  const [contact, setContact] = useState<OrderContact>(initialContact);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('square');
  const [errors, setErrors] = useState<Partial<Record<keyof OrderContact, string>>>({});

  if (items.length === 0 && typeof window !== 'undefined') {
    router.replace('/cart');
    return null;
  }

  function validate(): boolean {
    const newErrors: typeof errors = {};
    if (!contact.firstName) newErrors.firstName = 'Required';
    if (!contact.lastName) newErrors.lastName = 'Required';
    if (!contact.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email))
      newErrors.email = 'Valid email required';
    if (!contact.address) newErrors.address = 'Required';
    if (!contact.city) newErrors.city = 'Required';
    if (!contact.state) newErrors.state = 'Required';
    if (!contact.zip) newErrors.zip = 'Required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function field(key: keyof OrderContact, label: string, type = 'text', placeholder = '') {
    return (
      <div>
        <label className="label" htmlFor={key}>
          {label}
        </label>
        <input
          id={key}
          type={type}
          autoComplete={key}
          placeholder={placeholder}
          value={contact[key] ?? ''}
          onChange={(e) => setContact((c) => ({ ...c, [key]: e.target.value }))}
          className={`input ${errors[key] ? 'border-red-400 ring-red-200' : ''}`}
        />
        {errors[key] && <p className="mt-1 text-xs text-red-500">{errors[key]}</p>}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
      <h1 className="font-serif text-3xl font-semibold text-charcoal-900 mb-10">Checkout</h1>

      {/* Progress indicator */}
      <div className="flex items-center gap-2 mb-10 text-sm">
        <span
          className={`flex items-center gap-1.5 font-medium ${
            step === 'contact' ? 'text-charcoal-900' : 'text-charcoal-400'
          }`}
        >
          1. Shipping Info
        </span>
        <ChevronRight className="h-4 w-4 text-charcoal-300" />
        <span
          className={`flex items-center gap-1.5 font-medium ${
            step === 'payment' ? 'text-charcoal-900' : 'text-charcoal-400'
          }`}
        >
          2. Payment
        </span>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        {/* Main form */}
        <div className="lg:col-span-2">
          {step === 'contact' && (
            <div className="card p-6 space-y-5 animate-fade-in">
              <h2 className="font-serif text-xl font-semibold text-charcoal-900">
                Shipping Information
              </h2>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {field('firstName', 'First Name', 'text', 'Jane')}
                {field('lastName', 'Last Name', 'text', 'Smith')}
              </div>
              {field('email', 'Email Address', 'email', 'jane@example.com')}
              {field('phone', 'Phone (optional)', 'tel', '+1 555 000 0000')}
              {field('address', 'Street Address', 'text', '123 Main St')}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <div className="col-span-2 sm:col-span-1">
                  {field('city', 'City', 'text', 'Brooklyn')}
                </div>
                {field('state', 'State', 'text', 'NY')}
                {field('zip', 'ZIP', 'text', '11201')}
              </div>

              <button
                onClick={() => { if (validate()) setStep('payment'); }}
                className="btn-primary w-full justify-center mt-2"
              >
                Continue to Payment <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {step === 'payment' && (
            <div className="space-y-5 animate-fade-in">
              <div className="card p-6">
                <h2 className="font-serif text-xl font-semibold text-charcoal-900 mb-5">
                  Choose Payment Method
                </h2>

                {/* Method selector */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 mb-6">
                  {/* Square */}
                  <button
                    onClick={() => setPaymentMethod('square')}
                    className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-all ${
                      paymentMethod === 'square'
                        ? 'border-charcoal-900 bg-charcoal-50 ring-2 ring-charcoal-900/10'
                        : 'border-linen-300 hover:border-charcoal-400'
                    }`}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-charcoal-900">
                      <CreditCard className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-charcoal-900">Card / Square</p>
                      <p className="text-xs text-charcoal-400">Visa, MC, Amex, Apple Pay</p>
                    </div>
                  </button>

                  {/* BTCPay */}
                  <button
                    onClick={() => setPaymentMethod('btcpay')}
                    className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-all ${
                      paymentMethod === 'btcpay'
                        ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-500/10'
                        : 'border-linen-300 hover:border-amber-300'
                    }`}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500">
                      <Bitcoin className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-charcoal-900">Bitcoin / BTCPay</p>
                      <p className="text-xs text-charcoal-400">On-chain or Lightning Network</p>
                    </div>
                  </button>
                </div>

                {/* Payment form */}
                {paymentMethod === 'square' && (
                  <SquarePaymentForm contact={contact} totalCents={total} />
                )}
                {paymentMethod === 'btcpay' && (
                  <BTCPayButton contact={contact} totalCents={total} />
                )}
              </div>

              <button
                onClick={() => setStep('contact')}
                className="text-sm text-charcoal-500 hover:text-charcoal-700 transition-colors"
              >
                ← Back to shipping info
              </button>
            </div>
          )}
        </div>

        {/* Order summary sidebar */}
        <div className="lg:col-span-1">
          <div className="card p-5 sticky top-24">
            <h3 className="font-serif text-base font-semibold text-charcoal-900 mb-4">
              Order Summary
            </h3>

            <ul className="divide-y divide-linen-100 mb-4">
              {items.map((item) => {
                const variant = item.variantId
                  ? item.product.variants?.find((v) => v.id === item.variantId)
                  : null;
                const price = variant ? variant.price : item.product.price;
                return (
                  <li
                    key={`${item.product.id}-${item.variantId}`}
                    className="flex justify-between py-2 text-sm"
                  >
                    <span className="text-charcoal-700 truncate mr-2">
                      {item.product.name}
                      {variant && <span className="text-charcoal-400"> ({variant.label})</span>}
                      {' '}× {item.quantity}
                    </span>
                    <span className="font-medium shrink-0">{formatCents(price * item.quantity)}</span>
                  </li>
                );
              })}
            </ul>

            <dl className="space-y-2 text-sm border-t border-linen-200 pt-3">
              <div className="flex justify-between">
                <dt className="text-charcoal-500">Subtotal</dt>
                <dd>{formatCents(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-charcoal-500">Shipping</dt>
                <dd>{shipping === 0 ? <span className="text-green-600">Free</span> : formatCents(shipping)}</dd>
              </div>
              <div className="flex justify-between text-base font-semibold border-t border-linen-200 pt-2">
                <dt>Total</dt>
                <dd>{formatCents(total)}</dd>
              </div>
            </dl>

            <div className="mt-4 flex items-center gap-1.5 text-xs text-charcoal-400">
              <Lock className="h-3.5 w-3.5" />
              Secured by Square &amp; BTCPay
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
