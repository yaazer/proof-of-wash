import { readSettings } from '@/lib/storeSettings';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import SuspensionScreen from '@/components/store/SuspensionScreen';

export const dynamic = 'force-dynamic';

export default function CheckoutPage() {
  const settings = readSettings();

  if (settings.storeSuspended) {
    return <SuspensionScreen message={settings.suspensionMessage} />;
  }

  return <CheckoutForm />;
}
