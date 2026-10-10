import Link from 'next/link';
import { Fragment } from 'react';
import { PageShell, JsonLd } from './site/chrome';
import {
  Btn, Card, Chip, SectionHead, Stats, StepRow, RiskNote, CtaBand, Tile,
} from './site/ui';
import {
  Cpu, ChartBar, BookOpen, Headset, CircleQuestionMark, Wallet, ShieldCheck,
  CircleAlert, Clock, Zap, Gauge, Layers, Target,
} from 'lucide-react';
import { TiltImage, NoticeBoard } from './site/motion';
import { getStoreProducts, productImage } from '@/lib/products';
import { getNotices } from '@/lib/notices';
import { POSTS } from '@/lib/site-content';

export const dynamic = 'force-dynamic';

const usd = (n) => `$${Number(n || 0).toLocaleString('en-US')}`;

const SOLUTIONS = [
  { icon: Cpu, tone: 'blue', title: 'Rule-Based Trading Software', text: 'Expert Advisors that read the market through technical filters and manage positions with predefined risk controls.' },
  { icon: ChartBar, tone: 'emerald', title: 'Market Analysis Tools', text: 'Indicators and chart-support tools designed for structured analysis, testing and review.' },
  { icon: BookOpen, tone: 'purple', title: 'Educational Video Guides', text: 'General tutorials on platforms, setup and strategy testing to help you get running correctly.' },
  { icon: Headset, tone: 'amber', title: 'Installation & Technical Support', text: 'Setup assistance and installation guidance from our team, normally within 2 to 3 hours.' },
];

const STEPS = [
  { title: 'Choose a Product', text: 'Select software, an analysis tool, or an educational video guide that matches your requirements.' },
  { title: 'Review Information', text: 'Check compatibility, licence terms, delivery details, refund conditions, and the risk disclosure.' },
  { title: 'Complete Checkout', text: 'Confirm the order details and receive digital delivery and installation instructions.' },
  { title: 'Test Before Live Use', text: 'Install the product, test it on a demo account, and apply your own risk management.' },
];

const POSITIONING = [
  { icon: BookOpen, tone: 'blue', title: 'Software & Information', text: 'We provide digital trading software, analysis tools, technical documentation, and general educational content with clearly stated product information. Educational materials are general information only and are not personalised investment recommendations or trade calls.' },
  { icon: Wallet, tone: 'gold', title: 'No Client Funds', text: 'We do not receive trading capital, deposits, or investment funds from customers.' },
  { icon: CircleAlert, tone: 'red', title: 'No Guaranteed Returns', text: 'We do not promise profit, fixed income, loss recovery, or any guaranteed trading outcome.' },
  { icon: Target, tone: 'purple', title: 'Customer Responsibility', text: 'Customers choose their broker, account, settings, leverage, lot size, and risk controls independently.' },
];

export default async function HomePage() {
  const products = await getStoreProducts();
  const featured = products.slice(0, 3);
  const notices = await getNotices(3);

  return (
    <PageShell active="/">
      {/* ---------------- HERO ---------------- */}
      <section className="bs-hero">
        <div className="bs-container bs-hero-inner">
          <div>
            <span className="bs-eyebrow bs-dark-eyebrow">Dubai, UAE · Trading Software · Analysis Tools</span>
            <h1 className="bs-hero-title">
              Dubai-Based Trading Software,<br />
              Analysis Tools &amp; <em>Video Guides</em>
            </h1>
            <p className="bs-hero-text">
              We provide digital trading software, market-analysis tools, and educational video
              guides. Explore rule-based trading software, market-analysis tools, and educational
              video guides designed for strategy testing, chart analysis, platform use, and
              responsible risk management.
            </p>
            <div className="bs-hero-actions">
              <Btn variant="gold" size="lg" href="/shop">Explore Software</Btn>
              <Btn size="lg" variant="onDark" href="/terms-condition">View Risk Disclosure</Btn>
            </div>
            <div className="bs-hero-stats">
              <div className="bs-hero-stat"><b>MT5</b><span>Supported platform</span></div>
              <div className="bs-hero-stat"><b>2–3 hours</b><span>Typical support reply</span></div>
              <div className="bs-hero-stat"><b>Instant</b><span>Digital delivery</span></div>
            </div>
          </div>

          <div className="bs-hero-art bs-hero-art--bare">
            <TiltImage
              src="/assets/images/hero-btcmlt-ai-2.png"
              alt="BTCMLT AI 2.0 — AI powered MT5 trading system"
            />
          </div>
        </div>
        <NoticeBoard items={notices} />
      </section>

      {/* ---------------- SOLUTIONS — 4 PRODUCT BENEFITS ---------------- */}
      <section className="bs-section bs-section--tint">
        <div className="bs-container">
          <SectionHead
            eyebrow="Trading software solutions"
            title="Explore Trading Software and Analysis Tools"
            sub="Review product features, compatibility, licence terms, pricing, and risk information before purchase."
          />
          <div className="bs-ben4">
            {SOLUTIONS.map((s, i) => (
              <article key={s.title} className={`bs-ben4-card bs-ben4-card--${i + 1} bs-reveal`}>
                <span className="bs-ben4-badge" aria-hidden="true">
                  <span className="bs-ben4-disc"><b>{s.title}</b></span>
                </span>
                <p>{s.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- FEATURED PRODUCTS ---------------- */}
      {featured.length ? (
        <section className="bs-section bs-section--tint">
          <div className="bs-container">
            <SectionHead
              eyebrow="Featured trading software"
              tone="emerald"
              title="Our Products"
              sub="Instant digital delivery, single-account licence, and setup guidance with every purchase."
            />
            <div className="bs-products">
              {featured.map((p) => {
                const soon = p.status === 'coming_soon';
                return (
                  <Card key={p.slug} hover className="bs-pcard bs-reveal" pad={false}>
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
                        {p.short_desc || 'Rule-based automated trading system with structured risk controls and instant digital delivery.'}
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
              })}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 30 }}>
              <Btn variant="ghost" href="/shop">View all software</Btn>
            </div>
          </div>
        </section>
      ) : null}

      {/* ---------------- HOW TO BUY ---------------- */}
      <section className="bs-section">
        <div className="bs-container">
          <SectionHead
            eyebrow="Transparent process"
            title="How to Purchase and Use Our Software"
            sub="Review the product information, understand the risks, complete checkout, and test the software before live use."
          />
          <StepRow items={STEPS} />
        </div>
      </section>

      {/* ---------------- BLOG ---------------- */}
      <section className="bs-section bs-section--tint">
        <div className="bs-container">
          <SectionHead
            eyebrow="Educational resources"
            tone="emerald"
            title="Latest Articles and Guides"
            sub="Read software guides, platform tutorials, and general market education content."
          />
          <div className="bs-products">
            {POSTS.slice(0, 3).map((post) => (
              <Card key={post.slug} hover className="bs-postcard bs-reveal" pad={false}>
                <div className="bs-postcard-media">
                  <img src={post.image} alt="" loading="lazy" />
                </div>
                <div className="bs-postcard-body">
                  <div className="bs-postmeta">
                    <span>By BTCMLTAI</span><span>/</span><span>{post.date}</span>
                  </div>
                  <h3><Link href={`/blogs/${post.slug}`}>{post.title}</Link></h3>
                  <p>{post.excerpt}</p>
                  <Btn size="sm" variant="ghost" href={`/blogs/${post.slug}`}>Read More</Btn>
                </div>
              </Card>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 30 }}>
            <Btn variant="ghost" href="/blog">All articles &amp; guides</Btn>
          </div>
        </div>
      </section>

      {/* ---------------- POSITIONING ---------------- */}
      <section className="bs-section">
        <div className="bs-container">
          <SectionHead
            eyebrow="Clear business positioning"
            title="Digital Software Provider — Not an Investment Service"
            sub="We provide digital software products, analysis tools, technical support, and general educational resources to customers in supported markets. We do not manage customer trading accounts or client funds. Trading decisions and account risk remain under the customer’s control."
          />
          <div className="bs-chain">
            {POSITIONING.map((p, i) => {
              const Icon = p.icon;
              const top = i % 2 === 0;
              const node = (
                <div className="bs-chain-node">
                  {top ? null : <span className="bs-chain-arrow bs-chain-arrow--up" aria-hidden="true" />}
                  <span className="bs-chain-ball"><Icon size={42} strokeWidth={1.5} /></span>
                  {top ? <span className="bs-chain-arrow bs-chain-arrow--down" aria-hidden="true" /> : null}
                </div>
              );
              return (
                <Fragment key={p.title}>
                  {i > 0 ? (
                    <div className="bs-chain-arc" aria-hidden="true">
                      <i className="bs-chain-sp" />
                      <span className="bs-chain-arcbox">
                        <svg viewBox="0 0 100 100" preserveAspectRatio="none">
                          {i % 2 === 1
                            ? <path d="M3,97 Q50,3 97,97" fill="none" stroke={['', '#1b9bd7', '', '#f0ad00'][i]} strokeWidth="9" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                            : <path d="M3,3 Q50,97 97,3" fill="none" stroke="#22b8cf" strokeWidth="9" strokeLinecap="round" vectorEffect="non-scaling-stroke" />}
                        </svg>
                      </span>
                      <i className="bs-chain-sp" />
                    </div>
                  ) : null}
                  <div className={`bs-chain-col bs-chain-col--${i + 1} bs-reveal`}>
                    <div className="bs-chain-slot">{top ? node : null}</div>
                    <div className="bs-chain-pill">
                      <b>{p.title}</b>
                      <p>{p.text}</p>
                    </div>
                    <div className="bs-chain-slot">{top ? null : node}</div>
                  </div>
                </Fragment>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------- TRUST STRIP ---------------- */}
      <section className="bs-section bs-section--tight bs-section--tint">
        <div className="bs-container">
          <Stats
            items={[
              { icon: ShieldCheck, tone: 'emerald', title: 'No client funds', text: 'Payments go straight to our wallet. We never hold or trade client money.' },
              { icon: Clock, tone: 'blue', title: '2–3 hour replies', text: 'Our support team answers compatibility, delivery and setup questions.' },
              { icon: Zap, tone: 'gold', title: 'Instant delivery', text: 'Files, licence details and setup notes sent after verification.' },
            ]}
          />
        </div>
      </section>

      {/* ---------------- CTA ---------------- */}
      <section className="bs-section">
        <div className="bs-container">
          <CtaBand
            title="Ready to explore our software?"
            text="Every product page lists platform compatibility, timeframes, licence terms and delivery details so you can decide with full information."
          >
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Btn variant="gold" href="/shop">Browse Software</Btn>
              <Btn variant="onDark" href="/contact">Contact Support</Btn>
            </div>
          </CtaBand>

          <div style={{ marginTop: 26 }}>
            <RiskNote>
              <b>Risk disclaimer.</b> Forex, CFD, leveraged, algorithmic and automated trading
              involve a high risk of financial loss. We provide digital software products, technical
              setup assistance and general educational information only. We do not provide
              brokerage, personalised investment advisory, portfolio management, fund management or
              client-account management services. We do not accept client trading funds or guarantee
              profit, fixed returns, income, loss recovery or any specific trading result.
            </RiskNote>
          </div>
        </div>
      </section>

      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'BTCMLTAI | Trading Software, Analysis Tools & Video Guides',
        url: 'https://btcmltai.com/',
        inLanguage: 'en',
      }} />
    </PageShell>
  );
}