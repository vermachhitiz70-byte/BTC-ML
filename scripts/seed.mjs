// One-time Turso setup: creates tables (schema.sql) + seeds products.
// Usage: node --env-file=.env.local scripts/seed.mjs
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@libsql/client';
import { SEED_PRODUCTS } from '../lib/seed.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const schema = readFileSync(join(root, 'schema.sql'), 'utf8')
  .split('\n')
  .filter((line) => !line.trim().startsWith('--'))
  .join('\n');
const statements = schema
  .split(';')
  .map((s) => s.trim())
  .filter(Boolean);

for (const sql of statements) {
  await db.execute(sql);
}
console.log('schema ok:', statements.length, 'statements');

await db.execute('DELETE FROM products');
let i = 1;
for (const p of SEED_PRODUCTS) {
  await db.execute({
    sql: 'INSERT INTO products (slug,name,new_price,old_price,image,sort_order,active) VALUES (?,?,?,?,?,?,1)',
    args: [p.slug, p.name, p.new_price, p.old_price, p.image, i++],
  });
}
const rs = await db.execute('SELECT COUNT(*) AS n FROM products');
console.log('seeded products:', rs.rows[0].n);
db.close();
