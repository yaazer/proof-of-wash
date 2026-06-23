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
