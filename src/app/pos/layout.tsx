import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'POS | Proof of Wash' };

export default function POSLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-gray-100">{children}</div>;
}
