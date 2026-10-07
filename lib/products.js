import { dbEnabled, getDb } from './turso';
import { SEED_PRODUCTS } from './seed';

const FALLBACK_IMAGE = '/assets/images/products/btcml.jpg';

function normalize(row) {
  return {
    ...row,
    active: Number(row.active),
    new_price: Number(row.new_price || 0),
    old_price: Number(row.old_price || 0),
  };
}

/** All active products for the storefront. Drafts are always excluded. */
export async function getStoreProducts() {
  try {
    if (!dbEnabled) return SEED_PRODUCTS.map(normalize);
    const rs = await getDb().execute(
      `SELECT slug, name, short_desc, new_price, old_price, image, badge, status, active, sort_order
       FROM products
       WHERE active = 1 AND status != 'draft'
       ORDER BY sort_order, id`
    );
    return rs.rows.map(normalize);
  } catch {
    return [];
  }
}

/** Products including drafts — admin only. */
export async function getAllProducts() {
  try {
    if (!dbEnabled) return SEED_PRODUCTS.map(normalize);
    const rs = await getDb().execute(
      `SELECT id, slug, name, short_desc, new_price, old_price, image, badge, status, active, sort_order
       FROM products ORDER BY sort_order, id`
    );
    return rs.rows.map(normalize);
  } catch {
    return [];
  }
}

export async function getStoreProduct(slug) {
  const all = await getStoreProducts();
  return all.find((p) => p.slug === slug) || null;
}

export function productImage(image, fallback = FALLBACK_IMAGE) {
  if (!image) return fallback;
  return String(image).startsWith('/') ? image : `/assets/images/products/${image}`;
}

export const PRODUCT_IMAGE_FALLBACK = FALLBACK_IMAGE;