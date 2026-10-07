'use client';

import { useState } from 'react';
import { CircleAlert, CircleCheck, Send } from 'lucide-react';

export default function ContactForm() {
  const [f, setF] = useState({ name: '', email: '', phone: '', subject: '', body: '' });
  const [err, setErr] = useState('');
  const [ok, setOk] = useState(false);
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setErr('');
    setOk(false);
    setBusy(true);
    try {
      const r = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(f),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || 'Could not send your message.');
      setOk(true);
      setF({ name: '', email: '', phone: '', subject: '', body: '' });
    } catch (e2) {
      setErr(e2.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} noValidate>
      <div className="bs-field-row">
        <div className="bs-field">
          <label className="bs-label" htmlFor="ct-name">Your name *</label>
          <input id="ct-name" className="bs-input" value={f.name} onChange={set('name')} placeholder="Enter your full name" autoComplete="name" required />
        </div>
        <div className="bs-field">
          <label className="bs-label" htmlFor="ct-phone">Phone number *</label>
          <input id="ct-phone" className="bs-input" type="tel" value={f.phone} onChange={set('phone')} placeholder="+91 98765 43210" autoComplete="tel" required />
        </div>
      </div>

      <div className="bs-field">
        <label className="bs-label" htmlFor="ct-email">Email address *</label>
        <input id="ct-email" className="bs-input" type="email" value={f.email} onChange={set('email')} placeholder="Enter your email address" autoComplete="email" required />
      </div>

      <div className="bs-field">
        <label className="bs-label" htmlFor="ct-subject">What is it about?</label>
        <input id="ct-subject" className="bs-input" value={f.subject} onChange={set('subject')} placeholder="e.g. Product compatibility, order help, refund request" maxLength={120} />
      </div>

      <div className="bs-field">
        <label className="bs-label" htmlFor="ct-body">Your message *</label>
        <textarea id="ct-body" className="bs-textarea" value={f.body} onChange={set('body')} placeholder="Tell us what you need so we can help faster" maxLength={3000} required />
      </div>

      {err ? (
        <div className="bs-alert bs-alert--error" role="alert" style={{ marginBottom: 16 }}>
          <CircleAlert size={17} aria-hidden="true" /><span>{err}</span>
        </div>
      ) : null}

      {ok ? (
        <div className="bs-alert bs-alert--ok" role="status" style={{ marginBottom: 16 }}>
          <CircleCheck size={17} aria-hidden="true" />
          <span>Thank you — your message has reached our team. We reply within 2 to 3 hours.</span>
        </div>
      ) : null}

      <button type="submit" className="bs-btn bs-btn--gold bs-btn--block" disabled={busy}>
        <Send size={16} aria-hidden="true" />
        {busy ? 'Sending your message…' : 'Send Your Message'}
      </button>
    </form>
  );
}