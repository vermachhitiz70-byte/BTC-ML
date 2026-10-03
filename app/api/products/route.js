import { NextResponse } from 'next/server';
import { dbEnabled, getDb } from '@/lib/turso';
import { SEED_PRODUCTS } from '@/lib/seed';
import { ensureSchema } from '@/lib/schema';

export async function GET() {
  if (!dbEnabled) {
    return NextResponse.json({ source: 'seed', products: SEED_PRODUCTS });
  }
  await ensureSchema().catch(() => {});
  try {
    const rs = await getDb().execute(
      'SELECT slug, name, short_desc, new_price, old_price, image, badge, status, active, sort_order FROM products WHERE active = 1 ORDER BY sort_order, id'
    );
    return NextResponse.json({ source: 'turso', products: rs.rows });
  } catch (e) {
    return NextResponse.json(
      { source: 'seed-fallback', error: String(e?.message || e), products: SEED_PRODUCTS },
      { status: 200 }
    );
  }
}
