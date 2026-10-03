import Script from 'next/script';
import { StoreHeader, StoreFooter } from '../store-chrome';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "BTCMLTAI Basic Software | MT4 Trading Tools",
  description: "Explore BTCMLTAI basic MT4 trading software, product information, access requirements, digital delivery details, licence information, and risk disclosures.",
  alternates: { canonical: "https://btcmltai.com/shop" },
  openGraph: {
    title: "BTCMLTAI Basic Software | MT4 Trading Tools",
    description: "Explore BTCMLTAI basic MT4 trading software, product information, access requirements, digital delivery details, licence information, and risk disclosures.",
    url: "https://btcmltai.com/shop",
    siteName: "BTCMLTAI",
    type: "website",
    images: [{ url: "https://btcmltai.com/assets/images/products/btcml.png", width: 1254, height: 1254, alt: "BTCMLTAI Basic Software | MT4 Trading Tools" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "BTCMLTAI Basic Software | MT4 Trading Tools",
    description: "Explore BTCMLTAI basic MT4 trading software, product information, access requirements, digital delivery details, licence information, and risk disclosures.",
    images: ["https://btcmltai.com/assets/images/products/btcml.png"],
  },
};

async function getProducts() {
  try {
    const { dbEnabled, getDb } = await import('@/lib/turso');
    const { SEED_PRODUCTS } = await import('@/lib/seed');
    if (!dbEnabled) return SEED_PRODUCTS;
    const rs = await getDb().execute(
      'SELECT slug, name, short_desc, new_price, old_price, image, badge, status, active, sort_order FROM products WHERE active = 1 ORDER BY sort_order, id'
    );
    return rs.rows.map((r) => ({ ...r, active: Number(r.active) }));
  } catch {
    return [];
  }
}

function productImage(product) {
  const image = product.image || '/assets/images/products/btcml.png';
  return image.startsWith('/') ? image : `/assets/images/products/${image}`;
}

function ProductCard({ product }) {
  const isComingSoon = product.status === 'coming_soon';
  const price = product.new_price ? Number(product.new_price).toLocaleString('en-US') : '';
  return (
    <article className="st-card">
      <div className="st-card-media">
        {product.badge ? <span className={`st-card-badge ${isComingSoon ? 'is-soon' : 'is-live'}`}>{product.badge}</span> : (
          isComingSoon ? <span className="st-card-badge is-soon">Coming Soon</span> : <span className="st-card-badge is-live">Available</span>
        )}
        <a href={`/products/${product.slug}`} aria-label={product.name}>
          <img src={productImage(product)} alt={product.name} loading="lazy" />
        </a>
      </div>
      <div className="st-card-body">
        <h3 className="st-card-name">
          <a href={`/products/${product.slug}`}>{product.name}</a>
        </h3>
        <p className="st-card-desc">
          {product.short_desc || 'Rule-based automated trading system with structured risk controls, digital delivery and installation guidance.'}
        </p>
        <div className="st-card-foot">
          {isComingSoon ? (
            <span className="st-price-soon">Coming Soon</span>
          ) : (
            <span className="st-price">${price}<small>USD · one-time licence</small></span>
          )}
          {isComingSoon ? (
            <a className="st-btn-ghost st-btn-sm" href="#chat" data-fb-chat="1">Notify Me</a>
          ) : (
            <a className="st-btn st-btn-sm" href="javascript:void(0)" data-add-cart={product.slug}>
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              Add to Cart
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export default async function Page() {
  const products = (await getProducts()).filter((p) => p.active === 1 && p.status !== 'draft');

  return (
    <div className="st-page">
      <link rel="icon" href="/assets/images/btcmlai-logo.png" type="image/png" />
      <link rel="stylesheet" href="/assets/css/fb-store.css?v=1" />
      <link rel="stylesheet" href="/assets/css/fb-cart.css?v=1" />
      <link rel="stylesheet" href="/assets/css/fb-chatbot.css?v=2" />
      <StoreHeader active="/shop" />

      <section className="st-section">
        <div className="st-container">
          <div className="st-section-head">
            <span className="st-eyebrow">Premium Trading Software</span>
            <h1 className="st-h1">Our Products</h1>
            <p className="st-sub">
              Rule-based Expert Advisors engineered for structured entries, disciplined risk
              controls and instant digital delivery.
            </p>
          </div>

          <div className="st-grid">
            {products.map((p) => <ProductCard key={p.slug} product={p} />)}
          </div>

          {products.length === 0 ? (
            <div className="st-empty">
              <h2>Products are being updated</h2>
              <p>Please check back shortly. Meanwhile, our team is ready to answer your questions.</p>
              <a className="st-btn" href="/contact">Contact Support</a>
            </div>
          ) : null}
        </div>
      </section>

      <section className="st-section" style={{ background: 'rgba(4, 20, 37, 0.45)' }}>
        <div className="st-container">
          <div className="st-section-head">
            <span className="st-eyebrow is-green">Before You Order</span>
            <h2 className="st-h2">Review Product Requirements</h2>
            <p className="st-sub">
              Before purchasing, please ensure your setup meets the following requirements for
              optimal performance.
            </p>
          </div>
          <div className="st-req-grid">
            <div className="st-req-card">
              <h4>Platform</h4>
              <p>MetaTrader 5 (MT5) — Build 3300+</p>
            </div>
            <div className="st-req-card">
              <h4>Account Type</h4>
              <p>Hedging enabled, leverage 1:100 or higher</p>
            </div>
            <div className="st-req-card">
              <h4>VPS</h4>
              <p>Low-latency VPS (recommended for 24/7 operation)</p>
            </div>
            <div className="st-req-card">
              <h4>Symbols</h4>
              <p>BTCUSD, XAUUSD, major Forex pairs</p>
            </div>
          </div>
        </div>
      </section>

      <section className="st-section tight">
        <div className="st-container">
          <div className="st-strip">
            <div>
              <h3>Ready to trade with structure?</h3>
              <p>
                Every product ships with instant digital delivery, setup files and installation
                guidance. Our support team responds within 2–3 hours.
              </p>
            </div>
            <a className="st-btn" href="/contact">Talk to Our Team</a>
          </div>
        </div>
      </section>

      <StoreFooter />

      <Script src="/assets/js/fb-cart.js?v=2" strategy="afterInteractive" />
      <Script src="/assets/js/fb-chatbot.js?v=3" strategy="afterInteractive" />
      <div id="fb-chat-root" suppressHydrationWarning />
    </div>
  );
}
