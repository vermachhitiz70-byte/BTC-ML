'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, Trash2, Lock } from 'lucide-react';
import { Btn, Card, EmptyState, Chip } from '../site/ui';

export function readCart() {
  try {
    const v = JSON.parse(localStorage.getItem('btcmlai_cart') || '[]');
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

function syncBadge() {
  let n = 0;
  try {
    const cart = JSON.parse(localStorage.getItem('btcmlai_cart') || '[]');
    if (Array.isArray(cart)) n = cart.reduce((s, i) => s + (i.qty || 1), 0);
  } catch { n = 0; }
  document.querySelectorAll('.bs-cart-count').forEach((b) => {
    b.textContent = n > 9 ? '9+' : String(n);
    b.style.display = n > 0 ? 'inline-flex' : 'none';
  });
}

function img(p) {
  if (!p || !p.image) return '/assets/images/products/btcml.jpg';
  return String(p.image).startsWith('/') ? p.image : `/assets/images/products/${p.image}`;
}

const usd = (n) => `$${Number(n || 0).toLocaleString('en-US')}`;

export default function Cart() {
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setItems(readCart());
      try {
        const r = await fetch('/api/products', { cache: 'no-store' });
        const j = await r.json();
        const map = {};
        for (const p of j.products || []) map[p.slug] = p;
        setProducts(map);
      } catch { /* keep going with localStorage data */ }
      setLoading(false);
    })();
  }, []);

  useEffect(() => { if (!loading) syncBadge(); }, [items, loading]);

  const rows = useMemo(
    () => items.map((i) => ({ item: i, p: products[i.slug] || {} })).filter((r) => r.p.slug),
    [items, products]
  );
  const total = rows.reduce((s, r) => s + Number(r.p.new_price || 0) * (r.item.qty || 1), 0);

  function save(next) {
    setItems(next);
    localStorage.setItem('btcmlai_cart', JSON.stringify(next));
    syncBadge();
  }
  const qty = (slug, d) => save(items.map((i) => (i.slug === slug ? { ...i, qty: Math.max(1, Math.min(10, (i.qty || 1) + d)) } : i)));
  const remove = (slug) => save(items.filter((i) => i.slug !== slug));

  if (loading) {
    return (
      <div className="bs-container">
        <div className="bs-card bs-card--pad" style={{ maxWidth: 460, margin: '60px auto' }}>
          <p className="bs-note" style={{ textAlign: 'center' }}>Loading your cart…</p>
        </div>
      </div>
    );
  }

  if (!rows.length) {
    return (
      <div className="bs-container">
        <Card pad={false}>
          <EmptyState
            title="Your cart is empty"
            text="Browse our rule-based trading software and add a product — delivery is instant and digital."
          >
            <Btn href="/shop">Browse Software</Btn>
          </EmptyState>
        </Card>
      </div>
    );
  }

  return (
    <div className="bs-container">
      <div className="bs-cart">
        <Card>
          <div className="bs-cart-head">
            <h2>Order items</h2>
            <Chip tone="slate">{rows.length} {rows.length === 1 ? 'item' : 'items'}</Chip>
          </div>

          {rows.map(({ item, p }) => {
            const price = Number(p.new_price || 0);
            const q = item.qty || 1;
            return (
              <div className="bs-cart-row" key={item.slug}>
                <Link href={`/products/${item.slug}`} className="bs-thumb" aria-label={p.name}>
                  <img src={img(p)} alt={p.name || item.slug} loading="lazy" />
                </Link>
                <div className="bs-cart-info">
                  <h3><Link href={`/products/${item.slug}`}>{p.name || item.slug}</Link></h3>
                  <p>{usd(price)} · single-account licence · instant digital delivery</p>
                </div>
                <div className="bs-qty">
                  <button type="button" onClick={() => qty(item.slug, -1)} aria-label={`Decrease quantity of ${p.name}`}>−</button>
                  <span aria-live="polite">{q}</span>
                  <button type="button" onClick={() => qty(item.slug, 1)} aria-label={`Increase quantity of ${p.name}`}>+</button>
                </div>
                <div className="bs-line-total">{usd(price * q)}</div>
                <button type="button" className="bs-remove" onClick={() => remove(item.slug)} aria-label={`Remove ${p.name} from cart`}>
                  <Trash2 size={17} aria-hidden="true" />
                </button>
              </div>
            );
          })}
        </Card>

        <Card className="bs-summary">
          <h3>Order summary</h3>
          <div className="bs-summary-row"><span>Subtotal</span><b>{usd(total)}</b></div>
          <div className="bs-summary-row"><span>Digital delivery</span><b>Free</b></div>
          <div className="bs-summary-row"><span>Licence type</span><b>Single account</b></div>
          <div className="bs-summary-total"><span>Total due</span><b>{usd(total)}</b></div>

          <Btn variant="gold" block href="/checkout">
            Proceed to Checkout
          </Btn>
          <Btn variant="ghost" block href="/shop" style={{ marginTop: 10 }}>
            Continue Shopping
          </Btn>

          <div className="bs-trust">
            <ShieldCheck size={16} aria-hidden="true" />
            <span>Secure checkout · USDT (BEP20) crypto payment</span>
          </div>
          <div className="bs-trust" style={{ marginTop: 8 }}>
            <Lock size={16} aria-hidden="true" />
            <span>We never accept or hold client trading funds</span>
          </div>
        </Card>
      </div>
    </div>
  );
}