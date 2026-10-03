'use client';

import { useEffect, useState } from 'react';

export function readCart() {
  try {
    return JSON.parse(localStorage.getItem('btcmlai_cart') || '[]');
  } catch {
    return [];
  }
}

export default function Cart() {
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setItems(readCart());
      try {
        const r = await fetch('/api/products').then((x) => x.json());
        const map = {};
        for (const p of r.products || []) map[p.slug] = p;
        setProducts(map);
      } catch { /* ignore */ }
      setLoading(false);
    })();
  }, []);

  function save(next) {
    setItems(next);
    localStorage.setItem('btcmlai_cart', JSON.stringify(next));
  }
  function qty(slug, d) {
    save(items.map((i) => (i.slug === slug ? { ...i, qty: Math.max(1, Math.min(10, (i.qty || 1) + d)) } : i)));
  }
  function remove(slug) {
    save(items.filter((i) => i.slug !== slug));
  }

  const total = items.reduce((s, i) => s + Number((products[i.slug] || {}).new_price || 0) * (i.qty || 1), 0);

  if (loading) return <div className="fb-auth-wrap"><div className="fb-auth-card"><p>Loading…</p></div></div>;

  return (
    <div className="fb-auth-wrap fb-cart-wrap">
      <div className="fb-auth-card">
        <span className="fb-auth-kicker">Your cart</span>
        <h1>Shopping Cart</h1>
        {!items.length ? (
          <p className="fb-auth-sub">Your cart is empty. <a href="/shop">Browse software</a></p>
        ) : (
          <>
            <div className="fb-order-list">
              {items.map((i) => {
                const p = products[i.slug] || {};
                return (
                  <div className="fb-order-row" key={i.slug}>
                    <div>
                      <strong>{p.name || i.slug}</strong>
                      <div className="fb-order-meta">${Number(p.new_price || 0).toLocaleString()} × {i.qty || 1}</div>
                    </div>
                    <div className="fb-cart-actions">
                      <button onClick={() => qty(i.slug, -1)} aria-label="Decrease">−</button>
                      <button onClick={() => qty(i.slug, 1)} aria-label="Increase">+</button>
                      <button onClick={() => remove(i.slug)} aria-label="Remove">×</button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="fb-cart-total">Total: <strong>${total.toLocaleString()}</strong></div>
            <button className="fb-auth-btn" onClick={async () => {
              try {
                const me = await fetch('/api/auth/me').then((r) => r.json());
                window.location.href = me && me.user ? '/checkout' : '/login?next=/checkout';
              } catch {
                window.location.href = '/login?next=/checkout';
              }
            }}>Proceed to Checkout</button>
          </>
        )}
      </div>
    </div>
  );
}
