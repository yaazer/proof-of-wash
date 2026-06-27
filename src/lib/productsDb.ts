import fs from 'fs';
import path from 'path';
import type { Product } from '@/types';

const DATA_PATH = path.join(process.cwd(), 'src/data/products.json');

export function readProducts(): Product[] {
  return JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8')) as Product[];
}

export function writeProducts(products: Product[]): void {
  fs.writeFileSync(DATA_PATH, JSON.stringify(products, null, 2));
}

export function getProductBySlug(slug: string): Product | undefined {
  return readProducts().find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return readProducts().find((p) => p.id === id);
}

export function getFeaturedProducts(): Product[] {
  return readProducts().filter((p) => p.badge === 'bestseller' || p.badge === 'new');
}

export function decrementStock(
  productId: string,
  variantId: string | undefined,
  quantity: number,
): void {
  const products = readProducts();
  const idx = products.findIndex((p) => p.id === productId);
  if (idx === -1) return;

  if (variantId && products[idx].variants) {
    const vIdx = products[idx].variants!.findIndex((v) => v.id === variantId);
    if (vIdx === -1) return;
    const currentStock = products[idx].variants![vIdx].stock;
    if (typeof currentStock === 'number') {
      const variants = [...products[idx].variants!];
      variants[vIdx] = { ...variants[vIdx], stock: Math.max(0, currentStock - quantity) };
      products[idx] = { ...products[idx], variants };
    }
  } else if (!variantId) {
    const currentStock = products[idx].stock;
    if (typeof currentStock === 'number') {
      products[idx] = { ...products[idx], stock: Math.max(0, currentStock - quantity) };
    }
  }

  writeProducts(products);
}
