import Link from 'next/link';
import { Sparkles, ArrowLeft } from 'lucide-react';

interface Props {
  message?: string;
}

export default function SuspensionScreen({ message }: Props) {
  const displayMessage =
    message || "We're crafting the next batch — new stock arriving soon. Follow along for updates!";

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-linen-200 to-linen-300 flex items-center justify-center">
              <span className="font-serif text-4xl text-linen-500">✦</span>
            </div>
            <div className="absolute -right-1 -top-1 h-6 w-6 rounded-full bg-amber-400 flex items-center justify-center">
              <Sparkles className="h-3 w-3 text-white" />
            </div>
          </div>
        </div>

        {/* Heading */}
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-charcoal-900 mb-4">
          New Batch in Progress
        </h1>

        {/* Message */}
        <p className="text-base text-charcoal-500 leading-relaxed mb-8">{displayMessage}</p>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-8">
          <div className="flex-1 h-px bg-linen-200" />
          <span className="text-xs text-charcoal-300 font-medium uppercase tracking-widest">
            Meanwhile
          </span>
          <div className="flex-1 h-px bg-linen-200" />
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-charcoal-900 px-6 py-3 text-sm font-medium text-white hover:bg-charcoal-700 transition-colors"
          >
            Browse Products
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-linen-300 px-6 py-3 text-sm font-medium text-charcoal-700 hover:border-charcoal-400 transition-colors"
          >
            Our Story
          </Link>
        </div>

        {/* Back */}
        <Link
          href="/cart"
          className="mt-6 inline-flex items-center gap-1.5 text-xs text-charcoal-400 hover:text-charcoal-700 transition-colors"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to cart
        </Link>
      </div>
    </div>
  );
}
