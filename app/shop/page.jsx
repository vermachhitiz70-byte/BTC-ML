import Script from 'next/script';
import { Suspense } from 'react';

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

function ProductCard({ product }) {
  const badge = product.badge || '';
  const isComingSoon = product.status === 'coming_soon';
  const price = product.new_price ? `$${Number(product.new_price).toLocaleString()}` : '';
  const oldPrice = product.old_price && product.old_price !== product.new_price ? `$${Number(product.old_price).toLocaleString()}` : '';
  const image = product.image || '/assets/images/products/btcml.png';
  const slug = product.slug;
  const name = product.name;

  return (
    <div className="single-product">
      <div className="product-img">
        <a href={`/products/${slug}`}>
          <img src={image.startsWith('/') ? image : `/assets/images/products/${image}`} alt={name} className="primary-img" />
        </a>
        <div className="add-actions">
          <ul>
            <li>
              <a href={`/products/${slug}`} className="fb-shop-card-details-btn" title="Details">
                <i className="fa fa-search" />
              </a>
            </li>
            {isComingSoon ? (
              <li>
                <a href="/#chat" className="fb-shop-card-buy-btn notify-btn" title="Notify Me">
                  Notify Me
                </a>
              </li>
            ) : (
              <>
                <li>
                  <a href={`/cart?add=${slug}`} className="fb-shop-card-buy-btn add-to-cart-btn" data-slug={slug} title="Add to Cart">
                    <i className="fa fa-shopping-bag" /> Add to Cart
                  </a>
                </li>
                <li>
                  <a href={`/products/${slug}`} className="fb-shop-card-buy-btn buy-now-btn" title="Buy Now">
                    <i className="fa fa-bolt" /> Buy Now
                  </a>
                </li>
              </>
            )}
          </ul>
        </div>
        {badge && <span className="fb-coming-badge">{badge}</span>}
      </div>
      <div className="product-content">
        <h6 className="product-name">
          <a href={`/products/${slug}`}>{name}</a>
        </h6>
        <div className="product-price">
          {price && <span className="new-price">{price}</span>}
          {oldPrice && <span className="old-price">{oldPrice}</span>}
        </div>
      </div>
    </div>
  );
}

function ProductSlider({ products, title }) {
  return (
    <section className="fb-product-area umino-product-tab_area" style={{ padding: '60px 0', background: 'linear-gradient(180deg, #06283d 0%, #0a3a5c 100%)' }}>
      <div className="container" style={{ maxWidth: '1140px' }}>
        <div className="fb-section-heading" style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(34, 197, 94, 0.13)',
            border: '1px solid rgba(34, 197, 94, 0.42)',
            color: '#22c55e',
            fontSize: '13.5px',
            fontWeight: '800',
            letterSpacing: '0.75px',
            textTransform: 'uppercase',
            padding: '7px 16px',
            borderRadius: '999px',
            marginBottom: '14px'
          }}>
            {title}
          </span>
          <h2 style={{ color: '#e8eef7', fontSize: '36px', fontWeight: '700', letterSpacing: '-0.25px', margin: 0 }}>
            Our Products
          </h2>
        </div>

        <div className="product-tab" style={{ background: 'linear-gradient(180deg, #0a2c46 0%, #0a2c46 100%)', border: '1px solid rgba(245,197,66,.58)', borderRadius: '20px', boxShadow: '0 18px 42px rgba(10,44,70,.18)', padding: '30px' }}>
          <div className="umino-tab_content" style={{ background: 'linear-gradient(145deg, #0d3355 0%, #081f38 100%)', border: '1px solid rgba(245,197,66,.3)', borderRadius: '16px', padding: '20px' }}>
            <div className="umino-product-tab_slider" style={{ overflow: 'hidden' }}>
              <div className="row no-gutters slick-initialized slick-slider" style={{ display: 'flex' }}>
                <div className="slick-list" style={{ overflow: 'hidden' }}>
                  <div className="slick-track" style={{ display: 'flex', gap: '24px' }}>
                    {products.map((product) => (
                      <div key={product.slug} className="slick-slide" style={{ flex: '0 0 calc(33.333% - 16px)', minWidth: '280px' }}>
                        <ProductCard product={product} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Pager */}
            <div className="fb-product-mobile-pager" style={{ display: 'none', justifyContent: 'center', alignItems: 'center', gap: '12px', marginTop: '20px' }}>
              <button className="fb-product-prev" style={{ background: '#141416', border: '1px solid rgba(245,197,66,.38)', color: '#ddd7cf', width: '44px', height: '44px', borderRadius: '50%', fontSize: '20px', cursor: 'pointer' }}>‹</button>
              <button className="fb-product-next" style={{ background: '#141416', border: '1px solid rgba(245,197,66,.38)', color: '#ddd7cf', width: '44px', height: '44px', borderRadius: '50%', fontSize: '20px', cursor: 'pointer' }}>›</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ShopProducts() {
  return (
    <Suspense fallback={<div className="fb-product-area" style={{ padding: '60px 0', textAlign: 'center', color: '#fff' }}>Loading products…</div>}>
      <ProductList />
    </Suspense>
  );
}

async function ProductList() {
  const products = await getProducts();
  const activeProducts = products.filter(p => p.active === 1 && p.status !== 'draft');
  
  return (
    <>
      <ProductSlider products={activeProducts} title="BASIC SOFTWARE" />
      
      <section style={{ padding: '60px 0', background: '#06283d', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <h2 style={{ color: '#fff', fontSize: '28px', fontWeight: '700', marginBottom: '16px' }}>Review Product Requirements</h2>
          <p style={{ color: 'rgba(233,226,205,.9)', fontSize: '16px', lineHeight: '1.8', marginBottom: '24px' }}>
            Before purchasing, please ensure your setup meets the following requirements for optimal performance:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', textAlign: 'left' }}>
            <div style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(245,197,66,.3)', borderRadius: '12px', padding: '20px' }}>
              <h4 style={{ color: '#ffe27a', marginBottom: '8px' }}>Platform</h4>
              <p style={{ color: '#cbd5e1', margin: 0 }}>MetaTrader 5 (MT5) — Build 3300+</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(245,197,66,.3)', borderRadius: '12px', padding: '20px' }}>
              <h4 style={{ color: '#ffe27a', marginBottom: '8px' }}>Account Type</h4>
              <p style={{ color: '#cbd5e1', margin: 0 }}>Hedging enabled, leverage 1:100 or higher</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(245,197,66,.3)', borderRadius: '12px', padding: '20px' }}>
              <h4 style={{ color: '#ffe27a', marginBottom: '8px' }}>VPS</h4>
              <p style={{ color: '#cbd5e1', margin: 0 }}>Low-latency VPS (recommended for 24/7 operation)</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(245,197,66,.3)', borderRadius: '12px', padding: '20px' }}>
              <h4 style={{ color: '#ffe27a', marginBottom: '8px' }}>Symbols</h4>
              <p style={{ color: '#cbd5e1', margin: 0 }}>BTCUSD, XAUUSD, Major Forex pairs</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default function Page() {
  return (
    <>
      <link rel="icon" href="/assets/images/btcmlai-logo.png" type="image/png" />
      <link rel="shortcut icon" href="/assets/images/btcmlai-logo.png" />
      <link rel="apple-touch-icon" href="/assets/images/btcmlai-logo.png" />
      
      <style dangerouslySetInnerHTML={{ __html: `
        html, body { background: #06283d !important; color: #e8eef7 !important; }
        .wrapper, .main-wrapper, .page-content, .site-content, .main-content, main, #main, .content { background-color: transparent !important; }
        #preloader, .preloader, .page-loader, .loader, .loading-overlay { background: linear-gradient(135deg, #0e3a5c 0%, #0a2c46 52%, #071f38 100%) !important; }
      ` }} />
      
      <link rel="stylesheet" href="/assets/css/bootstrap.min.css" />
      <link rel="stylesheet" href="/assets/css/font-awesome.css" />
      <link rel="stylesheet" href="/assets/css/slick.css" />
      <link rel="stylesheet" href="/assets/css/fb-strip-float-v28.css" />
      <link rel="stylesheet" href="/assets/css/fb-shop.css?v=4" />
      <link rel="stylesheet" href="/assets/css/fb-chatbot.css?v=1" />
      <link rel="stylesheet" href="/assets/css/fb-cart.css?v=1" />
      
      <Script src="/assets/js/fb-cart.js?v=1" strategy="afterInteractive" />
      <Script src="/assets/js/fb-chatbot.js?v=3" strategy="afterInteractive" />
      <Script src="/assets/js/legacy-shop.js" strategy="afterInteractive" />
      
      <div id="fb-chat-root" suppressHydrationWarning />
      
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: "{\"@context\":\"https://schema.org\",\"@type\":\"Organization\",\"@id\":\"https://btcmltai.com#organization\",\"name\":\"BTCMLTAI\",\"url\":\"https://btcmltai.com\",\"logo\":{\"@type\":\"ImageObject\",\"url\":\"assets/images/btcmlai-logo.png\"},\"description\":\"BTCMLTAI provides rule-based MT4 trading software, market-analysis tools, general educational video guides, digital delivery, installation guidance, and customer support. Review compatibility, licence terms, product information, and risk disclosures before purchase.\",\"contactPoint\":{\"@type\":\"ContactPoint\",\"contactType\":\"customer support\",\"availableLanguage\":[\"English\",\"Hindi\"]}}" }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: "{\"@context\":\"https://schema.org\",\"@type\":\"WebSite\",\"@id\":\"https://btcmltai.com#website\",\"name\":\"BTCMLTAI\",\"url\":\"https://btcmltai.com\",\"description\":\"BTCMLTAI provides rule-based MT4 trading software, market-analysis tools, general educational video guides, digital delivery, installation guidance, and customer support. Review compatibility, licence terms, product information, and risk disclosures before purchase.\",\"publisher\":{\"@id\":\"https://btcmltai.com#organization\"},\"inLanguage\":\"en\"}" }} />
      <script type="module" src="https://widgets.tradingview-widget.com/w/en/tv-ticker-tape.js" />
      
      <div className="main-wrapper">
        <ShopProducts />
      </div>
    </>
  );
}