import Script from 'next/script';
import Link from 'next/link';
import {
  House, Info, ShoppingBag, BookOpen, CircleQuestionMark, Headset, GalleryHorizontalEnd,
  ShieldCheck, Zap, Clock, Wallet, MessageSquare,
} from 'lucide-react';
import { ParticleField, RevealOnScroll, BackToTop, MobileNav, CartBadge, LiveMarketTicker } from './motion';

/* re-exported so page files can pull the whole page kit from one place */
export { PageHero, Breadcrumb } from './ui';

export const NAV = [
  { href: '/', label: 'Home', icon: House },
  { href: '/about', label: 'About', icon: Info },
  { href: '/shop', label: 'Shop', icon: ShoppingBag },
  { href: '/blog', label: 'Blog', icon: BookOpen },
  { href: '/faqs', label: 'FAQs', icon: CircleQuestionMark },
  { href: '/contact', label: 'Contact', icon: Headset },
];

const DRAWER_EXTRA = [
  { href: '/gallery', label: 'Gallery', icon: GalleryHorizontalEnd },
  { href: '/account', label: 'My Account', icon: House },
];

/* ---------- JSON-LD ---------- */
export function JsonLd({ data }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

const ORG_ID = 'https://btcmltai.com/#organization';
const SITE_ID = 'https://btcmltai.com/#website';

const ORG_DESCRIPTION =
  'BTCMLTAI provides rule-based MT5 trading software, market-analysis tools, general educational video guides, digital delivery, installation guidance, and customer support. Review compatibility, licence terms, product information, and risk disclosures before purchase.';

export function SiteJsonLd() {
  return (
    <>
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'Organization',
        '@id': ORG_ID,
        name: 'BTCMLTAI',
        url: 'https://btcmltai.com/',
        logo: { '@type': 'ImageObject', url: 'https://btcmltai.com/assets/images/btcmlai-logo.png' },
        description: ORG_DESCRIPTION,
        contactPoint: { '@type': 'ContactPoint', contactType: 'customer support', availableLanguage: ['English', 'Hindi'] },
      }} />
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': SITE_ID,
        name: 'BTCMLTAI',
        url: 'https://btcmltai.com/',
        description: ORG_DESCRIPTION,
        publisher: { '@id': ORG_ID },
        inLanguage: 'en',
      }} />
    </>
  );
}

/* ---------- scripts (widgets) ---------- */
export function SiteScripts({ cart = true, chat = true }) {
  return (
    <>
      {chat ? (
        <>
          <link rel="stylesheet" href="/assets/css/fb-chatbot.css?v=3" />
          <Script src="/assets/js/fb-chatbot.js?v=4" strategy="afterInteractive" />
          <div id="fb-chat-root" suppressHydrationWarning />
        </>
      ) : null}
      {cart ? (
        <>
          <link rel="stylesheet" href="/assets/css/fb-cart.css?v=2" />
          <Script src="/assets/js/fb-cart.js?v=2" strategy="afterInteractive" />
        </>
      ) : null}
    </>
  );
}

/* ---------- top bar: full-width live market watch ---------- */
export function TopBar() {
  return (
    <div className="bs-topbar">
      <div className="bs-topbar-inner">
        <LiveMarketTicker />
      </div>
    </div>
  );
}

/* ---------- header ---------- */
export function SiteHeader({ active = '' }) {
  const drawer = [...NAV, ...DRAWER_EXTRA].map((n) => ({
    ...n,
    icon: <n.icon size={17} aria-hidden="true" />,
    active: n.href === active,
  }));

  return (
    <header className="bs-header">
      <div className="bs-container bs-header-inner">
        <Link className="bs-logo" href="/">
          <span className="bs-logo-mark">
            <img src="/assets/images/btcmlai-logo.png" alt="" width={34} height={34} />
          </span>
          <span className="bs-logo-text">
            <b>BTCMLTAI</b>
            <span>Trading Software</span>
          </span>
        </Link>

        <nav className="bs-nav" aria-label="Primary">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className={`bs-nav-link${n.href === active ? ' is-active' : ''}`}>
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="bs-header-actions">
          <Link href="/contact" className="bs-nav-link" data-fb-chat>Live Chat</Link>
          <Link href="/account" className="bs-nav-link" aria-label="My account">Account</Link>
          <Link href="/cart" className="bs-cart-pill" aria-label="Cart">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            Cart
            <span className="bs-cart-count" />
          </Link>
          <MobileNav items={drawer} />
        </div>
      </div>
    </header>
  );
}

/* ---------- footer ---------- */
export function SiteFooter() {
  return (
    <footer className="bs-footer">
      <div className="bs-container">
        <div className="bs-footer-top">
          <div>
            <Link className="bs-footer-brand" href="/">
              <span className="bs-logo-mark">
                <img src="/assets/images/btcmlai-logo.png" alt="" width={34} height={34} />
              </span>
              <b style={{ color: '#fff', fontSize: 19, fontWeight: 800 }}>BTCMLTAI</b>
            </Link>
            <p>
              Digital trading software, market-analysis tools, general educational video guides,
              installation guidance and customer support. Review product compatibility, licence
              terms, delivery information and risk disclosures before purchase.
            </p>
            <p style={{ display: 'flex', gap: 18, flexWrap: 'wrap', marginTop: 16 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
                <ShieldCheck size={15} style={{ color: 'var(--bs-gold)' }} /> No client funds
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
                <Zap size={15} style={{ color: 'var(--bs-gold)' }} /> Instant delivery
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
                <Clock size={15} style={{ color: 'var(--bs-gold)' }} /> 2–3 hour support
              </span>
            </p>
          </div>

          <div>
            <h3 className="bs-footer-title">Explore</h3>
            <ul className="bs-footer-links">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/shop">Shop Software</Link></li>
              <li><Link href="/gallery">Gallery</Link></li>
              <li><Link href="/blog">Blog &amp; Guides</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="bs-footer-title">Support</h3>
            <ul className="bs-footer-links">
              <li><Link href="/faqs">FAQs</Link></li>
              <li><Link href="/contact">Contact Us</Link></li>
              <li><Link href="/account">My Account</Link></li>
              <li><Link href="/cart">Cart</Link></li>
              <li><Link href="/checkout">Checkout</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="bs-footer-title">Information</h3>
            <ul className="bs-footer-links">
              <li><Link href="/terms-condition">Terms &amp; Conditions</Link></li>
              <li><Link href="/privacy-policy">Privacy Policy</Link></li>
              <li><Link href="/refund-policy">Refund Policy</Link></li>
              <li><Link href="/shipping-policy">Digital Delivery</Link></li>
              <li><Link href="/login">Log In</Link></li>
            </ul>
          </div>
        </div>

        <div className="bs-footer-note">
          <strong style={{ color: 'var(--bs-gold-lite)' }}>Risk disclaimer:</strong>{' '}
          Trading involves substantial risk. Past performance never guarantees future results.
          Always test on a demo account first and never trade with funds you cannot afford to
          lose. BTCMLTAI provides digital software and general educational materials only — we do
          not provide brokerage, personalised investment advice, or fund management, we do not
          accept client trading funds, and we never guarantee profit or any specific result.
        </div>

        <div className="bs-footer-bottom">
          <span>&copy; {new Date().getFullYear()} BTCMLTAI. All rights reserved.</span>
          <span>Instant digital delivery &middot; Support within 2&ndash;3 hours</span>
        </div>
      </div>
    </footer>
  );
}

/* ---------- the whole page shell ---------- */
export function PageShell({ active = '', cart = true, chat = true, children }) {
  return (
    <div className="bs-page">
      <link rel="icon" href="/assets/images/btcmlai-logo.png" type="image/png" />
      <link rel="apple-touch-icon" href="/assets/images/btcmlai-logo.png" />
      <link rel="stylesheet" href="/assets/css/btc-site.css?v=3" />
      <ParticleField />
      <TopBar />
      <SiteHeader active={active} />
      <main>{children}</main>
      <SiteFooter />
      <RevealOnScroll />
      <BackToTop />
      <CartBadge />
      <SiteScripts cart={cart} chat={chat} />
    </div>
  );
}