import { NextResponse } from 'next/server';
import { dbEnabled, getDb } from '@/lib/turso';
import { SEED_PRODUCTS } from '@/lib/seed';

export async function GET() {
  if (!dbEnabled) {
    return NextResponse.json({ source: 'seed', products: SEED_PRODUCTS });
  }
  try {
    const rs = await getDb().execute(
      'SELECT slug, name, new_price, old_price, image, badge FROM products WHERE active = 1 ORDER BY sort_order, id'
    );
    return NextResponse.json({ source: 'turso', products: rs.rows });
  } catch (e) {
    return NextResponse.json(
      { source: 'seed-fallback', error: String(e?.message || e), products: SEED_PRODUCTS },
      { status: 200 }
    );
  }
}
