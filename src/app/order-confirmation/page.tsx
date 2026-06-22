import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle, Bitcoin, CreditCard, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Order Confirmed',
};

interface Props {
  searchParams: Promise<{ method?: string; orderId?: string }>;
}

const btcpaySteps = [
  {
    label: 'Payment broadcast',
    desc: 'Your wallet broadcasts the transaction to the Bitcoin network.',
  },
  {
    label: 'Confirmation',
    desc: 'We watch for 1 on-chain confirmation (~10 min) or instant via Lightning.',
  },
  {
    label: 'Order prepared',
    desc: 'Once confirmed, we pull your order and hand-batch your detergent.',
  },
  {
    label: 'Ships in 3–5 business days',
    desc: "You'll receive a tracking number by email.",
  },
];

const cardSteps = [
  { label: 'Payment received', desc: 'Your card was charged successfully.' },
  { label: 'Order prepared', desc: 'We hand-batch your detergent to order.' },
  { label: 'Ships in 3–5 business days', desc: "You'll receive a tracking number by email." },
];

export default async function OrderConfirmationPage({ searchParams }: Props) {
  const { method, orderId } = await searchParams;
  const isBtcpay = method === 'btcpay';
  const steps = isBtcpay ? btcpaySteps : cardSteps;

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-24 text-center">
      {/* Icon */}
      <div className="flex justify-center mb-6">
        <div
          className={`flex h-20 w-20 items-center justify-center rounded-full ${
            isBtcpay ? 'bg-amber-100' : 'bg-green-100'
          }`}
        >
          {isBtcpay ? (
            <Bitcoin className="h-10 w-10 text-amber-500" />
          ) : (
            <CheckCircle className="h-10 w-10 text-green-500" />
          )}
        </div>
      </div>

      <h1 className="font-serif text-3xl font-semibold text-charcoal-900 mb-3">
        {isBtcpay ? 'Invoice Created!' : 'Order Confirmed!'}
      </h1>

      <p className="text-charcoal-500 text-base mb-6 leading-relaxed">
        {isBtcpay
          ? 'Your Bitcoin invoice has been created. Your order will be prepared once payment confirms on the network.'
          : 'Thank you for your order! We received your payment and will begin preparing your batch.'}
      </p>

      {orderId && (
        <div className="inline-flex items-center gap-2 rounded-xl border border-linen-200 bg-linen-50 px-4 py-2 text-sm text-charcoal-600 mb-8">
          {isBtcpay ? (
            <Bitcoin className="h-4 w-4 text-amber-500" />
          ) : (
            <CreditCard className="h-4 w-4 text-charcoal-400" />
          )}
          <span>
            Order ID: <span className="font-mono font-medium">{orderId}</span>
          </span>
        </div>
      )}

      {/* Timeline */}
      <div className="card p-6 text-left mb-10">
        <h2 className="font-serif text-lg font-semibold text-charcoal-900 mb-4">
          What happens next
        </h2>
        <ol className="space-y-4">
          {steps.map((step, i) => (
            <li key={step.label} className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-charcoal-900 text-xs font-bold text-white">
                {i + 1}
              </span>
              <div>
                <p className="text-sm font-semibold text-charcoal-900">{step.label}</p>
                <p className="text-xs text-charcoal-500 mt-0.5">{step.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="flex flex-wrap gap-4 justify-center">
        <Link href="/products" className="btn-outline">
          Continue Shopping <ArrowRight className="h-4 w-4" />
        </Link>
        <Link href="/" className="btn-primary">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
