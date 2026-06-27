import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/layout/CartDrawer';
import { readSettings } from '@/lib/storeSettings';
import SizePickerContainer from '@/components/store/SizePickerContainer';
import CartHydrator from '@/components/store/CartHydrator';
import Link from 'next/link';

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  const settings = readSettings();

  return (
    <>
      <CartHydrator />
      <Header />
      <CartDrawer />
      <SizePickerContainer />
      {settings.storeSuspended && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 text-center">
          <p className="text-sm text-amber-800">
            <span className="font-medium">Online orders are paused.</span>{' '}
            {settings.suspensionMessage}{' '}
            <Link href="/checkout" className="underline hover:text-amber-900">
              Learn more
            </Link>
          </p>
        </div>
      )}
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
