import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with the Proof of Wash team.',
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-16">
      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-charcoal-400 mb-2">
          Get in Touch
        </p>
        <h1 className="font-serif text-4xl font-semibold text-charcoal-900">Contact Us</h1>
        <p className="mt-4 text-charcoal-500 text-base">
          Questions, wholesale inquiries, or just want to talk shop? We reply within 1–2 business days.
        </p>
      </div>

      <form
        action="https://formspree.io/f/YOUR_FORM_ID"
        method="POST"
        className="card p-6 space-y-5"
      >
        <input type="hidden" name="_subject" value="Proof of Wash Contact Form" />
        <input type="text" name="_gotcha" className="hidden" tabIndex={-1} aria-hidden="true" />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="first-name">First Name</label>
            <input id="first-name" name="firstName" type="text" required className="input" />
          </div>
          <div>
            <label className="label" htmlFor="last-name">Last Name</label>
            <input id="last-name" name="lastName" type="text" required className="input" />
          </div>
        </div>

        <div>
          <label className="label" htmlFor="email">Email Address</label>
          <input id="email" name="email" type="email" required className="input" />
        </div>

        <div>
          <label className="label" htmlFor="subject">Subject</label>
          <select id="subject" name="subject" className="input">
            <option value="order">Order Question</option>
            <option value="wholesale">Wholesale Inquiry</option>
            <option value="ingredients">Ingredients / Allergies</option>
            <option value="btcpay">Bitcoin Payment Help</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="label" htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            rows={5}
            required
            className="input resize-none"
          />
        </div>

        <button type="submit" className="btn-primary w-full justify-center">
          Send Message
        </button>

        <p className="text-center text-xs text-charcoal-400">
          Your message is sent securely via Formspree. We never sell your data.
        </p>
      </form>

      <div className="mt-10 card p-5 flex flex-col gap-3 text-sm text-charcoal-600">
        <p className="font-serif text-base font-semibold text-charcoal-900">Other ways to reach us</p>
        <p>📧 <a href="mailto:hello@proofofwash.com" className="hover:text-charcoal-900 underline">hello@proofofwash.com</a></p>
        <p className="text-xs text-charcoal-400">We're a small operation — there's a real human on the other end.</p>
      </div>
    </div>
  );
}
