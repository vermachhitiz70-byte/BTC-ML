'use client';

import { useEffect, useState, useMemo } from 'react';
import { ChevronRight, TrendingUp, TrendingDown } from 'lucide-react';
import Script from 'next/script';

/* ---------- live market ticker (TradingView tape widget) — full bar ---------- */
export function LiveMarketTicker() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <div className="bs-market-ticker-wrap" aria-label="Market watch">
        <div className="bs-market-ticker-label">
          <span className="bs-market-pulse" aria-hidden="true"></span>
          <span>MARKET WATCH</span>
        </div>
        <div className="bs-market-ticker-widget">
          {ready ? (
            <tv-ticker-tape
              id="bsLiveMarketTicker"
              symbols="BITSTAMP:BTCUSD,BITSTAMP:ETHUSD,OANDA:XAUUSD,NASDAQ:AAPL,NASDAQ:NVDA,NASDAQ:TSLA,NASDAQ:MSFT,FOREXCOM:SPXUSD"
              item-size="compact"
              theme="dark"
              transparent
            >
              <div className="bs-market-loading">Loading market data…</div>
            </tv-ticker-tape>
          ) : (
            <div className="bs-market-loading">Loading market data…</div>
          )}
          <div className="bs-market-click-guard" aria-hidden="true"></div>
        </div>
      </div>
      <Script type="module" src="https://widgets.tradingview-widget.com/w/en/tv-ticker-tape.js" />
    </>
  );
}

/* ---------- live price ticker (scrolling marquee) ---------- */
export function LiveTicker() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function fetchPrices() {
      try {
        const res = await fetch('/api/ticker', { cache: 'no-store' });
        if (!res.ok) throw new Error('ticker fetch failed');
        const data = await res.json();
        if (!cancelled) {
          setItems(data.items || []);
          setLoading(false);
        }
      } catch (e) {
        console.error('[LiveTicker] fetch error:', e);
        if (!cancelled) setLoading(false);
      }
    }
    fetchPrices();
    const interval = setInterval(fetchPrices, 60000);
    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  /* duplicate list for seamless loop */
  const trackItems = useMemo(() => [...items, ...items], [items]);

  if (loading || !items.length) return null;

  return (
    <div className="bs-ticker" aria-live="polite" aria-label="Live market prices">
      <div className="bs-ticker-track">
        {trackItems.map((it, idx) => (
          <span key={`${it.symbol}-${idx}`} className="bs-ticker-item">
            <span className="bs-ticker-symbol">{it.symbol}</span>
            <span className={`bs-ticker-price ${it.up ? 'up' : 'down'}`}>
              {it.price ? formatPrice(it.symbol, it.price) : '—'}
            </span>
            {it.change !== 0 && (
              <span className={`bs-ticker-change ${it.up ? 'up' : 'down'}`}>
                {it.up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                {Math.abs(it.change).toFixed(2)}%
              </span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}

function formatPrice(symbol, price) {
  if (symbol === 'BTC') return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  if (symbol === 'ETH') return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  /* forex pairs */
  if (price >= 100) return price.toFixed(2);      // USDJPY ~150
  if (price >= 1) return price.toFixed(4);        // EURUSD, GBPUSD, etc.
  return price.toFixed(5);
}

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

/* ---------- reveal-on-scroll for .bs-reveal children ----------
   Safety: a fallback timer reveals everything even if
   IntersectionObserver never fires, so content can never stay hidden. */
export function RevealOnScroll() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll('.bs-reveal'));
    if (!els.length) return;

    const revealAll = () => els.forEach((el) => el.classList.add('is-in'));

    if (typeof IntersectionObserver === 'undefined') {
      revealAll();
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

    const fallback = setTimeout(revealAll, 1500);

    return () => {
      clearTimeout(fallback);
      io.disconnect();
    };
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

/* ============================================================
   TILT IMAGE — 3D mouse tilt for the hero art.
   Gold aura follows the cutout shape, flare + pedestal glow
   behind it, cursor-tracked glare on top.
   ============================================================ */
export function TiltImage({ src, alt, width = 520, height = 520 }) {
  const [t, setT] = useState({ rx: 0, ry: 0, gx: 50, gy: 50, live: false });
  const reduceMotion =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function onMove(e) {
    if (reduceMotion) return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    setT({ rx: (0.5 - py) * 14, ry: (px - 0.5) * 18, gx: px * 100, gy: py * 100, live: true });
  }
  function onLeave() {
    setT({ rx: 0, ry: 0, gx: 50, gy: 50, live: false });
  }

  return (
    <div className="bs-hero-stage" onMouseMove={onMove} onMouseLeave={onLeave}>
      <div className="bs-hero-flare" aria-hidden="true" />
      <div className="bs-hero-ring" aria-hidden="true" />
      <div className="bs-hero-float">
        <div
          className={`bs-tilt${t.live ? ' is-live' : ''}`}
          style={{ transform: `rotateX(${t.rx}deg) rotateY(${t.ry}deg)` }}
        >
          <img src={src} alt={alt} width={width} height={height} />
          <span
            className={`bs-tilt-glare${t.live ? ' is-on' : ''}`}
            aria-hidden="true"
            style={{
              background: `radial-gradient(circle at ${t.gx}% ${t.gy}%, rgba(255, 226, 122, 0.30), transparent 55%)`,
            }}
          />
        </div>
      </div>
      <div className="bs-hero-pedestal" aria-hidden="true" />
    </div>
  );
}