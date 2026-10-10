import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  CircleAlert, Clock, PackageCheck, ShieldCheck, Zap, CircleCheck,
  SlidersHorizontal, Scale, Layers, Lock, Ban, Globe,
} from 'lucide-react';
import { PageShell, PageHero, JsonLd } from '../site/chrome';
import { Btn, Card, Chip, Accordion, Specs, SectionHead, CheckList, RiskNote, Tile } from '../site/ui';
import { PRODUCT_CONTENT } from './product-content';
import { getStoreProducts, productImage } from '@/lib/products';

export const revalidate = 600;

function ProductDetailInner({ product, content, others }) {
  const isSoon = content.comingSoon || product.status === 'coming_soon';
  const price = Number(product.new_price || 0);
  const oldPrice = Number(product.old_price || 0) > 0 && Number(product.old_price) !== price
    ? Number(product.old_price) : 0;
  const related = others || [];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: content.name,
    description: content.desc,
    image: [`https://btcmltai.com${productImage(product.image)}`],
    brand: { '@type': 'Brand', name: 'BTCMLTAI' },
    category: 'Trading Software',
    offers: {
      '@type': 'Offer',
      price: price || 0,
      priceCurrency: 'USD',
      availability: isSoon ? 'https://schema.org/PreOrder' : 'https://schema.org/InStock',
      url: `https://btcmltai.com/products/${product.slug}`,
    },
  };

  return (
    <>
      <JsonLd data={jsonLd} />

      <div className="bs-container">
        <div className="bs-pdp">
          <div className="bs-pdp-media">
            <img src={productImage(product.image)} alt={content.name} />
          </div>

          <div>
            <span className="bs-eyebrow">{isSoon ? 'Upcoming release' : 'Automated trading'}</span>
            <h1 className="bs-pdp-title">{content.name}</h1>

            <div className="bs-pdp-chips">
              {isSoon
                ? <Chip tone="slate">Coming soon</Chip>
                : <Chip tone="green">Available now</Chip>}
              {content.specs.slice(0, 3).map((s) => (
                <Chip key={s.k} tone="slate">{s.v}</Chip>
              ))}
            </div>

            <p className="bs-pdp-text">{content.desc}</p>

            {isSoon ? (
              <>
                <div className="bs-pdp-pricerow">
                  <span className="bs-price bs-price--soon" style={{ fontSize: 24 }}>Price announced at launch</span>
                </div>
                <div className="bs-alert bs-alert--info" style={{ marginBottom: 20 }}>
                  <Clock size={17} aria-hidden="true" />
                  <span>{content.statusNote}</span>
                </div>
                <Btn variant="gold" href="/contact">Notify Me at Launch</Btn>
              </>
            ) : (
              <>
                <div className="bs-pdp-pricerow">
                  <span className="bs-pdp-price">{`$${price.toLocaleString('en-US')}`}</span>
                  {oldPrice ? <span className="bs-price-old">{`$${oldPrice.toLocaleString('en-US')}`}</span> : null}
                  <Chip tone="gold">One-time licence</Chip>
                </div>

                <div className="bs-pdp-cta">
                  <Btn variant="gold" href="/cart" data-buy-now={product.slug}>Buy Now</Btn>
                  <Btn variant="ghost" href="javascript:void(0)" data-add-cart={product.slug}>Add to Cart</Btn>
                </div>

                <div className="bs-deliver">
                  <div><PackageCheck size={17} aria-hidden="true" /> Instant digital delivery with setup files</div>
                  <div><Zap size={17} aria-hidden="true" /> Installation &amp; configuration guidance included</div>
                  <div><Clock size={17} aria-hidden="true" /> Licence delivered within 2–3 hours</div>
                  <div><ShieldCheck size={17} aria-hidden="true" /> No client funds held — payment goes to our wallet</div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <section className="bs-section bs-section--tint">
        <div className="bs-container">
          <SectionHead
            eyebrow="Why it works"
            tone="emerald"
            title={content.whyTitle}
            sub="Rule-based logic, structured entries and predefined risk controls on every position."
          />
          <Card style={{ maxWidth: 760, margin: '0 auto' }}>
            <CheckList items={content.why} />
          </Card>
        </div>
      </section>

      {content.features ? (
        <section className="bs-section">
          <div className="bs-container">
            <SectionHead eyebrow="Key features" title={`What ${content.name} does`} />
            {content.features.length <= 8 ? (
              <div className="bs-tl">
                {content.features.map((f, i) => {
                  const Icon = [SlidersHorizontal, Scale, Layers, Lock, Ban, Clock, Globe, ShieldCheck][i % 8];
                  return (
                    <div key={f.slice(0, 24)} className={`bs-tl-item bs-tl-item--${(i % 8) + 1} bs-reveal`}>
                      <div className="bs-tl-slot bs-tl-slot--top">
                        {i % 2 === 0 ? <span className="bs-tl-box">{f}</span> : null}
                      </div>
                      <span className="bs-tl-link" aria-hidden="true" />
                      <span className="bs-tl-ball"><Icon size={40} strokeWidth={1.5} /></span>
                      <span className="bs-tl-link" aria-hidden="true" />
                      <div className="bs-tl-slot bs-tl-slot--bot">
                        {i % 2 === 1 ? <span className="bs-tl-box">{f}</span> : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bs-features">
                {content.features.map((f, i) => (
                  <Card key={f} hover>
                    <Tile icon={CircleCheck} tone={['blue', 'emerald', 'purple'][i % 3]} />
                    <p style={{ margin: '14px 0 0', fontSize: 14, lineHeight: 1.7, color: 'var(--bs-muted)' }}>{f}</p>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      ) : null}

      {content.settings ? (
        <section className="bs-section bs-section--tint">
          <div className="bs-container bs-container--mid">
            <SectionHead
              eyebrow="Optimize settings"
              tone="emerald"
              title={`${content.name} settings explained`}
              sub="What each default parameter does, with conservative adjustments for controlled risk."
            />
            {content.settings.groups.map((g) => (
              <div key={g.title} style={{ marginBottom: 26 }}>
                <h3 style={{ margin: '0 0 12px', fontSize: 17, fontWeight: 800, color: 'var(--bs-heading)' }}>
                  {g.title}
                </h3>
                <Card>
                  <Specs rows={g.rows} />
                </Card>
                {g.note ? <p className="bs-note" style={{ marginTop: 10 }}>{g.note}</p> : null}
              </div>
            ))}
            {content.settings.advice ? (
              <div className="bs-features bs-features--2" style={{ marginTop: 8 }}>
                {content.settings.advice.map((a) => (
                  <Card key={a.title} hover>
                    <h3 style={{ margin: '0 0 10px', fontSize: 16, fontWeight: 800, color: 'var(--bs-heading)' }}>
                      {a.title}
                    </h3>
                    <CheckList items={a.items} />
                  </Card>
                ))}
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {content.usage ? (
        <section className="bs-section bs-section--tint">
          <div className="bs-container">
            <SectionHead eyebrow="Tool usage" tone="emerald" title="Getting started in four steps" />
            <div className="bs-steps">
              {content.usage.map((s, i) => (
                <Card key={s} hover className={`bs-step${i === 0 ? ' bs-step--gold' : ''}`}>
                  <div className="bs-step-num">{i + 1}</div>
                  <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.7, color: 'var(--bs-muted)' }}>{s}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="bs-section">
        <div className="bs-container bs-container--mid">
          <SectionHead eyebrow="Specifications" title={`${content.name} details`} />
          <Specs rows={content.specs} />
        </div>
      </section>

      <section className="bs-section bs-section--tint">
        <div className="bs-container bs-container--mid">
          <SectionHead eyebrow="FAQs" tone="emerald" title="Frequently asked questions" />
          <Accordion items={content.faqs} />
        </div>
      </section>

      <section className="bs-section">
        <div className="bs-container">
          <div className="bs-co">
            <div>
              <SectionHead
                eyebrow="Risk disclosure"
                align="left"
                title="Use software responsibly"
                sub="Every product is educational and rule-based. Review these points before live use."
              />
              <div style={{ marginTop: 6 }}>
                <RiskNote>
                  <b>Trading involves substantial risk.</b> Past performance never guarantees future
                  results. Always test on a demo account first and never trade with funds you cannot
                  afford to lose. BTCMLTAI does not provide brokerage, personalised investment advice
                  or fund management, and does not accept client trading funds.
                </RiskNote>
              </div>
            </div>

            <Card gold style={{ display: 'grid', gap: 14 }}>
              <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: 'var(--bs-heading)' }}>
                Questions before you buy?
              </h3>
              <p className="bs-note" style={{ margin: 0 }}>
                Our support team answers compatibility, licence and setup questions within 2–3 hours.
              </p>
              <Btn href="/contact">Talk to Support</Btn>
              <Btn variant="ghost" href="/faqs">Read the FAQs</Btn>
            </Card>
          </div>
        </div>
      </section>

      {related.length ? (
        <section className="bs-section bs-section--tint">
          <div className="bs-container">
            <SectionHead eyebrow="Related products" title="More from BTCMLTAI" />
            <div className="bs-products bs-products--2">
              {related.map((o) => {
                const oc = PRODUCT_CONTENT[o.slug];
                const soon = o.status === 'coming_soon';
                return (
                  <Card key={o.slug} hover>
                    <div style={{ display: 'flex', gap: 18, alignItems: 'center', flexWrap: 'wrap' }}>
                      <Link href={`/products/${o.slug}`} className="bs-thumb" style={{ width: 88, height: 88 }} aria-label={o.name}>
                        <img src={productImage(o.image)} alt={o.name} loading="lazy" />
                      </Link>
                      <div style={{ flex: 1, minWidth: 180 }}>
                        <h3 style={{ margin: '0 0 4px', fontSize: 16.5, fontWeight: 800 }}>
                          <Link href={`/products/${o.slug}`} style={{ color: 'var(--bs-heading)', textDecoration: 'none' }}>{o.name}</Link>
                        </h3>
                        <p style={{ margin: '0 0 10px', fontSize: 13, lineHeight: 1.6, color: 'var(--bs-muted)' }}>
                          {soon ? 'Coming soon — in final testing' : (oc ? oc.why[0] : '')}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                          {soon
                            ? <Chip tone="slate">Coming soon</Chip>
                            : <b style={{ fontSize: 17, color: 'var(--bs-heading)' }}>{`$${Number(o.new_price).toLocaleString('en-US')}`}</b>}
                          <Btn size="sm" variant={soon ? 'ghost' : 'gold'} href={`/products/${o.slug}`}>View Details</Btn>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}

export function ProductDetail({ product, content, others }) {
  return (
    <PageShell active="/shop">
      <PageHero
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Shop', href: '/shop' },
          { label: content.name },
        ]}
      />
      <ProductDetailInner product={product} content={content} others={others} />
    </PageShell>
  );
}

/* thin server wrapper used by the three route files */
export default async function ProductDetailRoute({ slug }) {
  const products = await getStoreProducts();
  const productRow = products.find((p) => p.slug === slug);
  const content = PRODUCT_CONTENT[slug];
  if (!content) notFound();
  const product = productRow || { slug, name: content.name, status: content.comingSoon ? 'coming_soon' : 'active' };
  const others = products.filter((p) => p.slug !== slug).slice(0, 2);
  return <ProductDetail product={product} content={content} others={others} />;
}