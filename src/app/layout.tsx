import type { Metadata } from 'next';
import { Archivo, Archivo_Black, Space_Mono } from 'next/font/google';
import './globals.css';

const archivo = Archivo({
  subsets: ['latin'],
  variable: '--font-archivo',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const archivBlack = Archivo_Black({
  subsets: ['latin'],
  variable: '--font-archivo-black',
  display: 'swap',
  weight: '400',
});

const spaceMono = Space_Mono({
  subsets: ['latin'],
  variable: '--font-space-mono',
  display: 'swap',
  weight: ['400', '700'],
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
    <html lang="en" className={`${archivo.variable} ${archivBlack.variable} ${spaceMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
