import { readProducts } from '@/lib/productsDb';
import POSInterface from '@/components/pos/POSInterface';

export default function POSPage() {
  const products = readProducts().filter((p) => p.inStock);
  return <POSInterface products={products} />;
}
