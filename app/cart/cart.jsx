'use client';

import { useEffect, useState } from 'react';

export function readCart() {
  try {
    return JSON.parse(localStorage.getItem('btcmlai_cart') || '[]');
  } catch {
    return [];
  }
}

function syncBadge() {
  try {
    const cart = JSON.parse(localStorage.getItem('btcmlai_cart') || '[]');
    const n = cart.reduce((s, i) => s + (i.qty || 1), 0);
    const b = document.querySelector('a[href="/cart"] .fb-cart-count');
    if (b) {
      b.textContent = n > 9 ? '9+' : String(n);
      b.style.display = n > 0 ? 'inline-flex' : 'none';
    }
  } catch { /* ignore */ }
}

function productImage(p) {
  if (!p || !p.image) return '/assets/images/products/btcml.png';
  return p.image.startsWith('/') ? p.image : `/assets/images/products/${p.image}`;
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

  useEffect(() => {
    if (!loading) syncBadge();
  }, [items, loading]);

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

  if (loading) {
    return (
      <section className="st-section">
        <div className="st-container" style={{ textAlign: 'center', color: 'var(--st-muted)' }}>Loading your cart…</div>
      </section>
    );
  }

  if (!items.length) {
    return (
      <section className="st-section">
        <div className="st-container">
          <div className="st-empty">
            <span className="st-empty-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
            </span>
            <h2>Your cart is empty</h2>
            <p>Browse our rule-based trading software and add a product to get started with instant digital delivery.</p>
            <a className="st-btn" href="/shop">Browse Software</a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="st-section">
      <div className="st-container">
        <div className="st-section-head" style={{ marginBottom: 30 }}>
          <span className="st-eyebrow">Your Cart</span>
          <h1 className="st-h1" style={{ fontSize: 'clamp(26px, 3.4vw, 34px)' }}>Shopping Cart</h1>
        </div>

        <div className="st-cart-layout">
          <div className="st-panel">
            <div className="st-panel-head">
              <h2>Order Items</h2>
              <span className="st-chip">{items.length} {items.length === 1 ? 'item' : 'items'}</span>
            </div>
            {items.map((i) => {
              const p = products[i.slug] || {};
              const price = Number(p.new_price || 0);
              return (
                <div className="st-cart-row" key={i.slug}>
                  <div className="st-thumb">
                    <img src={productImage(p)} alt={p.name || i.slug} loading="lazy" />
                  </div>
                  <div className="st-cart-main">
                    <p className="st-cart-name"><a href={`/products/${i.slug}`}>{p.name || i.slug}</a></p>
                    <div className="st-cart-meta">${price.toLocaleString('en-US')} · one-time licence · digital delivery</div>
                  </div>
                  <div className="st-qty">
                    <button type="button" onClick={() => qty(i.slug, -1)} aria-label="Decrease quantity">−</button>
                    <span>{i.qty || 1}</span>
                    <button type="button" onClick={() => qty(i.slug, 1)} aria-label="Increase quantity">+</button>
                  </div>
                  <div className="st-line-total">${(price * (i.qty || 1)).toLocaleString('en-US')}</div>
                  <button type="button" className="st-remove" onClick={() => remove(i.slug)} aria-label="Remove item">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>

          <div className="st-panel st-summary">
            <h3>Order Summary</h3>
            <div className="st-summary-row"><span>Subtotal</span><strong>${total.toLocaleString('en-US')}</strong></div>
            <div className="st-summary-row"><span>Delivery</span><strong>Digital · Free</strong></div>
            <div className="st-summary-total">
              <span>Total due</span>
              <strong>${total.toLocaleString('en-US')}</strong>
            </div>
            <button className="st-btn st-btn-block" onClick={async () => {
              try {
                const me = await fetch('/api/auth/me').then((r) => r.json());
                window.location.href = me && me.user ? '/checkout' : '/login?next=/checkout';
              } catch {
                window.location.href = '/login?next=/checkout';
              }
            }}>
              Proceed to Checkout
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
            <a className="st-btn-ghost st-btn-block" href="/shop" style={{ marginTop: 12 }}>Continue Shopping</a>
            <div className="st-secure-note">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Secure checkout · USDT (BEP20) crypto payment
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
