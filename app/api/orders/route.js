import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getDb } from '@/lib/turso';
import { getSessionUser, orderCode, validEmail, SESSION_COOKIE } from '@/lib/auth';

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
  const items = Array.isArray(body.items) ? body.items : null;
  const name = String(body.name || '').trim();
  const email = String(body.email || '').trim().toLowerCase();
  const phone = String(body.phone || '').trim();
  const coin = String(body.coin || 'USDT (BEP20)').trim();
  const txHash = String(body.tx_hash || body.txHash || '').trim();
  const screenshot = typeof body.screenshot === 'string' ? body.screenshot : '';
  if (!items || !items.length || items.length > 20) {
    return NextResponse.json({ error: 'Your cart is empty.' }, { status: 400 });
  }
  if (name.length < 2) return NextResponse.json({ error: 'Please enter your full name.' }, { status: 400 });
  if (!validEmail(email)) return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  if (!/^[+\d][\d\s\-()]{5,19}$/.test(phone)) {
    return NextResponse.json({ error: 'Please enter a valid phone number.' }, { status: 400 });
  }
  if (txHash.length < 10 || txHash.length > 200) {
    return NextResponse.json({ error: 'Please enter your transaction hash ID.' }, { status: 400 });
  }
  if (screenshot && screenshot.length > 1500000) {
    return NextResponse.json({ error: 'Screenshot is too large. Please use a smaller image.' }, { status: 400 });
  }

  const db = getDb();
  const slugs = [...new Set(items.map((i) => String(i.slug || '').trim()).filter(Boolean))];
  if (!slugs.length) return NextResponse.json({ error: 'Your cart is empty.' }, { status: 400 });
  const prs = await db.execute({
    sql: 'SELECT slug, name, new_price, status FROM products WHERE slug IN (' + slugs.map(() => '?').join(',') + ')',
    args: slugs,
  });
  const bySlug = Object.fromEntries(prs.rows.map((r) => [r.slug, r]));
  let total = 0;
  const lines = [];
  for (const it of items) {
    const p = bySlug[String(it.slug)];
    if (!p) return NextResponse.json({ error: 'A product in your cart is no longer available.' }, { status: 400 });
    if (p.status === 'coming_soon') {
      return NextResponse.json({ error: p.name + ' is coming soon and cannot be ordered yet.' }, { status: 400 });
    }
    const qty = Math.max(1, Math.min(10, parseInt(it.qty, 10) || 1));
    total += Number(p.new_price) * qty;
    lines.push({ slug: p.slug, name: p.name, price: Number(p.new_price), qty });
  }

  const store = await cookies();
  const user = await getSessionUser(store.get(SESSION_COOKIE)?.value).catch(() => null);
  const code = orderCode();
  await db.execute({
    sql: 'INSERT INTO orders(product_slug, customer_name, customer_email, amount, status, phone, coin, tx_hash, screenshot, items, order_code) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    args: [lines[0].slug, name, email, total, 'pending_verification', phone, coin, txHash, screenshot, JSON.stringify(lines), code],
  });
  return NextResponse.json({
    ok: true,
    order_code: code,
    total,
    message: 'Thank you for your order. Your order has been confirmed.',
  });
}

export async function GET(req) {
  const store = await cookies();
  const user = await getSessionUser(store.get(SESSION_COOKIE)?.value).catch(() => null);
  const { searchParams } = new URL(req.url);
  if (user && user.role === 'admin' && searchParams.get('all') === '1') {
    const rs = await getDb().execute({
      sql: "SELECT id, order_code, product_slug, customer_name, customer_email, amount, status, phone, coin, tx_hash, items, admin_note, created_at FROM orders ORDER BY id DESC LIMIT 200",
    });
    return NextResponse.json({ orders: rs.rows });
  }
  if (!user) return NextResponse.json({ orders: [] });
  const rs = await getDb().execute({
    sql: 'SELECT order_code, product_slug, customer_name, amount, status, coin, items, created_at FROM orders WHERE customer_email = ? ORDER BY id DESC LIMIT 50',
    args: [user.email],
  });
  return NextResponse.json({ orders: rs.rows });
}
