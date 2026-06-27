'use client';

import { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    // Artificial delay so the submit feels intentional
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="mb-10 pb-10 border-b border-charcoal-800">
      <div className="max-w-md">
        <p className="font-serif text-lg font-semibold text-white">Stay in the loop</p>
        <p className="mt-1 text-sm text-linen-400">
          New batches, restocks, and seasonal scents. No spam, ever.
        </p>
        {submitted ? (
          <div className="mt-4 flex items-center gap-2 text-sm text-green-400">
            <Check className="h-4 w-4" />
            You&apos;re on the list. Thanks!
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 rounded-lg bg-charcoal-900 border border-charcoal-700 px-3.5 py-2.5 text-sm text-white placeholder-charcoal-500 focus:outline-none focus:border-charcoal-500 focus:ring-1 focus:ring-charcoal-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-1.5 rounded-lg bg-linen-100 px-4 py-2.5 text-sm font-medium text-charcoal-900 hover:bg-white transition-colors disabled:opacity-60"
            >
              {loading ? (
                <span className="h-4 w-4 border-2 border-charcoal-400 border-t-charcoal-900 rounded-full animate-spin" />
              ) : (
                <ArrowRight className="h-4 w-4" />
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
