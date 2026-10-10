import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin';

const TABLES = {
  slides: ['image', 'title', 'link', 'sort_order', 'active'],
  testimonials: ['name', 'text', 'rating', 'active'],
  faqs: ['question', 'answer', 'sort_order', 'active'],
  policies: ['slug', 'title', 'body'],
  notices: ['image', 'title', 'description', 'link_label', 'link_url', 'sort_order', 'active'],
};

function numFields(t) {
  if (t === 'notices') return ['sort_order', 'active'];
  return t === 'slides' ? ['sort_order', 'active'] : t === 'testimonials' ? ['rating', 'active'] : t === 'faqs' ? ['sort_order', 'active'] : [];
}

export async function GET(req, { params }) {
  const { error, db } = await requireAdmin();
  if (error) return error;
  const table = (await params).table;
  if (!TABLES[table]) return NextResponse.json({ error: 'Unknown table.' }, { status: 404 });
  const rs = await db.execute({ sql: 'SELECT * FROM "' + table + '" ORDER BY id DESC LIMIT 200' });
  return NextResponse.json({ rows: rs.rows });
}

export async function POST(req, { params }) {
  const { error, db } = await requireAdmin();
  if (error) return error;
  const table = (await params).table;
  if (!TABLES[table]) return NextResponse.json({ error: 'Unknown table.' }, { status: 404 });
  const body = await req.json().catch(() => ({}));
  const fields = TABLES[table];
  const nums = numFields(table);
  try {
    const rs = await db.execute({
      sql: 'INSERT INTO "' + table + '"(' + fields.join(',') + ') VALUES(' + fields.map(() => '?').join(',') + ')',
      args: fields.map((f) => (nums.includes(f) ? Number(body[f]) || 0 : String(body[f] || ''))),
    });
    return NextResponse.json({ ok: true, id: Number(rs.lastInsertRowid) });
  } catch (e) {
    return NextResponse.json({ error: 'Save failed (duplicate slug?).' }, { status: 409 });
  }
}

export async function PATCH(req, { params }) {
  const { error, db } = await requireAdmin();
  if (error) return error;
  const table = (await params).table;
  if (!TABLES[table]) return NextResponse.json({ error: 'Unknown table.' }, { status: 404 });
  const body = await req.json().catch(() => ({}));
  const id = Number(body.id);
  if (!id) return NextResponse.json({ error: 'Invalid id.' }, { status: 400 });
  const fields = TABLES[table].filter((f) => body[f] !== undefined);
  if (!fields.length) return NextResponse.json({ error: 'Nothing to update.' }, { status: 400 });
  const nums = numFields(table);
  await db.execute({
    sql: 'UPDATE "' + table + '" SET ' + fields.map((f) => f + ' = ?').join(', ') + ' WHERE id = ?',
    args: [...fields.map((f) => (nums.includes(f) ? Number(body[f]) || 0 : String(body[f]))) , id],
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req, { params }) {
  const { error, db } = await requireAdmin();
  if (error) return error;
  const table = (await params).table;
  if (!TABLES[table]) return NextResponse.json({ error: 'Unknown table.' }, { status: 404 });
  const { searchParams } = new URL(req.url);
  const id = Number(searchParams.get('id'));
  if (!id) return NextResponse.json({ error: 'Invalid id.' }, { status: 400 });
  await db.execute({ sql: 'DELETE FROM "' + table + '" WHERE id = ?', args: [id] });
  return NextResponse.json({ ok: true });
}
