import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  style: ['normal', 'italic'],
});

export const metadata: Metadata = {
  title: {
    default: 'Proof of Wash — Artisan Laundry Detergent',
    template: '%s | Proof of Wash',
  },
  description:
    'Small-batch, plant-based laundry detergent. Natural ingredients, powerful clean. Order with card or Bitcoin.',
  keywords: ['artisan laundry', 'natural detergent', 'plant-based', 'handmade', 'Bitcoin'],
  openGraph: {
    type: 'website',
    title: 'Proof of Wash — Artisan Laundry Detergent',
    description: 'Small-batch, plant-based laundry detergent. Natural ingredients, powerful clean.',
    siteName: 'Proof of Wash',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>{children}</body>
    </html>
  );
}
