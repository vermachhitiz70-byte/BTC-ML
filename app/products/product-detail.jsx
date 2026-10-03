import Script from 'next/script';
import { StoreHeader, StoreFooter } from '../store-chrome';
import { PRODUCT_CONTENT } from './product-content';

async function getProducts() {
  try {
    const { dbEnabled, getDb } = await import('@/lib/turso');
    const { SEED_PRODUCTS } = await import('@/lib/seed');
    if (!dbEnabled) return SEED_PRODUCTS;
    const rs = await getDb().execute(
      'SELECT slug, name, short_desc, new_price, old_price, image, badge, status, active, sort_order FROM products WHERE active = 1 AND status != \'draft\' ORDER BY sort_order, id'
    );
    return rs.rows.map((r) => ({ ...r, active: Number(r.active) }));
  } catch {
    return [];
  }
}

function productImage(product, fallback) {
  if (!product) return fallback;
  const image = product.image || fallback;
  return image.startsWith('/') ? image : `/assets/images/products/${image}`;
}

const FALLBACK_IMAGES = {
  'btc-x-ea-mt5': '/assets/images/products/btcml.png',
  'galaxy-prop-firm-ea-mt5': '/assets/images/products/currency-bot-coins.png',
  'ict-silver-bullet-ea-mt4': '/assets/images/products/silver-package.png',
};

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

export default async function ProductDetail({ slug }) {
  const content = PRODUCT_CONTENT[slug];
  if (!content) return null;

  const products = await getProducts();
  const product = products.find((p) => p.slug === slug) || { slug, name: content.name, status: content.comingSoon ? 'coming_soon' : 'active' };
  const related = products.filter((p) => p.slug !== slug).slice(0, 2);
  const price = product.new_price ? Number(product.new_price) : 0;
  const oldPrice = product.old_price && product.old_price !== product.new_price ? Number(product.old_price) : 0;
  const isSoon = content.comingSoon || product.status === 'coming_soon';
  const relatedFallback = { 'btc-x-ea-mt5': FALLBACK_IMAGES['btc-x-ea-mt5'], 'galaxy-prop-firm-ea-mt5': FALLBACK_IMAGES['galaxy-prop-firm-ea-mt5'], 'ict-silver-bullet-ea-mt4': FALLBACK_IMAGES['ict-silver-bullet-ea-mt4'] };

  return (
    <div className="st-page">
      <link rel="icon" href="/assets/images/btcmlai-logo.png" type="image/png" />
      <link rel="stylesheet" href="/assets/css/fb-store.css?v=1" />
      <link rel="stylesheet" href="/assets/css/fb-cart.css?v=1" />
      <link rel="stylesheet" href="/assets/css/fb-chatbot.css?v=2" />
      <StoreHeader active="" />

      <div className="st-container">
        <div className="st-pdp-hero">
          <div className="st-pdp-media">
            <img src={productImage(product, relatedFallback[slug])} alt={content.name} />
          </div>
          <div>
            <span className="st-eyebrow">{isSoon ? 'Upcoming Release' : 'Automated Trading'}</span>
            <h1 className="st-h1">{content.name}</h1>
            <div className="st-pdp-badges">
              {product.badge ? <span className={`st-chip ${isSoon ? '' : 'is-gold'}`}>{product.badge}</span> : null}
              {content.specs.slice(0, 3).map((s) => <span key={s.k} className="st-chip">{s.v}</span>)}
            </div>
            <p className="st-pdp-desc">{content.desc}</p>

            {isSoon ? (
              <>
                <div className="st-pdp-price-row">
                  <span className="st-price-soon" style={{ fontSize: '24px' }}>Coming Soon</span>
                </div>
                <p className="st-note">{content.statusNote}</p>
                <div className="st-buy-row">
                  <a className="st-btn" href="#chat" data-fb-chat="1">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h14s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
                    </svg>
                    Notify Me at Launch
                  </a>
                </div>
              </>
            ) : (
              <>
                <div className="st-pdp-price-row">
                  <span className="st-pdp-price fb-sp-new">${price.toLocaleString('en-US')}</span>
                  {oldPrice ? <span className="st-pdp-price-old">${oldPrice.toLocaleString('en-US')}</span> : null}
                  <span className="st-chip">one-time licence</span>
                </div>
                <div className="st-buy-row fb-sp-info">
                  <div className="st-qty" style={{ flex: '0 0 auto' }}>
                    <button type="button" data-qty="-1" aria-label="Decrease quantity">−</button>
                    <input id="fb-sp-qty" type="number" min="1" max="10" defaultValue={1} style={{ width: 44, textAlign: 'center', padding: '8px 4px' }} aria-label="Quantity" />
                    <button type="button" data-qty="1" aria-label="Increase quantity">+</button>
                  </div>
                  <a className="st-btn" href="javascript:void(0)" data-add-cart={slug}>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                    </svg>
                    Add to Cart
                  </a>
                  <a className="st-btn-ghost" data-buy-now={slug}>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                    </svg>
                    Buy Now
                  </a>
                </div>
                <div className="st-pdp-deliver">
                  <div><CheckIcon /> Instant digital delivery with setup files</div>
                  <div><CheckIcon /> Installation guidance included</div>
                  <div><CheckIcon /> Support response within 2–3 hours</div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <section className="st-section" style={{ paddingTop: 26 }}>
        <div className="st-container">
          <div className="st-section-head">
            <span className="st-eyebrow is-green">{content.whyTitle}</span>
          </div>
          <ul className="st-feature-list">
            {content.why.map((f) => (
              <li key={f}><CheckIcon />{f}</li>
            ))}
          </ul>
        </div>
      </section>

      {content.features ? (
        <section className="st-section" style={{ background: 'rgba(4, 20, 37, 0.45)' }}>
          <div className="st-container">
            <div className="st-section-head">
              <span className="st-eyebrow">Key Features</span>
              <h2 className="st-h2">What {content.name} Does</h2>
            </div>
            <ul className="st-feature-list">
              {content.features.map((f) => (
                <li key={f}><CheckIcon />{f}</li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {content.usage ? (
        <section className="st-section">
          <div className="st-container">
            <div className="st-section-head">
              <span className="st-eyebrow is-green">Tool Usage</span>
              <h2 className="st-h2">Getting Started</h2>
            </div>
            <div className="st-usage-grid">
              {content.usage.map((step, i) => (
                <div key={step} className="st-usage-card">
                  <span className="st-usage-num">{i + 1}</span>
                  <p>{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="st-section" style={{ background: 'rgba(4, 20, 37, 0.45)' }}>
        <div className="st-container" style={{ maxWidth: 860 }}>
          <div className="st-section-head">
            <span className="st-eyebrow">Specifications</span>
            <h2 className="st-h2">{content.name} Details</h2>
          </div>
          <dl className="st-spec-table">
            {content.specs.map((s) => (
              <div className="st-spec-row" key={s.k}>
                <dt>{s.k}</dt>
                <dd>{s.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="st-section">
        <div className="st-container" style={{ maxWidth: 860 }}>
          <div className="st-section-head">
            <span className="st-eyebrow is-green">FAQs</span>
            <h2 className="st-h2">Frequently Asked Questions</h2>
          </div>
          <div className="st-faq">
            {content.faqs.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <div className="st-faq-a">{f.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {related.length ? (
        <section className="st-section tight" style={{ background: 'rgba(4, 20, 37, 0.45)' }}>
          <div className="st-container">
            <div className="st-section-head">
              <span className="st-eyebrow">Related Products</span>
              <h2 className="st-h2">More From BTCMLTAI</h2>
            </div>
            <div className="st-related-grid">
              {related.map((p) => {
                const soon = p.status === 'coming_soon';
                const relContent = PRODUCT_CONTENT[p.slug];
                return (
                  <div className="st-related-card" key={p.slug}>
                    <div className="st-thumb">
                      <img src={productImage(p, relatedFallback[p.slug] || '/assets/images/products/btcml.png')} alt={p.name} loading="lazy" />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p className="st-related-name"><a href={`/products/${p.slug}`}>{p.name}</a></p>
                      <p className="st-related-sub">{soon ? 'Coming soon — in final testing' : (relContent ? relContent.why[0] : 'Rule-based automated trading system.')}</p>
                      {soon ? (
                        <a className="st-btn-ghost st-btn-sm" href={`/products/${p.slug}`}>View Details</a>
                      ) : (
                        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                          <span className="st-price" style={{ fontSize: '17px' }}>${Number(p.new_price).toLocaleString('en-US')}</span>
                          <a className="st-btn st-btn-sm" href={`/products/${p.slug}`}>View Details</a>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}

      <StoreFooter />

      <Script src="/assets/js/fb-cart.js?v=2" strategy="afterInteractive" />
      <Script src="/assets/js/fb-chatbot.js?v=3" strategy="afterInteractive" />
      <div id="fb-chat-root" suppressHydrationWarning />
    </div>
  );
}
