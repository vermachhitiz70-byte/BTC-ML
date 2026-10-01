'use client';

import { useState } from 'react';

export default function SignupForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setErr('');
    setBusy(true);
    try {
      const r = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || 'Signup failed.');
      window.location.href = '/account';
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fb-auth-wrap">
      <div className="fb-auth-card">
        <span className="fb-auth-kicker">New customer</span>
        <h1>Create Account</h1>
        <p className="fb-auth-sub">Register to track orders and check out faster.</p>
        <form onSubmit={submit}>
          <label>Full name<input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" autoComplete="name" maxLength={60} /></label>
          <label>Email address<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" autoComplete="email" /></label>
          <label>Password (min 6 characters)<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" autoComplete="new-password" /></label>
          {err ? <div className="fb-auth-err">{err}</div> : null}
          <button type="submit" disabled={busy}>{busy ? 'Please wait…' : 'Register'}</button>
        </form>
        <p className="fb-auth-alt">Already registered? <a href="/login">Log in</a></p>
      </div>
    </div>
  );
}
