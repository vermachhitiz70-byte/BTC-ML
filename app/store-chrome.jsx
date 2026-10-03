const NAV = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

export function StoreHeader({ active = '' }) {
  return (
    <header className="st-header">
      <div className="st-container st-header-inner">
        <a className="st-logo" href="/">
          <img src="/assets/images/btcmlai-logo.png" alt="BTCMLTAI" width={42} height={42} />
          <b>BTCML<span>TAI</span></b>
        </a>
        <nav className="st-nav" aria-label="Primary">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className={n.href === active ? 'is-active' : ''}>{n.label}</a>
          ))}
        </nav>
        <div className="st-header-actions">
          <a className="st-cart-pill" href="/cart">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            Cart
            <span className="fb-cart-count" />
          </a>
        </div>
      </div>
    </header>
  );
}

export function StoreFooter() {
  return (
    <footer className="st-footer">
      <div className="st-container">
        <div className="st-footer-grid">
          <div>
            <a className="st-footer-brand" href="/">
              <img src="/assets/images/btcmlai-logo.png" alt="BTCMLTAI" width={38} height={38} />
              BTCML<span>TAI</span>
            </a>
            <p>
              Rule-based MT4/MT5 trading software, market-analysis tools, digital delivery,
              installation guidance and customer support. Review compatibility, licence terms
              and risk disclosures before purchase.
            </p>
          </div>
          <div>
            <h4>Quick Links</h4>
            <ul className="st-footer-links">
              <li><a href="/shop">Shop Software</a></li>
              <li><a href="/cart">Cart</a></li>
              <li><a href="/blog">Blog &amp; Guides</a></li>
              <li><a href="/faqs">FAQs</a></li>
              <li><a href="/contact">Contact Us</a></li>
            </ul>
          </div>
          <div>
            <h4>Information</h4>
            <ul className="st-footer-links">
              <li><a href="/terms-condition">Terms &amp; Conditions</a></li>
              <li><a href="/privacy-policy">Privacy Policy</a></li>
              <li><a href="/refund-policy">Refund Policy</a></li>
              <li><a href="/shipping-policy">Digital Delivery</a></li>
              <li><a href="/account">My Account</a></li>
            </ul>
          </div>
        </div>
        <div className="st-footer-note" role="note">
          Trading involves substantial risk. Past performance never guarantees future results.
          Always test on a demo account first and never trade with funds you cannot afford to lose.
        </div>
        <div className="st-footer-bottom">
          <span>© {new Date().getFullYear()} BTCMLTAI. All rights reserved.</span>
          <span>Instant digital delivery · Support within 2–3 hours</span>
        </div>
      </div>
    </footer>
  );
}
