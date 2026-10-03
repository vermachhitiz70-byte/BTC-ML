'use client';

import { useEffect, useState } from 'react';

function StepBar({ step }) {
  const labels = ['Your Details', 'Payment', 'Confirmation'];
  return (
    <div className="st-steps">
      {labels.map((label, i) => {
        const n = i + 1;
        const cls = n < step ? 'is-done' : n === step ? 'is-active' : '';
        return (
          <span key={label} style={{ display: 'inline-flex', alignItems: 'center' }}>
            {i > 0 ? <span className="st-step-line" /> : null}
            <span className={`st-step ${cls}`}>
              <span className="st-step-dot">{n < step ? '✓' : n}</span>
              {label}
            </span>
          </span>
        );
      })}
    </div>
  );
}

export default function Checkout() {
  const [step, setStep] = useState(1);
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState({});
  const [settings, setSettings] = useState({ pay_coin: 'USDT (BEP20)', pay_address: '', pay_qr: '' });
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [tx, setTx] = useState('');
  const [shot, setShot] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(null);

  useEffect(() => {
    try {
      setItems(JSON.parse(localStorage.getItem('btcmlai_cart') || '[]'));
    } catch { setItems([]); }
    fetch('/api/products').then((r) => r.json()).then((j) => {
      const map = {};
      for (const p of j.products || []) map[p.slug] = p;
      setProducts(map);
    }).catch(() => {});
    fetch('/api/settings').then((r) => r.json()).then((j) => {
      if (j.settings) setSettings((s) => ({ ...s, ...j.settings }));
    }).catch(() => {});
  }, []);

  const total = items.reduce((s, i) => s + Number((products[i.slug] || {}).new_price || 0) * (i.qty || 1), 0);

  function onFile(e) {
    setErr('');
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    if (!f.type.startsWith('image/')) { setErr('Please upload an image file.'); return; }
    const img = new Image();
    img.onload = () => {
      const max = 1000;
      const k = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement('canvas');
      c.width = Math.round(img.width * k);
      c.height = Math.round(img.height * k);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      const data = c.toDataURL('image/jpeg', 0.72);
      if (data.length > 1400000) { setErr('Image is too large. Please use a smaller screenshot.'); return; }
      setShot(data);
      URL.revokeObjectURL(img.src);
    };
    img.onerror = () => setErr('Could not read that image.');
    img.src = URL.createObjectURL(f);
  }

  async function placeOrder(e) {
    e.preventDefault();
    setErr('');
    if (tx.trim().length < 10) { setErr('Please enter your transaction hash ID.'); return; }
    if (!shot) { setErr('Please upload your payment screenshot.'); return; }
    setBusy(true);
    try {
      const r = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, name, email, phone, coin: settings.pay_coin, tx_hash: tx.trim(), screenshot: shot }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || 'Order failed.');
      localStorage.setItem('btcmlai_cart', '[]');
      setItems([]);
      setDone(j);
      setStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e2) {
      setErr(e2.message);
    } finally {
      setBusy(false);
    }
  }

  function detailsNext(e) {
    e.preventDefault();
    setErr('');
    if (name.trim().length < 2) return setErr('Please enter your full name.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setErr('Please enter a valid email address.');
    if (!/^[+\d][\d\s\-()]{5,19}$/.test(phone.trim())) return setErr('Please enter a valid phone number.');
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (!items.length && !done) {
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
            <p>Add a product to your cart to continue to secure checkout.</p>
            <a className="st-btn" href="/shop">Browse Software</a>
          </div>
        </div>
      </section>
    );
  }

  if (step === 3 && done) {
    return (
      <section className="st-section">
        <div className="st-container">
          <div className="st-panel" style={{ maxWidth: 640, margin: '0 auto' }}>
            <StepBar step={3} />
            <div className="st-done">
              <span className="st-done-tick">✓</span>
              <h2>Thank you for your order</h2>
              <p className="st-note" style={{ marginBottom: 0 }}>Your order has been confirmed.</p>
              <div className="st-order-code">{done.order_code}</div>
              <p className="st-note" style={{ marginTop: 16 }}>
                Our team will verify your payment and contact you within 2 to 3 hours.
              </p>
              <a className="st-btn" href="/shop">Continue Shopping</a>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="st-section">
      <div className="st-container">
        <div className="st-section-head" style={{ marginBottom: 0 }}>
          <span className="st-eyebrow">Secure Checkout</span>
          <h1 className="st-h1" style={{ fontSize: 'clamp(26px, 3.4vw, 34px)' }}>Complete Your Order</h1>
        </div>
        <StepBar step={step} />

        <div className="st-co-layout">
          <div className="st-panel">
            {step === 1 && (
              <form onSubmit={detailsNext}>
                <div className="st-panel-head">
                  <h2>Delivery Details</h2>
                  <span className="st-chip">Step 1 of 2</span>
                </div>
                <div className="st-field">
                  <label>Full name</label>
                  <input className="st-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" maxLength={60} />
                </div>
                <div className="st-field">
                  <label>Email address</label>
                  <input className="st-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
                </div>
                <div className="st-field">
                  <label>Phone number</label>
                  <input className="st-input" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" />
                </div>
                {err ? <div className="st-err">{err}</div> : null}
                <button className="st-btn st-btn-block" type="submit">
                  Continue to Payment
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={placeOrder}>
                <div className="st-panel-head">
                  <h2>Payment</h2>
                  <span className="st-chip">Step 2 of 2</span>
                </div>
                <div className="st-field">
                  <label>Transaction hash ID</label>
                  <input className="st-input" value={tx} onChange={(e) => setTx(e.target.value)} placeholder="e.g. 0xabc123…" maxLength={200} />
                </div>
                <div className="st-field">
                  <label>Payment screenshot</label>
                  <label className="st-file-btn">
                    Upload Screenshot
                    <input type="file" accept="image/*" onChange={onFile} style={{ display: 'none' }} />
                  </label>
                </div>
                {shot ? <img className="st-shot-preview" src={shot} alt="Payment screenshot preview" /> : null}
                {err ? <div className="st-err">{err}</div> : null}
                <button className="st-btn st-btn-block" type="submit" disabled={busy}>
                  {busy ? 'Placing order…' : 'Confirm Order'}
                </button>
                <button type="button" className="st-btn-ghost st-btn-block" style={{ marginTop: 12 }} onClick={() => setStep(1)}>
                  Back to Details
                </button>
              </form>
            )}
          </div>

          <div className="st-pay-card">
            <h3>Order Summary</h3>
            {items.map((i) => {
              const p = products[i.slug] || {};
              return (
                <div className="st-pay-row" key={i.slug}>
                  <span>{p.name || i.slug} × {i.qty || 1}</span>
                  <strong>${(Number(p.new_price || 0) * (i.qty || 1)).toLocaleString('en-US')}</strong>
                </div>
              );
            })}
            <div className="st-pay-row">
              <span>Total due</span>
              <strong>${total.toLocaleString('en-US')} in {settings.pay_coin}</strong>
            </div>
            {settings.pay_address ? (
              <>
                <code className="st-addr">{settings.pay_address}</code>
                {settings.pay_qr ? <img className="st-qr" src={settings.pay_qr} alt="Crypto payment QR code" /> : null}
              </>
            ) : null}
            <p className="st-note" style={{ marginBottom: 0 }}>
              Send the exact amount to the wallet address above, then enter your transaction hash ID
              and payment screenshot to confirm your order.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
