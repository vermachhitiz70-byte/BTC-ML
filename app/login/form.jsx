'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CircleAlert, Eye, EyeOff, LogIn } from 'lucide-react';
import { AuthShell, AuthHead, DEFAULT_FEATS } from '../site/auth';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setErr('');
    setBusy(true);
    try {
      const r = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || 'Login failed. Please try again.');
      if (j.user && j.user.role === 'admin') {
        window.location.href = '/admin';
        return;
      }
      const next = new URLSearchParams(window.location.search).get('next');
      const dest = next && next.startsWith('/') && !next.startsWith('//') ? next : '/account';
      window.location.href = dest;
    } catch (e2) {
      setErr(e2.message);
      setBusy(false);
    }
  }

  return (
    <AuthShell
      feats={DEFAULT_FEATS}
      chip="Secure customer account"
      sideTitle="Welcome back"
      sideText="Log in to your BTCMLTAI account"
      head={<AuthHead icon={LogIn}>Customer Login</AuthHead>}
      title="Sign in"
      sub="Access your orders, licences and delivery details."
      alt={<>New customer? <Link href="/signup">Create an account</Link></>}
    >
      <form onSubmit={submit} noValidate>
        <div className="bs-field">
          <label className="bs-label" htmlFor="login-email">Email address</label>
          <input
            id="login-email"
            className="bs-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            required
          />
        </div>

        <div className="bs-field">
          <label className="bs-label" htmlFor="login-password">Password</label>
          <div className="bs-pw">
            <input
              id="login-password"
              className="bs-input"
              type={show ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              className="bs-eye"
              onClick={() => setShow((v) => !v)}
              aria-label={show ? 'Hide password' : 'Show password'}
            >
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
          {busy ? 'Signing in…' : 'Sign In'}
        </button>
      </form>
    </AuthShell>
  );
}