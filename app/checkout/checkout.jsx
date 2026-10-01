'use client';

import { useEffect, useState } from 'react';

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
      <div className="fb-auth-wrap"><div className="fb-auth-card">
        <span className="fb-auth-kicker">Checkout</span>
        <h1>Your cart is empty</h1>
        <p className="fb-auth-sub"><a href="/shop">Browse software</a> to add products.</p>
      </div></div>
    );
  }

  return (
    <div className="fb-auth-wrap fb-co-page">
      <div className="fb-auth-card">
        <span className="fb-auth-kicker">Secure checkout — step {Math.min(step, 3)} of 3</span>
        <h1>{step === 3 ? 'Order Confirmed' : 'Checkout'}</h1>

        {step === 1 && (
          <form onSubmit={detailsNext}>
            <div className="fb-order-list">
              {items.map((i) => {
                const p = products[i.slug] || {};
                return <div className="fb-order-row" key={i.slug}><div><strong>{p.name || i.slug}</strong><div className="fb-order-meta">${Number(p.new_price || 0).toLocaleString()} × {i.qty || 1}</div></div></div>;
              })}
            </div>
            <div className="fb-cart-total">Total: <strong>${total.toLocaleString()}</strong></div>
            <label>Full name<input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" maxLength={60} /></label>
            <label>Email address<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" /></label>
            <label>Phone number<input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" /></label>
            {err ? <div className="fb-auth-err">{err}</div> : null}
            <button type="submit">Continue to Payment</button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={placeOrder}>
            <div className="fb-pay-box">
              <div className="fb-pay-row"><span>Amount to pay</span><strong>${total.toLocaleString()} in {settings.pay_coin}</strong></div>
              <div className="fb-pay-row"><span>Wallet address</span><code>{settings.pay_address}</code></div>
              {settings.pay_qr ? <img className="fb-pay-qr" src={settings.pay_qr} alt="Crypto payment QR code" /> : null}
              <p className="fb-auth-sub">Send the exact amount, then enter your transaction hash ID and payment screenshot below.</p>
            </div>
            <label>Transaction hash ID<input value={tx} onChange={(e) => setTx(e.target.value)} placeholder="e.g. 0xabc123…" maxLength={200} /></label>
            <label>Payment screenshot<input type="file" accept="image/*" onChange={onFile} /></label>
            {shot ? <img className="fb-pay-shot" src={shot} alt="Payment screenshot preview" /> : null}
            {err ? <div className="fb-auth-err">{err}</div> : null}
            <button type="submit" disabled={busy}>{busy ? 'Placing order…' : 'Confirm Order'}</button>
            <button type="button" className="fb-auth-ghost" onClick={() => setStep(1)}>Back</button>
          </form>
        )}

        {step === 3 && done && (
          <div className="fb-pay-done">
            <span className="fb-pay-tick">✓</span>
            <h2>Thank you for your order. Your order has been confirmed.</h2>
            <p>Order ID: <strong>{done.order_code}</strong></p>
            <p className="fb-auth-sub">Our team will verify your payment and contact you within 24 hours.</p>
            <a className="fb-auth-btn" href="/shop">Continue Shopping</a>
          </div>
        )}
      </div>
    </div>
  );
}
