import Link from 'next/link';
import { PageShell, PageHero, JsonLd } from '../site/chrome';
import { Btn, Card, SectionHead, Stats, RiskNote } from '../site/ui';
import { CircleQuestionMark, Cpu, Gauge, Layers, ShieldCheck, Wallet, Zap } from 'lucide-react';
import { getStoreProducts, productImage } from '@/lib/products';

export const dynamic = 'force-dynamic';

const usd = (n) => `$${Number(n || 0).toLocaleString('en-US')}`;

function ProductCard({ p }) {
  const soon = p.status === 'coming_soon';
  return (
    <Card hover className="bs-pcard" pad={false}>
      <div className="bs-pcard-media">
        <span className={`bs-badge ${soon ? 'bs-badge--soon' : 'bs-badge--live'}`}>
          {soon ? 'Coming soon' : 'Available'}
        </span>
        <Link href={`/products/${p.slug}`} aria-label={p.name} style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src={productImage(p.image)} alt={p.name} loading="lazy" />
        </Link>
      </div>
      <div className="bs-pcard-body">
        <h3 className="bs-pcard-name"><Link href={`/products/${p.slug}`}>{p.name}</Link></h3>
        <p className="bs-pcard-desc">
          {p.short_desc || 'Rule-based automated trading system with structured risk controls, instant digital delivery and installation guidance.'}
        </p>
        <div className="bs-pcard-foot">
          {soon ? (
            <span className="bs-price bs-price--soon">Coming soon</span>
          ) : (
            <span className="bs-price bs-price--gold">{usd(p.new_price)}<small>USD · one-time</small></span>
          )}
          {soon ? (
            <Btn size="sm" variant="ghost" href={`/products/${p.slug}`}>Notify Me</Btn>
          ) : (
            <Btn size="sm" variant="gold" href="javascript:void(0)" data-add-cart={p.slug}>Add to Cart</Btn>
          )}
        </div>
      </div>
    </Card>
  );
}

export default async function ShopPage() {
  const products = await getStoreProducts();

  return (
    <PageShell active="/shop">
      <PageHero
        eyebrow="Premium trading software"
        title="Shop automated trading tools"
        text="Rule-based Expert Advisors engineered for structured entries, disciplined risk controls and instant digital delivery."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Shop' }]}
      />

      <section className="bs-section">
        <div className="bs-container">
          <SectionHead
            eyebrow={`${products.length} product${products.length === 1 ? '' : 's'} available`}
            title="Choose your system"
            sub="Every product ships with setup files, installation guidance and support within 2–3 hours."
          />

          <div className="bs-products">
            {products.map((p) => <ProductCard key={p.slug} p={p} />)}
          </div>

          {!products.length ? (
            <Card pad={false}>
              <div className="bs-empty">
                <div className="bs-empty-icon"><Layers size={34} aria-hidden="true" /></div>
                <h2>Products are being updated</h2>
                <p>Our catalogue is being refreshed. Please check back shortly, or contact support for details.</p>
                <Btn href="/contact">Contact Support</Btn>
              </div>
            </Card>
          ) : null}
        </div>
      </section>

      <section className="bs-section bs-section--tint">
        <div className="bs-container">
          <SectionHead
            eyebrow="Before you order"
            tone="emerald"
            title="Review product requirements"
            sub="Make sure your setup meets these requirements for optimal performance."
          />
          <div className="bs-hex">
            {[
              { icon: Cpu, title: 'Platform', text: 'MetaTrader 5 (MT5) — build 3300 or newer.' },
              { icon: Gauge, title: 'Account type', text: 'Hedging enabled, leverage 1:100 or higher, and enough margin for your lot settings.' },
              { icon: Zap, title: 'VPS', text: 'A low-latency VPS is recommended so the system runs 24/7 without interruptions.' },
              { icon: Layers, title: 'Instruments', text: 'BTCUSD, XAUUSD and major Forex pairs depending on the product you choose.' },
            ].map((f, i) => {
              const Icon = f.icon;
              const left = i % 2 === 1;
              const banner = (
                <div className={`bs-hex-box bs-hex-box--${left ? 'l' : 'r'}`}>
                  <b>{f.title}</b>
                  <p>{f.text}</p>
                </div>
              );
              return (
                <div key={f.title} className={`bs-hex-row bs-hex-row--${i + 1} bs-reveal`}>
                  <div className="bs-hex-cell">{left ? banner : null}</div>
                  <div className="bs-hex-cell bs-hex-cell--mid">
                    <span className="bs-hex-node"><Icon size={38} strokeWidth={1.6} /></span>
                  </div>
                  <div className="bs-hex-cell">{left ? null : banner}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bs-section">
        <div className="bs-container">
          <SectionHead
            eyebrow="Why buy from BTCMLTAI"
            title="Clear information before you purchase"
            sub="We publish platform, timeframe, licence and delivery details on every product page."
          />
          <Stats
            items={[
              { icon: Wallet, tone: 'gold', title: 'Digital software provider', text: 'No client funds are ever accepted or held by us.' },
              { icon: ShieldCheck, tone: 'emerald', title: 'No guaranteed returns', text: 'We never promise profit, income, accuracy or any specific result.' },
              { icon: CircleQuestionMark, tone: 'blue', title: 'Demo-first guidance', text: 'Every product recommends validation on a demo account before live use.' },
            ]}
          />

          <div style={{ marginTop: 28 }}>
            <RiskNote>
              <b>Risk disclosure.</b> Trading involves substantial risk and past performance never
              guarantees future results. Educational materials and software outputs are general
              information only and are not personalised investment recommendations. Always test on a
              demo account first and never trade with funds you cannot afford to lose.
            </RiskNote>
          </div>
        </div>
      </section>

      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://btcmltai.com/' },
          { '@type': 'ListItem', position: 2, name: 'Shop', item: 'https://btcmltai.com/shop' },
        ],
      }} />
      {products.map((p) => (
        <JsonLd key={p.slug} data={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: p.name,
          description: p.short_desc || undefined,
          image: [`https://btcmltai.com${productImage(p.image)}`],
          brand: { '@type': 'Brand', name: 'BTCMLTAI' },
          offers: {
            '@type': 'Offer',
            price: p.new_price || 0,
            priceCurrency: 'USD',
            availability: p.status === 'coming_soon'
              ? 'https://schema.org/PreOrder'
              : 'https://schema.org/InStock',
            url: `https://btcmltai.com/products/${p.slug}`,
          },
        }} />
      ))}
    </PageShell>
  );
}