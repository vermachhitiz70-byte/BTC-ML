import {
  Check, CheckCircle, CircleCheck, CircleQuestionMark, Menu, ArrowRight,
  ChevronRight, TriangleAlert, Wallet, ShieldCheck, Truck, Clock, Headset,
  Package, ShoppingCart, Gauge, Target, Layers, Sparkles,
} from 'lucide-react';

/* ============================================================
   btc-site UI primitives — the storefront siblings of the
   admin's adm-* components. Same tokens, same 3D language.
   ============================================================ */

const TONES = {
  blue: 'bs-tile--blue',
  emerald: 'bs-tile--emerald',
  amber: 'bs-tile--amber',
  purple: 'bs-tile--purple',
  pink: 'bs-tile--pink',
  slate: 'bs-tile--slate',
  gold: 'bs-tile--gold',
};

const CHIP_TONES = {
  green: 'bs-chip--green',
  amber: 'bs-chip--amber',
  slate: 'bs-chip--slate',
  red: 'bs-chip--red',
  blue: 'bs-chip--blue',
  gold: 'bs-chip--gold',
};

/** 3D icon tile — identical recipe to the admin's .adm-nav-tile */
export function Tile({ icon: Icon, tone = 'blue', size = '' }) {
  return (
    <span className={`bs-tile ${TONES[tone] || TONES.blue}${size ? ` bs-tile--${size}` : ''}`}>
      <Icon size={size === 'sm' ? 17 : size === 'lg' ? 26 : 21} aria-hidden="true" />
    </span>
  );
}

export function Card({ pad = true, hover = false, gold = false, className = '', children, ...rest }) {
  const cls = [
    'bs-card',
    pad ? 'bs-card--pad' : '',
    hover ? 'bs-card--hover' : '',
    gold ? 'bs-card--gold' : '',
    className,
  ].filter(Boolean).join(' ');
  return <div className={cls} {...rest}>{children}</div>;
}

export function Chip({ tone = 'slate', children, className = '' }) {
  return <span className={`bs-chip ${CHIP_TONES[tone] || CHIP_TONES.slate} ${className}`}>{children}</span>;
}

/** 3D button. Renders <a> when href is given, otherwise <button>. */
export function Btn({ href, variant = '', size = '', block = false, className = '', children, ...rest }) {
  const cls = [
    'bs-btn',
    variant ? `bs-btn--${variant}` : '',
    size ? `bs-btn--${size}` : '',
    block ? 'bs-btn--block' : '',
    className,
  ].filter(Boolean).join(' ');
  if (href) {
    return <a className={cls} href={href} {...rest}>{children}</a>;
  }
  return <button type="button" className={cls} {...rest}>{children}</button>;
}

export function Eyebrow({ tone = '', children }) {
  return <span className={`bs-eyebrow${tone ? ` bs-eyebrow--${tone}` : ''}`}>{children}</span>;
}

export function SectionHead({ eyebrow, tone, title, sub, light = false, align = 'center', className = '' }) {
  return (
    <div className={`bs-section-head${align === 'left' ? ' bs-section-head--left' : ''} ${className}`}>
      {eyebrow ? <Eyebrow tone={light ? 'gold' : tone}>{eyebrow}</Eyebrow> : null}
      <h2 className={`bs-title${light ? ' bs-title--light' : ''}`}>{title}</h2>
      {sub ? <p className={`bs-subtitle${light ? ' bs-subtitle--light' : ''}`}>{sub}</p> : null}
    </div>
  );
}

export function Stats({ items, cols = 3 }) {
  return (
    <div className={`bs-stats${cols === 4 ? ' bs-stats--4' : ''}`}>
      {items.map((it) => (
        <Card key={it.title} className="bs-stat">
          <Tile icon={it.icon} tone={it.tone || 'blue'} />
          <div>
            <b>{it.title}</b>
            <p>{it.text}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}

export function FeatureGrid({ items, cols = 3 }) {
  return (
    <div className={`bs-features${cols === 2 ? ' bs-features--2' : ''}`}>
      {items.map((it) => (
        <Card key={it.title} hover className="bs-feature">
          <Tile icon={it.icon} tone={it.tone || 'blue'} size="lg" />
          <h3>{it.title}</h3>
          <p>{it.text}</p>
        </Card>
      ))}
    </div>
  );
}

export function StepRow({ items }) {
  return (
    <div className="bs-steps">
      {items.map((it, i) => (
        <Card key={it.title} hover className={`bs-step${i === 0 ? ' bs-step--gold' : ''}`}>
          <div className="bs-step-num">{i + 1}</div>
          <h3>{it.title}</h3>
          <p>{it.text}</p>
        </Card>
      ))}
    </div>
  );
}

export function CheckList({ items, light = false }) {
  return (
    <ul className={`bs-checklist${light ? ' bs-checklist--light' : ''}`}>
      {items.map((t) => (
        <li key={t}>
          <CheckCircle size={19} aria-hidden="true" />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

export function RiskNote({ children }) {
  return (
    <div className="bs-risk">
      <TriangleAlert size={19} aria-hidden="true" />
      <div>{children}</div>
    </div>
  );
}

export function CtaBand({ title, text, children }) {
  return (
    <div className="bs-cta">
      <div>
        <h3>{title}</h3>
        {text ? <p>{text}</p> : null}
      </div>
      {children}
    </div>
  );
}

export function Breadcrumb({ items, light = false }) {
  return (
    <ul className={`bs-breadcrumb${light ? ' bs-breadcrumb--light' : ''}`}>
      {items.map((it, i) => (
        <li key={it.label} style={{ display: 'inline-flex', alignItems: 'center', gap: 9 }}>
          {i > 0 ? <ChevronRight size={13} aria-hidden="true" /> : null}
          {it.href ? <a href={it.href}>{it.label}</a> : <span>{it.label}</span>}
        </li>
      ))}
    </ul>
  );
}

/** Navy interior-page hero */
export function PageHero({ eyebrow, title, text, crumbs }) {
  return (
    <section className="bs-pagehero">
      <div className="bs-container">
        <div className="bs-pagehero-inner">
          {crumbs ? <Breadcrumb items={crumbs} /> : null}
          {eyebrow ? <div style={{ marginTop: 14 }}><Eyebrow tone="gold">{eyebrow}</Eyebrow></div> : null}
          <h1 className="bs-pagehero-title">{title}</h1>
          {text ? <p className="bs-pagehero-text">{text}</p> : null}
        </div>
      </div>
    </section>
  );
}

/** Accordion built on <details> so it works with zero JS */
export function Accordion({ items }) {
  return (
    <div className="bs-acc">
      {items.map((it) => (
        <details className="bs-acc-item" key={it.q}>
          <summary>{it.q}</summary>
          <div className="bs-acc-body">
            <p>{it.a}</p>
          </div>
        </details>
      ))}
    </div>
  );
}

export function Specs({ rows }) {
  return (
    <dl className="bs-specs">
      {rows.map((r) => (
        <div className="bs-spec-row" key={r.k}>
          <dt>{r.k}</dt>
          <dd>{r.v}</dd>
        </div>
      ))}
    </dl>
  );
}

export function EmptyState({ icon: Icon = ShoppingCart, title, text, children }) {
  return (
    <div className="bs-empty">
      <div className="bs-empty-icon"><Icon size={36} aria-hidden="true" /></div>
      <h2>{title}</h2>
      {text ? <p>{text}</p> : null}
      {children}
    </div>
  );
}

/* small icon helpers reused across pages */
export const I = {
  check: Check,
  checkCircle: CircleCheck,
  faq: CircleQuestionMark,
  menu: Menu,
  arrow: ArrowRight,
  alert: TriangleAlert,
  wallet: Wallet,
  shield: ShieldCheck,
  truck: Truck,
  clock: Clock,
  support: Headset,
  package: Package,
  cart: ShoppingCart,
  gauge: Gauge,
  target: Target,
  layers: Layers,
  sparkles: Sparkles,
};