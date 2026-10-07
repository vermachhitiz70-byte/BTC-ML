'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CircleAlert, Eye, EyeOff, UserPlus } from 'lucide-react';
import { AuthShell, AuthHead, DEFAULT_FEATS } from '../site/auth';

export default function SignupForm() {
  const [f, setF] = useState({ name: '', email: '', phone: '', password: '' });
  const [show, setShow] = useState(false);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setErr('');
    setBusy(true);
    try {
      const r = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(f),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || 'Could not create your account.');
      window.location.href = '/login?next=%2Faccount';
    } catch (e2) {
      setErr(e2.message);
      setBusy(false);
    }
  }

  return (
    <AuthShell
      feats={DEFAULT_FEATS}
      chip="Free customer account"
      sideTitle="Create your account"
      sideText="Track orders, licences and downloads"
      head={<AuthHead icon={UserPlus}>Customer Signup</AuthHead>}
      title="Get started"
      sub="One account for every order, licence and installation guide."
      alt={<>Already registered? <Link href="/login">Log in instead</Link></>}
    >
      <form onSubmit={submit} noValidate>
        <div className="bs-field">
          <label className="bs-label" htmlFor="su-name">Full name</label>
          <input id="su-name" className="bs-input" value={f.name} onChange={set('name')} placeholder="Your full name" autoComplete="name" required />
        </div>

        <div className="bs-field">
          <label className="bs-label" htmlFor="su-email">Email address</label>
          <input id="su-email" className="bs-input" type="email" value={f.email} onChange={set('email')} placeholder="you@example.com" autoComplete="email" required />
        </div>

        <div className="bs-field">
          <label className="bs-label" htmlFor="su-phone">Phone number</label>
          <input id="su-phone" className="bs-input" type="tel" value={f.phone} onChange={set('phone')} placeholder="+91 98765 43210" autoComplete="tel" required />
        </div>

        <div className="bs-field">
          <label className="bs-label" htmlFor="su-password">Password</label>
          <div className="bs-pw">
            <input
              id="su-password"
              className="bs-input"
              type={show ? 'text' : 'password'}
              value={f.password}
              onChange={set('password')}
              placeholder="Create a password"
              autoComplete="new-password"
              required
            />
            <button type="button" className="bs-eye" onClick={() => setShow((v) => !v)} aria-label={show ? 'Hide password' : 'Show password'}>
              {show ? <EyeOff size={19} /> : <Eye size={19} />}
            </button>
          </div>
        </div>

        {err ? (
          <div className="bs-alert bs-alert--error" role="alert">
            <CircleAlert size={17} aria-hidden="true" />
            <span>{err}</span>
          </div>
        ) : null}

        <button type="submit" className="bs-btn bs-btn--gold bs-btn--block" disabled={busy}>
          {busy ? 'Creating your account…' : 'Create Account'}
        </button>
      </form>
    </AuthShell>
  );
}