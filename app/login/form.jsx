'use client';

import { useState } from 'react';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      if (!r.ok) throw new Error(j.error || 'Login failed.');
      window.location.href = j.user && j.user.role === 'admin' ? '/admin' : '/account';
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fb-auth-wrap">
      <div className="fb-auth-card">
        <span className="fb-auth-kicker">Welcome back</span>
        <h1>Login</h1>
        <p className="fb-auth-sub">Access your orders and account details.</p>
        <form onSubmit={submit}>
          <label>Email address<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" autoComplete="email" /></label>
          <label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" autoComplete="current-password" /></label>
          {err ? <div className="fb-auth-err">{err}</div> : null}
          <button type="submit" disabled={busy}>{busy ? 'Please wait…' : 'Login'}</button>
        </form>
        <p className="fb-auth-alt">New customer? <a href="/signup">Create an account</a></p>
      </div>
    </div>
  );
}
