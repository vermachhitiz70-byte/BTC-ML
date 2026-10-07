'use client';

import { useEffect, useState } from 'react';
import { CircleAlert, CircleCheck, Copy, QrCode, Wallet, Package } from 'lucide-react';
import { Btn, Card, Chip, EmptyState, SectionHead } from '../site/ui';

const usd = (n) => `$${Number(n || 0).toLocaleString('en-US')}`;

function Steps({ step }) {
  const labels = ['Your details', 'Payment', 'Confirmation'];
  return (
    <div className="bs-stepsbar">
      {labels.map((label, i) => {
        const n = i + 1;
        const cls = n < step ? 'is-done' : n === step ? 'is-on' : '';
        return (
          <span key={label} style={{ display: 'inline-flex', alignItems: 'center' }}>
            {i > 0 ? <span className="bs-stepsline" /> : null}
            <span className={`bs-stepsitem ${cls}`}>
              <span className="bs-stepsdot">{n < step ? '✓' : n}</span>
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
  const [copied, setCopied] = useState(false);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(null);

  useEffect(() => {
    try {
      const v = JSON.parse(localStorage.getItem('btcmlai_cart') || '[]');
      setItems(Array.isArray(v) ? v : []);
    } catch { setItems([]); }
    fetch('/api/products', { cache: 'no-store' })
      .then((r) => r.json())
      .then((j) => {
        const map = {};
        for (const p of j.products || []) map[p.slug] = p;
        setProducts(map);
      })
      .catch(() => {});
    fetch('/api/settings', { cache: 'no-store' })
      .then((r) => r.json())
      .then((j) => { if (j.settings) setSettings((s) => ({ ...s, ...j.settings })); })
      .catch(() => {});
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
      if (!r.ok) throw new Error(j.error || 'Order could not be placed.');
      localStorage.setItem('btcmlai_cart', '[]');
      document.querySelectorAll('.bs-cart-count').forEach((b) => { b.style.display = 'none'; });
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

  function copyAddr() {
    if (!settings.pay_address) return;
    navigator.clipboard?.writeText(settings.pay_address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (!items.length && !done) {
    return (
      <div className="bs-container">
        <Card pad={false}>
          <EmptyState
            title="Your cart is empty"
            text="Add a product to your cart before starting checkout."
          >
            <Btn href="/shop">Browse Software</Btn>
          </EmptyState>
        </Card>
      </div>
    );
  }

  if (step === 3 && done) {
    return (
      <div className="bs-container">
        <Card style={{ maxWidth: 620, margin: '0 auto' }}>
          <Steps step={3} />
          <div className="bs-done">
            <div className="bs-done-tick"><CircleCheck size={40} aria-hidden="true" /></div>
            <h2>Thank you for your order</h2>
            <p className="bs-note" style={{ margin: 0 }}>Your order has been received and is pending payment verification.</p>
            <div className="bs-code bs-mono">{done.order_code}</div>
            <p className="bs-note" style={{ marginTop: 16 }}>
              Our team verifies the transaction and contacts you within 2 to 3 hours with your
              licence and setup files.
            </p>
            <div style={{ marginTop: 24 }}>
              <Btn href="/shop">Continue Shopping</Btn>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="bs-container">
      <Steps step={step} />

      <div className="bs-co">
        <Card>
          {step === 1 ? (
            <form onSubmit={detailsNext} noValidate>
              <div className="bs-cart-head">
                <h2>Delivery details</h2>
                <Chip tone="slate">Step 1 of 2</Chip>
              </div>

              <div className="bs-field">
                <label className="bs-label" htmlFor="co-name">Full name</label>
                <input id="co-name" className="bs-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" autoComplete="name" maxLength={60} />
              </div>

              <div className="bs-field-row">
                <div className="bs-field">
                  <label className="bs-label" htmlFor="co-email">Email address</label>
                  <input id="co-email" className="bs-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" />
                </div>
                <div className="bs-field">
                  <label className="bs-label" htmlFor="co-phone">Phone number</label>
                  <input id="co-phone" className="bs-input" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" autoComplete="tel" />
                </div>
              </div>

              <div className="bs-alert bs-alert--info" style={{ marginBottom: 20 }}>
                <CircleCheck size={17} aria-hidden="true" />
                <span>Your licence, setup files and installation guidance are delivered to this email address.</span>
              </div>

              {err ? (
                <div className="bs-alert bs-alert--error" role="alert" style={{ marginBottom: 16 }}>
                  <CircleAlert size={17} aria-hidden="true" /><span>{err}</span>
                </div>
              ) : null}

              <Btn variant="gold" block type="submit">Continue to Payment</Btn>
            </form>
          ) : (
            <form onSubmit={placeOrder} noValidate>
              <div className="bs-cart-head">
                <h2>Payment proof</h2>
                <Chip tone="slate">Step 2 of 2</Chip>
              </div>

              <div className="bs-field">
                <label className="bs-label" htmlFor="co-tx">Transaction hash ID</label>
                <input id="co-tx" className="bs-input bs-mono" value={tx} onChange={(e) => setTx(e.target.value)} placeholder="0x…" maxLength={200} />
              </div>

              <div className="bs-field">
                <label className="bs-label" htmlFor="co-shot">Payment screenshot</label>
                <label className={`bs-file${shot ? ' has-file' : ''}`} htmlFor="co-shot">
                  <CircleCheck size={18} aria-hidden="true" />
                  {shot ? 'Screenshot attached — click to replace' : 'Upload your payment screenshot'}
                  <input id="co-shot" type="file" accept="image/*" onChange={onFile} />
                </label>
              </div>

              {shot ? <img className="bs-shot" src={shot} alt="Payment screenshot preview" /> : null}

              {err ? (
                <div className="bs-alert bs-alert--error" role="alert" style={{ marginBottom: 16 }}>
                  <CircleAlert size={17} aria-hidden="true" /><span>{err}</span>
                </div>
              ) : null}

              <Btn variant="gold" block type="submit" disabled={busy}>
                {busy ? 'Placing your order…' : 'Confirm Order'}
              </Btn>
              <Btn variant="ghost" block type="button" style={{ marginTop: 10 }} onClick={() => setStep(1)}>
                Back to details
              </Btn>
            </form>
          )}
        </Card>

        <Card gold className="bs-pay">
          <h3><Wallet size={17} style={{ verticalAlign: -3, marginRight: 8 }} aria-hidden="true" />Payment details</h3>

          {items.map((i) => {
            const p = products[i.slug] || {};
            const q = i.qty || 1;
            return (
              <div className="bs-payrow" key={i.slug}>
                <span>{p.name || i.slug} × {q}</span>
                <b>{usd(Number(p.new_price || 0) * q)}</b>
              </div>
            );
          })}

          <div className="bs-payrow">
            <span>Total to pay</span>
            <b>{usd(total)} in {settings.pay_coin}</b>
          </div>

          {settings.pay_address ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 }}>
                <span className="bs-label">Wallet address</span>
                <button type="button" onClick={copyAddr} className="bs-btn bs-btn--ghost bs-btn--sm" style={{ padding: '6px 12px' }}>
                  <Copy size={13} aria-hidden="true" /> {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <code className="bs-addr">{settings.pay_address}</code>
              {settings.pay_qr ? <img className="bs-qr" src={settings.pay_qr} alt="Crypto payment QR code" /> : null}
            </>
          ) : null}

          <p className="bs-note" style={{ margin: 0 }}>
            <QrCode size={14} style={{ verticalAlign: -2, marginRight: 6 }} aria-hidden="true" />
            Send the exact amount to the address above, then enter your transaction hash and
            screenshot to confirm. Funds go directly to our wallet — we never hold client funds.
          </p>
        </Card>
      </div>

      <div style={{ marginTop: 28 }}>
        <SectionHead
          title="What happens next?"
          align="left"
          sub="Three quick steps from payment to delivery."
        />
        <div className="bs-features bs-features--2">
          {[
            { icon: Wallet, title: '1 · You pay the exact amount', text: `Send ${usd(total)} in ${settings.pay_coin} to the wallet above and keep your transaction hash.` },
            { icon: CircleCheck, title: '2 · We verify', text: 'Our team checks the transaction and confirms your order, usually within 2 to 3 hours.' },
            { icon: Package, title: '3 · You receive delivery', text: 'Licence, EA setup files and installation guidance are sent to your email.' },
          ].map((s) => (
            <Card key={s.title} hover>
              <h3 style={{ margin: '0 0 6px', fontSize: 16.5, fontWeight: 800, color: 'var(--bs-heading)' }}>{s.title}</h3>
              <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.7, color: 'var(--bs-muted)' }}>{s.text}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}