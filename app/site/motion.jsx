'use client';

import { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';

/* ---------- floating particle field (admin's #particles-bg, client-built) ---------- */
export function ParticleField({ count = 18 }) {
  const [bits, setBits] = useState([]);
  useEffect(() => {
    setBits(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        size: 4 + Math.random() * 12,
        left: Math.random() * 100,
        delay: -(Math.random() * 22),
        dur: 18 + Math.random() * 14,
      }))
    );
  }, [count]);
  return (
    <div className="bs-particles" aria-hidden="true">
      {bits.map((b) => (
        <span
          key={b.id}
          className="bs-particle"
          style={{
            width: b.size,
            height: b.size,
            left: `${b.left}%`,
            animationDelay: `${b.delay}s`,
            animationDuration: `${b.dur}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ---------- reveal-on-scroll for .bs-reveal children ---------- */
export function RevealOnScroll() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll('.bs-reveal'));
    if (!els.length) return;
    if (typeof IntersectionObserver === 'undefined') {
      els.forEach((el) => el.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add('is-in');
            io.unobserve(en.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.06 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  });
  return null;
}

/* ---------- back to top ---------- */
export function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  if (!show) return null;
  return (
    <button
      type="button"
      className="bs-backtop"
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <ChevronRight size={20} style={{ transform: 'rotate(-90deg)' }} aria-hidden="true" />
    </button>
  );
}

/* ============================================================
   MOBILE NAV — burger + slide-in drawer
   ============================================================ */
export function MobileNav({ items }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <button
        type="button"
        className="bs-burger"
        aria-label="Open menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
          <path d="M3 6h18M3 12h18M3 18h18" />
        </svg>
      </button>

      <div
        className={`bs-drawer-backdrop${open ? ' is-open' : ''}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
      <aside className={`bs-drawer${open ? ' is-open' : ''}`} aria-hidden={!open}>
        <div className="bs-drawer-head">
          <b>BTCMLTAI</b>
          <button type="button" className="bs-drawer-x" aria-label="Close menu" onClick={() => setOpen(false)}>
            &times;
          </button>
        </div>
        {items.map((it) => (
          <a
            key={it.href}
            href={it.href}
            className={`bs-drawer-link${it.active ? ' is-active' : ''}`}
            onClick={() => setOpen(false)}
          >
            {it.icon}
            {it.label}
          </a>
        ))}
        <div className="bs-drawer-sep" />
        <a href="/login" className="bs-drawer-link" onClick={() => setOpen(false)}>Log In</a>
        <a href="/shop" className="bs-btn bs-btn--gold bs-btn--block" style={{ marginTop: 12 }} onClick={() => setOpen(false)}>
          Shop Software
        </a>
      </aside>
    </>
  );
}

/* ============================================================
   CART BADGE — keeps the header pill count correct on every
   page (fb-cart.js also updates it after add-to-cart clicks)
   ============================================================ */
export function CartBadge() {
  useEffect(() => {
    const sync = () => {
      let n = 0;
      try {
        const cart = JSON.parse(localStorage.getItem('btcmlai_cart') || '[]');
        if (Array.isArray(cart)) n = cart.reduce((s, i) => s + (i.qty || 1), 0);
      } catch { n = 0; }
      document.querySelectorAll('.bs-cart-count').forEach((b) => {
        b.textContent = n > 9 ? '9+' : String(n);
        b.style.display = n > 0 ? 'inline-flex' : 'none';
      });
    };
    sync();
    window.addEventListener('storage', sync);
    window.addEventListener('focus', sync);
    window.addEventListener('pageshow', sync);
    const t = setInterval(sync, 1200);
    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener('focus', sync);
      window.removeEventListener('pageshow', sync);
      clearInterval(t);
    };
  }, []);
  return null;
}