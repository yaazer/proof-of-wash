import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Leaf, Shield, Recycle, Bitcoin } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Our Story',
  description:
    'The story behind Proof of Wash — why we started, how we make it, and what we stand for.',
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-16">
      {/* Header */}
      <div className="mb-14 max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-charcoal-400 mb-3">
          Our Story
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-charcoal-900 leading-tight">
          We believe your laundry room deserves honesty.
        </h1>
        <p className="mt-6 text-base text-charcoal-600 leading-relaxed">
          Proof of Wash started at a kitchen table with a dissatisfaction: every detergent on the
          shelf was full of synthetic dyes, mystery &ldquo;fragrances,&rdquo; and single-use plastic. We set
          out to make something better — and to prove it.
        </p>
      </div>

      {/* Mission section */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-16">
        {[
          {
            icon: Leaf,
            title: 'Plant-Derived, Always',
            body: 'Every surfactant, every preservative, every scent compound is sourced from plants. We publish our full ingredient list — no INCI hiding, no aliases.',
          },
          {
            icon: Shield,
            title: 'Small-Batch Integrity',
            body: 'Each batch is hand-mixed and pH-tested before it ships. Small batches mean freshness, traceability, and human attention at every step.',
          },
          {
            icon: Recycle,
            title: 'Refill First',
            body: 'Our refill sizes cut packaging in half. We use post-consumer recycled plastic and encourage you to refill — not re-buy — whenever possible.',
          },
          {
            icon: Bitcoin,
            title: 'Sovereign Commerce',
            body: 'We accept Bitcoin via BTCPay Server — self-hosted, no third-party custodian. Your financial privacy matters as much as your skin safety.',
          },
        ].map(({ icon: Icon, title, body }) => (
          <div key={title} className="card p-6 flex gap-4">
            <div className="shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-linen-100">
              <Icon className="h-5 w-5 text-charcoal-700" />
            </div>
            <div>
              <h3 className="font-serif text-base font-semibold text-charcoal-900 mb-2">{title}</h3>
              <p className="text-sm text-charcoal-600 leading-relaxed">{body}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Ingredients transparency section */}
      <div id="ingredients" className="mb-16 scroll-mt-20">
        <h2 className="font-serif text-2xl font-semibold text-charcoal-900 mb-4">
          Ingredient Safety Standards
        </h2>
        <p className="text-sm text-charcoal-600 leading-relaxed mb-6">
          Every ingredient we use has been evaluated against the{' '}
          <strong>EWG Skin Deep Database</strong> and the <strong>EPA Safer Choice</strong>{' '}
          program. Our rule is simple: if we wouldn&apos;t put it near our own families, it doesn&apos;t
          go in the bottle.
        </p>
        <ul className="space-y-3 text-sm text-charcoal-700">
          {[
            'No synthetic fragrances or phthalates',
            'No optical brighteners (linked to skin sensitization)',
            'No 1,4-dioxane (common contamination in ethoxylated surfactants)',
            'No sodium laureth sulfate — we use milder coco-glucoside and decyl glucoside',
            'No artificial dyes or colorants',
            'Cruelty-free and vegan',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-charcoal-900" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* How it's made */}
      <div className="bg-linen-100 rounded-2xl p-8 mb-16">
        <h2 className="font-serif text-2xl font-semibold text-charcoal-900 mb-4">
          How We Make It
        </h2>
        <ol className="space-y-5 text-sm text-charcoal-700">
          {[
            { step: 'Sourcing', detail: 'We source essential oils from certified wildcrafters and USDA organic farms. Surfactants come from certified non-GMO coconut and corn.' },
            { step: 'Blending', detail: 'Each formula is blended in stainless steel vessels and pH-tested to fall between 7–9, optimized for fabric safety and surfactant performance.' },
            { step: 'Filling', detail: 'Bottles are filled and capped by hand in small runs of 50–100 units. Every bottle is weighed before sealing.' },
            { step: 'Labeling', detail: 'Labels include full INCI ingredient lists, batch numbers, and best-by dates. No hiding anything.' },
          ].map(({ step, detail }, i) => (
            <li key={step} className="flex gap-4">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-charcoal-900 text-xs font-bold text-white">
                {i + 1}
              </span>
              <div>
                <p className="font-semibold text-charcoal-900">{step}</p>
                <p className="mt-1 text-charcoal-600">{detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* CTA */}
      <div className="text-center">
        <h2 className="font-serif text-2xl font-semibold text-charcoal-900 mb-3">
          Ready to experience it?
        </h2>
        <p className="text-charcoal-500 mb-6">
          The Starter Bundle lets you try all four formulas before committing to a full size.
        </p>
        <Link href="/products/starter-bundle" className="btn-primary">
          Shop the Starter Bundle <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
