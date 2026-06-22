import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-24 text-center">
      <p className="font-serif text-7xl font-bold text-linen-300 mb-6">404</p>
      <h1 className="font-serif text-2xl font-semibold text-charcoal-900 mb-3">
        Page not found
      </h1>
      <p className="text-sm text-charcoal-500 mb-8">
        The page you&apos;re looking for has been moved or doesn&apos;t exist.
      </p>
      <Link href="/" className="btn-primary">
        Back to Home <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
