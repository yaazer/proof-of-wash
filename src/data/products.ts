// Thin re-export layer — actual data lives in src/data/products.json
// and is read via src/lib/productsDb.ts (server-only, uses fs)
export { readProducts as getAllProducts, getProductBySlug, getFeaturedProducts } from '@/lib/productsDb';
